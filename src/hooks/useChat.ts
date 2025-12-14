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

// Conversation stage tracking
type ConversationStage = 'greeting' | 'children' | 'ages' | 'housing' | 'income' | 'employment' | 'challenges' | 'ready';

function getConversationStage(profile: Partial<ParentProfile>): ConversationStage {
  if (!profile.numberOfChildren) return 'greeting';
  if (!profile.childrenAges) return 'children';
  if (!profile.housingType) return 'ages';
  if (!profile.monthlyIncome) return 'housing';
  if (!profile.employmentStatus) return 'income';
  if (!profile.challenges) return 'employment';
  return 'ready';
}

// Warm, empathetic responses that build trust before recommending
function generateResponse(userMessage: string, profile: Partial<ParentProfile>, messageCount: number): {
  response: string;
  quickReplies: string[];
  updatedProfile: Partial<ParentProfile>;
  shouldShowBenefits: boolean;
} {
  const lower = userMessage.toLowerCase();
  const updatedProfile = { ...profile, ...parseProfileFromConversation(userMessage) };
  
  const rawConvo = `${profile.rawConversation || ''}\nUser: ${userMessage}`;
  updatedProfile.rawConversation = rawConvo;

  let response = '';
  let quickReplies: string[] = [];
  let shouldShowBenefits = false;

  const stage = getConversationStage(updatedProfile);

  // First message - warm welcome
  if (messageCount === 0 || stage === 'greeting') {
    // Check if they mentioned children
    const numMatch = lower.match(/(\d+)\s*(child|kid|kinderen)/i) || lower.match(/i have (\d+)/i);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      updatedProfile.numberOfChildren = num;
      response = `${num === 1 ? 'One little one' : `${num} little ones`} — you must have your hands full! I really appreciate you sharing that with me.\n\nBefore we look at what support might be available, I'd love to understand your situation a bit better. It helps me find the things that are actually relevant to you.\n\nHow old ${num === 1 ? 'is your child' : 'are your children'}?`;
      quickReplies = ['Baby/toddler (0-4)', 'Primary school (4-12)', 'Teenager (12-18)', 'Mixed ages'];
    } else if (lower.includes('new') || lower.includes('nieuw') || lower.includes('start')) {
      response = `Welcome! I'm Bloom, and I'm here to help you navigate the maze of support that's available in the Netherlands.\n\nI know it can feel overwhelming — there are so many different "potjes" (funds) and it's hard to know what you might qualify for. That's exactly why I'm here.\n\nLet's start simple: do you have children?`;
      quickReplies = ['Yes, I have children', 'No children', 'I\'m expecting'];
    } else if (lower.includes('children') || lower.includes('child') || lower.includes('kinderen')) {
      response = `It sounds like you have little ones! That's wonderful.\n\nThere's actually quite a lot of support available for parents in the Netherlands — from childcare benefits to school supplies funds. But first, let me get to know your situation a bit.\n\nHow many children do you have?`;
      quickReplies = ['1 child', '2 children', '3 or more'];
    } else if (lower.includes('housing') || lower.includes('rent') || lower.includes('huur') || lower.includes('woon')) {
      response = `Housing costs can be one of the biggest expenses — I hear you. The good news is there's help available.\n\nBut let me understand your full picture first so I can really help. Tell me, do you have children?`;
      quickReplies = ['Yes, I have children', 'No children'];
    } else if (lower.includes('healthcare') || lower.includes('gezond') || lower.includes('zorg')) {
      response = `Healthcare costs are a real concern for many families. The zorgtoeslag (healthcare allowance) can help, but there might be more support available depending on your situation.\n\nLet me learn a bit about you first. Do you have children?`;
      quickReplies = ['Yes, I have children', 'No children'];
    } else {
      response = `Hi there! I'm Bloom, your friendly guide to finding support in the Netherlands.\n\nI know dealing with government systems and applications can feel scary — especially after everything that's happened. But I'm here to help, and everything you share stays completely private.\n\nLet's start with a simple question: do you have children?`;
      quickReplies = ['Yes, I have children', 'No children', 'I\'m expecting'];
    }
    return { response, quickReplies, updatedProfile, shouldShowBenefits: false };
  }

  // Stage: Just learned about children, asking for ages
  if (stage === 'children') {
    const numMatch = lower.match(/(\d+)/);
    if (numMatch) {
      updatedProfile.numberOfChildren = parseInt(numMatch[1]);
    }
    
    if (lower.includes('baby') || lower.includes('toddler') || lower.includes('0-4') || lower.includes('under 4')) {
      updatedProfile.childrenAges = 'young';
      response = `Little ones under 4 — such a precious but exhausting time! You're doing amazing.\n\nChildcare at this age can be expensive, but there's good support available. I'll keep that in mind.\n\nNow, can you tell me about your living situation? Are you renting, or do you own your home?`;
      quickReplies = ['I rent privately', 'Social housing', 'I own my home', 'Living with family'];
    } else if (lower.includes('primary') || lower.includes('school') || lower.includes('4-12')) {
      updatedProfile.childrenAges = 'school';
      response = `School-age children! Between school runs, homework, and after-school activities, I'm sure you're busy.\n\nThere are specific funds for school costs, activities, and even laptops. Good to know!\n\nWhat's your housing situation like? Are you renting or do you own?`;
      quickReplies = ['I rent privately', 'Social housing', 'I own my home', 'Living with family'];
    } else if (lower.includes('teen') || lower.includes('12-18') || lower.includes('older')) {
      updatedProfile.childrenAges = 'teen';
      response = `Teenagers — a whole different adventure! They have their own needs, and costs can actually go up as they get older.\n\nThere are funds specifically for teens, including for education and activities. I'll remember that.\n\nTell me about where you live — are you renting or do you own your home?`;
      quickReplies = ['I rent privately', 'Social housing', 'I own my home', 'Living with family'];
    } else if (lower.includes('mixed') || lower.includes('different ages')) {
      updatedProfile.childrenAges = 'mixed';
      response = `A mix of ages — so you're juggling different needs all at once! That takes real skill.\n\nThe good news is there might be multiple types of support for different ages. I'll look at all of them.\n\nWhat about your housing? Do you rent or own?`;
      quickReplies = ['I rent privately', 'Social housing', 'I own my home'];
    } else {
      response = `Thanks for sharing! To help me understand what support might fit your family, could you tell me roughly how old your children are?`;
      quickReplies = ['Baby/toddler (0-4)', 'Primary school (4-12)', 'Teenager (12-18)', 'Mixed ages'];
    }
    return { response, quickReplies, updatedProfile, shouldShowBenefits: false };
  }

  // Stage: Asking about housing
  if (stage === 'ages') {
    if (lower.includes('rent') || lower.includes('huur')) {
      updatedProfile.housingType = lower.includes('social') ? 'social' : 'rent';
      response = `Got it — ${lower.includes('social') ? 'social housing' : 'renting'}. Housing costs are often the biggest monthly expense, so this is really important information.\n\n${lower.includes('social') ? 'Social housing usually means lower rent, which is good!' : 'Private rent can be expensive, but there\'s help available like huurtoeslag (rent benefit).'}\n\nNow, can I ask — roughly what's your household income each month? Don't worry about exact numbers, a rough range helps.`;
      quickReplies = ['Under €1,500/month', '€1,500-2,500/month', '€2,500-3,500/month', 'Above €3,500/month'];
    } else if (lower.includes('own') || lower.includes('koop') || lower.includes('bought')) {
      updatedProfile.housingType = 'own';
      response = `You own your home — that's great! While some rental benefits won't apply, there are still many other forms of support available.\n\nCan I ask about your household income? A rough range is fine — this helps me understand which benefits might be relevant.`;
      quickReplies = ['Under €1,500/month', '€1,500-2,500/month', '€2,500-3,500/month', 'Above €3,500/month'];
    } else if (lower.includes('family') || lower.includes('parents') || lower.includes('living with')) {
      updatedProfile.housingType = 'family';
      response = `Living with family can be a practical choice, especially when times are tough. It's nothing to be ashamed of.\n\nSome benefits are calculated differently when you share housing. Let me note that down.\n\nWhat about income — roughly how much does your household bring in each month?`;
      quickReplies = ['Under €1,500/month', '€1,500-2,500/month', '€2,500-3,500/month', 'Above €3,500/month'];
    } else {
      response = `Thanks! To help me find the right support, could you tell me about your housing situation?`;
      quickReplies = ['I rent privately', 'Social housing', 'I own my home', 'Living with family'];
    }
    return { response, quickReplies, updatedProfile, shouldShowBenefits: false };
  }

  // Stage: Asking about income
  if (stage === 'housing') {
    if (lower.includes('under') || lower.includes('1500') || lower.includes('1,500') || lower.includes('low')) {
      updatedProfile.monthlyIncome = 'low';
      response = `I appreciate you sharing that — I know it's not always easy to talk about. Many families are in similar situations, and there's no shame in needing support.\n\nThe good news is that at this income level, you likely qualify for quite a few benefits. But let me ask one more thing first.\n\nAre you currently working, looking for work, or perhaps studying?`;
      quickReplies = ['Working full-time', 'Working part-time', 'Looking for work', 'Studying', 'Unable to work'];
    } else if (lower.includes('2500') || lower.includes('2,500') || lower.includes('middle') || lower.includes('medium')) {
      updatedProfile.monthlyIncome = 'medium';
      response = `Thank you for sharing. At this income level, you might still qualify for several benefits — especially with children.\n\nMany people don't realize they're eligible until they check. That's exactly why I'm here!\n\nAre you currently working, studying, or something else?`;
      quickReplies = ['Working full-time', 'Working part-time', 'Looking for work', 'Studying'];
    } else if (lower.includes('3500') || lower.includes('3,500') || lower.includes('above') || lower.includes('high')) {
      updatedProfile.monthlyIncome = 'high';
      response = `Thanks for being open with me. Even at higher income levels, there are still family-specific benefits you might qualify for — like kinderbijslag, which everyone with children gets regardless of income.\n\nAre you working, studying, or in another situation?`;
      quickReplies = ['Working full-time', 'Working part-time', 'Self-employed', 'Studying'];
    } else {
      response = `No worries if you're not sure of the exact amount! Just a rough idea helps me understand which benefits might be relevant. What would you estimate?`;
      quickReplies = ['Under €1,500/month', '€1,500-2,500/month', '€2,500-3,500/month', 'Above €3,500/month'];
    }
    return { response, quickReplies, updatedProfile, shouldShowBenefits: false };
  }

  // Stage: Asking about employment
  if (stage === 'income') {
    if (lower.includes('full-time') || lower.includes('full time') || lower.includes('fulltime')) {
      updatedProfile.employmentStatus = 'employed';
      response = `Working full-time while raising children — that takes real strength. You should be proud of yourself.\n\nOne more question, and then I can start looking at what might help you.\n\nWhat's the biggest challenge you're facing right now? Is it childcare costs, healthcare, housing, or something else?`;
      quickReplies = ['Childcare costs', 'Healthcare/insurance', 'Making ends meet', 'School costs', 'Everything feels hard'];
    } else if (lower.includes('part-time') || lower.includes('part time') || lower.includes('parttime')) {
      updatedProfile.employmentStatus = 'part-time';
      response = `Part-time work often makes the most sense when you have children to care for. It's a valid choice.\n\nWorking part-time can actually open up more benefit options. Let me ask one more thing:\n\nWhat's your biggest challenge right now?`;
      quickReplies = ['Childcare costs', 'Finding more hours', 'Making ends meet', 'School costs', 'Everything feels hard'];
    } else if (lower.includes('looking') || lower.includes('unemployed') || lower.includes('zoek')) {
      updatedProfile.employmentStatus = 'unemployed';
      response = `Looking for work while managing a family is incredibly tough. Please don't be hard on yourself.\n\nThere are specific benefits for people in your situation, and I want to help you find them.\n\nWhat feels like the biggest struggle right now?`;
      quickReplies = ['Paying the bills', 'Childcare while job hunting', 'Healthcare costs', 'Everything feels overwhelming'];
    } else if (lower.includes('study') || lower.includes('student') || lower.includes('studer')) {
      updatedProfile.employmentStatus = 'studying';
      response = `Studying while raising children? That's incredibly ambitious — and there's support specifically for parents who study.\n\nLast question before I look for benefits:\n\nWhat's your biggest challenge right now?`;
      quickReplies = ['Childcare while studying', 'Tuition costs', 'Living expenses', 'Time management'];
    } else if (lower.includes('unable') || lower.includes('disabled') || lower.includes('sick') || lower.includes('arbeidsongeschikt')) {
      updatedProfile.employmentStatus = 'unable';
      response = `I understand, and I'm sorry you're dealing with health challenges on top of everything else.\n\nThere are specific benefits for people who can't work due to health reasons. Let me make sure I find those for you.\n\nWhat feels most pressing for you right now?`;
      quickReplies = ['Medical costs', 'Daily living expenses', 'Support for my children', 'Everything feels hard'];
    } else {
      response = `Thanks for sharing! Can you tell me a bit about your work situation?`;
      quickReplies = ['Working full-time', 'Working part-time', 'Looking for work', 'Studying', 'Unable to work'];
    }
    return { response, quickReplies, updatedProfile, shouldShowBenefits: false };
  }

  // Stage: Asking about challenges - this is the final question before recommendations
  if (stage === 'employment') {
    // Capture the challenge
    if (lower.includes('childcare') || lower.includes('opvang')) {
      updatedProfile.challenges = 'childcare';
    } else if (lower.includes('healthcare') || lower.includes('zorg') || lower.includes('medical') || lower.includes('insurance')) {
      updatedProfile.challenges = 'healthcare';
    } else if (lower.includes('school') || lower.includes('education')) {
      updatedProfile.challenges = 'education';
    } else if (lower.includes('everything') || lower.includes('overwhelming') || lower.includes('hard')) {
      updatedProfile.challenges = 'multiple';
    } else {
      updatedProfile.challenges = 'financial';
    }

    response = `Thank you so much for trusting me with all of this. I know it's not easy to open up, especially about money and struggles.\n\nI've been listening carefully, and I think I have a good picture of your situation now.\n\n**Here's what I'm going to do:**\nI'll look through all the national benefits, local gemeente support, and private funds to find what matches YOUR specific situation.\n\nAre you ready to see what you might qualify for?`;
    quickReplies = ['Yes, show me!', 'I have more to share first'];
    return { response, quickReplies, updatedProfile, shouldShowBenefits: false };
  }

  // Stage: Ready to show benefits
  if (stage === 'ready') {
    if (lower.includes('yes') || lower.includes('show') || lower.includes('ready') || lower.includes('ja')) {
      const matches = calculateBenefitMatches(updatedProfile);
      shouldShowBenefits = true;
      
      if (matches.length > 0) {
        const topMatch = matches[0];
        response = `I found **${matches.length} potential benefits** that might be relevant to your situation! 🌻\n\n**Your strongest match:**\n**${topMatch.benefit.name}** (${topMatch.benefit.nameNl})\n${topMatch.benefit.description.split('.')[0]}.\n\n${topMatch.benefit.estimatedAmount ? `💰 Could be worth up to **${topMatch.benefit.estimatedAmount}**` : ''}\n\nI'll show you each one, and you can add the ones you want to your personal checklist. From there, I'll help you understand exactly how to apply.\n\nShall I walk you through your matches?`;
        quickReplies = ['Walk me through them', 'Show all at once', 'Tell me about ' + topMatch.benefit.name];
      } else {
        response = `I've looked through everything, and while the standard benefits might not be a perfect fit right now, that doesn't mean there's no help available.\n\nThere might be local gemeente support or private funds that could help. Would you like me to look into those?`;
        quickReplies = ['Yes, check local support', 'Tell me about private funds'];
      }
    } else if (lower.includes('more') || lower.includes('share') || lower.includes('tell')) {
      response = `Of course — take your time. What else would you like to share? I'm here to listen.`;
      quickReplies = ['I have health issues', 'I have debts', 'My situation is complicated', "I'm ready now"];
    } else {
      // Continue the conversation
      response = `I'm still here! Is there anything else you'd like to share, or shall I show you what benefits might be available?`;
      quickReplies = ['Show me my benefits', 'I have a question', 'Tell me more about you'];
    }
    return { response, quickReplies, updatedProfile, shouldShowBenefits };
  }

  // Fallback
  response = `I'm here to help! Could you tell me a bit about your situation? For example, do you have children, and what's your living situation like?`;
  quickReplies = ['I have children', 'Tell me what you need to know', 'How does this work?'];
  
  return { response, quickReplies, updatedProfile, shouldShowBenefits: false };
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

    const { response, quickReplies: newQuickReplies, updatedProfile } = generateResponse(content, profile, messages.length);

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
