import { useState } from 'react';
import { ChatView } from '@/components/chat/ChatView';
import { ForumView } from '@/components/forum/ForumView';
import { MyBenefitsView } from '@/components/mybenefits/MyBenefitsView';
import { AllBenefitsView } from '@/components/benefits/AllBenefitsView';
import { useChat } from '@/hooks/useChat';
import { useLanguage } from '@/hooks/useLanguage';
import { Task, Benefit } from '@/types';
import { cn } from '@/lib/utils';

const Index = () => {
  const [currentView, setCurrentView] = useState<'chat' | 'mybenefits' | 'allbenefits' | 'forum'>('chat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { language, toggleLanguage } = useLanguage();
  
  const {
    messages,
    isLoading,
    isTyping,
    quickReplies,
    benefitMatches,
    sendMessage,
    sendFile,
    resetConversation,
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
      const steps = task.steps || [];
      return {
        ...task,
        steps: steps.map(step => 
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
    myBenefits: language === 'en' ? 'My List' : 'Mijn Lijst',
    allBenefits: language === 'en' ? 'All Benefits' : 'Alle Regelingen',
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
                onClick={() => setCurrentView('mybenefits')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all relative",
                  currentView === 'mybenefits' 
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
                onClick={() => setCurrentView('allbenefits')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  currentView === 'allbenefits' 
                    ? "bg-card text-foreground shadow-soft" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.allBenefits}
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
            onSendFile={sendFile}
            isLoading={isLoading}
            isTyping={isTyping}
            quickReplies={quickReplies}
            hasRecommendations={benefitMatches.length > 0}
            benefitMatches={benefitMatches}
            language={language}
            onAddBenefitToTasks={handleAddBenefitToTasks}
            onReset={resetConversation}
          />
        )}

        {currentView === 'mybenefits' && (
          <MyBenefitsView
            tasks={tasks}
            onToggleStep={handleToggleStep}
            language={language}
          />
        )}

        {currentView === 'allbenefits' && (
          <AllBenefitsView language={language} />
        )}
        
        {currentView === 'forum' && (
          <ForumView language={language} />
        )}
      </main>
    </div>
  );
};

export default Index;
