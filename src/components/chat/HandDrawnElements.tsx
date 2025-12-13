import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

interface DoodleProps {
  className?: string;
  style?: CSSProperties;
}

export function CloudDoodle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 100 60" className={cn("text-secondary/30", className)} style={style} fill="currentColor">
      <path d="M20 45 Q10 45 10 35 Q10 25 25 25 Q25 15 40 15 Q55 15 55 25 Q70 20 75 30 Q90 30 90 40 Q90 50 75 50 L25 50 Q15 50 20 45" style={{ filter: 'url(#sketchy)' }} />
      <defs>
        <filter id="sketchy">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
        </filter>
      </defs>
    </svg>
  );
}

export function HeartDoodle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 50 50" className={cn("text-destructive/40", className)} style={style} fill="currentColor">
      <path d="M25 45 Q5 30 5 18 Q5 5 18 5 Q25 5 25 15 Q25 5 32 5 Q45 5 45 18 Q45 30 25 45" style={{ filter: 'url(#sketchy2)' }} />
      <defs>
        <filter id="sketchy2">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5"/>
        </filter>
      </defs>
    </svg>
  );
}

export function StarDoodle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 50 50" className={cn("text-accent/50", className)} style={style} fill="currentColor">
      <path d="M25 5 L30 20 L45 22 L33 32 L37 47 L25 38 L13 47 L17 32 L5 22 L20 20 Z" style={{ filter: 'url(#sketchy3)' }} />
      <defs>
        <filter id="sketchy3">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
        </filter>
      </defs>
    </svg>
  );
}

export function SunDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={cn("text-accent", className)} fill="currentColor">
      <circle cx="40" cy="40" r="15" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="40"
          y1="40"
          x2={40 + 25 * Math.cos((angle * Math.PI) / 180)}
          y2={40 + 25 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function WavyLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 20" className={cn("text-primary/20", className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M0 10 Q25 0 50 10 Q75 20 100 10 Q125 0 150 10 Q175 20 200 10" strokeLinecap="round" />
    </svg>
  );
}