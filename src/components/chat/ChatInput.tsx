import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Paperclip, X, FileText } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onSendFile?: (file: File) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, onSendFile, isLoading, placeholder = "Tell me about your situation..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingFile && onSendFile) {
      onSendFile(pendingFile);
      setPendingFile(null);
      return;
    }
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setPendingFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPendingFile(files[0]);
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
      {/* Drop zone overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-2xl z-10 flex items-center justify-center">
          <p className="text-primary font-medium">Drop your document here</p>
        </div>
      )}
      
      {/* Pending file preview */}
      {pendingFile && (
        <div className="mb-2 p-3 bg-muted rounded-xl flex items-center gap-3 border border-border">
          <FileText className="h-5 w-5 text-primary" />
          <span className="flex-1 text-sm truncate">{pendingFile.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setPendingFile(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div 
        className={`flex items-end gap-3 bg-card border rounded-2xl p-2 shadow-soft transition-all ${
          isDragging ? 'border-primary ring-2 ring-primary/20' : 'border-border focus-within:ring-2 focus-within:ring-primary/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={pendingFile ? "Add a message or press send..." : placeholder}
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent border-none resize-none text-[15px] leading-relaxed placeholder:text-muted-foreground focus:outline-none py-2 px-3 min-h-[44px] max-h-[150px]"
        />
        <Button
          type="submit"
          size="icon"
          disabled={(!message.trim() && !pendingFile) || isLoading}
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
        Drop a document or type a message — your info stays private 💚
      </p>
    </form>
  );
}
