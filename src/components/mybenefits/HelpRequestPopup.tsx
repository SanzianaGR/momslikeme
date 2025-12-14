import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

interface HelpRequestPopupProps {
  open: boolean;
  onClose: () => void;
  language: 'en' | 'nl';
}

export function HelpRequestPopup({ open, onClose, language }: HelpRequestPopupProps) {
  const [formData, setFormData] = useState({
    contactMethod: 'phone' as 'phone' | 'email',
    phone: '',
    email: '',
    municipality: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const t = {
    title: language === 'nl' ? 'Hulp aanvragen' : 'Request Help',
    subtitle: language === 'nl' 
      ? 'Een gemeente medewerker neemt zo snel mogelijk contact met je op' 
      : 'A municipality worker will contact you as soon as possible',
    contactMethod: language === 'nl' ? 'Hoe wil je benaderd worden?' : 'How would you like to be contacted?',
    phone: language === 'nl' ? 'Telefoonnummer' : 'Phone number',
    email: language === 'nl' ? 'E-mailadres' : 'Email address',
    municipality: language === 'nl' ? 'Jouw gemeente' : 'Your municipality',
    municipalityPlaceholder: language === 'nl' ? 'bijv. Amsterdam, Rotterdam...' : 'e.g. Amsterdam, Rotterdam...',
    submit: language === 'nl' ? 'Verstuur aanvraag' : 'Send request',
    successTitle: language === 'nl' ? 'Aanvraag verzonden!' : 'Request sent!',
    successMessage: language === 'nl' 
      ? 'Je ontvangt zo snel mogelijk informatie van een gemeente medewerker.' 
      : 'You will receive information from a municipality worker as soon as possible.',
    close: language === 'nl' ? 'Sluiten' : 'Close',
    free: language === 'nl' ? 'Je verdient gratis ondersteuning' : 'You deserve support for free'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the request to a backend
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({ contactMethod: 'phone', phone: '', email: '', municipality: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-2 border-dashed border-border rounded-3xl">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">{t.title}</DialogTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">{t.subtitle}</p>
              <p className="text-sm text-primary font-medium text-center mt-1">{t.free}</p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Contact method toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.contactMethod}</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.contactMethod === 'phone' ? 'default' : 'outline'}
                    className={`flex-1 ${formData.contactMethod === 'phone' ? 'bg-primary' : 'border-2 border-dashed'}`}
                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: 'phone' }))}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {t.phone}
                  </Button>
                  <Button
                    type="button"
                    variant={formData.contactMethod === 'email' ? 'default' : 'outline'}
                    className={`flex-1 ${formData.contactMethod === 'email' ? 'bg-primary' : 'border-2 border-dashed'}`}
                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: 'email' }))}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {t.email}
                  </Button>
                </div>
              </div>

              {/* Phone or Email input */}
              {formData.contactMethod === 'phone' ? (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">{t.phone}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="06 12345678"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10 border-2 border-dashed rounded-xl"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">{t.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="jouw@email.nl"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 border-2 border-dashed rounded-xl"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Municipality */}
              <div className="space-y-2">
                <Label htmlFor="municipality" className="text-sm font-medium">{t.municipality}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="municipality"
                    type="text"
                    placeholder={t.municipalityPlaceholder}
                    value={formData.municipality}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                    className="pl-10 border-2 border-dashed rounded-xl"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-xl py-6">
                {t.submit}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t.successTitle}</h3>
            <p className="text-muted-foreground mb-6">{t.successMessage}</p>
            <Button onClick={handleClose} variant="outline" className="border-2 border-dashed">
              {t.close}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
