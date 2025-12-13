import { BenefitMatch } from '@/types';
import { cn } from '@/lib/utils';

interface BenefitPopupProps {
  match: BenefitMatch;
  language: 'en' | 'nl';
  onClose: () => void;
  onAddToTasks: () => void;
}

export function BenefitPopup({ match, language, onClose, onAddToTasks }: BenefitPopupProps) {
  const { benefit } = match;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative bg-card border-2 border-primary/30 rounded-3xl p-6 max-w-md w-full shadow-soft-lg animate-scale-in"
        style={{ transform: 'rotate(-0.5deg)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6 L18 18 M6 18 L18 6" />
          </svg>
        </button>

        {/* Sparkle decoration */}
        <svg className="absolute -top-4 -left-4 w-10 h-10 text-warning animate-twinkle" viewBox="0 0 24 24">
          <path d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z" fill="currentColor" />
        </svg>

        {/* Match score */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {Math.round(match.matchScore * 100)}% {language === 'en' ? 'match' : 'match'}
        </div>

        {/* Benefit name */}
        <h3 className="text-xl font-bold text-foreground mb-1 hand-drawn-text">
          {language === 'nl' ? benefit.nameNl : benefit.name}
        </h3>
        
        {/* Administrator */}
        <p className="text-sm text-muted-foreground mb-3">
          {benefit.administrator}
        </p>

        {/* Amount */}
        {benefit.estimatedAmount && (
          <div className="bg-warning/10 rounded-xl p-3 mb-4">
            <p className="text-sm text-muted-foreground mb-1">
              {language === 'en' ? 'Estimated amount' : 'Geschat bedrag'}
            </p>
            <p className="text-lg font-bold text-warning">
              {benefit.estimatedAmount}
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-muted-foreground mb-4">
          {benefit.description}
        </p>

        {/* Match reasons */}
        <div className="mb-4">
          <p className="text-sm font-medium text-foreground mb-2">
            {language === 'en' ? 'Why this matches you:' : 'Waarom dit bij je past:'}
          </p>
          <ul className="space-y-1">
            {match.matchReasons.slice(0, 3).map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 mt-0.5 text-primary shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="4" />
                </svg>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground font-medium hover:border-primary/30 transition-all"
          >
            {language === 'en' ? 'Later' : 'Later'}
          </button>
          <button
            onClick={onAddToTasks}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
          >
            {language === 'en' ? 'Add to my list' : 'Toevoegen aan lijst'}
          </button>
        </div>
      </div>
    </div>
  );
}
