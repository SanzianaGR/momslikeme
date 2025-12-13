import { cn } from '@/lib/utils';
import { BenefitMatch } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface BenefitCardProps {
  match: BenefitMatch;
  onAddTask?: (benefitId: string) => void;
}

const categoryColors = {
  national: 'bg-primary/10 text-primary border-primary/20',
  municipal: 'bg-secondary/10 text-secondary border-secondary/20',
  private: 'bg-accent/10 text-accent-foreground border-accent/20',
};

const categoryLabels = {
  national: 'National',
  municipal: 'Municipal',
  private: 'Private Fund',
};

export function BenefitCard({ match, onAddTask }: BenefitCardProps) {
  const { benefit, matchScore, matchReasons, missingInfo } = match;
  const scorePercent = Math.round(matchScore * 100);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-soft hover-lift transition-all group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{benefit.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-base truncate">{benefit.name}</h3>
            <Badge
              variant="outline"
              className={cn('text-[10px] px-2 py-0', categoryColors[benefit.category])}
            >
              {categoryLabels[benefit.category]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{benefit.nameNl}</p>
        </div>
        
        {/* Match Score */}
        <div className={cn(
          'shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold',
          scorePercent >= 70 ? 'bg-primary/10 text-primary' :
          scorePercent >= 40 ? 'bg-warning/10 text-warning' :
          'bg-muted text-muted-foreground'
        )}>
          {scorePercent}%
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
        {benefit.description}
      </p>

      {/* Estimated Amount */}
      {benefit.estimatedAmount && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-primary/5 rounded-xl">
          <span className="text-lg">💰</span>
          <span className="text-sm font-medium text-primary">{benefit.estimatedAmount}</span>
        </div>
      )}

      {/* Match Reasons */}
      {matchReasons.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {matchReasons.slice(0, 2).map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Missing Info Warning */}
      {missingInfo.length > 0 && scorePercent < 70 && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-warning/5 rounded-xl border border-warning/10">
          <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-warning">
            Share more about your {missingInfo.slice(0, 2).join(' and ').toLowerCase()} for a better match
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <Button
          variant="soft"
          size="sm"
          onClick={() => onAddTask?.(benefit.id)}
          className="flex-1"
        >
          Add to my tasks
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        {benefit.applicationUrl && (
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
          >
            <a href={benefit.applicationUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
