import { cn } from '@/lib/utils';

interface FlowerBotProps {
  className?: string;
  speaking?: boolean;
}

export function FlowerBot({ className, speaking = false }: FlowerBotProps) {
  return (
    <svg 
      viewBox="0 0 120 160" 
      className={cn("flower-bot", speaking && "speaking", className)}
      fill="none"
    >
      {/* Stem */}
      <path 
        d="M60 160 Q55 130 60 100 Q65 80 58 65" 
        className="stroke-primary stroke-[3] fill-none animate-sway"
        strokeLinecap="round"
        style={{ filter: 'url(#sketch)' }}
      />
      
      {/* Leaves */}
      <path 
        d="M58 120 Q30 108 22 90 Q35 105 60 115" 
        className="fill-primary/90"
        style={{ filter: 'url(#sketch)' }}
      />
      <path 
        d="M62 105 Q90 93 98 75 Q85 90 60 100" 
        className="fill-primary/90"
        style={{ filter: 'url(#sketch)' }}
      />
      <path 
        d="M56 135 Q38 130 32 118 Q42 127 58 132" 
        className="fill-primary/70"
        style={{ filter: 'url(#sketch)' }}
      />
      
      {/* Outer petals - layer 1 (back) */}
      <g className="animate-pulse-slow">
        <ellipse cx="25" cy="45" rx="16" ry="20" className="fill-accent/60" transform="rotate(-50 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="95" cy="45" rx="16" ry="20" className="fill-accent/50" transform="rotate(50 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="60" cy="12" rx="14" ry="18" className="fill-secondary/60" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="20" cy="65" rx="14" ry="18" className="fill-secondary/50" transform="rotate(-80 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="100" cy="65" rx="14" ry="18" className="fill-secondary/40" transform="rotate(80 60 40)" style={{ filter: 'url(#sketch)' }} />
      </g>
      
      {/* Middle petals - layer 2 */}
      <g className="animate-pulse-slow" style={{ animationDelay: '0.2s' }}>
        <ellipse cx="32" cy="32" rx="18" ry="22" className="fill-accent/90" transform="rotate(-35 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="88" cy="32" rx="18" ry="22" className="fill-accent/85" transform="rotate(35 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="25" cy="58" rx="17" ry="21" className="fill-secondary/85" transform="rotate(-65 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="95" cy="58" rx="17" ry="21" className="fill-secondary/80" transform="rotate(65 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="60" cy="18" rx="16" ry="20" className="fill-accent/75" style={{ filter: 'url(#sketch)' }} />
      </g>
      
      {/* Inner petals - layer 3 (front) */}
      <g className="animate-pulse-slow" style={{ animationDelay: '0.4s' }}>
        <ellipse cx="40" cy="28" rx="15" ry="19" className="fill-warning/90" transform="rotate(-25 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="80" cy="28" rx="15" ry="19" className="fill-warning/85" transform="rotate(25 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="35" cy="52" rx="14" ry="18" className="fill-warning/80" transform="rotate(-55 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="85" cy="52" rx="14" ry="18" className="fill-warning/75" transform="rotate(55 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="60" cy="22" rx="13" ry="17" className="fill-warning/70" style={{ filter: 'url(#sketch)' }} />
      </g>
      
      {/* Face center */}
      <circle cx="60" cy="45" r="24" className="fill-warning" style={{ filter: 'url(#sketch)' }} />
      <circle cx="60" cy="45" r="20" className="fill-[hsl(40,95%,68%)]" style={{ filter: 'url(#sketch)' }} />
      
      {/* Rosy cheeks */}
      <circle cx="42" cy="50" r="6" className="fill-destructive/25" />
      <circle cx="78" cy="50" r="6" className="fill-destructive/25" />
      
      {/* Eyes - happy curved eyes */}
      <g className={cn("eyes", speaking && "animate-blink")}>
        <path 
          d="M48 42 Q52 38 56 42" 
          className="stroke-foreground stroke-[2.5] fill-none"
          strokeLinecap="round"
        />
        <path 
          d="M64 42 Q68 38 72 42" 
          className="stroke-foreground stroke-[2.5] fill-none"
          strokeLinecap="round"
        />
        {/* Sparkles in eyes */}
        <circle cx="52" cy="40" r="1" className="fill-card" />
        <circle cx="68" cy="40" r="1" className="fill-card" />
      </g>
      
      {/* Big happy smile */}
      <path 
        d={speaking ? "M48 53 Q60 62 72 53" : "M48 52 Q60 64 72 52"}
        className={cn(
          "stroke-foreground stroke-[3] fill-none",
          speaking && "animate-talk"
        )}
        strokeLinecap="round"
        style={{ filter: 'url(#sketch)' }}
      />
      
      {/* Tongue when speaking */}
      {speaking && (
        <ellipse cx="60" cy="57" rx="4" ry="3" className="fill-destructive/60" />
      )}
      
      {/* Freckles */}
      <circle cx="46" cy="45" r="1" className="fill-foreground/20" />
      <circle cx="44" cy="48" r="0.8" className="fill-foreground/15" />
      <circle cx="74" cy="45" r="1" className="fill-foreground/20" />
      <circle cx="76" cy="48" r="0.8" className="fill-foreground/15" />
      
      {/* Sketch filter for hand-drawn effect */}
      <defs>
        <filter id="sketch" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    </svg>
  );
}
