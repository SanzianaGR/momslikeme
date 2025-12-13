import { Quote } from '@/data/quotes';

interface QuoteCardProps {
  quote: Quote;
  language: 'en' | 'nl';
}

export function QuoteCard({ quote, language }: QuoteCardProps) {
  return (
    <div className="relative py-8 px-6 max-w-lg mx-auto">
      {/* Hand-drawn quote marks */}
      <svg 
        className="absolute -top-2 -left-2 w-12 h-12 text-primary/30"
        viewBox="0 0 40 40"
        fill="currentColor"
      >
        <path 
          d="M10 25 Q5 20 8 12 Q10 8 16 8 Q20 8 20 14 Q20 20 14 25 Q12 27 10 25 Z M26 25 Q21 20 24 12 Q26 8 32 8 Q36 8 36 14 Q36 20 30 25 Q28 27 26 25 Z"
          style={{ filter: 'url(#quote-sketch)' }}
        />
        <defs>
          <filter id="quote-sketch">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>
      
      <blockquote className="relative z-10">
        <p className="text-lg md:text-xl font-medium text-foreground/80 italic leading-relaxed hand-drawn-text">
          "{language === 'en' ? quote.text : quote.textNl}"
        </p>
        <footer className="mt-4 text-sm text-muted-foreground font-medium">
          — {quote.author}
        </footer>
      </blockquote>
      
      {/* Decorative underline */}
      <svg 
        className="w-24 h-3 mt-2 text-accent/50"
        viewBox="0 0 100 10"
      >
        <path 
          d="M5 5 Q25 2 50 5 Q75 8 95 5"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{ filter: 'url(#underline-sketch)' }}
        />
        <defs>
          <filter id="underline-sketch">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
