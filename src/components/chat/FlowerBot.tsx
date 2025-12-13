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
        d="M58 110 Q35 100 30 85 Q38 95 60 105" 
        className="fill-primary/80"
        style={{ filter: 'url(#sketch)' }}
      />
      <path 
        d="M62 95 Q85 85 90 70 Q82 80 60 90" 
        className="fill-primary/80"
        style={{ filter: 'url(#sketch)' }}
      />
      
      {/* Flower petals */}
      <g className="animate-pulse-slow">
        <ellipse cx="35" cy="35" rx="18" ry="22" className="fill-accent/90" transform="rotate(-30 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="85" cy="35" rx="18" ry="22" className="fill-accent/80" transform="rotate(30 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="30" cy="55" rx="18" ry="22" className="fill-secondary/80" transform="rotate(-60 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="90" cy="55" rx="18" ry="22" className="fill-secondary/70" transform="rotate(60 60 40)" style={{ filter: 'url(#sketch)' }} />
        <ellipse cx="60" cy="20" rx="16" ry="20" className="fill-accent/70" style={{ filter: 'url(#sketch)' }} />
      </g>
      
      {/* Face center */}
      <circle cx="60" cy="45" r="22" className="fill-warning" style={{ filter: 'url(#sketch)' }} />
      
      {/* Eyes */}
      <g className={cn("eyes", speaking && "animate-blink")}>
        <circle cx="52" cy="42" r="4" className="fill-foreground" />
        <circle cx="68" cy="42" r="4" className="fill-foreground" />
        <circle cx="53" cy="41" r="1.5" className="fill-card" />
        <circle cx="69" cy="41" r="1.5" className="fill-card" />
      </g>
      
      {/* Smile */}
      <path 
        d="M50 52 Q60 60 70 52" 
        className={cn(
          "stroke-foreground stroke-[2.5] fill-none",
          speaking && "animate-talk"
        )}
        strokeLinecap="round"
        style={{ filter: 'url(#sketch)' }}
      />
      
      {/* Blush */}
      <circle cx="42" cy="50" r="5" className="fill-destructive/30" />
      <circle cx="78" cy="50" r="5" className="fill-destructive/30" />
      
      {/* Sketch filter for hand-drawn effect */}
      <defs>
        <filter id="sketch" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    </svg>
  );
}