import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, isLoading, placeholder = "Tell me about your situation..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-3 bg-card border border-border rounded-2xl p-2 shadow-soft focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent border-none resize-none text-[15px] leading-relaxed placeholder:text-muted-foreground focus:outline-none py-2 px-3 min-h-[44px] max-h-[150px]"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          className="shrink-0 rounded-xl"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2 text-center">
        Your information is private and helps us find the right support for you 💚
      </p>
    </form>
  );
}
