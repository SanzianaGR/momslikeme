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
      
      <svg 
        viewBox="0 0 120 140" 
        className={cn(
          "transition-all duration-500",
          speaking ? "animate-flower-talk" : "animate-flower-idle",
          sparkling && "drop-shadow-[0_0_20px_hsl(var(--warning)/0.6)]"
        )}
        style={{ transform: `scale(${scale})` }}
        fill="none"
      >
        {/* Stem - sways */}
        <g className="animate-stem-sway" style={{ transformOrigin: '60px 138px' }}>
          <path 
            d="M60 85 Q55 100 58 120 Q60 130 60 138" 
            className="stroke-primary"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Leaves - flutter */}
          <ellipse 
            cx="48" cy="110" rx="12" ry="6" 
            className="fill-primary/70 animate-leaf-flutter" 
            style={{ transformOrigin: '55px 110px', animationDelay: '0.2s' }}
          />
          <ellipse 
            cx="72" cy="105" rx="10" ry="5" 
            className="fill-primary/60 animate-leaf-flutter" 
            style={{ transformOrigin: '65px 105px', animationDelay: '0.5s' }}
          />
          
          {/* Flower head - bobs */}
          <g className="animate-head-bob" style={{ transformOrigin: '60px 50px' }}>
            {/* Outer petals - warm peachy pink */}
            <g className="animate-petals-breathe" style={{ transformOrigin: '60px 50px' }}>
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

            {/* Face center - warm cream */}
            <circle cx="60" cy="50" r="24" className="fill-[hsl(45,85%,70%)]" />
            <circle cx="60" cy="50" r="20" className="fill-[hsl(48,90%,78%)]" />
            
            {/* Eyes - calm and friendly */}
            <g className={speaking ? "animate-eyes-excited" : "animate-eyes-blink"}>
              {/* Eye whites */}
              <ellipse cx="52" cy="48" rx="5" ry="5" className="fill-card" />
              <ellipse cx="68" cy="48" rx="5" ry="5" className="fill-card" />
              {/* Pupils */}
              <g className="animate-pupils-look">
                <circle cx="52" cy="48" r="3" className="fill-foreground" />
                <circle cx="68" cy="48" r="3" className="fill-foreground" />
              </g>
              {/* Eye sparkles */}
              <circle cx="53" cy="47" r="1" className="fill-card" />
              <circle cx="69" cy="47" r="1" className="fill-card" />
            </g>
            
            {/* Mouth - gentle smile */}
            <path 
              d="M52 56 Q60 62 68 56"
              className="stroke-foreground fill-none"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
