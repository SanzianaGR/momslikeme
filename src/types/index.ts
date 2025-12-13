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

export interface DocumentRequirement {
  id: string;
  name: string;
  nameNl: string;
  description: string;
  descriptionNl: string;
  required: boolean;
  uploaded: boolean;
}

export interface Benefit {
  id: string;
  name: string;
  nameNl: string;
  description: string;
  descriptionNl?: string;
  category: 'national' | 'municipal' | 'private';
  administrator: string;
  eligibilityCriteria: string[];
  eligibilityCriteriaNl?: string[];
  applicationUrl?: string;
  estimatedAmount?: string;
  estimatedAmountNl?: string;
  deadline?: string;
  documents?: DocumentRequirement[];
  icon: string;
}

export interface BenefitMatch {
  benefit: Benefit;
  matchScore: number;
  matchReasons: string[];
  matchReasonsNl?: string[];
  missingInfo: string[];
  missingInfoNl?: string[];
}

export interface TaskStep {
  id: string;
  title: string;
  titleNl: string;
  completed: boolean;
  description?: string;
  descriptionNl?: string;
}

export interface Task {
  id: string;
  title: string;
  titleNl?: string;
  description?: string;
  descriptionNl?: string;
  benefitId?: string;
  benefit?: Benefit;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  steps?: TaskStep[];
  documents?: DocumentRequirement[];
  estimatedAmount?: string;
  applicationUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contentNl?: string;
  timestamp: string;
  hasRecommendations?: boolean;
  metadata?: {
    extractedInfo?: Partial<ParentProfile>;
    suggestedBenefits?: BenefitMatch[];
    suggestedTasks?: Task[];
  };
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: 'benefits' | 'tips' | 'support' | 'questions' | 'success';
  upvotes: number;
  upvotedBy: string[];
  replies: ForumReply[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  upvotes: number;
  upvotedBy: string[];
  createdAt: string;
}

export interface ConversationState {
  messages: ChatMessage[];
  profile: Partial<ParentProfile>;
  benefitMatches: BenefitMatch[];
  tasks: Task[];
  currentView: 'chat' | 'benefits' | 'tasks' | 'forum';
}
