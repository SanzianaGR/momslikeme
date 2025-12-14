import { Task } from '@/types';
import { useState } from 'react';
import { ChevronDown, Euro, ExternalLink, Download, Mail, Users, FileText, ListChecks, HelpCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HandDrawnCheckbox } from './HandDrawnCheckbox';
import { FloatingDoodles } from './FloatingDoodles';
import { HelpRequestPopup } from './HelpRequestPopup';
import { allBenefits, BenefitFull } from '@/data/allBenefits';
import jsPDF from 'jspdf';

interface MyBenefitsViewProps {
  tasks: Task[];
  onToggleStep: (taskId: string, stepId: string) => void;
  language: 'en' | 'nl';
}

export function MyBenefitsView({ tasks, onToggleStep, language }: MyBenefitsViewProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, string[]>>({});
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  // Get full benefit details from allBenefits
  const getBenefitDetails = (benefitId?: string): BenefitFull | undefined => {
    if (!benefitId) return undefined;
    return allBenefits.find(b => b.id === benefitId);
  };

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
    whatYouNeed: language === 'nl' ? 'Wat heb je nodig?' : 'What documents do you need?',
    howToApply: language === 'nl' ? 'Hoe aanvragen?' : 'How to apply?',
    importantNotes: language === 'nl' ? 'Belangrijk om te weten' : 'Important to know',
    amount: language === 'nl' ? 'Wat je krijgt' : 'What you\'ll receive',
    apply: language === 'nl' ? 'Ga naar aanvraag' : 'Go to application',
    download: language === 'nl' ? 'Download je informatie' : 'Download your information',
    email: language === 'nl' ? 'Verstuur naar mijn email' : 'Send to my email',
    youDeserve: language === 'nl' ? 'Je verdient dit. Laten we het regelen.' : 'You deserve this. Let\'s make it happen.',
    itemsCompleted: language === 'nl' ? 'items afgevinkt' : 'items completed',
    administrator: language === 'nl' ? 'Beheerder' : 'Administrator',
    needHelp: language === 'nl' ? 'Hulp nodig bij aanvragen?' : 'Need help applying?',
    helpText: language === 'nl' 
      ? 'Je kunt gratis hulp krijgen bij het Sociaal Wijkteam in je gemeente. Zij kunnen je helpen met formulieren en documenten.' 
      : 'You can get free help from the Social District Team (Sociaal Wijkteam) in your municipality. They can help you with forms and documents.',
    askForHelp: language === 'nl' ? 'Vraag om hulp' : 'Ask for help',
    freeSupport: language === 'nl' ? 'Je verdient gratis ondersteuning' : 'You deserve support for free',
    pdfTitle: language === 'nl' ? 'Jouw Voordelen Overzicht' : 'Your Benefits Overview',
    pdfGenerated: language === 'nl' ? 'Gegenereerd op' : 'Generated on',
    pdfDocuments: language === 'nl' ? 'Benodigde documenten' : 'Required documents',
    pdfSteps: language === 'nl' ? 'Stappen om aan te vragen' : 'Steps to apply',
    pdfWebsite: language === 'nl' ? 'Officiële website' : 'Official website',
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
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Colors
    const primaryColor: [number, number, number] = [111, 175, 142]; // Forest green
    const textColor: [number, number, number] = [46, 42, 39]; // Dark charcoal
    const mutedColor: [number, number, number] = [120, 120, 120];
    const accentColor: [number, number, number] = [242, 166, 90]; // Warm apricot

    // Helper to add new page if needed
    const checkNewPage = (neededHeight: number) => {
      if (yPos + neededHeight > pageHeight - 30) {
        // Add page number before new page
        pdf.setFontSize(8);
        pdf.setTextColor(...mutedColor);
        pdf.text(`momslikeme - ${t.pdfTitle}`, margin, pageHeight - 10);
        pdf.text(pdf.internal.pages.length.toString(), pageWidth - margin, pageHeight - 10, { align: 'right' });
        
        pdf.addPage();
        yPos = margin;
      }
    };

    // ===== HEADER SECTION =====
    // Header background
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('momslikeme', margin, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(t.pdfTitle, margin, 37);
    
    yPos = 60;

    // Date and summary
    pdf.setTextColor(...textColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const dateStr = new Date().toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`${t.pdfGenerated}: ${dateStr}`, margin, yPos);
    yPos += 8;
    
    // Benefits count
    const totalAmount = tasks.reduce((sum, task) => {
      const amount = task.estimatedAmount?.replace(/[^0-9]/g, '') || '0';
      return sum + parseInt(amount, 10);
    }, 0);
    
    pdf.setFontSize(11);
    pdf.text(language === 'nl' 
      ? `${tasks.length} regelingen gevonden` 
      : `${tasks.length} benefits found`, margin, yPos);
    if (totalAmount > 0) {
      pdf.text(language === 'nl' 
        ? `Geschatte totale waarde: €${totalAmount.toLocaleString()}+`
        : `Estimated total value: €${totalAmount.toLocaleString()}+`, pageWidth - margin, yPos, { align: 'right' });
    }
    yPos += 15;

    // Motivational quote box
    pdf.setFillColor(251, 247, 242); // Warm cream
    pdf.setDrawColor(...primaryColor);
    pdf.roundedRect(margin, yPos, contentWidth, 18, 3, 3, 'FD');
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(...primaryColor);
    pdf.text(`"${t.youDeserve}"`, pageWidth / 2, yPos + 11, { align: 'center' });
    yPos += 28;

    // Divider
    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // ===== BENEFITS SECTION =====
    tasks.forEach((task, index) => {
      const benefitFull = getBenefitDetails(task.benefitId);
      const name = language === 'nl' ? (task.titleNl || task.title) : task.title;
      const description = language === 'nl' ? (task.descriptionNl || task.description) : task.description;
      
      checkNewPage(70);

      // Benefit number badge
      pdf.setFillColor(...accentColor);
      pdf.circle(margin + 5, yPos + 3, 5, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text((index + 1).toString(), margin + 5, yPos + 5.5, { align: 'center' });

      // Benefit name
      pdf.setTextColor(...textColor);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(name, margin + 15, yPos + 5);
      yPos += 12;

      // Amount badge
      if (task.estimatedAmount) {
        pdf.setFillColor(200, 230, 200);
        const amountText = `${t.amount}: ${task.estimatedAmount}`;
        const amountWidth = pdf.getTextWidth(amountText) + 8;
        pdf.roundedRect(margin + 15, yPos - 3, amountWidth, 8, 2, 2, 'F');
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(50, 120, 50);
        pdf.text(amountText, margin + 19, yPos + 2);
        yPos += 10;
      }

      // Description
      if (description) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...mutedColor);
        const descLines = pdf.splitTextToSize(description, contentWidth - 20);
        checkNewPage(descLines.length * 5);
        pdf.text(descLines, margin + 15, yPos);
        yPos += descLines.length * 5 + 5;
      }

      // Required documents section
      const requiredDocs = benefitFull
        ? (language === 'nl' ? (benefitFull.requiredDocumentsNl || benefitFull.requiredDocuments) : benefitFull.requiredDocuments)
        : [];
      
      if (requiredDocs.length > 0) {
        checkNewPage(15 + requiredDocs.length * 6);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...textColor);
        pdf.text(t.pdfDocuments + ':', margin + 15, yPos);
        yPos += 6;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...mutedColor);
        requiredDocs.forEach(doc => {
          checkNewPage(6);
          pdf.text('•', margin + 18, yPos);
          const docLines = pdf.splitTextToSize(doc, contentWidth - 30);
          pdf.text(docLines, margin + 24, yPos);
          yPos += docLines.length * 4 + 2;
        });
        yPos += 3;
      }

      // How to apply steps
      const howToApply = benefitFull
        ? (language === 'nl' ? (benefitFull.howToApplyNl || benefitFull.howToApply) : benefitFull.howToApply)
        : [];
      
      if (howToApply.length > 0) {
        checkNewPage(15 + howToApply.length * 6);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...textColor);
        pdf.text(t.pdfSteps + ':', margin + 15, yPos);
        yPos += 6;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...mutedColor);
        howToApply.forEach((step, i) => {
          checkNewPage(6);
          pdf.setTextColor(...primaryColor);
          pdf.text(`${i + 1}.`, margin + 18, yPos);
          pdf.setTextColor(...mutedColor);
          const stepLines = pdf.splitTextToSize(step, contentWidth - 35);
          pdf.text(stepLines, margin + 26, yPos);
          yPos += stepLines.length * 4 + 2;
        });
        yPos += 3;
      }

      // Official website
      const officialUrl = benefitFull?.officialWebsite || task.applicationUrl;
      if (officialUrl) {
        checkNewPage(12);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...textColor);
        pdf.text(`${t.pdfWebsite}:`, margin + 15, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 102, 204);
        pdf.textWithLink(officialUrl, margin + 15 + pdf.getTextWidth(`${t.pdfWebsite}: `), yPos, { url: officialUrl });
        yPos += 8;
      }

      // Divider between benefits
      if (index < tasks.length - 1) {
        yPos += 5;
        pdf.setDrawColor(230, 230, 230);
        pdf.setLineDashPattern([2, 2], 0);
        pdf.line(margin + 15, yPos, pageWidth - margin, yPos);
        pdf.setLineDashPattern([], 0);
        yPos += 10;
      }
    });

    // ===== FOOTER SECTION =====
    checkNewPage(50);
    yPos += 10;
    
    // Help section box
    pdf.setFillColor(251, 247, 242);
    pdf.setDrawColor(...primaryColor);
    pdf.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'FD');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    pdf.text(t.needHelp, margin + 8, yPos + 10);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...mutedColor);
    const helpLines = pdf.splitTextToSize(t.helpText, contentWidth - 16);
    pdf.text(helpLines, margin + 8, yPos + 18);
    
    yPos += 45;
    
    // Free support message
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...primaryColor);
    pdf.text(t.freeSupport, pageWidth / 2, yPos, { align: 'center' });

    // Final page number
    pdf.setFontSize(8);
    pdf.setTextColor(...mutedColor);
    pdf.text(`momslikeme - ${t.pdfTitle}`, margin, pageHeight - 10);
    pdf.text(pdf.internal.pages.length.toString(), pageWidth - margin, pageHeight - 10, { align: 'right' });

    // Save
    pdf.save('momslikeme-benefits-report.pdf');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`momslikeme - ${t.title}`);
    const body = encodeURIComponent(`${t.youDeserve}\n\n${tasks.map(task => {
      const name = language === 'nl' ? (task.titleNl || task.title) : task.title;
      const benefitFull = getBenefitDetails(task.benefitId);
      const url = benefitFull?.officialWebsite || task.applicationUrl || '';
      return `- ${name}${task.estimatedAmount ? ` (${task.estimatedAmount})` : ''}\n  ${url}`;
    }).join('\n\n')}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingDoodles />
      <HelpRequestPopup open={showHelpPopup} onClose={() => setShowHelpPopup(false)} language={language} />
      
      {/* Header */}
      <div className="relative z-10 px-6 py-8 text-center">
        <h1 className="font-nunito text-3xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground max-w-md mx-auto">{t.subtitle}</p>
        <p className="text-primary font-medium mt-2">{t.freeSupport}</p>
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

              // Get real benefit details from allBenefits
              const benefitFull = getBenefitDetails(task.benefitId);
              
              // Real eligibility criteria from benefit data
              const eligibilityCriteria = benefitFull 
                ? (language === 'nl' 
                    ? (Array.isArray(benefitFull.eligibilityPlainLanguageNl) 
                        ? benefitFull.eligibilityPlainLanguageNl 
                        : [benefitFull.eligibilityPlainLanguageNl || benefitFull.eligibilityPlainLanguage])
                    : (Array.isArray(benefitFull.eligibilityPlainLanguage) 
                        ? benefitFull.eligibilityPlainLanguage 
                        : [benefitFull.eligibilityPlainLanguage]))
                : task.benefit?.eligibilityCriteria || [];

              // Real required documents from benefit data
              const requiredDocuments = benefitFull
                ? (language === 'nl' 
                    ? (benefitFull.requiredDocumentsNl || benefitFull.requiredDocuments)
                    : benefitFull.requiredDocuments)
                : [];

              // Real how-to-apply steps from benefit data
              const howToApplySteps = benefitFull
                ? (language === 'nl' 
                    ? (benefitFull.howToApplyNl || benefitFull.howToApply)
                    : benefitFull.howToApply)
                : [];

              // Important notes
              const notes = benefitFull
                ? (language === 'nl' 
                    ? (benefitFull.notesNl || benefitFull.notes || [])
                    : (benefitFull.notes || []))
                : [];

              // Official website URL
              const officialUrl = benefitFull?.officialWebsite || task.applicationUrl;
              const administrator = benefitFull?.administrator;

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
                              {/* Real required documents from benefit data */}
                              {requiredDocuments.map((doc, i) => (
                                <div key={i} className="flex items-start gap-3 py-1">
                                  <div className="w-5 h-5 rounded border-2 border-dashed border-muted-foreground/40 flex items-center justify-center shrink-0 mt-0.5">
                                    <FileText className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <span className="text-sm text-muted-foreground">{doc}</span>
                                </div>
                              ))}
                              {/* Fallback to task steps if no benefit data */}
                              {requiredDocuments.length === 0 && steps.map(step => (
                                <HandDrawnCheckbox
                                  key={step.id}
                                  checked={step.completed}
                                  label={language === 'nl' ? step.titleNl : step.title}
                                  onChange={() => onToggleStep(task.id, step.id)}
                                />
                              ))}
                              {/* Task documents */}
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
                      <div className="border-b border-dashed border-border">
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
                            {/* Administrator info */}
                            {administrator && (
                              <div className="mb-4 p-3 bg-muted/30 rounded-xl border border-dashed border-border">
                                <p className="text-xs text-muted-foreground mb-1">{t.administrator}</p>
                                <p className="text-sm font-medium">{administrator}</p>
                              </div>
                            )}
                            
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
                            
                            {officialUrl && (
                              <Button 
                                className="w-full bg-primary hover:bg-primary/90 mb-3"
                                onClick={() => window.open(officialUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                {t.apply}
                              </Button>
                            )}
                            
                            {/* Official URL display */}
                            {officialUrl && (
                              <p className="text-xs text-muted-foreground text-center break-all">
                                {officialUrl}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Important notes */}
                      {notes.length > 0 && (
                        <div className="border-b border-dashed border-border">
                          <button
                            onClick={() => toggleSection(task.id, 'notes')}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <AlertCircle className="h-5 w-5 text-warning" />
                              <span className="font-medium">{t.importantNotes}</span>
                            </div>
                            <ChevronDown 
                              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isSectionExpanded(task.id, 'notes') ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {isSectionExpanded(task.id, 'notes') && (
                            <div className="px-6 pb-4 animate-fade-in">
                              <ul className="space-y-2 ml-8">
                                {notes.map((note, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="text-warning mt-1">⚠</span>
                                    <span>{note}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Need help section */}
                      <div className="px-6 py-4">
                        <div className="flex items-center gap-3 mb-3">
                          <HelpCircle className="h-5 w-5 text-secondary" />
                          <span className="font-medium">{t.needHelp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 ml-8">
                          {t.helpText}
                        </p>
                        <Button 
                          variant="outline"
                          className="w-full border-2 border-dashed border-secondary/50"
                          onClick={() => setShowHelpPopup(true)}
                        >
                          <HelpCircle className="h-4 w-4 mr-2" />
                          {t.askForHelp}
                        </Button>
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
