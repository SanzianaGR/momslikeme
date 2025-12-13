import { Button } from '@/components/ui/button';

interface QuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
  disabled?: boolean;
}

export function QuickReplies({ replies, onSelect, disabled }: QuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center animate-fade-in">
      {replies.map((reply, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="text-sm hover-lift"
        >
          {reply}
        </Button>
      ))}
    </div>
  );
}
