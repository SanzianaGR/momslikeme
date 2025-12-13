import { useState } from 'react';
import { ChatView } from '@/components/chat/ChatView';
import { ForumView } from '@/components/forum/ForumView';
import { MyBenefitsView } from '@/components/mybenefits/MyBenefitsView';
import { useChat } from '@/hooks/useChat';
import { useLanguage } from '@/hooks/useLanguage';
import { Task, Benefit } from '@/types';
import { cn } from '@/lib/utils';

const Index = () => {
  const [currentView, setCurrentView] = useState<'chat' | 'benefits' | 'forum'>('chat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { language, toggleLanguage } = useLanguage();
  
  const {
    messages,
    isLoading,
    quickReplies,
    benefitMatches,
    sendMessage,
  } = useChat();

  const handleAddBenefitToTasks = (benefit: Benefit, matchScore: number) => {
    // Check if already added
    if (tasks.some(t => t.benefitId === benefit.id)) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: benefit.name,
      titleNl: benefit.nameNl,
      description: benefit.description,
      descriptionNl: benefit.descriptionNl,
      benefitId: benefit.id,
      benefit: benefit,
      status: 'pending',
      priority: matchScore > 80 ? 'high' : matchScore > 50 ? 'medium' : 'low',
      createdAt: new Date().toISOString(),
      dueDate: benefit.deadline,
      estimatedAmount: benefit.estimatedAmount,
      applicationUrl: benefit.applicationUrl,
      steps: benefit.eligibilityCriteria.map((criteria, i) => ({
        id: `step-${i}`,
        title: criteria,
        titleNl: benefit.eligibilityCriteriaNl?.[i] || criteria,
        completed: false,
      })),
      documents: benefit.documents || [],
    };

    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleStep = (taskId: string, stepId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        steps: task.steps.map(step => 
          step.id === stepId ? { ...step, completed: !step.completed } : step
        ),
      };
    }));
  };

  const handleLoginRequest = () => {
    // For now just simulate login - this would open auth modal
    setIsLoggedIn(true);
  };

  const t = {
    bloom: 'Bloom',
    myBenefits: language === 'en' ? 'My Benefits' : 'Mijn Voordelen',
    community: language === 'en' ? 'Community' : 'Gemeenschap',
  };

  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      {/* Fixed navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground hand-drawn-text">momslikeme</h1>
          
          <div className="flex items-center gap-4">
            {/* View toggle */}
            <div className="flex gap-1 bg-muted/50 rounded-full p-1">
              <button
                onClick={() => setCurrentView('chat')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  currentView === 'chat' 
                    ? "bg-card text-foreground shadow-soft" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.bloom}
              </button>
              <button
                onClick={() => setCurrentView('benefits')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all relative",
                  currentView === 'benefits' 
                    ? "bg-card text-foreground shadow-soft" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.myBenefits}
                {tasks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning text-warning-foreground text-xs flex items-center justify-center font-bold">
                    {tasks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentView('forum')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  currentView === 'forum' 
                    ? "bg-card text-foreground shadow-soft" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.community}
              </button>
            </div>
            
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full text-sm font-medium border-2 border-dashed border-border/50 hover:border-primary/30 transition-all"
            >
              {language === 'en' ? 'NL' : 'EN'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16">
        {currentView === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            quickReplies={quickReplies}
            hasRecommendations={benefitMatches.length > 0}
            benefitMatches={benefitMatches}
            language={language}
            onAddBenefitToTasks={handleAddBenefitToTasks}
          />
        )}

        {currentView === 'benefits' && (
          <MyBenefitsView
            tasks={tasks}
            onToggleStep={handleToggleStep}
            language={language}
          />
        )}
        
        {currentView === 'forum' && (
          <ForumView 
            language={language} 
            isLoggedIn={isLoggedIn}
            onLoginRequest={handleLoginRequest}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
