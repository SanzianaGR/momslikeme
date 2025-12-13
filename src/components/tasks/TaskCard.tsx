import { cn } from '@/lib/utils';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border p-4 transition-all hover-lift group',
        isCompleted && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1 rounded-md"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'font-semibold text-sm',
              isCompleted && 'line-through text-muted-foreground'
            )}>
              {task.title}
            </h3>
            <Badge
              variant="outline"
              className={cn('text-[10px] px-1.5 py-0', priorityColors[task.priority])}
            >
              {task.priority}
            </Badge>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
