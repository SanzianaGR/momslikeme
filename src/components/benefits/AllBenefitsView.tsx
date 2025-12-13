import { useState, useMemo } from 'react';
import { allBenefits, municipalities, BenefitFull } from '@/data/allBenefits';
import { ExternalLink, FileText, CheckCircle, Info, Search, Filter, ChevronDown, ChevronUp, MapPin, Building2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FloatingDoodles } from '@/components/mybenefits/FloatingDoodles';

interface AllBenefitsViewProps {
  language: 'en' | 'nl';
}

export function AllBenefitsView({ language }: AllBenefitsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'national' | 'municipal' | 'private'>('all');
  const [municipalityFilter, setMunicipalityFilter] = useState<string>('all');
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);

  const t = {
    title: language === 'nl' ? 'Alle Regelingen' : 'All Benefits',
    subtitle: language === 'nl' 
      ? 'Een complete gids voor alle ondersteuning waar je mogelijk recht op hebt' 
      : 'A complete guide to all support you may be entitled to',
    search: language === 'nl' ? 'Zoek regelingen...' : 'Search benefits...',
    all: language === 'nl' ? 'Alles' : 'All',
    national: language === 'nl' ? 'Landelijk' : 'National',
    municipal: language === 'nl' ? 'Gemeentelijk' : 'Municipal',
    private: language === 'nl' ? 'Fondsen' : 'Private Funds',
    municipality: language === 'nl' ? 'Gemeente' : 'Municipality',
    eligibility: language === 'nl' ? 'Wie komt in aanmerking?' : 'Who is eligible?',
    documents: language === 'nl' ? 'Wat heb je nodig?' : 'What do you need?',
    howToApply: language === 'nl' ? 'Hoe vraag je aan?' : 'How to apply?',
    notes: language === 'nl' ? 'Goed om te weten' : 'Good to know',
    visitWebsite: language === 'nl' ? 'Naar de website' : 'Visit website',
    administrator: language === 'nl' ? 'Beheerder' : 'Administrator',
    results: language === 'nl' ? 'regelingen gevonden' : 'benefits found',
    noResults: language === 'nl' ? 'Geen regelingen gevonden' : 'No benefits found',
    forYou: language === 'nl' ? 'Speciaal voor alleenstaande ouders' : 'Especially for single parents',
  };

  const filteredBenefits = useMemo(() => {
    return allBenefits.filter(benefit => {
      // Category filter
      if (categoryFilter !== 'all' && benefit.category !== categoryFilter) return false;
      
      // Municipality filter
      if (municipalityFilter !== 'all' && benefit.municipality !== municipalityFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = language === 'nl' ? (benefit.nameNl || benefit.name) : benefit.name;
        const desc = language === 'nl' ? (benefit.shortDescriptionNl || benefit.shortDescription) : benefit.shortDescription;
        return name.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
      }
      
      return true;
    });
  }, [searchQuery, categoryFilter, municipalityFilter, language]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'national': return <Building2 className="w-4 h-4" />;
      case 'municipal': return <MapPin className="w-4 h-4" />;
      case 'private': return <Heart className="w-4 h-4" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'national': return 'bg-primary/10 text-primary border-primary/30';
      case 'municipal': return 'bg-secondary/10 text-secondary border-secondary/30';
      case 'private': return 'bg-warning/10 text-warning border-warning/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const renderBenefitCard = (benefit: BenefitFull) => {
    const isExpanded = expandedBenefit === benefit.id;
    const name = language === 'nl' ? (benefit.nameNl || benefit.name) : benefit.name;
    const description = language === 'nl' ? (benefit.shortDescriptionNl || benefit.shortDescription) : benefit.shortDescription;
    const eligibility = language === 'nl' ? (benefit.eligibilityPlainLanguageNl || benefit.eligibilityPlainLanguage) : benefit.eligibilityPlainLanguage;
    const documents = language === 'nl' ? (benefit.requiredDocumentsNl || benefit.requiredDocuments) : benefit.requiredDocuments;
    const howToApply = language === 'nl' ? (benefit.howToApplyNl || benefit.howToApply) : benefit.howToApply;
    const notes = language === 'nl' ? (benefit.notesNl || benefit.notes) : benefit.notes;

    return (
      <div 
        key={benefit.id}
        className="bg-card rounded-2xl border-2 border-dashed border-border overflow-hidden transition-all duration-300 hover:border-primary/30"
      >
        {/* Header */}
        <button
          onClick={() => setExpandedBenefit(isExpanded ? null : benefit.id)}
          className="w-full p-5 text-left"
        >
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-2">
              {/* Category badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(benefit.category)}`}>
                {getCategoryIcon(benefit.category)}
                {benefit.category === 'national' ? t.national : benefit.category === 'municipal' ? benefit.municipality : t.private}
              </span>
              
              {/* Single parent highlight */}
              {benefit.id === 'alo_kop' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/30">
                  💪 {t.forYou}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                {t.administrator}: {benefit.administrator}
              </p>
            </div>
            
            <div className="shrink-0">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-5 pb-5 pt-0 border-t border-dashed border-border animate-fade-in">
            <div className="grid gap-6 mt-5">
              {/* Eligibility */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  {t.eligibility}
                </h4>
                {Array.isArray(eligibility) ? (
                  <ul className="space-y-2">
                    {eligibility.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{eligibility}</p>
                )}
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-warning" />
                  {t.documents}
                </h4>
                <ul className="space-y-2">
                  {documents.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-warning mt-1">📄</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to Apply */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-secondary" />
                  {t.howToApply}
                </h4>
                <ol className="space-y-2">
                  {howToApply.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Notes */}
              {notes && notes.length > 0 && (
                <div className="bg-muted/30 rounded-xl p-4">
                  <h4 className="font-semibold text-sm text-foreground mb-2">💡 {t.notes}</h4>
                  <ul className="space-y-1">
                    {notes.map((note, i) => (
                      <li key={i} className="text-sm text-muted-foreground italic">{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => window.open(benefit.officialWebsite, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t.visitWebsite}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingDoodles />
      
      {/* Header */}
      <div className="relative z-10 px-6 py-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">{t.subtitle}</p>
      </div>

      {/* Filters */}
      <div className="relative z-10 px-6 pb-6 max-w-3xl mx-auto">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-2 border-dashed rounded-xl"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(['all', 'national', 'municipal', 'private'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 border-dashed ${
                categoryFilter === category
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/30'
              }`}
            >
              {category === 'all' ? t.all : category === 'national' ? t.national : category === 'municipal' ? t.municipal : t.private}
            </button>
          ))}
        </div>

        {/* Municipality filter (only show when municipal is selected) */}
        {categoryFilter === 'municipal' && (
          <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
            <span className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
              <Filter className="w-4 h-4" />
              {t.municipality}:
            </span>
            <button
              onClick={() => setMunicipalityFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                municipalityFilter === 'all'
                  ? 'bg-secondary text-secondary-foreground border-secondary'
                  : 'bg-card text-muted-foreground border-border hover:border-secondary/30'
              }`}
            >
              {t.all}
            </button>
            {municipalities.map((muni) => (
              <button
                key={muni}
                onClick={() => setMunicipalityFilter(muni)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  municipalityFilter === muni
                    ? 'bg-secondary text-secondary-foreground border-secondary'
                    : 'bg-card text-muted-foreground border-border hover:border-secondary/30'
                }`}
              >
                {muni}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filteredBenefits.length} {t.results}
        </p>
      </div>

      {/* Benefits list */}
      <div className="relative z-10 px-6 pb-24 max-w-3xl mx-auto">
        {filteredBenefits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.noResults}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBenefits.map(renderBenefitCard)}
          </div>
        )}
      </div>
    </div>
  );
}
