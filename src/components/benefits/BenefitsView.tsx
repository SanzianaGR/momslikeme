import { BenefitCard } from './BenefitCard';
import { BenefitMatch } from '@/types';
import { Gift, Sparkles, Building2, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BenefitsViewProps {
  matches: BenefitMatch[];
  onAddTask: (benefitId: string) => void;
}

export function BenefitsView({ matches, onAddTask }: BenefitsViewProps) {
  const nationalMatches = matches.filter(m => m.benefit.category === 'national');
  const municipalMatches = matches.filter(m => m.benefit.category === 'municipal');
  const privateMatches = matches.filter(m => m.benefit.category === 'private');

  const hasMatches = matches.length > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="shrink-0 px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10">
            <Gift className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Your Benefits</h1>
            <p className="text-sm text-muted-foreground">
              {hasMatches ? `${matches.length} potential matches found` : 'Chat to discover your matches'}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!hasMatches ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4 animate-bounce-gentle">
              <Sparkles className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-bold mb-2">No matches yet</h2>
            <p className="text-muted-foreground max-w-sm">
              Tell me about yourself in the chat, and I'll find the support you might be eligible for!
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                All ({matches.length})
              </TabsTrigger>
              <TabsTrigger value="national" className="text-xs sm:text-sm">
                <Building2 className="h-3 w-3 mr-1 hidden sm:inline" />
                National
              </TabsTrigger>
              <TabsTrigger value="municipal" className="text-xs sm:text-sm">
                <Building2 className="h-3 w-3 mr-1 hidden sm:inline" />
                Local
              </TabsTrigger>
              <TabsTrigger value="private" className="text-xs sm:text-sm">
                <Heart className="h-3 w-3 mr-1 hidden sm:inline" />
                Funds
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {matches.map(match => (
                <BenefitCard key={match.benefit.id} match={match} onAddTask={onAddTask} />
              ))}
            </TabsContent>

            <TabsContent value="national" className="space-y-4">
              {nationalMatches.length > 0 ? (
                nationalMatches.map(match => (
                  <BenefitCard key={match.benefit.id} match={match} onAddTask={onAddTask} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No national benefits matched yet</p>
              )}
            </TabsContent>

            <TabsContent value="municipal" className="space-y-4">
              {municipalMatches.length > 0 ? (
                municipalMatches.map(match => (
                  <BenefitCard key={match.benefit.id} match={match} onAddTask={onAddTask} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No local benefits matched yet</p>
              )}
            </TabsContent>

            <TabsContent value="private" className="space-y-4">
              {privateMatches.length > 0 ? (
                privateMatches.map(match => (
                  <BenefitCard key={match.benefit.id} match={match} onAddTask={onAddTask} />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No private funds matched yet</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
