import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageCircle, Gift, CheckSquare, User, Heart } from 'lucide-react';

interface SidebarProps {
  currentView: 'chat' | 'benefits' | 'tasks' | 'profile';
  onViewChange: (view: 'chat' | 'benefits' | 'tasks' | 'profile') => void;
}

const navItems = [
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'benefits', label: 'Benefits', icon: Gift },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'profile', label: 'Profile', icon: User },
] as const;

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-20 md:w-24 bg-card border-r border-border flex flex-col items-center py-6 gap-2 shrink-0">
      {/* Logo */}
      <div className="mb-6 p-3 bg-primary/10 rounded-2xl">
        <Heart className="h-7 w-7 text-primary" fill="currentColor" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={currentView === id ? 'soft' : 'ghost'}
            size="icon-lg"
            onClick={() => onViewChange(id)}
            className={cn(
              'flex flex-col h-auto py-3 px-2 gap-1 rounded-xl transition-all',
              currentView === id && 'shadow-soft'
            )}
          >
            <Icon className={cn(
              'h-5 w-5 transition-colors',
              currentView === id ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className={cn(
              'text-[10px] font-medium',
              currentView === id ? 'text-primary' : 'text-muted-foreground'
            )}>
              {label}
            </span>
          </Button>
        ))}
      </nav>

      {/* Footer decoration */}
      <div className="mt-auto flex flex-col items-center gap-2 text-muted-foreground/40">
        <div className="w-2 h-2 rounded-full bg-primary/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-secondary/30" />
        <div className="w-1 h-1 rounded-full bg-accent/30" />
      </div>
    </aside>
  );
}
