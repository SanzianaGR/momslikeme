import { useState, useCallback } from 'react';
import { ChatMessage, ParentProfile, BenefitMatch, Task } from '@/types';
import { parseProfileFromConversation, calculateBenefitMatches } from '@/lib/matching';
import { getBenefitById } from '@/data/benefits';

const generateId = () => Math.random().toString(36).substring(2, 9);

// Simulate typing delay based on message length
const getTypingDelay = (text: string): number => {
  const baseDelay = 400;
  const perCharDelay = 15;
  return Math.min(baseDelay + text.length * perCharDelay, 2500);
};

// Hardcoded document explanations
const documentExplanations: Record<string, { title: string; explanation: string; quickReplies: string[] }> = {
  'pdf': {
    title: 'Document Analysis',
    explanation: `I can see this looks like a government letter or official document! 📄\n\nHere's what I notice:\n• This appears to be related to benefits or taxes\n• There might be important deadlines mentioned\n• You may need to take action or respond\n\nWould you like me to help you understand what action might be needed?`,
    quickReplies: ['What should I do next?', 'Is this about a benefit?', 'Help me respond to this']
  },
  'belastingdienst': {
    title: 'Tax Office Letter',
    explanation: `This looks like a letter from the Belastingdienst (Tax Office)! 📋\n\n**In simple terms:**\n• The Tax Office handles things like toeslagen (benefits) and taxes\n• This letter might be about your zorgtoeslag, huurtoeslag, or kinderopvangtoeslag\n• Don't worry — I can help you understand what it means!\n\nThe most important thing is to check if there's a deadline (usually shown at the top of the letter).`,
    quickReplies: ['Is there a deadline?', 'What benefits is this about?', 'Help me understand the amounts']
  },
  'gemeente': {
    title: 'Municipality Letter', 
    explanation: `This appears to be from your gemeente (municipality)! 🏛️\n\n**What this usually means:**\n• Your local gemeente handles things like bijzondere bijstand (special assistance)\n• They might be asking for more information or confirming something\n• Municipal letters often have local support options\n\nRemember: your gemeente wants to help! They have many local programs available.`,
    quickReplies: ['What local help is available?', 'Do I need to respond?', 'Tell me about bijzondere bijstand']
  },
  'default': {
    title: 'Document Received',
    explanation: `Thank you for sharing this document with me! 📄\n\n**Here's what I can help with:**\n• Understanding official language in plain Dutch/English\n• Identifying what action you might need to take\n• Finding benefits or support related to this document\n\nCould you tell me a bit more about what this document is about, or what concerns you have about it?`,
    quickReplies: ['What does this mean?', 'Do I need to do anything?', 'Is this about money I could receive?']
  }
};

// Get document explanation based on filename
function getDocumentExplanation(filename: string): { title: string; explanation: string; quickReplies: string[] } {
  const lower = filename.toLowerCase();
  if (lower.includes('belasting') || lower.includes('toeslag') || lower.includes('tax')) {
    return documentExplanations['belastingdienst'];
  }
  if (lower.includes('gemeente') || lower.includes('municipal') || lower.includes('bijstand')) {
    return documentExplanations['gemeente'];
  }
  if (lower.includes('.pdf')) {
    return documentExplanations['pdf'];
  }
  return documentExplanations['default'];
}

// Simple response generation - in production, this would call GreenPT API
function generateResponse(userMessage: string, profile: Partial<ParentProfile>): {
  response: string;
  quickReplies: string[];
  updatedProfile: Partial<ParentProfile>;
} {
  const lower = userMessage.toLowerCase();
  const updatedProfile = { ...profile, ...parseProfileFromConversation(userMessage) };
  
  // Combine all messages into conversation string
  const rawConvo = `${profile.rawConversation || ''}\nUser: ${userMessage}`;
  updatedProfile.rawConversation = rawConvo;

  let response = '';
  let quickReplies: string[] = [];

  // Check for children info
  if (lower.includes('child') || lower.includes('kid') || /\d+/.test(lower)) {
    const numMatch = lower.match(/(\d+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      if (num <= 5) {
        updatedProfile.numberOfChildren = num;
        response = `${num === 1 ? 'One little one' : `${num} children`} — that's wonderful! 💚\n\nHow old ${num === 1 ? 'is your child' : 'are they'}? This helps me find age-specific support like school funds or childcare benefits.`;
        quickReplies = ['Under 4 years', '4-12 years old', 'Teenagers (13-18)'];
      }
    }
  }
  
  // Check for age info
  if (lower.includes('year') || lower.includes('old') || lower.includes('teenager') || lower.includes('under')) {
    if (!response) {
      response = `Thanks for sharing! That helps me understand what kind of support might be available.\n\nAre you currently renting or do you own your home? Housing costs are often where families can get the most help.`;
      quickReplies = ['I rent my home', 'Social housing', 'I own my home'];
    }
  }

  // Check for housing info
  if (lower.includes('rent') || lower.includes('huur')) {
    if (!response) {
      updatedProfile.housingType = lower.includes('social') ? 'social' : 'rent';
      response = `Good to know! Renting families often qualify for Huurtoeslag (rent benefit) which can save hundreds per month.\n\nDo you work, or are you looking for work right now?`;
      quickReplies = ['I work full-time', 'I work part-time', "I'm looking for work"];
    }
  }
  
  if (lower.includes('own') || lower.includes('koop')) {
    if (!response) {
      updatedProfile.housingType = 'own';
      response = `Owning your home is great! While Huurtoeslag won't apply, there are still many other benefits that might help.\n\nDo you work, or are you looking for work?`;
      quickReplies = ['I work full-time', 'I work part-time', "I'm looking for work"];
    }
  }

  // Check for employment info
  if (lower.includes('work') || lower.includes('job') || lower.includes('employed')) {
    if (!response) {
      if (lower.includes('part-time') || lower.includes('parttime')) {
        updatedProfile.employmentStatus = 'part-time';
      } else if (lower.includes('looking') || lower.includes('unemployed')) {
        updatedProfile.employmentStatus = 'unemployed';
      } else {
        updatedProfile.employmentStatus = 'employed';
      }
      
      response = `Thanks! That helps me understand your situation better.\n\nDo you need help with childcare costs? If you're working or studying, Kinderopvangtoeslag could cover up to 96% of childcare!`;
      quickReplies = ['Yes, I need childcare', "No childcare needed", 'What other help is there?'];
    }
  }

  // Check for childcare
  if (lower.includes('childcare') || lower.includes('opvang') || lower.includes('daycare')) {
    if (!response) {
      updatedProfile.hasChildcareNeeds = true;
      response = `Childcare is so important! The Kinderopvangtoeslag can really help.\n\nI think I have a good picture now. Would you like to see which benefits might be a good fit for you?`;
      quickReplies = ['Show me my benefits', 'Tell me more about childcare help'];
    }
  }

  // Generic helpful responses
  if (!response) {
    const matches = calculateBenefitMatches(updatedProfile);
    if (matches.length > 0) {
      response = `Based on what you've shared, I've found ${matches.length} potential benefits you might qualify for! 🎉\n\nThe top match is **${matches[0].benefit.name}** (${matches[0].benefit.nameNl}) — ${matches[0].benefit.description.split('.')[0]}.\n\nWant to see all your matches?`;
      quickReplies = ['Show all my benefits', 'Tell me more about ' + matches[0].benefit.name];
    } else {
      response = `I'm listening! Could you tell me a bit more about your situation?\n\nFor example, how many children do you have, or whether you're renting or owning your home?`;
      quickReplies = ['I have 1 child', 'I have 2 children', 'I rent my home'];
    }
  }

  return { response, quickReplies, updatedProfile };
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [profile, setProfile] = useState<Partial<ParentProfile>>({});
  const [benefitMatches, setBenefitMatches] = useState<BenefitMatch[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

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

    // Natural "thinking" delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

    const { response, quickReplies: newQuickReplies, updatedProfile } = generateResponse(content, profile);

    // Simulate typing based on response length
    const typingDelay = getTypingDelay(response);
    await new Promise(resolve => setTimeout(resolve, typingDelay));

    setIsTyping(false);

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };

    setProfile(updatedProfile);
    setMessages(prev => [...prev, assistantMessage]);
    setQuickReplies(newQuickReplies);
    
    // Update benefit matches
    const matches = calculateBenefitMatches(updatedProfile);
    setBenefitMatches(matches);

    setIsLoading(false);
  }, [profile]);

  const sendFile = useCallback(async (file: File) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: `📎 Shared document: ${file.name}`,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setQuickReplies([]);

    // Simulate document processing delay
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    const docExplanation = getDocumentExplanation(file.name);
    
    // Typing delay for response
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
    const benefit = getBenefitById(benefitId);
    if (!benefit) return;

    const newTask: Task = {
      id: generateId(),
      title: `Apply for ${benefit.name}`,
      description: `Check eligibility and apply for ${benefit.nameNl} through ${benefit.administrator}`,
      benefitId,
      status: 'pending',
      priority: 'medium',
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [...prev, newTask]);
  }, []);

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
