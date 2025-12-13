import { Task } from '@/types';
import { useState } from 'react';
import { ChevronDown, Euro, ExternalLink, Download, Mail, Sparkles, Users, FileText, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HandDrawnCheckbox } from './HandDrawnCheckbox';
import { FloatingDoodles } from './FloatingDoodles';

interface MyBenefitsViewProps {
  tasks: Task[];
  onToggleStep: (taskId: string, stepId: string) => void;
  language: 'en' | 'nl';
}

export function MyBenefitsView({ tasks, onToggleStep, language }: MyBenefitsViewProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, string[]>>({});

  const t = {
    title: language === 'nl' ? 'Jouw Voordelen' : 'Your Benefits',
    subtitle: language === 'nl' 
      ? 'Alles wat je hebt verzameld op jouw reis naar ondersteuning' 
      : 'Everything you\'ve gathered on your journey to support',
    emptyTitle: language === 'nl' ? 'Jouw reis begint hier' : 'Your journey starts here',
    emptyText: language === 'nl' 
      ? 'Praat met Bloom om voordelen te ontdekken waar je recht op hebt. Elk voordeel dat je toevoegt verschijnt hier als een stap op je pad.' 
      : 'Chat with Bloom to discover benefits you deserve. Every benefit you add will appear here as a step on your path.',
    whoIsEligible: language === 'nl' ? 'Wie komt in aanmerking?' : 'Who is eligible?',
    whatYouNeed: language === 'nl' ? 'Wat heb je nodig?' : 'What do you need?',
    howToApply: language === 'nl' ? 'Hoe aanvragen?' : 'How to apply?',
    amount: language === 'nl' ? 'Wat je krijgt' : 'What you\'ll receive',
    apply: language === 'nl' ? 'Ga naar aanvraag' : 'Go to application',
    download: language === 'nl' ? 'Download als PDF' : 'Download as PDF',
    email: language === 'nl' ? 'Verstuur naar mijn email' : 'Send to my email',
    youDeserve: language === 'nl' ? 'Je verdient dit. Laten we het regelen.' : 'You deserve this. Let\'s make it happen.',
    itemsCompleted: language === 'nl' ? 'items afgevinkt' : 'items completed',
  };

  const toggleSection = (taskId: string, section: string) => {
    setExpandedSections(prev => {
      const taskSections = prev[taskId] || [];
      if (taskSections.includes(section)) {
        return { ...prev, [taskId]: taskSections.filter(s => s !== section) };
      }
      return { ...prev, [taskId]: [...taskSections, section] };
    });
  };

  const isSectionExpanded = (taskId: string, section: string) => {
    return expandedSections[taskId]?.includes(section) || false;
  };

  const handleDownloadPDF = () => {
    const printContent = tasks.map(task => {
      const name = language === 'nl' ? (task.titleNl || task.title) : task.title;
      const desc = language === 'nl' ? (task.descriptionNl || task.description) : task.description;
      const steps = (task.steps || []).map(s => `${s.completed ? '✓' : '○'} ${language === 'nl' ? s.titleNl : s.title}`).join('\n');
      const docs = (task.documents || []).map(d => `- ${language === 'nl' ? d.nameNl : d.name}`).join('\n');
      
      return `
═══════════════════════════════════════
${name}
═══════════════════════════════════════
${desc || ''}

💰 ${t.amount}: ${task.estimatedAmount || 'Varies'}
🔗 ${task.applicationUrl || 'Contact for details'}

${t.whatYouNeed}:
${steps}
${docs}
      `;
    }).join('\n\n');

    const blob = new Blob([`momslikeme - ${t.title}\n\n${t.youDeserve}\n\n${printContent}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-benefits.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`momslikeme - ${t.title}`);
    const body = encodeURIComponent(`${t.youDeserve}\n\n${tasks.map(task => {
      const name = language === 'nl' ? (task.titleNl || task.title) : task.title;
      return `• ${name} - ${task.estimatedAmount || ''}`;
    }).join('\n')}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingDoodles />
      
      {/* Header */}
      <div className="relative z-10 px-6 py-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-warning animate-pulse-slow" />
          <h1 className="font-nunito text-3xl font-bold text-foreground">{t.title}</h1>
          <Sparkles className="h-6 w-6 text-warning animate-pulse-slow" />
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">{t.subtitle}</p>
      </div>

      {/* Action buttons */}
      {tasks.length > 0 && (
        <div className="flex justify-center gap-3 mb-8 px-6">
          <Button 
            variant="outline" 
            onClick={handleDownloadPDF}
            className="hand-drawn-badge bg-card border-2 border-dashed border-primary/50"
          >
            <Download className="h-4 w-4 mr-2" />
            {t.download}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSendEmail}
            className="hand-drawn-badge bg-card border-2 border-dashed border-secondary/50"
          >
            <Mail className="h-4 w-4 mr-2" />
            {t.email}
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 px-6 pb-24 max-w-2xl mx-auto">
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <svg viewBox="0 0 100 100" className="animate-float">
                <ellipse cx="50" cy="70" rx="35" ry="15" className="fill-muted stroke-foreground/30" strokeWidth="2" />
                <path d="M15 70 L20 40 L80 40 L85 70" className="fill-none stroke-foreground/30" strokeWidth="2" strokeLinecap="round" />
                <path d="M30 40 Q50 20 70 40" className="fill-none stroke-foreground/30" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="55" r="8" className="fill-warning/50" />
                <circle cx="48" cy="53" r="1.5" className="fill-foreground" />
                <circle cx="52" cy="53" r="1.5" className="fill-foreground" />
                <path d="M47 57 Q50 59 53 57" className="stroke-foreground fill-none" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3">{t.emptyTitle}</h2>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">{t.emptyText}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Motivational text */}
            <div className="text-center py-4">
              <p className="text-lg font-medium text-primary italic">"{t.youDeserve}"</p>
            </div>

            {tasks.map((task, index) => {
              const isExpanded = expandedTask === task.id;
              const steps = task.steps || [];
              const documents = task.documents || [];
              const completedSteps = steps.filter(s => s.completed).length;
              const totalSteps = steps.length + documents.length;
              const name = language === 'nl' ? (task.titleNl || task.title) : task.title;
              const description = language === 'nl' ? (task.descriptionNl || task.description) : task.description;

              // Mock eligibility criteria based on benefit
              const eligibilityCriteria = task.benefit?.eligibilityCriteria || [
                language === 'nl' ? 'Je woont in Nederland' : 'You live in the Netherlands',
                language === 'nl' ? 'Je hebt een laag inkomen' : 'You have a low income',
              ];

              // How to apply steps
              const howToApplySteps = [
                language === 'nl' ? 'Verzamel alle benodigde documenten' : 'Gather all required documents',
                language === 'nl' ? 'Ga naar de officiële website' : 'Go to the official website',
                language === 'nl' ? 'Vul het aanvraagformulier in' : 'Fill in the application form',
                language === 'nl' ? 'Wacht op de beslissing' : 'Wait for the decision',
              ];

              return (
                <div 
                  key={task.id}
                  className="bg-card rounded-3xl border-2 border-dashed border-border overflow-hidden hand-drawn-card animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Task header */}
                  <button 
                    onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                    className="w-full text-left p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">{task.benefit?.icon || '🌸'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-foreground mb-1">{name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          {task.estimatedAmount && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                              <Euro className="h-3.5 w-3.5" />
                              {task.estimatedAmount}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {completedSteps}/{totalSteps} {t.itemsCompleted}
                          </span>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Expanded content - Accordion sections */}
                  {isExpanded && (
                    <div className="border-t border-dashed border-border animate-fade-in">
                      {/* Who is eligible? */}
                      <div className="border-b border-dashed border-border">
                        <button
                          onClick={() => toggleSection(task.id, 'eligible')}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-secondary" />
                            <span className="font-medium">{t.whoIsEligible}</span>
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isSectionExpanded(task.id, 'eligible') ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isSectionExpanded(task.id, 'eligible') && (
                          <div className="px-6 pb-4 animate-fade-in">
                            <ul className="space-y-2 ml-8">
                              {eligibilityCriteria.map((criteria, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{criteria}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* What do you need? (Checklist) */}
                      <div className="border-b border-dashed border-border">
                        <button
                          onClick={() => toggleSection(task.id, 'requirements')}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <ListChecks className="h-5 w-5 text-warning" />
                            <span className="font-medium">{t.whatYouNeed}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              {completedSteps}/{totalSteps}
                            </span>
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isSectionExpanded(task.id, 'requirements') ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isSectionExpanded(task.id, 'requirements') && (
                          <div className="px-6 pb-4 animate-fade-in">
                            <div className="space-y-2 ml-8">
                              {/* Steps as checklist */}
                              {steps.map(step => (
                                <HandDrawnCheckbox
                                  key={step.id}
                                  checked={step.completed}
                                  label={language === 'nl' ? step.titleNl : step.title}
                                  onChange={() => onToggleStep(task.id, step.id)}
                                />
                              ))}
                              {/* Documents as checklist items */}
                              {documents.map(doc => (
                                <div key={doc.id} className="flex items-center gap-3 py-1">
                                  <div className={`w-5 h-5 rounded border-2 border-dashed flex items-center justify-center ${doc.uploaded ? 'bg-success/20 border-success' : 'border-muted-foreground/40'}`}>
                                    {doc.uploaded && (
                                      <svg className="w-3 h-3 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className={`text-sm ${doc.uploaded ? 'line-through text-muted-foreground' : ''}`}>
                                      {language === 'nl' ? doc.nameNl : doc.name}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* How to apply? */}
                      <div>
                        <button
                          onClick={() => toggleSection(task.id, 'howto')}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <ExternalLink className="h-5 w-5 text-primary" />
                            <span className="font-medium">{t.howToApply}</span>
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isSectionExpanded(task.id, 'howto') ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isSectionExpanded(task.id, 'howto') && (
                          <div className="px-6 pb-4 animate-fade-in">
                            <ol className="space-y-3 ml-8 mb-4">
                              {howToApplySteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                                    {i + 1}
                                  </span>
                                  <span className="pt-0.5">{step}</span>
                                </li>
                              ))}
                            </ol>
                            {task.applicationUrl && (
                              <Button 
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={() => window.open(task.applicationUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                {t.apply}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
