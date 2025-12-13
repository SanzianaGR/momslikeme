import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { CheckSquare, Plus, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask?: () => void;
}

export function TasksView({ tasks, onToggleTask, onDeleteTask, onAddTask }: TasksViewProps) {
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="shrink-0 px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10">
              <CheckSquare className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Your Tasks</h1>
              <p className="text-sm text-muted-foreground">
                {pendingTasks.length} pending, {completedTasks.length} done
              </p>
            </div>
          </div>
          {onAddTask && (
            <Button size="sm" onClick={onAddTask}>
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-bold mb-2">No tasks yet</h2>
            <p className="text-muted-foreground max-w-sm">
              When you find benefits you're interested in, you can add them as tasks to track your applications.
            </p>
          </div>
        ) : (
          <>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  To Do ({pendingTasks.length})
                </h2>
                <div className="space-y-2">
                  {pendingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Completed ({completedTasks.length})
                </h2>
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
