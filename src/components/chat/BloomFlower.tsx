import { cn } from '@/lib/utils';

interface BloomFlowerProps {
  className?: string;
  speaking?: boolean;
  growthStage: number; // 0-5 where 0 is seed, 5 is full bloom
  sparkling?: boolean;
}

export function BloomFlower({ className, speaking = false, growthStage = 1, sparkling = false }: BloomFlowerProps) {
  // Calculate sizes based on growth stage
  const stemHeight = 40 + growthStage * 24;
  const petalScale = 0.3 + growthStage * 0.14;
  const faceSize = 12 + growthStage * 6;
  
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
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 40}%`,
                animationDelay: `${i * 0.2}s`,
                width: 16 + Math.random() * 12,
                height: 16 + Math.random() * 12,
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z"
                className="fill-warning stroke-warning/50"
                strokeWidth="0.5"
                style={{ filter: 'url(#sparkle-glow)' }}
              />
              <defs>
                <filter id="sparkle-glow">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          ))}
        </div>
      )}
      
      <svg 
        viewBox="0 0 120 200" 
        className={cn(
          "flower-bot transition-all duration-1000",
          speaking && "speaking",
          sparkling && "animate-pulse-slow"
        )}
        fill="none"
        style={{
          filter: sparkling ? 'drop-shadow(0 0 20px hsl(var(--warning) / 0.5))' : undefined
        }}
      >
        {/* Ground/Pot - hand drawn style */}
        <path 
          d={`M30 ${200 - stemHeight * 0.3} Q60 ${205 - stemHeight * 0.3} 90 ${200 - stemHeight * 0.3}`}
          className="stroke-primary/40 stroke-[3] fill-none"
          strokeLinecap="round"
          style={{ filter: 'url(#sketch)' }}
        />
        
        {/* Stem - grows with stage */}
        <path 
          d={`M60 ${200 - stemHeight * 0.3} Q${55 + growthStage} ${180 - stemHeight * 0.5} 60 ${200 - stemHeight} Q${65 - growthStage} ${180 - stemHeight * 1.2} 58 ${170 - stemHeight}`}
          className="stroke-primary stroke-[3] fill-none animate-sway"
          strokeLinecap="round"
          style={{ filter: 'url(#sketch)', transformOrigin: 'bottom center' }}
        />
        
        {/* Leaves - appear as flower grows */}
        {growthStage >= 1 && (
          <path 
            d={`M58 ${195 - stemHeight * 0.6} Q30 ${185 - stemHeight * 0.5} 25 ${165 - stemHeight * 0.4} Q40 ${180 - stemHeight * 0.5} 60 ${190 - stemHeight * 0.6}`}
            className="fill-primary/80"
            style={{ filter: 'url(#sketch)', opacity: Math.min(growthStage * 0.3, 1) }}
          />
        )}
        {growthStage >= 2 && (
          <path 
            d={`M62 ${185 - stemHeight * 0.7} Q90 ${175 - stemHeight * 0.6} 95 ${155 - stemHeight * 0.5} Q80 ${170 - stemHeight * 0.6} 60 ${180 - stemHeight * 0.7}`}
            className="fill-primary/70"
            style={{ filter: 'url(#sketch)', opacity: Math.min((growthStage - 1) * 0.3, 1) }}
          />
        )}
        {growthStage >= 3 && (
          <path 
            d={`M56 ${205 - stemHeight * 0.4} Q35 ${200 - stemHeight * 0.3} 30 ${185 - stemHeight * 0.2} Q45 ${195 - stemHeight * 0.3} 58 ${202 - stemHeight * 0.4}`}
            className="fill-primary/60"
            style={{ filter: 'url(#sketch)', opacity: Math.min((growthStage - 2) * 0.3, 1) }}
          />
        )}
        
        {/* Flower head group - positioned at stem top */}
        <g transform={`translate(60, ${170 - stemHeight}) scale(${petalScale})`} style={{ transformOrigin: 'center' }}>
          {/* Outer petals - layer 1 (back) */}
          <g className="animate-pulse-slow">
            <ellipse cx="-70" cy="10" rx="32" ry="40" className="fill-accent/50" transform="rotate(-50)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="70" cy="10" rx="32" ry="40" className="fill-accent/45" transform="rotate(50)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="0" cy="-65" rx="28" ry="36" className="fill-secondary/50" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="-80" cy="50" rx="28" ry="36" className="fill-secondary/45" transform="rotate(-80)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="80" cy="50" rx="28" ry="36" className="fill-secondary/40" transform="rotate(80)" style={{ filter: 'url(#sketch)' }} />
          </g>
          
          {/* Middle petals - layer 2 */}
          <g className="animate-pulse-slow" style={{ animationDelay: '0.2s' }}>
            <ellipse cx="-55" cy="-15" rx="36" ry="44" className="fill-accent/85" transform="rotate(-35)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="55" cy="-15" rx="36" ry="44" className="fill-accent/80" transform="rotate(35)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="-70" cy="35" rx="34" ry="42" className="fill-secondary/80" transform="rotate(-65)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="70" cy="35" rx="34" ry="42" className="fill-secondary/75" transform="rotate(65)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="0" cy="-45" rx="32" ry="40" className="fill-accent/70" style={{ filter: 'url(#sketch)' }} />
          </g>
          
          {/* Inner petals - layer 3 (front) */}
          <g className="animate-pulse-slow" style={{ animationDelay: '0.4s' }}>
            <ellipse cx="-40" cy="-25" rx="30" ry="38" className="fill-warning/90" transform="rotate(-25)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="40" cy="-25" rx="30" ry="38" className="fill-warning/85" transform="rotate(25)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="-50" cy="25" rx="28" ry="36" className="fill-warning/80" transform="rotate(-55)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="50" cy="25" rx="28" ry="36" className="fill-warning/75" transform="rotate(55)" style={{ filter: 'url(#sketch)' }} />
            <ellipse cx="0" cy="-35" rx="26" ry="34" className="fill-warning/70" style={{ filter: 'url(#sketch)' }} />
          </g>
          
          {/* Face center */}
          <circle cx="0" cy="10" r={faceSize * 2} className="fill-warning" style={{ filter: 'url(#sketch)' }} />
          <circle cx="0" cy="10" r={faceSize * 1.7} className="fill-[hsl(40,95%,70%)]" style={{ filter: 'url(#sketch)' }} />
          
          {/* Rosy cheeks */}
          <circle cx={-faceSize * 1.5} cy={faceSize * 0.5} r={faceSize * 0.5} className="fill-destructive/20" />
          <circle cx={faceSize * 1.5} cy={faceSize * 0.5} r={faceSize * 0.5} className="fill-destructive/20" />
          
          {/* Eyes - happy curved eyes */}
          <g className={cn("eyes", speaking && "animate-blink")}>
            <path 
              d={`M${-faceSize * 1} ${-faceSize * 0.3} Q${-faceSize * 0.5} ${-faceSize * 0.8} ${-faceSize * 0} ${-faceSize * 0.3}`}
              className="stroke-foreground stroke-[3] fill-none"
              strokeLinecap="round"
            />
            <path 
              d={`M${faceSize * 0} ${-faceSize * 0.3} Q${faceSize * 0.5} ${-faceSize * 0.8} ${faceSize * 1} ${-faceSize * 0.3}`}
              className="stroke-foreground stroke-[3] fill-none"
              strokeLinecap="round"
            />
            {/* Sparkles in eyes */}
            <circle cx={-faceSize * 0.5} cy={-faceSize * 0.5} r={2} className="fill-card" />
            <circle cx={faceSize * 0.5} cy={-faceSize * 0.5} r={2} className="fill-card" />
          </g>
          
          {/* Big happy smile */}
          <path 
            d={speaking 
              ? `M${-faceSize * 1} ${faceSize * 0.6} Q0 ${faceSize * 1.5} ${faceSize * 1} ${faceSize * 0.6}`
              : `M${-faceSize * 1} ${faceSize * 0.4} Q0 ${faceSize * 1.5} ${faceSize * 1} ${faceSize * 0.4}`
            }
            className={cn(
              "stroke-foreground stroke-[3] fill-none",
              speaking && "animate-talk"
            )}
            strokeLinecap="round"
            style={{ filter: 'url(#sketch)' }}
          />
          
          {/* Tongue when speaking */}
          {speaking && (
            <ellipse cx="0" cy={faceSize * 1} rx={faceSize * 0.4} ry={faceSize * 0.3} className="fill-destructive/50" />
          )}
          
          {/* Freckles */}
          <circle cx={-faceSize * 1.2} cy={0} r={1.5} className="fill-foreground/15" />
          <circle cx={-faceSize * 1.4} cy={faceSize * 0.3} r={1.2} className="fill-foreground/10" />
          <circle cx={faceSize * 1.2} cy={0} r={1.5} className="fill-foreground/15" />
          <circle cx={faceSize * 1.4} cy={faceSize * 0.3} r={1.2} className="fill-foreground/10" />
        </g>
        
        {/* Sketch filter for hand-drawn effect */}
        <defs>
          <filter id="sketch" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
