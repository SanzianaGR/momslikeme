import { useState, useCallback } from 'react';
import { ChatMessage, ParentProfile, BenefitMatch, Task } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getBenefitById } from '@/data/benefits';

const generateId = () => Math.random().toString(36).substring(2, 9);

// Simulate typing delay based on message length
const getTypingDelay = (text: string): number => {
  const baseDelay = 300;
  const perCharDelay = 12;
  return Math.min(baseDelay + text.length * perCharDelay, 2000);
};

// Document explanations for file uploads
const documentExplanations: Record<string, { title: string; explanation: string; quickReplies: string[] }> = {
  'belastingdienst': {
    title: 'Tax Office Letter',
    explanation: `This looks like a letter from the Belastingdienst! It might be about your toeslagen. Check if there's a deadline at the top.`,
    quickReplies: ['What does it mean?', 'Is there a deadline?', 'Help me respond']
  },
  'gemeente': {
    title: 'Municipality Letter', 
    explanation: `This is from your gemeente. They might be asking for info or confirming something about local support.`,
    quickReplies: ['What should I do?', 'Is this about benefits?']
  },
  'default': {
    title: 'Document Received',
    explanation: `Thanks for sharing! Tell me what this document is about and I'll help you understand it.`,
    quickReplies: ['What does this mean?', 'Do I need to respond?']
  }
};

function getDocumentExplanation(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.includes('belasting') || lower.includes('toeslag')) return documentExplanations['belastingdienst'];
  if (lower.includes('gemeente') || lower.includes('bijstand')) return documentExplanations['gemeente'];
  return documentExplanations['default'];
}

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

// Get conversation stage
type Stage = 'greeting' | 'children' | 'ages' | 'housing' | 'income' | 'employment' | 'challenges' | 'ready';

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
  const lower = userMessage.toLowerCase();

  let response = '';
  let quickReplies: string[] = [];
  let shouldMatch = false;

  switch (stage) {
    case 'greeting':
      if (lower.includes('yes') || lower.includes('child') || lower.includes('kinderen')) {
        response = `How many children do you have?`;
        quickReplies = ['1 child', '2 children', '3 or more'];
      } else {
        response = `Hi! I'm Bloom. I help parents find support they're entitled to.\n\nDo you have children?`;
        quickReplies = ['Yes, I have children', 'No children'];
      }
      break;

    case 'children':
      response = `Got it! How old ${updatedProfile.numberOfChildren === 1 ? 'is your child' : 'are they'}?`;
      quickReplies = ['Baby/toddler (0-4)', 'School age (4-12)', 'Teenager (12-18)', 'Mixed ages'];
      break;

    case 'ages':
      response = `Thanks! Are you renting or do you own your home?`;
      quickReplies = ['Renting privately', 'Social housing', 'Own home', 'Living with family'];
      break;

    case 'housing':
      response = `What's your approximate household income per month?`;
      quickReplies = ['Under €1,500', '€1,500-2,500', '€2,500-3,500', 'Above €3,500'];
      break;

    case 'income':
      response = `Are you currently working?`;
      quickReplies = ['Full-time', 'Part-time', 'Looking for work', 'Studying', 'Unable to work'];
      break;

    case 'employment':
      response = `Last question: what's your biggest challenge right now?`;
      quickReplies = ['Childcare costs', 'Healthcare', 'Making ends meet', 'Everything feels hard'];
      break;

    case 'ready':
      response = `Thanks for sharing. Let me find what you're entitled to...`;
      quickReplies = [];
      shouldMatch = true;
      break;
  }

  return { response, quickReplies, updatedProfile, shouldMatch };
}

// Call GreenPT API for AI response
async function callGreenPT(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('greenpt-chat', {
      body: { messages }
    });

    if (error) {
      console.error('GreenPT error:', error);
      return '';
    }

    return data?.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.error('Failed to call GreenPT:', err);
    return '';
  }
}

// Call benefits matching API
async function callBenefitsMatch(profile: Partial<ParentProfile>): Promise<BenefitMatch[]> {
  try {
    // Convert profile to the format expected by the matching API
    const monthlyIncome = typeof profile.monthlyIncome === 'number' ? profile.monthlyIncome : 2000;
    const matchProfile = {
      personal: {
        age: 30 // Default
      },
      financial: {
        annualIncomeGross: monthlyIncome * 12
      },
      children: {
        numberOfChildren: profile.numberOfChildren || 0,
        age: Array.isArray(profile.childrenAges) ? profile.childrenAges[0] : 5
      },
      housing: {
        isRenting: profile.housingType === 'rent' || profile.housingType === 'social'
      },
      employment: {
        isEmployed: profile.employmentStatus === 'employed' || profile.employmentStatus === 'part-time'
      }
    };

    const { data, error } = await supabase.functions.invoke('benefits-match', {
      body: matchProfile
    });

    if (error) {
      console.error('Benefits match error:', error);
      return [];
    }

    // Transform to BenefitMatch format
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

    // Generate local response for structured flow
    const { response: localResponse, quickReplies: newReplies, updatedProfile, shouldMatch } = 
      generateLocalResponse(content, profile, messages.length);

    // Try to get AI response for more natural conversation
    let finalResponse = localResponse;
    
    // Only call AI for certain stages or when we need more nuanced responses
    const stage = getStage(updatedProfile);
    if (stage === 'ready' && !shouldMatch) {
      const aiResponse = await callGreenPT(newHistory);
      if (aiResponse) {
        finalResponse = aiResponse;
      }
    }

    // Simulate natural typing delay
    await new Promise(resolve => setTimeout(resolve, getTypingDelay(finalResponse)));
    setIsTyping(false);

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: finalResponse,
      timestamp: new Date().toISOString(),
    };

    setProfile(updatedProfile);
    setMessages(prev => [...prev, assistantMessage]);
    setQuickReplies(newReplies);
    setConversationHistory(prev => [...prev, { role: 'assistant', content: finalResponse }]);

    // If ready to match, call the benefits matching API (popups will appear automatically)
    if (shouldMatch) {
      setIsTyping(true);
      
      const matches = await callBenefitsMatch(updatedProfile);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(false);
      
      // Set matches - popups will be triggered in ChatView automatically
      setBenefitMatches(matches);
      
      // Brief follow-up message (no benefit details in chat)
      const followUp = matches.length > 0
        ? `I found ${matches.length} options for you. Take a look!`
        : `I'm still searching... Would you like to talk to a local worker who can help?`;
      
      const followUpMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: followUp,
        timestamp: new Date().toISOString(),
        hasRecommendations: matches.length > 0,
      };
      
      setMessages(prev => [...prev, followUpMessage]);
      setQuickReplies(matches.length === 0 ? ['Yes, connect me', 'No thanks'] : []);
    }

    setIsLoading(false);
  }, [profile, conversationHistory, messages.length]);

  const sendFile = useCallback(async (file: File) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: `📎 Shared: ${file.name}`,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setQuickReplies([]);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const docExplanation = getDocumentExplanation(file.name);
    
    await new Promise(resolve => setTimeout(resolve, getTypingDelay(docExplanation.explanation)));
    setIsTyping(false);

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: docExplanation.explanation,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setQuickReplies(docExplanation.quickReplies);
    setIsLoading(false);
  }, []);

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

  return {
    messages,
    isLoading,
    isTyping,
    quickReplies,
    profile,
    benefitMatches,
    tasks,
    sendMessage,
    sendFile,
    addTaskForBenefit,
    toggleTask,
    deleteTask,
  };
}
