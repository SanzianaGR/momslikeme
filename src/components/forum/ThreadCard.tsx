import { ForumThread } from '@/types';
import { FlowerUpvote } from './FlowerUpvote';
import { cn } from '@/lib/utils';

interface ThreadCardProps {
  thread: ForumThread;
  language: 'en' | 'nl';
  onUpvote: () => void;
  delay?: number;
}

const categoryColors: Record<string, string> = {
  success: 'bg-success/10 text-success border-success/30',
  tips: 'bg-warning/10 text-warning border-warning/30',
  questions: 'bg-info/10 text-info border-info/30',
  support: 'bg-secondary/10 text-secondary border-secondary/30',
  benefits: 'bg-primary/10 text-primary border-primary/30'
};

const categoryLabels: Record<string, { en: string; nl: string }> = {
  success: { en: 'Success', nl: 'Succes' },
  tips: { en: 'Tip', nl: 'Tip' },
  questions: { en: 'Question', nl: 'Vraag' },
  support: { en: 'Support', nl: 'Steun' },
  benefits: { en: 'Benefits', nl: 'Toeslagen' }
};

export function ThreadCard({ thread, language, onUpvote, delay = 0 }: ThreadCardProps) {
  const timeAgo = getTimeAgo(thread.createdAt, language);

  return (
    <div 
      className="relative bg-card border-2 border-border/50 rounded-2xl p-5 hover:shadow-soft transition-all animate-slide-up"
      style={{ 
        animationDelay: `${delay}s`,
        transform: `rotate(${Math.random() * 0.5 - 0.25}deg)`
      }}
    >
      {/* Category badge */}
      <span className={cn(
        "inline-block px-3 py-1 rounded-full text-xs font-medium border border-dashed mb-3",
        categoryColors[thread.category]
      )}>
        {categoryLabels[thread.category]?.[language] || thread.category}
      </span>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 hand-drawn-text">
        {thread.title}
      </h3>

      {/* Content preview */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {thread.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium">{thread.authorName}</span>
          <span>·</span>
          <span>{timeAgo}</span>
          {thread.replies.length > 0 && (
            <>
              <span>·</span>
              <span>
                {thread.replies.length} {language === 'en' 
                  ? (thread.replies.length === 1 ? 'reply' : 'replies')
                  : (thread.replies.length === 1 ? 'reactie' : 'reacties')
                }
              </span>
            </>
          )}
        </div>

        {/* Flower upvote */}
        <FlowerUpvote count={thread.upvotes} onUpvote={onUpvote} />
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string, language: 'en' | 'nl'): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return language === 'en' ? 'just now' : 'zojuist';
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return language === 'en' ? `${mins}m ago` : `${mins}m geleden`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return language === 'en' ? `${hours}h ago` : `${hours}u geleden`;
  }
  const days = Math.floor(seconds / 86400);
  return language === 'en' ? `${days}d ago` : `${days}d geleden`;
}
