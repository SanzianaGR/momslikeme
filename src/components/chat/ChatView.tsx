import { useRef, useState, useMemo } from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { BloomFlower } from './BloomFlower';
import { MessageCard } from './MessageCard';
import { OptionCard } from './OptionCard';
import { QuoteCard } from './QuoteCard';
import { SpeechButton } from '@/components/speech/SpeechButton';
import { LanguageToggle } from './LanguageToggle';
import { quotes, getRandomQuote } from '@/data/quotes';
import { CloudDoodle, HeartDoodle, StarDoodle, SunDoodle } from './HandDrawnElements';
import { Shield, Users, Home, Heart } from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  quickReplies?: string[];
  hasRecommendations?: boolean;
  language: 'en' | 'nl';
}

export function ChatView({ messages, onSendMessage, isLoading, quickReplies = [], hasRecommendations = false, language }: ChatViewProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Calculate growth stage based on messages (0-5)
  const growthStage = Math.min(Math.floor(messages.length / 2), 5);
  
  // Get a random quote for the hero
  const heroQuote = useMemo(() => getRandomQuote(), []);

  const startingOptions = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: language === 'en' ? "I'm new here" : "Ik ben nieuw hier",
      description: language === 'en' 
        ? "Let's start fresh and see what support you might qualify for"
        : "Laten we beginnen en kijken welke steun je kunt krijgen"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: language === 'en' ? "I have children" : "Ik heb kinderen",
      description: language === 'en'
        ? "Find benefits for childcare, education, and family support"
        : "Vind toeslagen voor kinderopvang, onderwijs en gezinssteun"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: language === 'en' ? "Housing costs" : "Woonkosten",
      description: language === 'en'
        ? "Get help with rent, utilities, and housing expenses"
        : "Krijg hulp met huur, rekeningen en woonkosten"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: language === 'en' ? "Healthcare" : "Gezondheidszorg",
      description: language === 'en'
        ? "Find support for health insurance and medical costs"
        : "Vind steun voor zorgverzekering en medische kosten"
    }
  ];

  const handleStart = (message: string) => {
    setHasStarted(true);
    onSendMessage(message);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSpeechTranscript = (text: string) => {
    if (!hasStarted) {
      handleStart(text);
    } else {
      onSendMessage(text);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Background decorations */}
        <CloudDoodle className="absolute top-20 left-10 w-24 h-16 text-secondary/30 animate-float" />
        <StarDoodle className="absolute top-32 right-20 w-12 h-12 text-warning/40 animate-twinkle" />
        <HeartDoodle className="absolute bottom-40 left-20 w-10 h-10 text-destructive/30 animate-bounce-gentle" />
        <SunDoodle className="absolute top-40 right-10 w-16 h-16 text-warning/30 animate-spin-slow" />
        
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-center hand-drawn-text">
          momslikeme
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 text-center max-w-md">
          {language === 'en' 
            ? 'Discover the benefits you deserve. Talk to Bloom.'
            : 'Ontdek de toeslagen die je verdient. Praat met Bloom.'
          }
        </p>

        {/* Bloom the flower */}
        <div className="relative mb-8">
          <BloomFlower 
            className="w-48 h-64 md:w-64 md:h-80" 
            speaking={isLoading}
            growthStage={growthStage}
            sparkling={hasRecommendations}
          />
        </div>

        {/* Quote */}
        <QuoteCard quote={heroQuote} language={language} />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce-gentle">
          <span className="text-sm">{language === 'en' ? 'Scroll to begin' : 'Scroll om te beginnen'}</span>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5 L12 19 M5 12 L12 19 L19 12" />
          </svg>
        </div>
      </section>

      {/* Chat Section */}
      <section className="relative px-4 py-16 min-h-screen">
        {/* Privacy badge */}
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed border-primary/30 bg-primary/5">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Anonymous. Your data stays with you.'
                : 'Anoniem. Je gegevens blijven bij jou.'
              }
            </span>
          </div>
        </div>

        {!hasStarted ? (
          /* Starting options */
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-center text-foreground mb-6 hand-drawn-text">
              {language === 'en' ? 'How can Bloom help you today?' : 'Hoe kan Bloom je vandaag helpen?'}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {startingOptions.map((option, index) => (
                <OptionCard
                  key={index}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  onClick={() => handleStart(option.title)}
                />
              ))}
            </div>

            {/* Speech button */}
            <div className="flex justify-center pt-8">
              <SpeechButton
                onTranscript={handleSpeechTranscript}
                language={language}
              />
            </div>
          </div>
        ) : (
          /* Conversation */
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Messages as cards */}
            {messages.map((message, index) => (
              <MessageCard
                key={message.id}
                message={message}
                language={language}
                index={index}
              />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
                <div className="w-8 h-8">
                  <BloomFlower className="w-full h-full" speaking growthStage={1} />
                </div>
                <span className="text-sm">{language === 'en' ? 'Bloom is thinking...' : 'Bloom denkt na...'}</span>
              </div>
            )}

            {/* Quick replies */}
            {quickReplies.length > 0 && !isLoading && (
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onSendMessage(reply);
                      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}
                    className="px-4 py-2 rounded-full border-2 border-dashed border-primary/30 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-all"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Speech button for continuing conversation */}
            <div className="flex justify-center pt-4">
              <SpeechButton
                onTranscript={handleSpeechTranscript}
                disabled={isLoading}
                language={language}
              />
            </div>

            <div ref={bottomRef} />
          </div>
        )}

        {/* Another quote at the bottom */}
        {messages.length > 3 && (
          <div className="max-w-2xl mx-auto mt-16">
            <QuoteCard quote={quotes[messages.length % quotes.length]} language={language} />
          </div>
        )}
      </section>
    </div>
  );
}
