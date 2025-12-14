import { useState } from 'react';
import { X, MessageCircle, Calendar, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  joinedDate: string;
  postsCount: number;
  helpfulCount: number;
}

interface UserProfilePopupProps {
  user: UserProfile;
  language: 'en' | 'nl';
  onClose: () => void;
  onStartChat: () => void;
}

export function UserProfilePopup({ user, language, onClose, onStartChat }: UserProfilePopupProps) {
  const t = {
    memberSince: language === 'en' ? 'Member since' : 'Lid sinds',
    posts: language === 'en' ? 'Posts' : 'Berichten',
    helpful: language === 'en' ? 'Helpful' : 'Behulpzaam',
    sendMessage: language === 'en' ? 'Send a message' : 'Stuur een bericht',
    close: language === 'en' ? 'Close' : 'Sluiten',
  };

  const joinedFormatted = new Date(user.joinedDate).toLocaleDateString(language === 'en' ? 'en-US' : 'nl-NL', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border-2 border-border rounded-3xl p-6 w-full max-w-sm shadow-xl animate-scale-in">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl font-bold text-primary mb-3 border-2 border-dashed border-primary/30">
            {user.avatar || user.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-bold text-foreground hand-drawn-text">{user.name}</h3>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-muted-foreground text-center mb-4 italic">
            "{user.bio}"
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-muted/30 rounded-xl">
            <Calendar className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">{t.memberSince}</p>
            <p className="text-sm font-medium text-foreground">{joinedFormatted}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-xl">
            <MessageCircle className="w-4 h-4 mx-auto mb-1 text-secondary" />
            <p className="text-xs text-muted-foreground">{t.posts}</p>
            <p className="text-sm font-medium text-foreground">{user.postsCount}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-xl">
            <Award className="w-4 h-4 mx-auto mb-1 text-warning" />
            <p className="text-xs text-muted-foreground">{t.helpful}</p>
            <p className="text-sm font-medium text-foreground">{user.helpfulCount}</p>
          </div>
        </div>

        {/* Chat button */}
        <button
          onClick={onStartChat}
          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-5 h-5" />
          {t.sendMessage}
        </button>
      </div>
    </div>
  );
}
