import { useState } from 'react';
import { ForumThread } from '@/types';

interface NewThreadFormProps {
  language: 'en' | 'nl';
  onSubmit: (thread: Omit<ForumThread, 'id' | 'upvotes' | 'upvotedBy' | 'replies' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const categories = [
  { id: 'success' as const, labelEn: 'Success Story', labelNl: 'Succesverhaal' },
  { id: 'tips' as const, labelEn: 'Tip', labelNl: 'Tip' },
  { id: 'questions' as const, labelEn: 'Question', labelNl: 'Vraag' },
  { id: 'support' as const, labelEn: 'Looking for Support', labelNl: 'Zoek Steun' },
  { id: 'benefits' as const, labelEn: 'About Benefits', labelNl: 'Over Toeslagen' }
];

export function NewThreadForm({ language, onSubmit, onCancel }: NewThreadFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'benefits' | 'tips' | 'support' | 'questions' | 'success'>('questions');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !authorName.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      authorId: 'anonymous',
      authorName: authorName.trim(),
      category
    });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-card border-2 border-dashed border-primary/30 rounded-2xl p-6 mb-6 animate-scale-in"
    >
      <h3 className="text-lg font-bold text-foreground mb-4 hand-drawn-text">
        {language === 'en' ? 'Share with the community' : 'Deel met de gemeenschap'}
      </h3>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          {language === 'en' ? 'Your name (or nickname)' : 'Je naam (of bijnaam)'}
        </label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder={language === 'en' ? 'e.g., Maria' : 'bijv. Maria'}
          className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-primary/50 focus:outline-none transition-colors"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          {language === 'en' ? 'Category' : 'Categorie'}
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 border-dashed transition-all ${
                category === cat.id
                  ? 'bg-primary/15 border-primary text-primary'
                  : 'bg-card border-border/50 text-muted-foreground hover:border-primary/30'
              }`}
            >
              {language === 'en' ? cat.labelEn : cat.labelNl}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          {language === 'en' ? 'Title' : 'Titel'}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={language === 'en' ? 'What do you want to share?' : 'Wat wil je delen?'}
          className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-primary/50 focus:outline-none transition-colors"
        />
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          {language === 'en' ? 'Your message' : 'Je bericht'}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={language === 'en' ? 'Share your experience, tip, or question...' : 'Deel je ervaring, tip of vraag...'}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-primary/50 focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground font-medium hover:border-primary/30 transition-all"
        >
          {language === 'en' ? 'Cancel' : 'Annuleren'}
        </button>
        <button
          type="submit"
          disabled={!title.trim() || !content.trim() || !authorName.trim()}
          className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {language === 'en' ? 'Share' : 'Delen'}
        </button>
      </div>
    </form>
  );
}
