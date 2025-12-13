import { useState } from 'react';
import { ChatView } from '@/components/chat/ChatView';
import { ForumView } from '@/components/forum/ForumView';
import { useChat } from '@/hooks/useChat';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

const Index = () => {
  const [currentView, setCurrentView] = useState<'chat' | 'forum'>('chat');
  const { language, toggleLanguage } = useLanguage();
  
  const {
    messages,
    isLoading,
    quickReplies,
    benefitMatches,
    sendMessage,
  } = useChat();

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
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  currentView === 'chat' 
                    ? "bg-card text-foreground shadow-soft" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {language === 'en' ? 'Bloom' : 'Bloom'}
              </button>
              <button
                onClick={() => setCurrentView('forum')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  currentView === 'forum' 
                    ? "bg-card text-foreground shadow-soft" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {language === 'en' ? 'Community' : 'Gemeenschap'}
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
            language={language}
          />
        )}
        
        {currentView === 'forum' && (
          <ForumView language={language} />
        )}
      </main>
    </div>
  );
};

export default Index;
