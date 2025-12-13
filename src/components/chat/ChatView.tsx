import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickReplies } from './QuickReplies';
import { ChatMessage as ChatMessageType } from '@/types';
import { Sparkles } from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  quickReplies?: string[];
}

const welcomeMessage = `Hoi! 👋 I'm here to help you discover what support ("potjes") you and your children might be eligible for.

I know dealing with benefits can feel overwhelming, but don't worry — we'll take it step by step together. 

**Everything you share stays private.** I'm not connected to any government system.

Would you like to tell me a bit about yourself? For example, how many children do you have?`;

export function ChatView({ messages, onSendMessage, isLoading, quickReplies = [] }: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const showWelcome = messages.length === 0;
  const defaultQuickReplies = showWelcome
    ? ['I have 1 child', 'I have 2 children', 'I have 3+ children']
    : quickReplies;

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
        {showWelcome && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="chat-bubble-assistant max-w-[80%] px-4 py-3 shadow-soft">
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {welcomeMessage}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary animate-pulse-soft" />
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
      {defaultQuickReplies.length > 0 && (
        <div className="shrink-0 px-4 pb-2">
          <QuickReplies
            replies={defaultQuickReplies}
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
          placeholder={showWelcome ? "How many children do you have?" : "Type your message..."}
        />
      </div>
    </div>
  );
}
