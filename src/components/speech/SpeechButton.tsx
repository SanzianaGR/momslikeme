import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SpeechButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  language: 'en' | 'nl';
}

export function SpeechButton({ onTranscript, disabled, language }: SpeechButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError(language === 'en' 
        ? 'Speech recognition is not supported in your browser' 
        : 'Spraakherkenning wordt niet ondersteund in je browser'
      );
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    
    recognition.lang = language === 'nl' ? 'nl-NL' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setError(language === 'en' 
        ? 'Could not hear you. Please try again.' 
        : 'Kon je niet verstaan. Probeer opnieuw.'
      );
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, onTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={cn(
          "relative w-16 h-16 rounded-full transition-all duration-300",
          "border-3 border-dashed",
          "flex items-center justify-center",
          "hover:scale-105 active:scale-95",
          isListening 
            ? "bg-destructive/20 border-destructive animate-pulse" 
            : "bg-primary/10 border-primary/40 hover:bg-primary/20",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-label={isListening 
          ? (language === 'en' ? 'Stop listening' : 'Stop luisteren')
          : (language === 'en' ? 'Talk to Bloom' : 'Praat met Bloom')
        }
      >
        <svg 
          viewBox="0 0 32 32" 
          className={cn(
            "w-8 h-8 transition-colors",
            isListening ? "text-destructive" : "text-primary"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M16 4 Q12 4 12 8 L12 16 Q12 20 16 20 Q20 20 20 16 L20 8 Q20 4 16 4" />
          <path d="M8 14 Q8 22 16 22 Q24 22 24 14" />
          <path d="M16 22 L16 28" />
          <path d="M12 28 L20 28" />
        </svg>
        
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-destructive/50 animate-ping" />
            <span className="absolute inset-0 rounded-full border-2 border-destructive/30 animate-ping" style={{ animationDelay: '0.2s' }} />
          </>
        )}
      </button>
      
      <p className={cn(
        "absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap",
        "text-xs font-medium",
        isListening ? "text-destructive" : "text-muted-foreground"
      )}>
        {isListening 
          ? (language === 'en' ? 'Listening...' : 'Luisteren...')
          : (language === 'en' ? 'Talk to Bloom' : 'Praat met Bloom')
        }
      </p>
      
      {error && (
        <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
