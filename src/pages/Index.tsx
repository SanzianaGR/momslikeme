import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatView } from '@/components/chat/ChatView';
import { BenefitsView } from '@/components/benefits/BenefitsView';
import { TasksView } from '@/components/tasks/TasksView';
import { ProfileView } from '@/components/profile/ProfileView';
import { useChat } from '@/hooks/useChat';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentView, setCurrentView] = useState<'chat' | 'benefits' | 'tasks' | 'profile'>('chat');
  const { toast } = useToast();
  
  const {
    messages,
    isLoading,
    quickReplies,
    profile,
    benefitMatches,
    tasks,
    sendMessage,
    addTaskForBenefit,
    toggleTask,
    deleteTask,
  } = useChat();

  const handleAddTask = (benefitId: string) => {
    addTaskForBenefit(benefitId);
    toast({
      title: "Task added! 📝",
      description: "You can track your progress in the Tasks section.",
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-hidden">
        {currentView === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            quickReplies={quickReplies}
          />
        )}
        
        {currentView === 'benefits' && (
          <BenefitsView
            matches={benefitMatches}
            onAddTask={handleAddTask}
          />
        )}
        
        {currentView === 'tasks' && (
          <TasksView
            tasks={tasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        )}
        
        {currentView === 'profile' && (
          <ProfileView profile={profile} />
        )}
      </main>
    </div>
  );
};

export default Index;
