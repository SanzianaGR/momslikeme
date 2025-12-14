import { useState } from 'react';
import { BenefitMatch } from '@/types';
import { Shield, Phone, X } from 'lucide-react';

interface BenefitPopupProps {
  match: BenefitMatch;
  language: 'en' | 'nl';
  onClose: () => void;
  onAddToTasks: () => void;
}

export function BenefitPopup({ match, language, onClose, onAddToTasks }: BenefitPopupProps) {
  const [showWorkerInfo, setShowWorkerInfo] = useState(false);
  const { benefit } = match;
  
  const t = {
    en: {
      match: 'match',
      estimatedAmount: 'Estimated amount',
      whyMatch: 'Why this matches you:',
      later: 'Later',
      addToList: 'Add to my list',
      contactWorker: 'Talk to a worker',
      privacyFirst: 'Privacy is first — 100% your choice',
      workerInfoTitle: 'What a worker would see',
      workerInfoDesc: "If you choose to connect with a municipality worker, here's what information would be shared to help them assist you:",
      infoShared: [
        'Number of children and their ages',
        'Housing situation (renting/owning)',
        'Approximate income range',
        'Employment status',
        'Main challenges you mentioned'
      ],
      notShared: 'NOT shared: Your name, address, BSN, or any identifying info',
      yesConnect: 'Yes, connect me',
      noThanks: 'No, keep it private',
      yourChoice: "It's 100% your choice. No pressure."
    },
    nl: {
      match: 'match',
      estimatedAmount: 'Geschat bedrag',
      whyMatch: 'Waarom dit bij je past:',
      later: 'Later',
      addToList: 'Toevoegen aan lijst',
      contactWorker: 'Praat met een medewerker',
      privacyFirst: 'Privacy staat voorop — 100% jouw keuze',
      workerInfoTitle: 'Wat een medewerker zou zien',
      workerInfoDesc: 'Als je ervoor kiest om contact op te nemen met een gemeentemedewerker, wordt deze informatie gedeeld om je te helpen:',
      infoShared: [
        'Aantal kinderen en hun leeftijden',
        'Woonsituatie (huren/kopen)',
        'Geschat inkomensbereik',
        'Arbeidsstatus',
        'Belangrijkste uitdagingen die je noemde'
      ],
      notShared: 'NIET gedeeld: Je naam, adres, BSN of identificerende informatie',
      yesConnect: 'Ja, verbind me',
      noThanks: 'Nee, houd het privé',
      yourChoice: 'Het is 100% jouw keuze. Geen druk.'
    }
  };

  const text = t[language];

  if (showWorkerInfo) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
        <div 
          className="relative bg-card border-2 border-primary/30 rounded-3xl p-6 max-w-md w-full shadow-soft-lg animate-scale-in"
          style={{ transform: 'rotate(-0.5deg)' }}
        >
          {/* Close button */}
          <button
            onClick={() => setShowWorkerInfo(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Privacy badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            {text.privacyFirst}
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2 hand-drawn-text">
            {text.workerInfoTitle}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            {text.workerInfoDesc}
          </p>

          {/* Info that would be shared */}
          <div className="bg-muted/30 rounded-xl p-4 mb-4">
            <ul className="space-y-2">
              {text.infoShared.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <svg className="w-4 h-4 mt-0.5 text-primary shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Not shared notice */}
          <div className="bg-success/10 rounded-xl p-3 mb-4 border border-success/20">
            <p className="text-sm text-success font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {text.notShared}
            </p>
          </div>

          {/* Your choice message */}
          <p className="text-center text-sm text-muted-foreground italic mb-4">
            {text.yourChoice}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowWorkerInfo(false)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground font-medium hover:border-primary/30 transition-all"
            >
              {text.noThanks}
            </button>
            <button
              onClick={() => {
                // This would open the help request popup
                window.dispatchEvent(new CustomEvent('openHelpRequest'));
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {text.yesConnect}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <X className="w-5 h-5" />
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
          {Math.round(match.matchScore * 100)}% {text.match}
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
              {text.estimatedAmount}
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
            {text.whyMatch}
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

        {/* Actions - 3 buttons now */}
        <div className="space-y-2">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground font-medium hover:border-primary/30 transition-all"
            >
              {text.later}
            </button>
            <button
              onClick={onAddToTasks}
              className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
            >
              {text.addToList}
            </button>
          </div>
          
          {/* Contact worker button */}
          <button
            onClick={() => setShowWorkerInfo(true)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-secondary-foreground font-medium hover:bg-secondary/70 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            {text.contactWorker}
          </button>
        </div>
      </div>
    </div>
  );
}
