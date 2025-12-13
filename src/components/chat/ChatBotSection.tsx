import { useRef, useEffect } from 'react';
import { FlowerBot } from './FlowerBot';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickReplies } from './QuickReplies';
import { WavyLine, StarDoodle, HeartDoodle } from './HandDrawnElements';
import { ChatMessage as ChatMessageType } from '@/types';
import { Users, Home, Heart, ArrowRight, Shield } from 'lucide-react';

interface ChatBotSectionProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  quickReplies?: string[];
  hasStarted: boolean;
  onStart: (message: string) => void;
}

const startingOptions = [
  {
    icon: Users,
    label: "Ik ben alleenstaande ouder",
    description: "Vind ondersteuning voor jou en je kinderen",
    message: "Ik ben alleenstaande ouder en zoek naar regelingen waar ik misschien recht op heb.",
    color: "primary",
  },
  {
    icon: Home,
    label: "Hulp met wonen",
    description: "Huur, energie, verhuiskosten",
    message: "Ik heb hulp nodig met woonkosten zoals huur of energierekeningen.",
    color: "secondary",
  },
  {
    icon: Heart,
    label: "Voor mijn kinderen",
    description: "School, sport, verjaardagen",
    message: "Ik wil ondersteuning vinden voor de activiteiten en behoeften van mijn kinderen.",
    color: "accent",
  },
];

export function ChatBotSection({ 
  messages, 
  onSendMessage, 
  isLoading, 
  quickReplies = [],
  hasStarted,
  onStart 
}: ChatBotSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="min-h-screen relative bg-gradient-to-b from-primary/5 via-background to-background py-12 px-4">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2">
        <WavyLine className="w-full h-12 opacity-40" />
      </div>
      
      {/* Floating decorations */}
      <StarDoodle className="absolute top-20 right-8 w-10 h-10 animate-twinkle opacity-50" />
      <HeartDoodle className="absolute bottom-32 left-8 w-8 h-8 animate-float opacity-40" />
      
      <div className="max-w-2xl mx-auto">
        {/* Chat container with hand-drawn border effect */}
        <div className="relative">
          {/* Hand-drawn border decoration */}
          <div className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-[2rem] -m-2 pointer-events-none" />
          
          <div className="bg-card rounded-3xl shadow-xl overflow-hidden border-2 border-border hand-drawn-card">
            {/* Chat header */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 px-6 py-5 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FlowerBot className="w-14 h-18" speaking={isLoading} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Bloem</h2>
                  <p className="text-sm text-muted-foreground">Je vriendelijke hulpje 🌸</p>
                </div>
              </div>
            </div>

            {/* Chat content area */}
            <div className="min-h-[400px] max-h-[500px] overflow-hidden flex flex-col">
              {!hasStarted ? (
                /* Welcome state with option cards */
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Privacy assurance */}
                  <div className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-6 flex items-start gap-3 hand-drawn-card">
                    <Shield className="h-6 w-6 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">Jouw privacy is veilig</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ik ben niet verbonden met de overheid. Wat je deelt blijft tussen ons. 💚
                      </p>
                    </div>
                  </div>
                  
                  {/* Greeting from flower */}
                  <div className="text-center mb-6">
                    <p className="text-lg text-foreground font-medium hand-drawn-text">
                      Hallo! 👋 Hoe kan ik je helpen vandaag?
                    </p>
                  </div>
                  
                  {/* Option cards */}
                  <div className="space-y-3">
                    {startingOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => onStart(option.message)}
                        className="w-full bg-background border-2 border-border hover:border-primary/40 rounded-2xl p-4 text-left transition-all group hover-lift hand-drawn-card animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            option.color === 'primary' ? 'bg-primary/10 group-hover:bg-primary/20' :
                            option.color === 'secondary' ? 'bg-secondary/10 group-hover:bg-secondary/20' :
                            'bg-accent/10 group-hover:bg-accent/20'
                          }`}>
                            <option.icon className={`h-6 w-6 ${
                              option.color === 'primary' ? 'text-primary' :
                              option.color === 'secondary' ? 'text-secondary' :
                              'text-accent'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-foreground">{option.label}</p>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Active chat state */
                <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 animate-fade-in">
                      <FlowerBot className="w-10 h-12 shrink-0" speaking />
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick replies */}
              {hasStarted && quickReplies.length > 0 && (
                <div className="px-6 pb-2">
                  <QuickReplies
                    replies={quickReplies}
                    onSelect={onSendMessage}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Input area */}
              <div className="p-4 border-t border-border/50 bg-muted/30">
                <ChatInput
                  onSend={hasStarted ? onSendMessage : onStart}
                  isLoading={isLoading}
                  placeholder={hasStarted ? "Typ je bericht..." : "Of typ hier je vraag..."}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}