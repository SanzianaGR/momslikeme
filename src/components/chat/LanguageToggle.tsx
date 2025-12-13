import { Language } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
  className?: string;
}

export function LanguageToggle({ language, onToggle, className }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-1 px-3 py-2 rounded-full bg-card border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all hand-drawn-badge hover-lift",
        className
      )}
      aria-label={language === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
    >
      <span className={cn(
        "text-sm font-bold transition-colors",
        language === 'nl' ? "text-primary" : "text-muted-foreground"
      )}>
        NL
      </span>
      <span className="text-muted-foreground">/</span>
      <span className={cn(
        "text-sm font-bold transition-colors",
        language === 'en' ? "text-primary" : "text-muted-foreground"
      )}>
        EN
      </span>
    </button>
  );
}
