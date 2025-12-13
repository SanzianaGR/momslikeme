import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CloudDoodle, HeartDoodle, StarDoodle, SunDoodle } from '@/components/chat/HandDrawnElements';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Heart, Shield, Users } from 'lucide-react';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup - frontend only
    setTimeout(() => {
      setIsLoading(false);
      // Would navigate to app
    }, 1500);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-destructive', width: '33%' };
    if (password.length < 10) return { label: 'Good', color: 'bg-accent', width: '66%' };
    return { label: 'Strong', color: 'bg-primary', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <CloudDoodle className="absolute top-10 right-10 w-24 h-16 text-secondary/20 animate-float" />
      <StarDoodle className="absolute top-32 left-16 w-8 h-8 text-accent/30 animate-twinkle" />
      <HeartDoodle className="absolute bottom-32 right-24 w-10 h-10 text-primary/20 animate-pulse-slow" />
      <SunDoodle className="absolute bottom-10 left-10 w-16 text-accent/15 animate-spin-slow" />
      <StarDoodle className="absolute top-1/2 right-1/4 w-6 h-6 text-secondary/25 animate-twinkle" style={{ animationDelay: '1s' }} />
      <CloudDoodle className="absolute top-1/4 left-1/3 w-16 h-10 text-primary/10 animate-float" style={{ animationDelay: '3s' }} />

      {/* Decorative circles */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      {/* Signup Card */}
      <div className="w-full max-w-md relative animate-scale-in">
        <div className="bg-card rounded-3xl shadow-xl border-2 border-border/50 p-8 relative overflow-hidden">
          {/* Card decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-primary to-secondary" />
          
          {/* Logo/Mascot */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center animate-bounce-gentle">
                <Heart className="w-10 h-10 text-accent" fill="currentColor" />
              </div>
              <StarDoodle className="absolute -left-2 -top-2 w-6 h-6 text-primary animate-twinkle" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Join our community! 🌸
            </h1>
            <p className="text-muted-foreground">
              Create your account and discover benefits you deserve.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Anonymous</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-4 h-4 text-secondary" />
              <span>500k+ moms</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Display name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="How should we call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl border-2 border-border/60 focus:border-primary bg-background/50 text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-2 border-border/60 focus:border-primary bg-background/50 text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-2 border-border/60 focus:border-primary bg-background/50 pr-12 text-foreground placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: <span className="font-medium">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                className="mt-0.5 border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full h-12 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create my account
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-sm">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-border/60 hover:bg-muted/50 text-foreground font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Sign in link */}
          <p className="text-center mt-8 text-muted-foreground">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
