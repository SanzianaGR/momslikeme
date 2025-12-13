import { Task, TaskStep } from '@/types';
import { useState } from 'react';
import { CheckCircle2, Circle, FileText, Calendar, Euro, ExternalLink, Download, Mail, Sparkles } from 'lucide-react';
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

  const t = {
    title: language === 'nl' ? 'Jouw Voordelen' : 'Your Benefits',
    subtitle: language === 'nl' 
      ? 'Alles wat je hebt verzameld op jouw reis naar ondersteuning' 
      : 'Everything you\'ve gathered on your journey to support',
    emptyTitle: language === 'nl' ? 'Jouw reis begint hier' : 'Your journey starts here',
    emptyText: language === 'nl' 
      ? 'Praat met Bloom om voordelen te ontdekken waar je recht op hebt. Elk voordeel dat je toevoegt verschijnt hier als een stap op je pad.' 
      : 'Chat with Bloom to discover benefits you deserve. Every benefit you add will appear here as a step on your path.',
    requirements: language === 'nl' ? 'Wat je nodig hebt' : 'What you need',
    documents: language === 'nl' ? 'Je documenten' : 'Your documents',
    deadline: language === 'nl' ? 'Deadline' : 'Deadline',
    amount: language === 'nl' ? 'Wat je krijgt' : 'What you\'ll receive',
    apply: language === 'nl' ? 'Aanvragen' : 'Apply now',
    download: language === 'nl' ? 'Download als PDF' : 'Download as PDF',
    email: language === 'nl' ? 'Verstuur naar mijn email' : 'Send to my email',
    steps: language === 'nl' ? 'stappen' : 'steps',
    completed: language === 'nl' ? 'voltooid' : 'completed',
    youDeserve: language === 'nl' ? 'Je verdient dit. Laten we het regelen.' : 'You deserve this. Let\'s make it happen.',
    uploadReminder: language === 'nl' ? 'Upload wanneer je klaar bent' : 'Upload when you\'re ready',
  };

  const handleDownloadPDF = () => {
    // Create printable content
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
📅 ${t.deadline}: ${task.dueDate || 'No deadline'}
🔗 ${task.applicationUrl || 'Contact for details'}

${t.requirements}:
${steps}

${t.documents}:
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
                {/* Empty basket */}
                <ellipse cx="50" cy="70" rx="35" ry="15" className="fill-muted stroke-foreground/30" strokeWidth="2" />
                <path d="M15 70 L20 40 L80 40 L85 70" className="fill-none stroke-foreground/30" strokeWidth="2" strokeLinecap="round" />
                <path d="M30 40 Q50 20 70 40" className="fill-none stroke-foreground/30" strokeWidth="2" strokeLinecap="round" />
                {/* Little flower waiting */}
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
              const totalSteps = steps.length;
              const name = language === 'nl' ? (task.titleNl || task.title) : task.title;
              const description = language === 'nl' ? (task.descriptionNl || task.description) : task.description;

              return (
                <div 
                  key={task.id}
                  className="bg-card rounded-3xl border-2 border-dashed border-border p-6 hand-drawn-card animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Task header */}
                  <button 
                    onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl">{task.benefit?.icon || '🌸'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-foreground mb-1">{name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          {task.estimatedAmount && (
                            <span className="flex items-center gap-1 text-success font-medium">
                              <Euro className="h-4 w-4" />
                              {task.estimatedAmount}
                            </span>
                          )}
                          <span className="text-muted-foreground">
                            {completedSteps}/{totalSteps} {t.steps} {t.completed}
                          </span>
                        </div>
                      </div>
                      <svg 
                        className={`w-6 h-6 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-dashed border-border space-y-6 animate-fade-in">
                      {/* Requirements/Steps */}
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          {t.requirements}
                        </h4>
                        <div className="space-y-2">
                          {steps.map(step => (
                            <HandDrawnCheckbox
                              key={step.id}
                              checked={step.completed}
                              label={language === 'nl' ? step.titleNl : step.title}
                              onChange={() => onToggleStep(task.id, step.id)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Documents */}
                      {documents.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {t.documents}
                          </h4>
                          <div className="space-y-2">
                            {documents.map(doc => (
                              <div 
                                key={doc.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-dashed border-border"
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${doc.uploaded ? 'bg-success/20' : 'bg-warning/20'}`}>
                                  <FileText className={`h-4 w-4 ${doc.uploaded ? 'text-success' : 'text-warning'}`} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{language === 'nl' ? doc.nameNl : doc.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {doc.uploaded ? '✓ Uploaded' : t.uploadReminder}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Deadline & Amount */}
                      <div className="flex flex-wrap gap-4">
                        {task.dueDate && (
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-medium">{t.deadline}: {task.dueDate}</span>
                          </div>
                        )}
                        {task.estimatedAmount && (
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success">
                            <Euro className="h-4 w-4" />
                            <span className="text-sm font-medium">{task.estimatedAmount}</span>
                          </div>
                        )}
                      </div>

                      {/* Apply button */}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
