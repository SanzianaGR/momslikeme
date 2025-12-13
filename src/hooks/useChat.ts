import { useState, useCallback } from 'react';
import { ChatMessage, ParentProfile, BenefitMatch, Task } from '@/types';
import { parseProfileFromConversation, calculateBenefitMatches } from '@/lib/matching';
import { getBenefitById } from '@/data/benefits';

const generateId = () => Math.random().toString(36).substring(2, 9);

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
    setQuickReplies([]);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const { response, quickReplies: newQuickReplies, updatedProfile } = generateResponse(content, profile);

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
    quickReplies,
    profile,
    benefitMatches,
    tasks,
    sendMessage,
    addTaskForBenefit,
    toggleTask,
    deleteTask,
  };
}
