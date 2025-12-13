import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types';

interface MessageCardProps {
  message: ChatMessage;
  language: 'en' | 'nl';
  index: number;
  isLatest?: boolean;
  isLoading?: boolean;
  growthStage?: number;
  sparkling?: boolean;
}

export function MessageCard({ 
  message, 
  language, 
  index
}: MessageCardProps) {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "relative animate-slide-up",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Message card */}
      <div 
        className={cn(
          "relative max-w-[85%]",
          isUser ? "mr-2" : ""
        )}
      >
        {/* Hand-drawn card background */}
        <div 
          className={cn(
            "relative p-5 rounded-2xl transition-all duration-300",
            isUser 
              ? "bg-primary/10 border-2 border-primary/30 border-dashed rounded-br-sm" 
              : "bg-card border-2 border-border/50 rounded-bl-sm"
          )}
          style={{
            transform: `rotate(${isUser ? 0.3 : -0.3}deg)`,
          }}
        >
          {/* Corner decorations for assistant messages */}
          {!isUser && (
            <svg className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-twinkle" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.5" />
            </svg>
          )}
          
          {/* Role indicator */}
          <div className={cn(
            "text-xs font-medium mb-1.5 uppercase tracking-wider",
            isUser ? "text-primary" : "text-muted-foreground"
          )}>
            {isUser ? (language === 'en' ? 'You' : 'Jij') : '🌸 Bloom'}
          </div>
          
          {/* Message content */}
          <p className="text-foreground leading-relaxed whitespace-pre-wrap hand-drawn-text text-sm md:text-base">
            {language === 'nl' && message.contentNl ? message.contentNl : message.content}
          </p>
          
          {/* Recommendation indicator */}
          {message.hasRecommendations && (
            <div className="mt-3 flex items-center gap-2 text-sm text-warning font-medium">
              <svg className="w-4 h-4 animate-twinkle" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z" />
              </svg>
              <span>{language === 'en' ? 'Benefits found!' : 'Toeslagen gevonden!'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
