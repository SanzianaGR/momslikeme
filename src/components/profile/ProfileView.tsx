import { ParentProfile } from '@/types';
import { User, MapPin, Users, Euro, Home, Briefcase, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileViewProps {
  profile: Partial<ParentProfile>;
}

export function ProfileView({ profile }: ProfileViewProps) {
  const hasData = Object.keys(profile).some(
    key => key !== 'rawConversation' && profile[key as keyof ParentProfile] !== undefined
  );

  const profileItems = [
    {
      icon: Users,
      label: 'Children',
      value: profile.numberOfChildren
        ? `${profile.numberOfChildren} child${profile.numberOfChildren > 1 ? 'ren' : ''}`
        : undefined,
      color: 'text-primary',
    },
    {
      icon: Users,
      label: 'Ages',
      value: profile.childrenAges
        ? (typeof profile.childrenAges === 'string' 
            ? profile.childrenAges 
            : profile.childrenAges.map(a => `${a} years`).join(', '))
        : undefined,
      color: 'text-primary',
    },
    {
      icon: MapPin,
      label: 'Municipality',
      value: profile.municipality,
      color: 'text-secondary',
    },
    {
      icon: Euro,
      label: 'Monthly Income',
      value: profile.monthlyIncome ? `€${profile.monthlyIncome}` : undefined,
      color: 'text-warning',
    },
    {
      icon: Home,
      label: 'Housing',
      value: profile.housingType
        ? {
            rent: 'Renting',
            social: 'Social Housing',
            own: 'Own Home',
          }[profile.housingType]
        : undefined,
      color: 'text-accent',
    },
    {
      icon: Briefcase,
      label: 'Employment',
      value: profile.employmentStatus
        ? {
            employed: 'Employed',
            'part-time': 'Part-time',
            unemployed: 'Unemployed',
            'self-employed': 'Self-employed',
            student: 'Student',
          }[profile.employmentStatus]
        : undefined,
      color: 'text-info',
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="shrink-0 px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Your Profile</h1>
            <p className="text-sm text-muted-foreground">
              Built from our conversation
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-float">
              <User className="h-12 w-12 text-primary/40" />
            </div>
            <h2 className="text-xl font-bold mb-2">Tell me about yourself</h2>
            <p className="text-muted-foreground max-w-sm">
              As we chat, I'll build your profile here to find the best benefits for you. Everything stays private.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="bg-muted/50">Number of children</Badge>
              <Badge variant="outline" className="bg-muted/50">Your municipality</Badge>
              <Badge variant="outline" className="bg-muted/50">Income level</Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Avatar */}
            <div className="flex flex-col items-center pb-6 border-b border-border/50">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3">
                <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              </div>
              <h2 className="font-bold text-lg">
                {profile.name || 'Single Parent'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Building your benefits profile
              </p>
            </div>

            {/* Profile Items */}
            <div className="space-y-3">
              {profileItems.map((item) => {
                if (!item.value) return null;
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-soft"
                  >
                    <div className={`p-2 rounded-lg bg-muted/50 ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-semibold">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Privacy Notice */}
            <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-sm text-muted-foreground text-center">
                🔒 Your information is private and stored only in your browser. We never share your data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
