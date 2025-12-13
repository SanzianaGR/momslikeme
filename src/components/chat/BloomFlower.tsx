import { cn } from '@/lib/utils';

interface BloomFlowerProps {
  className?: string;
  speaking?: boolean;
  growthStage: number; // 0-5 where 0 is seed, 5 is full bloom
  sparkling?: boolean;
}

export function BloomFlower({ className, speaking = false, growthStage = 1, sparkling = false }: BloomFlowerProps) {
  const scale = 0.5 + growthStage * 0.1;
  
  return (
    <div className={cn("relative", className)}>
      {/* Sparkles when recommendations are found */}
      {sparkling && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <svg
              key={i}
              className="absolute animate-twinkle"
              style={{
                left: `${15 + Math.cos(i * 0.8) * 40 + 30}%`,
                top: `${15 + Math.sin(i * 0.8) * 35 + 20}%`,
                animationDelay: `${i * 0.15}s`,
                width: 12 + Math.random() * 8,
                height: 12 + Math.random() * 8,
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z"
                className="fill-warning"
              />
            </svg>
          ))}
        </div>
      )}
      
      <svg 
        viewBox="0 0 100 100" 
        className={cn(
          "transition-all duration-700",
          speaking && "animate-bounce-gentle",
          sparkling && "drop-shadow-[0_0_15px_hsl(var(--warning)/0.5)]"
        )}
        style={{ transform: `scale(${scale})` }}
        fill="none"
      >
        {/* Simple cute flower face */}
        <defs>
          <filter id="soft-sketch" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>

        {/* Outer petals - soft pastel colors */}
        <g style={{ filter: 'url(#soft-sketch)' }}>
          <ellipse cx="50" cy="20" rx="18" ry="22" className="fill-[hsl(350,70%,85%)]" />
          <ellipse cx="80" cy="35" rx="18" ry="22" className="fill-[hsl(340,65%,82%)]" transform="rotate(72 50 50)" />
          <ellipse cx="72" cy="72" rx="18" ry="22" className="fill-[hsl(330,70%,85%)]" transform="rotate(144 50 50)" />
          <ellipse cx="28" cy="72" rx="18" ry="22" className="fill-[hsl(345,65%,83%)]" transform="rotate(216 50 50)" />
          <ellipse cx="20" cy="35" rx="18" ry="22" className="fill-[hsl(355,70%,84%)]" transform="rotate(288 50 50)" />
        </g>

        {/* Inner petals - slightly darker */}
        <g style={{ filter: 'url(#soft-sketch)' }}>
          <ellipse cx="50" cy="28" rx="14" ry="16" className="fill-[hsl(25,80%,80%)]" />
          <ellipse cx="72" cy="40" rx="14" ry="16" className="fill-[hsl(30,75%,78%)]" transform="rotate(72 50 50)" />
          <ellipse cx="64" cy="68" rx="14" ry="16" className="fill-[hsl(20,80%,80%)]" transform="rotate(144 50 50)" />
          <ellipse cx="36" cy="68" rx="14" ry="16" className="fill-[hsl(28,75%,79%)]" transform="rotate(216 50 50)" />
          <ellipse cx="28" cy="40" rx="14" ry="16" className="fill-[hsl(22,80%,81%)]" transform="rotate(288 50 50)" />
        </g>

        {/* Face center - warm yellow */}
        <circle cx="50" cy="50" r="22" className="fill-[hsl(45,90%,70%)]" style={{ filter: 'url(#soft-sketch)' }} />
        <circle cx="50" cy="50" r="18" className="fill-[hsl(48,95%,75%)]" />
        
        {/* Rosy cheeks */}
        <circle cx="38" cy="54" r="5" className="fill-[hsl(350,60%,80%)]" opacity="0.6" />
        <circle cx="62" cy="54" r="5" className="fill-[hsl(350,60%,80%)]" opacity="0.6" />
        
        {/* Eyes - cute dot eyes */}
        <g className={speaking ? "animate-blink" : ""}>
          <circle cx="42" cy="46" r="3" className="fill-foreground" />
          <circle cx="58" cy="46" r="3" className="fill-foreground" />
          {/* Eye sparkles */}
          <circle cx="43" cy="45" r="1" className="fill-card" />
          <circle cx="59" cy="45" r="1" className="fill-card" />
        </g>
        
        {/* Smile */}
        <path 
          d={speaking 
            ? "M42 56 Q50 64 58 56" 
            : "M42 55 Q50 62 58 55"
          }
          className="stroke-foreground fill-none"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
