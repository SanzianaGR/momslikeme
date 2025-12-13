import { cn } from '@/lib/utils';

interface BloomFlowerProps {
  className?: string;
  speaking?: boolean;
  growthStage: number; // 0-5 where 0 is seed, 5 is full bloom
  sparkling?: boolean;
}

export function BloomFlower({ className, speaking = false, growthStage = 1, sparkling = false }: BloomFlowerProps) {
  const scale = 0.6 + growthStage * 0.08;
  
  return (
    <div className={cn("relative", className)}>
      {/* Sparkles when recommendations are found */}
      {sparkling && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <svg
              key={i}
              className="absolute animate-twinkle"
              style={{
                left: `${10 + Math.cos(i * 0.52) * 45 + 25}%`,
                top: `${10 + Math.sin(i * 0.52) * 40 + 20}%`,
                animationDelay: `${i * 0.12}s`,
                width: 14 + (i % 3) * 6,
                height: 14 + (i % 3) * 6,
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
        viewBox="0 0 120 140" 
        className={cn(
          "transition-all duration-500 animate-bounce-gentle",
          sparkling && "drop-shadow-[0_0_20px_hsl(var(--warning)/0.6)]"
        )}
        style={{ transform: `scale(${scale})` }}
        fill="none"
      >
        {/* Stem */}
        <path 
          d="M60 85 Q55 100 58 120 Q60 130 60 138" 
          className="stroke-primary"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Leaves */}
        <ellipse cx="48" cy="110" rx="12" ry="6" className="fill-primary/70" transform="rotate(-30 48 110)" />
        <ellipse cx="72" cy="105" rx="10" ry="5" className="fill-primary/60" transform="rotate(25 72 105)" />
        
        {/* Outer petals - warm peachy pink */}
        <g className="animate-sway" style={{ transformOrigin: '60px 50px' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={i}
              cx="60"
              cy="20"
              rx="18"
              ry="28"
              className="fill-[hsl(350,75%,82%)]"
              transform={`rotate(${angle} 60 50)`}
              style={{ opacity: 0.9 - i * 0.02 }}
            />
          ))}
        </g>

        {/* Inner petals - warmer orange-ish */}
        <g>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse
              key={i}
              cx="60"
              cy="30"
              rx="12"
              ry="20"
              className="fill-[hsl(30,80%,78%)]"
              transform={`rotate(${angle} 60 50)`}
            />
          ))}
        </g>

        {/* Face center - sunny yellow */}
        <circle cx="60" cy="50" r="24" className="fill-[hsl(45,95%,65%)]" />
        <circle cx="60" cy="50" r="20" className="fill-[hsl(48,100%,72%)]" />
        
        {/* Rosy cheeks */}
        <circle cx="46" cy="54" r="6" className="fill-[hsl(350,70%,82%)]" opacity="0.7" />
        <circle cx="74" cy="54" r="6" className="fill-[hsl(350,70%,82%)]" opacity="0.7" />
        
        {/* Big happy eyes */}
        <g className={speaking ? "animate-blink" : ""}>
          {/* Eye whites */}
          <ellipse cx="52" cy="46" rx="6" ry="7" className="fill-card" />
          <ellipse cx="68" cy="46" rx="6" ry="7" className="fill-card" />
          {/* Pupils */}
          <circle cx="53" cy="47" r="4" className="fill-foreground" />
          <circle cx="69" cy="47" r="4" className="fill-foreground" />
          {/* Eye sparkles */}
          <circle cx="54.5" cy="45" r="1.5" className="fill-card" />
          <circle cx="70.5" cy="45" r="1.5" className="fill-card" />
        </g>
        
        {/* Big warm smile */}
        <path 
          d={speaking 
            ? "M48 58 Q60 72 72 58" 
            : "M48 58 Q60 68 72 58"
          }
          className="stroke-foreground fill-none"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Little tongue when speaking */}
        {speaking && (
          <ellipse cx="60" cy="64" rx="4" ry="3" className="fill-[hsl(350,60%,75%)]" />
        )}
      </svg>
    </div>
  );
}
