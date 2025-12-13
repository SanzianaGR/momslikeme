import { FlowerBot } from './FlowerBot';
import { CloudDoodle, HeartDoodle, StarDoodle, SunDoodle, WavyLine } from './HandDrawnElements';
import { LanguageToggle } from './LanguageToggle';
import { ChevronDown } from 'lucide-react';
import { Language } from '@/hooks/useLanguage';

interface HeroSectionProps {
  onScrollToChat: () => void;
  language: Language;
  onToggleLanguage: () => void;
  t: (key: string) => string;
}

export function HeroSection({ onScrollToChat, language, onToggleLanguage, t }: HeroSectionProps) {
  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 bg-gradient-to-b from-background via-background to-primary/5">
      {/* Language toggle */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle language={language} onToggle={onToggleLanguage} />
      </div>
      
      {/* Hand-drawn decorations */}
      <CloudDoodle className="absolute top-16 left-8 w-24 h-16 animate-float opacity-60" />
      <CloudDoodle className="absolute top-32 right-12 w-32 h-20 animate-float opacity-40" style={{ animationDelay: '2s' }} />
      <StarDoodle className="absolute top-24 right-1/4 w-8 h-8 animate-twinkle" />
      <StarDoodle className="absolute bottom-1/3 left-16 w-6 h-6 animate-twinkle" style={{ animationDelay: '1s' }} />
      <HeartDoodle className="absolute top-1/3 left-12 w-10 h-10 animate-float" style={{ animationDelay: '3s' }} />
      <SunDoodle className="absolute top-12 right-24 w-16 h-16 animate-spin-slow opacity-70" />
      
      {/* Extra decorations */}
      <HeartDoodle className="absolute bottom-1/4 right-16 w-8 h-8 animate-float opacity-50" style={{ animationDelay: '1.5s' }} />
      <StarDoodle className="absolute top-1/2 left-8 w-10 h-10 animate-twinkle opacity-40" style={{ animationDelay: '2.5s' }} />
      
      {/* Wavy decoration lines */}
      <div className="absolute bottom-0 left-0 right-0">
        <WavyLine className="w-full h-8 opacity-30" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Flower mascot */}
        <div className="mb-8 flex justify-center">
          <FlowerBot className="w-44 h-56 drop-shadow-lg animate-bounce-gentle" />
        </div>
        
        {/* Title with hand-drawn underline effect */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 relative inline-block">
          <span className="relative z-10 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {t('hero.title')}
          </span>
          <svg className="absolute -bottom-2 left-0 w-full h-4 text-accent" viewBox="0 0 200 15" preserveAspectRatio="none">
            <path d="M0 10 Q50 0 100 10 Q150 20 200 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed hand-drawn-text">
          {language === 'nl' ? (
            <>
              Ontdek welke <span className="text-primary font-bold">{t('hero.subtitle.help')}</span> er voor jou en je gezin is — 
              <span className="text-secondary font-bold"> {t('hero.subtitle.safe')}</span> en <span className="text-accent font-bold">{t('hero.subtitle.anonymous')}</span>
            </>
          ) : (
            <>
              Discover what <span className="text-primary font-bold">{t('hero.subtitle.help')}</span> is available for you and your family — 
              <span className="text-secondary font-bold"> {t('hero.subtitle.safe')}</span> and <span className="text-accent font-bold">{t('hero.subtitle.anonymous')}</span>
            </>
          )}
        </p>
        
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="hand-drawn-badge bg-card px-5 py-3 rounded-2xl border-2 border-dashed border-primary/30 flex items-center gap-2">
            <HeartDoodle className="w-5 h-5 text-destructive" />
            <span className="text-sm font-semibold text-foreground">{t('hero.badge.private')}</span>
          </div>
          <div className="hand-drawn-badge bg-card px-5 py-3 rounded-2xl border-2 border-dashed border-secondary/30 flex items-center gap-2">
            <StarDoodle className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-foreground">{t('hero.badge.noGov')}</span>
          </div>
          <div className="hand-drawn-badge bg-card px-5 py-3 rounded-2xl border-2 border-dashed border-accent/30 flex items-center gap-2">
            <FlowerBot className="w-5 h-6" />
            <span className="text-sm font-semibold text-foreground">{t('hero.badge.friendly')}</span>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <button 
        onClick={onScrollToChat}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group cursor-pointer"
      >
        <span className="text-sm font-medium">{t('hero.scroll')}</span>
        <div className="animate-bounce-gentle">
          <ChevronDown className="h-8 w-8 group-hover:scale-110 transition-transform" />
        </div>
      </button>
    </section>
  );
}
