import { useRef, useState, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { ChatBotSection } from './ChatBotSection';
import { ChatMessage as ChatMessageType } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';

interface ChatViewProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  quickReplies?: string[];
}

export function ChatView({ messages, onSendMessage, isLoading, quickReplies = [] }: ChatViewProps) {
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { language, toggleLanguage, t } = useLanguage();

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStart = (message: string) => {
    setHasStarted(true);
    onSendMessage(message);
  };

  // Track scroll progress for animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero section */}
      <div 
        className="transition-all duration-300"
        style={{ 
          opacity: 1 - scrollProgress * 0.5,
          transform: `scale(${1 - scrollProgress * 0.05})`
        }}
      >
        <HeroSection 
          onScrollToChat={scrollToChat}
          language={language}
          onToggleLanguage={toggleLanguage}
          t={t}
        />
      </div>
      
      {/* Chat section */}
      <div 
        ref={chatSectionRef}
        className="transition-all duration-500"
        style={{
          opacity: 0.5 + scrollProgress * 0.5,
          transform: `translateY(${(1 - scrollProgress) * 20}px)`
        }}
      >
        <ChatBotSection
          messages={messages}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          quickReplies={quickReplies}
          hasStarted={hasStarted}
          onStart={handleStart}
          t={t}
        />
      </div>
    </div>
  );
}