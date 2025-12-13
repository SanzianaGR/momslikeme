import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types';

interface MessageCardProps {
  message: ChatMessage;
  language: 'en' | 'nl';
  index: number;
}

export function MessageCard({ message, language, index }: MessageCardProps) {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "relative max-w-2xl mx-auto animate-slide-up",
        isUser ? "ml-auto mr-4" : "mr-auto ml-4"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Hand-drawn card background */}
      <div 
        className={cn(
          "relative p-6 rounded-3xl transition-all duration-300",
          isUser 
            ? "bg-primary/10 border-2 border-primary/30 border-dashed" 
            : "bg-card border-2 border-border/50"
        )}
        style={{
          transform: `rotate(${isUser ? 0.5 : -0.5}deg)`,
        }}
      >
        {/* Corner decorations for assistant messages */}
        {!isUser && (
          <>
            <svg className="absolute -top-2 -left-2 w-6 h-6 text-accent" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.5" />
              <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.3" />
            </svg>
            <svg className="absolute -bottom-2 -right-2 w-6 h-6 text-secondary" viewBox="0 0 24 24">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" opacity="0.3" />
            </svg>
          </>
        )}
        
        {/* Role indicator */}
        <div className={cn(
          "text-xs font-medium mb-2 uppercase tracking-wider",
          isUser ? "text-primary" : "text-muted-foreground"
        )}>
          {isUser ? (language === 'en' ? 'You' : 'Jij') : 'Bloom'}
        </div>
        
        {/* Message content */}
        <p className="text-foreground leading-relaxed whitespace-pre-wrap hand-drawn-text">
          {language === 'nl' && message.contentNl ? message.contentNl : message.content}
        </p>
        
        {/* Recommendation indicator */}
        {message.hasRecommendations && (
          <div className="mt-4 flex items-center gap-2 text-sm text-warning font-medium">
            <svg className="w-5 h-5 animate-twinkle" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z" />
            </svg>
            <span>{language === 'en' ? 'Benefits found for you!' : 'Toeslagen voor jou gevonden!'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
