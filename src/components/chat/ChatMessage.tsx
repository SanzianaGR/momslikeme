import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-3 animate-slide-up',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      {isAssistant && (
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] px-4 py-3 shadow-soft',
          isAssistant
            ? 'chat-bubble-assistant text-foreground'
            : 'chat-bubble-user'
        )}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <span className={cn(
          'text-[10px] mt-2 block',
          isAssistant ? 'text-muted-foreground' : 'text-primary-foreground/70'
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      {!isAssistant && (
        <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
          <User className="h-5 w-5 text-accent-foreground" />
        </div>
      )}
    </div>
  );
}
