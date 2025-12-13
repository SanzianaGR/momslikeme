import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputBoxProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder: string;
}

export function ChatInputBox({ onSend, isLoading, placeholder }: ChatInputBoxProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 bg-card border-2 border-dashed border-border/50 rounded-2xl p-2 focus-within:border-primary/40 transition-all">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none px-3 py-2"
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={cn(
            "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
            message.trim() && !isLoading
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2 A10 10 0 0 1 22 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12 L19 12 M12 5 L19 12 L12 19" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
