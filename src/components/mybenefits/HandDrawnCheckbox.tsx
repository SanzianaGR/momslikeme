import { cn } from '@/lib/utils';

interface HandDrawnCheckboxProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

export function HandDrawnCheckbox({ checked, label, onChange }: HandDrawnCheckboxProps) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left",
        checked 
          ? "bg-success/10 border-2 border-success/30" 
          : "bg-muted/30 border-2 border-dashed border-border hover:border-primary/30"
      )}
    >
      <div className="shrink-0 w-6 h-6 relative">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          {/* Hand-drawn checkbox */}
          <rect 
            x="3" y="3" 
            width="18" height="18" 
            rx="4"
            className={cn(
              "transition-all duration-300",
              checked ? "fill-success stroke-success" : "fill-none stroke-foreground/40"
            )}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {checked && (
            <path 
              d="M7 12l3 3 7-7" 
              className="stroke-success-foreground animate-scale-in"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </svg>
      </div>
      <span className={cn(
        "text-sm transition-all duration-300",
        checked ? "text-success line-through" : "text-foreground"
      )}>
        {label}
      </span>
    </button>
  );
}
