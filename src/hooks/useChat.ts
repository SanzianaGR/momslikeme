import { useState, useCallback } from 'react';
import { ChatMessage, ParentProfile, BenefitMatch, Task } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getBenefitById } from '@/data/benefits';
import { toast } from 'sonner';

const generateId = () => Math.random().toString(36).substring(2, 9);

// Simulate typing delay based on message length
const getTypingDelay = (text: string): number => {
  const baseDelay = 300;
  const perCharDelay = 8;
  return Math.min(baseDelay + text.length * perCharDelay, 1500);
};

// Parse profile info from user messages
function parseProfileFromMessage(message: string, currentProfile: Partial<ParentProfile>): Partial<ParentProfile> {
  const lower = message.toLowerCase();
  const updated = { ...currentProfile };

  // Children count
  const numMatch = lower.match(/(\d+)\s*(child|kid|kinderen|children)/i) || lower.match(/i have (\d+)/i);
  if (numMatch) updated.numberOfChildren = parseInt(numMatch[1]);
  if (lower.includes('1 child') || lower.includes('one child')) updated.numberOfChildren = 1;
  if (lower.includes('2 child') || lower.includes('two child')) updated.numberOfChildren = 2;
  if (lower.includes('3') && lower.includes('more')) updated.numberOfChildren = 3;

  // Ages
  if (lower.includes('baby') || lower.includes('toddler') || lower.includes('0-4')) updated.childrenAges = [2];
  if (lower.includes('primary') || lower.includes('4-12') || lower.includes('school age')) updated.childrenAges = [8];
  if (lower.includes('teen') || lower.includes('12-18')) updated.childrenAges = [14];
  if (lower.includes('mixed')) updated.childrenAges = [4, 10];

  // Housing
  if (lower.includes('rent') && !lower.includes('social')) updated.housingType = 'rent';
  if (lower.includes('social housing') || lower.includes('social')) updated.housingType = 'social';
  if (lower.includes('own') || lower.includes('bought')) updated.housingType = 'own';
  if (lower.includes('family') || lower.includes('parents')) updated.housingType = 'family';

  // Income
  if (lower.includes('under') || lower.includes('1500') || lower.includes('low income')) updated.monthlyIncome = 1200;
  if (lower.includes('1500-2500') || lower.includes('medium') || lower.includes('middle')) updated.monthlyIncome = 2000;
  if (lower.includes('2500-3500')) updated.monthlyIncome = 3000;
  if (lower.includes('above 3500') || lower.includes('high')) updated.monthlyIncome = 4000;

  // Employment
  if (lower.includes('full-time') || lower.includes('fulltime')) updated.employmentStatus = 'employed';
  if (lower.includes('part-time') || lower.includes('parttime')) updated.employmentStatus = 'part-time';
  if (lower.includes('looking') || lower.includes('unemployed') || lower.includes('job hunting')) updated.employmentStatus = 'unemployed';
  if (lower.includes('study') || lower.includes('student')) updated.employmentStatus = 'student';
  if (lower.includes('unable') || lower.includes('disabled') || lower.includes('sick')) updated.employmentStatus = 'unable';
  if (lower.includes('self-employed') || lower.includes('freelance')) updated.employmentStatus = 'self-employed';

  // Challenges
  if (lower.includes('childcare') || lower.includes('opvang')) updated.challenges = 'childcare';
  if (lower.includes('healthcare') || lower.includes('medical') || lower.includes('insurance')) updated.challenges = 'healthcare';
  if (lower.includes('school') || lower.includes('education')) updated.challenges = 'education';
  if (lower.includes('everything') || lower.includes('overwhelming')) updated.challenges = 'multiple';
  if (lower.includes('bills') || lower.includes('money') || lower.includes('ends meet')) updated.challenges = 'financial';

  return updated;
}

// Build profile context string for AI
function buildProfileContext(profile: Partial<ParentProfile>): string {
  const parts: string[] = [];
  if (profile.numberOfChildren) parts.push(`Children: ${profile.numberOfChildren}`);
  if (profile.childrenAges?.length) parts.push(`Ages: ${Array.isArray(profile.childrenAges) ? profile.childrenAges.join(', ') : profile.childrenAges}`);
  if (profile.housingType) parts.push(`Housing: ${profile.housingType}`);
  if (profile.monthlyIncome) parts.push(`Monthly income: ~€${profile.monthlyIncome}`);
  if (profile.employmentStatus) parts.push(`Employment: ${profile.employmentStatus}`);
  if (profile.challenges) parts.push(`Main challenge: ${profile.challenges}`);
  return parts.length > 0 ? parts.join('\n') : 'No information gathered yet.';
}

// Call AI API for response
async function callAI(messages: { role: string; content: string }[], isDocument = false, profileContext?: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('greenpt-chat', {
      body: { messages, isDocument, profileContext }
    });

    if (error) {
      console.error('AI error:', error);
      if (error.message?.includes('429')) {
        toast.error('Too many requests. Please wait a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('AI credits needed.');
      }
      return '';
    }

    return data?.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.error('Failed to call AI:', err);
    return '';
  }
}

// Get conversation stage - we need at least 5 answered questions before matching
type Stage = 'greeting' | 'children' | 'ages' | 'housing' | 'income' | 'employment' | 'challenges' | 'ready';

function countAnsweredQuestions(profile: Partial<ParentProfile>): number {
  let count = 0;
  if (profile.numberOfChildren) count++;
  if (profile.childrenAges && profile.childrenAges.length > 0) count++;
  if (profile.housingType) count++;
  if (profile.monthlyIncome) count++;
  if (profile.employmentStatus) count++;
  if (profile.challenges) count++;
  return count;
}

function getStage(profile: Partial<ParentProfile>): Stage {
  if (!profile.numberOfChildren) return 'greeting';
  if (!profile.childrenAges || profile.childrenAges.length === 0) return 'children';
  if (!profile.housingType) return 'ages';
  if (!profile.monthlyIncome) return 'housing';
  if (!profile.employmentStatus) return 'income';
  if (!profile.challenges) return 'employment';
  return 'ready';
}

// Generate concise responses based on stage
function generateLocalResponse(userMessage: string, profile: Partial<ParentProfile>, messageCount: number): {
  response: string;
  quickReplies: string[];
  updatedProfile: Partial<ParentProfile>;
  shouldMatch: boolean;
} {
  const updatedProfile = parseProfileFromMessage(userMessage, profile);
  const stage = getStage(updatedProfile);
  const answeredCount = countAnsweredQuestions(updatedProfile);
  const lower = userMessage.toLowerCase();

  let response = '';
  let quickReplies: string[] = [];
  // Only match when we have at least 5 questions answered AND reached 'ready' stage
  let shouldMatch = stage === 'ready' && answeredCount >= 5;

  switch (stage) {
    case 'greeting':
      if (lower.includes('yes') || lower.includes('child') || lower.includes('kinderen') || lower.includes('have children')) {
        response = `That's wonderful. How many little ones do you have?`;
        quickReplies = ['1 child', '2 children', '3 or more'];
      } else if (lower.includes('new') || lower.includes('nieuw')) {
        response = `Welcome! I'm here to help you discover support you may be entitled to. Do you have any children?`;
        quickReplies = ['Yes, I have children', 'No children'];
      } else if (lower.includes('housing') || lower.includes('woon')) {
        response = `I can help with housing support. But first, tell me - do you have any children?`;
        quickReplies = ['Yes, I have children', 'No children'];
      } else if (lower.includes('health') || lower.includes('gezond')) {
        response = `Healthcare support is definitely something we can explore. To start, do you have any children?`;
        quickReplies = ['Yes, I have children', 'No children'];
      } else {
        response = `Hi there! I'm Bloom, and I'm here to help you find support you deserve.\n\nDo you have any children?`;
        quickReplies = ['Yes, I have children', 'No children'];
      }
      break;

    case 'children':
      response = `Got it, ${updatedProfile.numberOfChildren} ${updatedProfile.numberOfChildren === 1 ? 'child' : 'children'}! How old ${updatedProfile.numberOfChildren === 1 ? 'is your little one' : 'are they'}?`;
      quickReplies = ['Baby/toddler (0-4)', 'School age (4-12)', 'Teenager (12-18)', 'Mixed ages'];
      break;

    case 'ages':
      response = `Thanks for sharing! Now, what's your housing situation?`;
      quickReplies = ['Renting privately', 'Social housing', 'Own home', 'Living with family'];
      break;

    case 'housing':
      response = `Understood. And roughly, what's your monthly household income?`;
      quickReplies = ['Under €1,500', '€1,500-2,500', '€2,500-3,500', 'Above €3,500'];
      break;

    case 'income':
      response = `Almost there! What's your current work situation?`;
      quickReplies = ['Full-time', 'Part-time', 'Looking for work', 'Studying', 'Unable to work'];
      break;

    case 'employment':
      response = `Last question: what feels like your biggest challenge right now?`;
      quickReplies = ['Childcare costs', 'Healthcare expenses', 'Making ends meet', 'Everything feels overwhelming'];
      break;

    case 'ready':
      if (shouldMatch) {
        response = `Thank you for trusting me with your story. Let me find what you're entitled to...`;
        quickReplies = [];
      } else {
        // Not enough info yet, ask for more
        response = `Thanks for sharing. Is there anything else that's been challenging?`;
        quickReplies = ['Childcare costs', 'Healthcare', 'Bills and expenses', 'That covers it'];
        shouldMatch = lower.includes('covers it') || lower.includes('that\'s all');
      }
      break;
  }

  return { response, quickReplies, updatedProfile, shouldMatch };
}

// Call benefits matching API
async function callBenefitsMatch(profile: Partial<ParentProfile>): Promise<BenefitMatch[]> {
  try {
    const monthlyIncome = typeof profile.monthlyIncome === 'number' ? profile.monthlyIncome : 2000;
    const matchProfile = {
      personal: { age: 30 },
      financial: { annualIncomeGross: monthlyIncome * 12 },
      children: {
        numberOfChildren: profile.numberOfChildren || 0,
        age: Array.isArray(profile.childrenAges) ? profile.childrenAges[0] : 5
      },
      housing: { isRenting: profile.housingType === 'rent' || profile.housingType === 'social' },
      employment: { isEmployed: profile.employmentStatus === 'employed' || profile.employmentStatus === 'part-time' }
    };

    const { data, error } = await supabase.functions.invoke('benefits-match', {
      body: matchProfile
    });

    if (error) {
      console.error('Benefits match error:', error);
      return [];
    }

    return (data?.matches || []).map((match: any) => ({
      benefit: {
        id: match.benefitId,
        name: match.name,
        nameNl: match.nameNl || match.name,
        description: match.description,
        descriptionNl: match.descriptionNl,
        category: match.type || 'national',
        administrator: match.provider,
        eligibilityCriteria: match.eligibilitySummary || [],
        applicationUrl: match.applicationUrl,
        estimatedAmount: match.estimatedAmount,
        icon: '🌻'
      },
      matchScore: match.matchScore || 0.85,
      matchReasons: match.matchReasons || match.eligibilitySummary || [],
      missingInfo: []
    }));
  } catch (err) {
    console.error('Failed to match benefits:', err);
    return [];
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [profile, setProfile] = useState<Partial<ParentProfile>>({});
  const [benefitMatches, setBenefitMatches] = useState<BenefitMatch[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    // Handle PDF quick replies
    if (pendingPdfFile && (content === 'Analyze & explain it' || content === 'Help me fill it in')) {
      if (content === 'Analyze & explain it') {
        const userMsg: ChatMessage = {
          id: generateId(),
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMsg]);
        await analyzeDocument(pendingPdfFile.name);
        return;
      } else {
        const userMsg: ChatMessage = {
          id: generateId(),
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMsg]);
        await startPdfFill(pendingPdfFile);
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setQuickReplies([]);

    // Update conversation history for API
    const newHistory = [...conversationHistory, { role: 'user', content }];
    setConversationHistory(newHistory);

    // Parse profile from user message BEFORE calling AI
    const updatedProfile = parseProfileFromMessage(content, profile);
    const answeredCount = countAnsweredQuestions(updatedProfile);
    const stage = getStage(updatedProfile);
    const shouldMatch = stage === 'ready' && answeredCount >= 5;

    // Build context for AI about what we know so far
    const profileContext = buildProfileContext(updatedProfile);

    // Call real AI for response with profile context
    const aiResponse = await callAI(newHistory, false, profileContext);
    
    // Simulate natural typing delay
    await new Promise(resolve => setTimeout(resolve, getTypingDelay(aiResponse || 'Thinking...')));
    setIsTyping(false);

    const finalResponse = aiResponse || "I'm here to help. Tell me about your situation.";

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: finalResponse,
      timestamp: new Date().toISOString(),
    };

    setProfile(updatedProfile);
    setMessages(prev => [...prev, assistantMessage]);
    setConversationHistory(prev => [...prev, { role: 'assistant', content: finalResponse }]);

    // Generate quick replies based on NEXT stage (what we're asking about)
    const nextStage = getStage(updatedProfile);
    const quickRepliesForStage = getQuickRepliesForStage(nextStage);
    setQuickReplies(quickRepliesForStage);

    // If ready to match, call the benefits matching API
    if (shouldMatch) {
      setIsTyping(true);
      
      const matches = await callBenefitsMatch(updatedProfile);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(false);
      
      setBenefitMatches(matches);
      
      if (matches.length > 0) {
        const followUp = `I found ${matches.length} options for you! Take a look.`;
        const followUpMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: followUp,
          timestamp: new Date().toISOString(),
          hasRecommendations: true,
        };
        setMessages(prev => [...prev, followUpMessage]);
        setQuickReplies([]);
      }
    }

    setIsLoading(false);
  }, [profile, conversationHistory]);

  // Helper to get quick replies based on conversation stage
  function getQuickRepliesForStage(stage: Stage): string[] {
    switch (stage) {
      case 'greeting': return ['Yes, I have children', '1 child', '2 children', '3 or more'];
      case 'children': return ['Baby/toddler (0-4)', 'School age (4-12)', 'Teenager (12-18)', 'Mixed ages'];
      case 'ages': return ['Renting privately', 'Social housing', 'Own home', 'Living with family'];
      case 'housing': return ['Under €1,500', '€1,500-2,500', '€2,500-3,500', 'Above €3,500'];
      case 'income': return ['Full-time', 'Part-time', 'Looking for work', 'Studying', 'Unable to work'];
      case 'employment': return ['Childcare costs', 'Healthcare expenses', 'Making ends meet', 'Everything feels hard'];
      case 'ready': return [];
      default: return [];
    }
  }

  const [pendingPdfFile, setPendingPdfFile] = useState<File | null>(null);
  const [pdfMode, setPdfMode] = useState<'none' | 'analyze' | 'fill'>('none');

  const analyzeDocument = async (filename: string) => {
    setIsLoading(true);
    setIsTyping(true);
    setQuickReplies([]);

    const documentContext = `The user shared a document called "${filename}". Based on common Dutch government documents, help them understand what this document likely is and what they should do.`;
    
    const docHistory = [
      ...conversationHistory,
      { role: 'user', content: documentContext }
    ];

    const aiResponse = await callAI(docHistory, true);
    
    await new Promise(resolve => setTimeout(resolve, getTypingDelay(aiResponse || 'Looking at your document...')));
    setIsTyping(false);

    const explanation = aiResponse || "I see you've shared a document. Can you tell me a bit more about what it says or where it's from? I'll help you understand what it means.";

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: explanation,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setConversationHistory(prev => [...prev, 
      { role: 'user', content: documentContext },
      { role: 'assistant', content: explanation }
    ]);
    setQuickReplies(['What should I do next?', 'Is there a deadline?', 'Continue with benefits']);
    setIsLoading(false);
    setPendingPdfFile(null);
    setPdfMode('none');
  };

  const startPdfFill = async (file: File) => {
    setPdfMode('fill');
    setIsLoading(true);
    setIsTyping(true);
    setQuickReplies([]);

    const fillContext = `The user wants help filling in a PDF form called "${file.name}". This is likely a Dutch government form. Ask them for the information typically needed, one question at a time. Start by asking about their basic info. Be warm and helpful.`;
    
    const docHistory = [
      ...conversationHistory,
      { role: 'user', content: `I want help filling in ${file.name}` }
    ];

    const aiResponse = await callAI([...docHistory, { role: 'user', content: fillContext }], false);
    
    await new Promise(resolve => setTimeout(resolve, getTypingDelay(aiResponse || 'Let me help you...')));
    setIsTyping(false);

    const response = aiResponse || "I'll help you fill in this form! Let's start with some basic information. What's your full name as it appears on official documents?";

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setConversationHistory(prev => [...prev, 
      { role: 'user', content: `I want help filling in ${file.name}` },
      { role: 'assistant', content: response }
    ]);
    setIsLoading(false);
    setPendingPdfFile(null);
  };

  const sendFile = useCallback(async (file: File) => {
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: `📎 Shared document: ${file.name}`,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    if (isPdf) {
      setPendingPdfFile(file);
      
      const askMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `I see you've shared a PDF document. What would you like me to do with it?`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, askMessage]);
      setQuickReplies(['Analyze & explain it', 'Help me fill it in']);
      return;
    }

    await analyzeDocument(file.name);
  }, [conversationHistory]);

  const addTaskForBenefit = useCallback((benefitId: string) => {
    // First check if it's from the API matches
    const apiMatch = benefitMatches.find(m => m.benefit.id === benefitId);
    const benefit = apiMatch?.benefit || getBenefitById(benefitId);
    
    if (!benefit) return;

    const newTask: Task = {
      id: generateId(),
      title: `Apply for ${benefit.name}`,
      titleNl: `Aanvragen ${benefit.nameNl}`,
      description: benefit.description,
      benefitId,
      benefit,
      status: 'pending',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      estimatedAmount: benefit.estimatedAmount,
      applicationUrl: benefit.applicationUrl,
    };

    setTasks(prev => [...prev, newTask]);
  }, [benefitMatches]);

  const toggleTask = useCallback((taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setProfile({});
    setBenefitMatches([]);
    setQuickReplies([]);
    setConversationHistory([]);
    setIsLoading(false);
    setIsTyping(false);
    setPendingPdfFile(null);
    setPdfMode('none');
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    quickReplies,
    profile,
    benefitMatches,
    tasks,
    pdfMode,
    sendMessage,
    sendFile,
    addTaskForBenefit,
    toggleTask,
    deleteTask,
    resetConversation,
  };
}
