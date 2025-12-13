import { useState, useCallback } from 'react';

export type Language = 'nl' | 'en';

interface Translations {
  [key: string]: {
    nl: string;
    en: string;
  };
}

export const translations: Translations = {
  // Hero section
  'hero.title': {
    nl: 'momslikeme',
    en: 'momslikeme',
  },
  'hero.subtitle': {
    nl: 'Ontdek welke hulp er voor jou en je gezin is — veilig en anoniem',
    en: 'Discover what support is available for you and your family — safe and anonymous',
  },
  'hero.subtitle.help': {
    nl: 'hulp',
    en: 'support',
  },
  'hero.subtitle.safe': {
    nl: 'veilig',
    en: 'safe',
  },
  'hero.subtitle.anonymous': {
    nl: 'anoniem',
    en: 'anonymous',
  },
  'hero.badge.private': {
    nl: '100% Privé',
    en: '100% Private',
  },
  'hero.badge.noGov': {
    nl: 'Geen overheid',
    en: 'No government',
  },
  'hero.badge.friendly': {
    nl: 'Vriendelijke hulp',
    en: 'Friendly help',
  },
  'hero.scroll': {
    nl: 'Scroll om te beginnen',
    en: 'Scroll to begin',
  },
  
  // Chatbot section
  'chat.name': {
    nl: 'Bloem',
    en: 'Bloom',
  },
  'chat.helper': {
    nl: 'Je vriendelijke hulpje 🌸',
    en: 'Your friendly helper 🌸',
  },
  'chat.privacy.title': {
    nl: 'Jouw privacy is veilig',
    en: 'Your privacy is safe',
  },
  'chat.privacy.desc': {
    nl: 'Ik ben niet verbonden met de overheid. Wat je deelt blijft tussen ons. 💚',
    en: "I'm not connected to the government. What you share stays between us. 💚",
  },
  'chat.greeting': {
    nl: 'Hallo! 👋 Hoe kan ik je helpen vandaag?',
    en: 'Hello! 👋 How can I help you today?',
  },
  'chat.input.placeholder': {
    nl: 'Typ je bericht...',
    en: 'Type your message...',
  },
  'chat.input.welcome': {
    nl: 'Of typ hier je vraag...',
    en: 'Or type your question here...',
  },
  
  // Starting options
  'option.parent.label': {
    nl: 'Ik ben alleenstaande ouder',
    en: "I'm a single parent",
  },
  'option.parent.desc': {
    nl: 'Vind ondersteuning voor jou en je kinderen',
    en: 'Find support for you and your children',
  },
  'option.parent.message': {
    nl: 'Ik ben alleenstaande ouder en zoek naar regelingen waar ik misschien recht op heb.',
    en: "I'm a single parent looking for benefits I might be entitled to.",
  },
  'option.housing.label': {
    nl: 'Hulp met wonen',
    en: 'Help with housing',
  },
  'option.housing.desc': {
    nl: 'Huur, energie, verhuiskosten',
    en: 'Rent, energy, moving costs',
  },
  'option.housing.message': {
    nl: 'Ik heb hulp nodig met woonkosten zoals huur of energierekeningen.',
    en: 'I need help with housing costs like rent or energy bills.',
  },
  'option.children.label': {
    nl: 'Voor mijn kinderen',
    en: 'For my children',
  },
  'option.children.desc': {
    nl: 'School, sport, verjaardagen',
    en: 'School, sports, birthdays',
  },
  'option.children.message': {
    nl: 'Ik wil ondersteuning vinden voor de activiteiten en behoeften van mijn kinderen.',
    en: 'I want to find support for my children\'s activities and needs.',
  },
};

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('nl');

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language];
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'nl' ? 'en' : 'nl');
  }, []);

  return { language, setLanguage, toggleLanguage, t };
}
