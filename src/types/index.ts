export interface ParentProfile {
  id: string;
  name?: string;
  municipality?: string;
  numberOfChildren: number;
  childrenAges: number[];
  monthlyIncome?: number;
  housingType?: 'rent' | 'own' | 'social';
  employmentStatus?: 'employed' | 'part-time' | 'unemployed' | 'self-employed' | 'student';
  hasChildcareNeeds: boolean;
  healthInsurance: boolean;
  receivingBenefits: string[];
  concerns: string[];
  rawConversation: string;
}

export interface Benefit {
  id: string;
  name: string;
  nameNl: string;
  description: string;
  category: 'national' | 'municipal' | 'private';
  administrator: string;
  eligibilityCriteria: string[];
  applicationUrl?: string;
  estimatedAmount?: string;
  icon: string;
}

export interface BenefitMatch {
  benefit: Benefit;
  matchScore: number;
  matchReasons: string[];
  missingInfo: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  benefitId?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    extractedInfo?: Partial<ParentProfile>;
    suggestedBenefits?: BenefitMatch[];
    suggestedTasks?: Task[];
  };
}

export interface ConversationState {
  messages: ChatMessage[];
  profile: Partial<ParentProfile>;
  benefitMatches: BenefitMatch[];
  tasks: Task[];
  currentView: 'chat' | 'benefits' | 'tasks' | 'profile';
}
