import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

interface ChatPopupProps {
  recipientId: string;
  recipientName: string;
  currentUserId: string;
  language: 'en' | 'nl';
  onClose: () => void;
}

// Simulated chat responses
const simulatedResponses = [
  "Thank you for reaching out! It's so nice to connect with other moms here 💚",
  "I went through something similar. Would love to share what worked for me!",
  "That's a great question! Let me think about it...",
  "I found a really helpful resource, let me find the link for you.",
  "You're not alone in this. Many of us have been there. ❤️",
];

export function ChatPopup({ recipientId, recipientName, currentUserId, language, onClose }: ChatPopupProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: language === 'en' 
        ? `Hi! Thanks for reaching out. How can I help? 😊`
        : `Hoi! Bedankt voor je bericht. Hoe kan ik helpen? 😊`,
      senderId: recipientId,
      timestamp: new Date(Date.now() - 60000).toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = {
    typeMessage: language === 'en' ? 'Type a message...' : 'Typ een bericht...',
    typing: language === 'en' ? 'typing...' : 'aan het typen...',
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderId: currentUserId,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate response delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    setIsTyping(false);

    const response: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)],
      senderId: recipientId,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, response]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-card border-2 border-border rounded-2xl shadow-xl flex flex-col animate-scale-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
            {recipientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">{recipientName}</p>
            {isTyping && (
              <p className="text-xs text-muted-foreground italic">{t.typing}</p>
            )}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={cn(
              "max-w-[80%] px-3 py-2 rounded-xl text-sm",
              msg.senderId === currentUserId
                ? "ml-auto bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md"
            )}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="max-w-[80%] px-3 py-2 rounded-xl bg-muted text-foreground rounded-bl-md">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.typeMessage}
            className="flex-1 bg-muted/50 border-none rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
