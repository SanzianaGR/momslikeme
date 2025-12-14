import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

interface DoodleProps {
  className?: string;
  style?: CSSProperties;
}

export function CoinDoodle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 50 50" className={cn("text-warning", className)} style={style}>
      <circle cx="25" cy="25" r="20" fill="currentColor" opacity="0.8" />
      <circle cx="25" cy="25" r="16" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <text x="25" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="hsl(var(--warning-foreground))">€</text>
    </svg>
  );
}

export function MoneyBagDoodle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 70" className={cn("text-success", className)} style={style}>
      <path d="M30 10 L35 5 L40 12 L35 15 L30 10" fill="currentColor" opacity="0.7" />
      <ellipse cx="30" cy="45" rx="22" ry="20" fill="currentColor" opacity="0.8" />
      <path d="M15 25 Q30 15 45 25 Q48 35 45 45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <text x="30" y="52" textAnchor="middle" fontSize="18" fontWeight="bold" fill="hsl(var(--success-foreground))">€</text>
    </svg>
  );
}

export function BanknoteDoodle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 40" className={cn("text-primary", className)} style={style}>
      <rect x="5" y="5" width="70" height="30" rx="3" fill="currentColor" opacity="0.7" />
      <rect x="10" y="10" width="60" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="40" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <text x="40" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="hsl(var(--primary-foreground))">€</text>
    </svg>
  );
}

export function CoinsStackDoodle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 50 60" className={cn("text-warning", className)} style={style}>
      <ellipse cx="25" cy="50" rx="18" ry="6" fill="currentColor" opacity="0.6" />
      <ellipse cx="25" cy="44" rx="18" ry="6" fill="currentColor" opacity="0.7" />
      <ellipse cx="25" cy="38" rx="18" ry="6" fill="currentColor" opacity="0.8" />
      <ellipse cx="25" cy="32" rx="18" ry="6" fill="currentColor" opacity="0.9" />
      <ellipse cx="25" cy="26" rx="18" ry="6" fill="currentColor" />
      <text x="25" y="30" textAnchor="middle" fontSize="10" fontWeight="bold" fill="hsl(var(--warning-foreground))">€€€</text>
    </svg>
  );
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