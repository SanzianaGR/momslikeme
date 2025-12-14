import { useState } from 'react';
import { ForumThread, ForumReply } from '@/types';
import { FlowerUpvote } from './FlowerUpvote';
import { UserProfilePopup } from './UserProfilePopup';
import { ChatPopup } from './ChatPopup';
import { cn } from '@/lib/utils';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ThreadCardProps {
  thread: ForumThread;
  language: 'en' | 'nl';
  onUpvote: () => void;
  onReply?: (content: string) => void;
  isLoggedIn: boolean;
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

// Mock user profiles
const mockUserProfiles: Record<string, {
  id: string;
  name: string;
  bio: string;
  joinedDate: string;
  postsCount: number;
  helpfulCount: number;
}> = {
  'user1': {
    id: 'user1',
    name: 'Maria',
    bio: 'Single mom of 2. Amsterdam. Survived the toeslagenaffaire. Here to help others.',
    joinedDate: '2023-03-15',
    postsCount: 24,
    helpfulCount: 156
  },
  'user2': {
    id: 'user2',
    name: 'Sophie',
    bio: 'Mom of 3. Rotterdam. Working part-time. Learning the system together.',
    joinedDate: '2023-06-20',
    postsCount: 12,
    helpfulCount: 45
  },
  'user3': {
    id: 'user3',
    name: 'Lisa',
    bio: 'Single mom. Utrecht. Found my way through bijzondere bijstand - happy to share tips!',
    joinedDate: '2022-11-10',
    postsCount: 38,
    helpfulCount: 234
  },
  'user4': {
    id: 'user4',
    name: 'Anna',
    bio: 'New here, figuring things out. Den Haag.',
    joinedDate: '2024-01-05',
    postsCount: 5,
    helpfulCount: 8
  }
};

export function ThreadCard({ thread, language, onUpvote, onReply, isLoggedIn, delay = 0 }: ThreadCardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const timeAgo = getTimeAgo(thread.createdAt, language);
  const userProfile = mockUserProfiles[thread.authorId];

  const t = {
    replies: language === 'en' ? 'replies' : 'reacties',
    reply: language === 'en' ? 'reply' : 'reactie',
    showReplies: language === 'en' ? 'Show replies' : 'Toon reacties',
    hideReplies: language === 'en' ? 'Hide replies' : 'Verberg reacties',
    writeReply: language === 'en' ? 'Write a reply...' : 'Schrijf een reactie...',
    send: language === 'en' ? 'Send' : 'Verstuur',
    loginToReply: language === 'en' ? 'Login to reply' : 'Log in om te reageren',
  };

  const handleProfileClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowProfilePopup(true);
  };

  const handleStartChat = () => {
    setShowProfilePopup(false);
    setShowChat(true);
  };

  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(replyText.trim());
      setReplyText('');
    }
  };

  return (
    <>
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
            {/* Clickable author name */}
            <button 
              onClick={() => handleProfileClick(thread.authorId)}
              className="font-medium text-primary hover:underline"
            >
              {thread.authorName}
            </button>
            <span>·</span>
            <span>{timeAgo}</span>
            {thread.replies.length > 0 && (
              <>
                <span>·</span>
                <button 
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {thread.replies.length} {thread.replies.length === 1 ? t.reply : t.replies}
                  {showReplies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </>
            )}
          </div>

          {/* Flower upvote */}
          <FlowerUpvote count={thread.upvotes} onUpvote={onUpvote} />
        </div>

        {/* Expanded replies section */}
        {showReplies && thread.replies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
            {thread.replies.map(reply => (
              <ReplyCard 
                key={reply.id} 
                reply={reply} 
                language={language}
                onProfileClick={handleProfileClick}
              />
            ))}
          </div>
        )}

        {/* Reply input (only when logged in and replies are shown) */}
        {isLoggedIn && showReplies && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={t.writeReply}
              className="flex-1 bg-muted/50 border border-border/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleReplySubmit}
              disabled={!replyText.trim()}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {t.send}
            </button>
          </div>
        )}

        {/* Show replies toggle when there are replies but not expanded */}
        {!showReplies && thread.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(true)}
            className="mt-3 text-sm text-primary hover:underline flex items-center gap-1"
          >
            {t.showReplies} ({thread.replies.length})
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Profile popup */}
      {showProfilePopup && selectedUserId && mockUserProfiles[selectedUserId] && (
        <UserProfilePopup
          user={mockUserProfiles[selectedUserId]}
          language={language}
          onClose={() => setShowProfilePopup(false)}
          onStartChat={handleStartChat}
        />
      )}

      {/* Chat popup */}
      {showChat && selectedUserId && mockUserProfiles[selectedUserId] && (
        <ChatPopup
          recipientId={selectedUserId}
          recipientName={mockUserProfiles[selectedUserId].name}
          currentUserId="currentUser"
          language={language}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
}

interface ReplyCardProps {
  reply: ForumReply;
  language: 'en' | 'nl';
  onProfileClick: (userId: string) => void;
}

function ReplyCard({ reply, language, onProfileClick }: ReplyCardProps) {
  const timeAgo = getTimeAgo(reply.createdAt, language);
  
  return (
    <div className="bg-muted/30 rounded-xl p-3 border border-border/30">
      <p className="text-sm text-foreground mb-2">{reply.content}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <button 
          onClick={() => onProfileClick(reply.authorId)}
          className="font-medium text-primary hover:underline"
        >
          {reply.authorName}
        </button>
        <span>·</span>
        <span>{timeAgo}</span>
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
