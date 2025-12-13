import { useState } from 'react';
import { ForumThread } from '@/types';
import { ThreadCard } from './ThreadCard';
import { NewThreadForm } from './NewThreadForm';
import { cn } from '@/lib/utils';

interface ForumViewProps {
  language: 'en' | 'nl';
}

// Sample threads for demo
const sampleThreads: ForumThread[] = [
  {
    id: '1',
    title: 'How I applied for Kinderbijslag successfully',
    content: 'Just wanted to share my experience with applying for Kinderbijslag. The process took about 2 weeks and I made sure to have all documents ready...',
    authorId: 'user1',
    authorName: 'Maria',
    category: 'success',
    upvotes: 24,
    upvotedBy: [],
    replies: [
      {
        id: 'r1',
        content: 'Thank you for sharing! This helped me so much.',
        authorId: 'user2',
        authorName: 'Sophie',
        upvotes: 5,
        upvotedBy: [],
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Tip: Sam& portal for multiple benefits at once',
    content: 'I discovered you can apply for Leergeld, Jarige Job, and Jeugdfonds all through one portal called Sam&. Saved me so much time!',
    authorId: 'user3',
    authorName: 'Lisa',
    category: 'tips',
    upvotes: 18,
    upvotedBy: [],
    replies: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '3',
    title: 'Question about Huurtoeslag deadline',
    content: 'Does anyone know if there is a deadline for applying for Huurtoeslag? I want to make sure I do not miss it.',
    authorId: 'user4',
    authorName: 'Anna',
    category: 'questions',
    upvotes: 7,
    upvotedBy: [],
    replies: [],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString()
  }
];

const categories = [
  { id: 'all', labelEn: 'All', labelNl: 'Alles' },
  { id: 'success', labelEn: 'Success Stories', labelNl: 'Succesverhalen' },
  { id: 'tips', labelEn: 'Tips', labelNl: 'Tips' },
  { id: 'questions', labelEn: 'Questions', labelNl: 'Vragen' },
  { id: 'support', labelEn: 'Support', labelNl: 'Steun' },
  { id: 'benefits', labelEn: 'Benefits', labelNl: 'Toeslagen' }
];

export function ForumView({ language }: ForumViewProps) {
  const [threads, setThreads] = useState<ForumThread[]>(sampleThreads);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewThread, setShowNewThread] = useState(false);

  const filteredThreads = selectedCategory === 'all' 
    ? threads 
    : threads.filter(t => t.category === selectedCategory);

  const handleUpvote = (threadId: string) => {
    setThreads(prev => prev.map(t => 
      t.id === threadId 
        ? { ...t, upvotes: t.upvotes + 1 }
        : t
    ));
  };

  const handleNewThread = (thread: Omit<ForumThread, 'id' | 'upvotes' | 'upvotedBy' | 'replies' | 'createdAt' | 'updatedAt'>) => {
    const newThread: ForumThread = {
      ...thread,
      id: Math.random().toString(36).substr(2, 9),
      upvotes: 0,
      upvotedBy: [],
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setThreads(prev => [newThread, ...prev]);
    setShowNewThread(false);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 hand-drawn-text">
            momslikeme
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'A community where single moms support each other'
              : 'Een gemeenschap waar alleenstaande moeders elkaar steunen'
            }
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                "border-2 border-dashed",
                selectedCategory === cat.id
                  ? "bg-primary/15 border-primary text-primary"
                  : "bg-card border-border/50 text-muted-foreground hover:border-primary/30"
              )}
            >
              {language === 'en' ? cat.labelEn : cat.labelNl}
            </button>
          ))}
        </div>

        {/* New thread button */}
        <button
          onClick={() => setShowNewThread(true)}
          className="w-full mb-6 p-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-all"
        >
          {language === 'en' ? '+ Share your story or question' : '+ Deel je verhaal of vraag'}
        </button>

        {/* New thread form */}
        {showNewThread && (
          <NewThreadForm
            language={language}
            onSubmit={handleNewThread}
            onCancel={() => setShowNewThread(false)}
          />
        )}

        {/* Threads list */}
        <div className="space-y-4">
          {filteredThreads.map((thread, index) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              language={language}
              onUpvote={() => handleUpvote(thread.id)}
              delay={index * 0.1}
            />
          ))}
        </div>

        {filteredThreads.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>{language === 'en' ? 'No threads yet in this category' : 'Nog geen berichten in deze categorie'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
