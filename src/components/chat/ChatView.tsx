import { useRef, useEffect, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickReplies } from './QuickReplies';
import { ChatMessage as ChatMessageType } from '@/types';
import { Sparkles, Heart, Users, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatViewProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  quickReplies?: string[];
}

const startingOptions = [
  {
    icon: Users,
    label: "I'm a single parent",
    description: "Find support for you and your children",
    message: "I'm a single parent looking for benefits I might be eligible for.",
  },
  {
    icon: Home,
    label: "I need housing help",
    description: "Rent, energy, moving costs",
    message: "I need help with housing costs like rent or energy bills.",
  },
  {
    icon: Heart,
    label: "Help for my kids",
    description: "School, sports, birthdays",
    message: "I want to find support for my children's activities and needs.",
  },
];

export function ChatView({ messages, onSendMessage, isLoading, quickReplies = [] }: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // If there are messages, show chat view
  const showWelcome = messages.length === 0 && !hasStarted;

  const handleStartOption = (message: string) => {
    setHasStarted(true);
    onSendMessage(message);
  };

  const handleQuickReply = (reply: string) => {
    setHasStarted(true);
    onSendMessage(reply);
  };

  if (showWelcome) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Decorative header with illustration */}
        <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 pt-8 pb-16 px-6">
          {/* Floating decorative elements */}
          <div className="absolute top-6 left-8 w-12 h-12 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-16 right-12 w-8 h-8 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-8 left-1/4 w-6 h-6 rounded-full bg-secondary/20 animate-float" style={{ animationDelay: '2s' }} />
          
          {/* Main illustration area */}
          <div className="relative flex flex-col items-center text-center max-w-md mx-auto">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg animate-bounce-gentle">
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground mb-3">
              Hulpwijzer
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover what support you and your family might be eligible for — 
              <span className="text-primary font-semibold"> privately</span> and 
              <span className="text-primary font-semibold"> safely</span>.
            </p>
          </div>
        </div>

        {/* Cards section */}
        <div className="flex-1 overflow-y-auto px-6 py-8 -mt-8">
          <div className="max-w-md mx-auto space-y-4">
            {/* Trust message */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-soft mb-6 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Your privacy matters</p>
                  <p className="text-sm text-muted-foreground">
                    I'm not connected to any government system. Everything you share stays between us. 💚
                  </p>
                </div>
              </div>
            </div>

            {/* Starting option cards */}
            <p className="text-center text-muted-foreground font-medium mb-4">
              How can I help you today?
            </p>
            
            {startingOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleStartOption(option.message)}
                className="w-full bg-card border border-border rounded-2xl p-5 shadow-soft hover-lift text-left transition-all group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <option.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-lg mb-0.5">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}

            {/* Or type message */}
            <div className="pt-4">
              <p className="text-center text-sm text-muted-foreground mb-3">
                or ask me anything...
              </p>
              <ChatInput
                onSend={handleQuickReply}
                isLoading={isLoading}
                placeholder="Type your question here..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="shrink-0 px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Hulpwijzer</h1>
            <p className="text-sm text-muted-foreground">Your friendly benefits guide</p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div className="chat-bubble-assistant px-4 py-3 shadow-soft">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && (
        <div className="shrink-0 px-4 pb-2">
          <QuickReplies
            replies={quickReplies}
            onSelect={onSendMessage}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-4 pb-4">
        <ChatInput
          onSend={onSendMessage}
          isLoading={isLoading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}
