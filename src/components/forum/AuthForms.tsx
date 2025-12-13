import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Heart } from 'lucide-react';

interface AuthFormsProps {
  language: 'en' | 'nl';
  onSuccess: () => void;
  onCancel: () => void;
}

export function AuthForms({ language, onSuccess, onCancel }: AuthFormsProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    signupTitle: language === 'en' ? 'Join our community! 🌸' : 'Word lid van onze community! 🌸',
    signupSubtitle: language === 'en' ? 'Create an account to share and connect.' : 'Maak een account om te delen en contact te leggen.',
    loginTitle: language === 'en' ? 'Welcome back! 🌻' : 'Welkom terug! 🌻',
    loginSubtitle: language === 'en' ? 'Sign in to continue.' : 'Log in om verder te gaan.',
    name: language === 'en' ? 'Display name' : 'Weergavenaam',
    namePlaceholder: language === 'en' ? 'How should we call you?' : 'Hoe mogen we je noemen?',
    email: 'Email',
    emailPlaceholder: language === 'en' ? 'your.email@example.com' : 'jouw.email@voorbeeld.nl',
    password: language === 'en' ? 'Password' : 'Wachtwoord',
    passwordPlaceholder: language === 'en' ? 'Create a secure password' : 'Maak een veilig wachtwoord',
    loginPasswordPlaceholder: language === 'en' ? 'Your password' : 'Je wachtwoord',
    terms: language === 'en' ? 'I agree to the Terms & Privacy Policy' : 'Ik ga akkoord met de Voorwaarden & Privacy',
    signupButton: language === 'en' ? 'Create my account' : 'Maak mijn account',
    loginButton: language === 'en' ? 'Sign In' : 'Inloggen',
    or: language === 'en' ? 'or' : 'of',
    google: language === 'en' ? 'Continue with Google' : 'Doorgaan met Google',
    hasAccount: language === 'en' ? 'Already have an account?' : 'Heb je al een account?',
    noAccount: language === 'en' ? "Don't have an account?" : 'Nog geen account?',
    switchToLogin: language === 'en' ? 'Sign in' : 'Inloggen',
    switchToSignup: language === 'en' ? 'Sign up free' : 'Gratis aanmelden',
    cancel: language === 'en' ? 'Maybe later' : 'Misschien later',
    weak: language === 'en' ? 'Weak' : 'Zwak',
    good: language === 'en' ? 'Good' : 'Goed',
    strong: language === 'en' ? 'Strong' : 'Sterk',
    strength: language === 'en' ? 'Password strength' : 'Wachtwoordsterkte',
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '', width: '0%' };
    if (password.length < 6) return { label: t.weak, color: 'bg-destructive', width: '33%' };
    if (password.length < 10) return { label: t.good, color: 'bg-accent', width: '66%' };
    return { label: t.strong, color: 'bg-primary', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth - frontend only
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-xl border-2 border-border/50 p-6 max-w-md w-full relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

        {/* Decorative flower */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-bounce-gentle">
              <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {mode === 'signup' ? t.signupTitle : t.loginTitle}
          </h2>
          <p className="text-muted-foreground text-sm">
            {mode === 'signup' ? t.signupSubtitle : t.loginSubtitle}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-foreground font-medium flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-primary" />
                {t.name}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl border-2 border-border/60 focus:border-primary bg-background/50"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="auth-email" className="text-foreground font-medium flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-primary" />
              {t.email}
            </Label>
            <Input
              id="auth-email"
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border-2 border-border/60 focus:border-primary bg-background/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth-password" className="text-foreground font-medium flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-primary" />
              {t.password}
            </Label>
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'signup' ? t.passwordPlaceholder : t.loginPasswordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border-2 border-border/60 focus:border-primary bg-background/50 pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* Password strength */}
            {mode === 'signup' && password.length > 0 && (
              <div className="space-y-1">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                </div>
                <p className="text-xs text-muted-foreground">{t.strength}: <span className="font-medium">{strength.label}</span></p>
              </div>
            )}
          </div>

          {mode === 'signup' && (
            <div className="flex items-start gap-2 pt-1">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                className="mt-0.5 border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                {t.terms}
              </Label>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || (mode === 'signup' && !agreeTerms)}
            className="w-full h-11 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {mode === 'signup' ? 'Creating...' : 'Signing in...'}
              </span>
            ) : mode === 'signup' ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t.signupButton}
              </span>
            ) : (
              t.loginButton
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs">{t.or}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 rounded-xl border-2 border-border/60 hover:bg-muted/50 font-medium"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t.google}
        </Button>

        {/* Switch mode */}
        <p className="text-center mt-5 text-muted-foreground text-sm">
          {mode === 'signup' ? t.hasAccount : t.noAccount}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            {mode === 'signup' ? t.switchToLogin : t.switchToSignup}
          </button>
        </p>

        {/* Cancel */}
        <Button
          type="button"
          variant="ghost"
          className="w-full mt-3 text-muted-foreground"
          onClick={onCancel}
        >
          {t.cancel}
        </Button>
      </div>
    </div>
  );
}
