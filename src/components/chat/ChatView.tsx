import { useRef, useState, useMemo, useEffect } from 'react';
import { ChatMessage as ChatMessageType, BenefitMatch } from '@/types';
import { BloomFlower } from './BloomFlower';
import { MessageCard } from './MessageCard';
import { OptionCard } from './OptionCard';
import { QuoteCard } from './QuoteCard';
import { ChatInputBox } from './ChatInputBox';
import { SpeechButton } from '@/components/speech/SpeechButton';
import { BenefitPopup } from './BenefitPopup';
import { quotes, getRandomQuote } from '@/data/quotes';
import { CloudDoodle, HeartDoodle, StarDoodle, SunDoodle } from './HandDrawnElements';
import { Shield, Users, Home, Heart } from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  quickReplies?: string[];
  hasRecommendations?: boolean;
  benefitMatches?: BenefitMatch[];
  language: 'en' | 'nl';
  onAddBenefitToTasks?: (benefit: import('@/types').Benefit, matchScore: number) => void;
}

export function ChatView({ 
  messages, 
  onSendMessage, 
  isLoading, 
  quickReplies = [], 
  hasRecommendations = false, 
  benefitMatches = [],
  language,
  onAddBenefitToTasks
}: ChatViewProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [showBenefitPopup, setShowBenefitPopup] = useState(false);
  const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Calculate growth stage based on messages (0-5)
  const growthStage = Math.min(Math.floor(messages.length / 2), 5);
  
  // Get a random quote for the hero
  const heroQuote = useMemo(() => getRandomQuote(), []);

  // Show benefit popup when new matches are found
  useEffect(() => {
    if (benefitMatches.length > 0 && hasStarted && !isLoading) {
      const timer = setTimeout(() => {
        setShowBenefitPopup(true);
        setCurrentBenefitIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [benefitMatches.length, hasStarted, isLoading]);

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

  const handleNextBenefit = () => {
    if (currentBenefitIndex < benefitMatches.length - 1) {
      setCurrentBenefitIndex(prev => prev + 1);
    } else {
      setShowBenefitPopup(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Background decorations */}
        <CloudDoodle className="absolute top-20 left-10 w-24 h-16 text-secondary/30 animate-float" />
        <StarDoodle className="absolute top-32 right-20 w-12 h-12 text-warning/40 animate-twinkle" />
        <HeartDoodle className="absolute bottom-40 left-20 w-10 h-10 text-destructive/30 animate-bounce-gentle" />
        <SunDoodle className="absolute top-40 right-10 w-16 h-16 text-warning/30 animate-spin-slow" />
        
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-2 text-center hand-drawn-text">
          momslikeme
        </h1>
        
        {/* Impactful tagline */}
        <p className="text-xl md:text-2xl text-primary font-bold mb-2 text-center">
          {language === 'en' 
            ? 'You deserve support.'
            : 'Je verdient steun.'
          }
        </p>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
          {language === 'en' 
            ? "Let's find what's rightfully yours."
            : "Laten we vinden wat rechtmatig van jou is."
          }
        </p>

        {/* Bloom the flower */}
        <div className="relative mb-6">
          <BloomFlower 
            className="w-32 h-32 md:w-40 md:h-40" 
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

            {/* Text input */}
            <div className="pt-6">
              <p className="text-center text-sm text-muted-foreground mb-3">
                {language === 'en' ? 'Or tell Bloom in your own words:' : 'Of vertel Bloom in je eigen woorden:'}
              </p>
              <ChatInputBox
                onSend={handleStart}
                isLoading={isLoading}
                placeholder={language === 'en' ? 'Type your situation here...' : 'Typ hier je situatie...'}
              />
            </div>

            {/* Speech button */}
            <div className="flex justify-center pt-6">
              <SpeechButton
                onTranscript={handleSpeechTranscript}
                language={language}
              />
            </div>
          </div>
        ) : (
          /* Conversation with large Bloom alongside messages */
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {messages.map((message, index) => {
                const isAssistant = message.role === 'assistant';
                const isLatestAssistant = isAssistant && 
                  index === messages.map((m, i) => m.role === 'assistant' ? i : -1).filter(i => i !== -1).pop();
                
                return (
                  <div key={message.id} className="animate-fade-in">
                    {isAssistant ? (
                      /* Assistant message with Bloom alongside */
                      <div className="flex gap-4 items-start">
                        {/* Large Bloom next to assistant messages */}
                        <div className="hidden md:flex flex-col items-center flex-shrink-0">
                          <BloomFlower 
                            className={`transition-all duration-500 ${isLatestAssistant ? 'w-32 h-40 lg:w-40 lg:h-48' : 'w-20 h-24 opacity-60'}`}
                            speaking={isLoading && isLatestAssistant}
                            growthStage={growthStage}
                            sparkling={hasRecommendations && isLatestAssistant}
                          />
                          {isLatestAssistant && (
                            <p className="text-xs text-muted-foreground mt-1 text-center max-w-[120px]">
                              {isLoading 
                                ? (language === 'en' ? "Thinking..." : "Denkt na...")
                                : (language === 'en' ? "I'm here!" : "Ik ben er!")
                              }
                            </p>
                          )}
                        </div>
                        
                        {/* Mobile: smaller Bloom inline */}
                        <div className="flex md:hidden flex-shrink-0">
                          <BloomFlower 
                            className={`transition-all duration-500 ${isLatestAssistant ? 'w-16 h-20' : 'w-10 h-12 opacity-60'}`}
                            speaking={isLoading && isLatestAssistant}
                            growthStage={growthStage}
                            sparkling={hasRecommendations && isLatestAssistant}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <MessageCard
                            message={message}
                            language={language}
                            index={index}
                            isLatest={isLatestAssistant || false}
                            isLoading={isLoading}
                            growthStage={growthStage}
                            sparkling={hasRecommendations}
                          />
                        </div>
                      </div>
                    ) : (
                      /* User message - right aligned, no Bloom */
                      <div className="flex justify-end md:pl-44">
                        <MessageCard
                          message={message}
                          language={language}
                          index={index}
                          isLatest={false}
                          isLoading={false}
                          growthStage={growthStage}
                          sparkling={false}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading state with Bloom */}
              {isLoading && (
                <div className="flex gap-4 items-start animate-fade-in">
                  <div className="hidden md:flex flex-col items-center flex-shrink-0">
                    <BloomFlower 
                      className="w-32 h-40 lg:w-40 lg:h-48"
                      speaking={true}
                      growthStage={growthStage}
                      sparkling={false}
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {language === 'en' ? "Thinking..." : "Denkt na..."}
                    </p>
                  </div>
                  <div className="flex md:hidden flex-shrink-0">
                    <BloomFlower 
                      className="w-16 h-20"
                      speaking={true}
                      growthStage={growthStage}
                      sparkling={false}
                    />
                  </div>
                  <div className="bg-card border-2 border-border/50 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-muted-foreground italic">
                        {language === 'en' ? 'Bloom is thinking...' : 'Bloom denkt na...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick replies */}
              {quickReplies.length > 0 && !isLoading && (
                <div className="flex flex-wrap gap-2 md:pl-44">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onSendMessage(reply);
                        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                      className="px-4 py-2 rounded-full border-2 border-dashed border-primary/30 bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 hover:scale-105 transition-all"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="sticky bottom-4 mt-6">
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-3 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ChatInputBox
                      onSend={(msg) => {
                        onSendMessage(msg);
                        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                      isLoading={isLoading}
                      placeholder={language === 'en' ? 'Type your message...' : 'Typ je bericht...'}
                    />
                  </div>
                  <SpeechButton
                    onTranscript={handleSpeechTranscript}
                    disabled={isLoading}
                    language={language}
                  />
                </div>
              </div>
            </div>

            <div ref={bottomRef} />
          </div>
        )}

        {/* Another quote at the bottom */}
        {messages.length > 3 && (
          <div className="max-w-4xl mx-auto mt-16">
            <QuoteCard quote={quotes[messages.length % quotes.length]} language={language} />
          </div>
        )}
      </section>

      {/* Benefit popup */}
      {showBenefitPopup && benefitMatches[currentBenefitIndex] && (
        <BenefitPopup
          match={benefitMatches[currentBenefitIndex]}
          language={language}
          onClose={handleNextBenefit}
          onAddToTasks={() => {
            const match = benefitMatches[currentBenefitIndex];
            onAddBenefitToTasks?.(match.benefit, match.matchScore);
            handleNextBenefit();
          }}
        />
      )}
    </div>
  );
}
