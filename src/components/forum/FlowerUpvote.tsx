import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FlowerUpvoteProps {
  count: number;
  onUpvote: () => void;
  hasUpvoted?: boolean;
}

export function FlowerUpvote({ count, onUpvote, hasUpvoted: initialUpvoted = false }: FlowerUpvoteProps) {
  const [hasUpvoted, setHasUpvoted] = useState(initialUpvoted);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (hasUpvoted) return;
    
    setIsAnimating(true);
    setHasUpvoted(true);
    onUpvote();
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={hasUpvoted}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
        "border-2 border-dashed",
        hasUpvoted 
          ? "bg-primary/15 border-primary text-primary cursor-default" 
          : "bg-card border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
      )}
    >
      {/* Flower icon */}
      <svg 
        viewBox="0 0 24 24" 
        className={cn(
          "w-5 h-5 transition-transform",
          isAnimating && "animate-bounce-gentle"
        )}
      >
        {/* Petals */}
        <ellipse cx="12" cy="6" rx="3" ry="4" className={cn(hasUpvoted ? "fill-primary" : "fill-muted-foreground/50")} />
        <ellipse cx="6" cy="12" rx="4" ry="3" className={cn(hasUpvoted ? "fill-primary" : "fill-muted-foreground/50")} />
        <ellipse cx="18" cy="12" rx="4" ry="3" className={cn(hasUpvoted ? "fill-primary" : "fill-muted-foreground/50")} />
        <ellipse cx="12" cy="18" rx="3" ry="4" className={cn(hasUpvoted ? "fill-primary" : "fill-muted-foreground/50")} />
        <ellipse cx="7" cy="7" rx="3" ry="3" className={cn(hasUpvoted ? "fill-accent/80" : "fill-muted-foreground/40")} transform="rotate(-45 7 7)" />
        <ellipse cx="17" cy="7" rx="3" ry="3" className={cn(hasUpvoted ? "fill-accent/80" : "fill-muted-foreground/40")} transform="rotate(45 17 7)" />
        <ellipse cx="7" cy="17" rx="3" ry="3" className={cn(hasUpvoted ? "fill-accent/80" : "fill-muted-foreground/40")} transform="rotate(45 7 17)" />
        <ellipse cx="17" cy="17" rx="3" ry="3" className={cn(hasUpvoted ? "fill-accent/80" : "fill-muted-foreground/40")} transform="rotate(-45 17 17)" />
        {/* Center */}
        <circle cx="12" cy="12" r="4" className={cn(hasUpvoted ? "fill-warning" : "fill-muted-foreground/60")} />
      </svg>
      
      <span className="text-sm font-medium">{count}</span>
      
      {/* Sparkle on upvote */}
      {isAnimating && (
        <svg 
          className="absolute -top-1 -right-1 w-4 h-4 text-warning animate-twinkle"
          viewBox="0 0 16 16"
        >
          <path d="M8 0L9 6L16 8L9 10L8 16L7 10L0 8L7 6L8 0Z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
