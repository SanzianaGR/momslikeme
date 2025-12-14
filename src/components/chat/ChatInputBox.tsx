import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Paperclip, X, FileText } from 'lucide-react';

interface ChatInputBoxProps {
  onSend: (message: string) => void;
  onSendFile?: (file: File) => void;
  isLoading: boolean;
  placeholder: string;
}

export function ChatInputBox({ onSend, onSendFile, isLoading, placeholder }: ChatInputBoxProps) {
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
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

  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Drop zone overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-2xl z-10 flex items-center justify-center">
          <p className="text-primary font-medium text-sm">Drop your document here</p>
        </div>
      )}

      {/* Pending file preview */}
      {pendingFile && (
        <div className="mb-2 p-2 bg-muted/50 rounded-xl flex items-center gap-2 border border-dashed border-border">
          <FileText className="h-4 w-4 text-primary" />
          <span className="flex-1 text-xs truncate">{pendingFile.name}</span>
          <button
            type="button"
            onClick={() => setPendingFile(null)}
            className="p-1 hover:bg-muted rounded"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div 
        className={cn(
          "flex items-center gap-2 bg-card border-2 border-dashed rounded-2xl p-2 transition-all",
          isDragging ? "border-primary ring-2 ring-primary/20" : "border-border/50 focus-within:border-primary/40"
        )}
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
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={pendingFile ? "Add a message or send..." : placeholder}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none px-2 py-2"
        />
        <button
          type="submit"
          disabled={(!message.trim() && !pendingFile) || isLoading}
          className={cn(
            "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
            (message.trim() || pendingFile) && !isLoading
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
