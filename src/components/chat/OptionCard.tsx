import { cn } from '@/lib/utils';

interface OptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'highlight';
}

export function OptionCard({ title, description, icon, onClick, variant = 'default' }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full p-5 rounded-2xl text-left transition-all duration-300 group",
        "border-2 border-dashed hover:border-solid",
        "hover:-translate-y-1 hover:shadow-soft-lg",
        variant === 'highlight' 
          ? "bg-primary/10 border-primary/40 hover:bg-primary/15" 
          : "bg-card border-border/50 hover:border-primary/30"
      )}
      style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
    >
      {/* Corner flower decoration */}
      <svg 
        className="absolute -top-3 -right-3 w-8 h-8 text-accent opacity-0 group-hover:opacity-100 transition-opacity"
        viewBox="0 0 32 32"
      >
        <circle cx="16" cy="16" r="6" className="fill-warning" />
        <ellipse cx="16" cy="6" rx="4" ry="6" className="fill-accent/70" />
        <ellipse cx="16" cy="26" rx="4" ry="6" className="fill-accent/70" />
        <ellipse cx="6" cy="16" rx="6" ry="4" className="fill-accent/70" />
        <ellipse cx="26" cy="16" rx="6" ry="4" className="fill-accent/70" />
      </svg>
      
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground mb-1 hand-drawn-text">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      
      {/* Hand-drawn arrow */}
      <svg 
        className="absolute bottom-4 right-4 w-6 h-6 text-primary/50 group-hover:text-primary transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M5 12 Q12 12 17 12" />
        <path d="M13 8 Q17 11 17 12 Q17 13 13 16" />
      </svg>
    </button>
  );
}
