import { Benefit } from '@/types';

export const benefits: Benefit[] = [
  // National Schemes (Toeslagen)
  {
    id: 'kinderbijslag',
    name: 'Child Benefit',
    nameNl: 'Kinderbijslag',
    description: 'Quarterly payment to help cover the cost of raising children. Available to all parents with children under 18.',
    category: 'national',
    administrator: 'SVB (Sociale Verzekeringsbank)',
    eligibilityCriteria: [
      'Have children under 18 years old',
      'Child lives in the Netherlands',
      'You are the caretaker of the child'
    ],
    estimatedAmount: '€269-€323 per child per quarter',
    icon: '👶'
  },
  {
    id: 'kindgebonden-budget',
    name: 'Child-related Budget',
    nameNl: 'Kindgebonden budget',
    description: 'Additional support for families with lower incomes to help cover child-raising costs.',
    category: 'national',
    administrator: 'Belastingdienst',
    eligibilityCriteria: [
      'Have children under 18',
      'Income below threshold',
      'Receive Kinderbijslag'
    ],
    estimatedAmount: 'Up to €3,848 per year depending on income',
    icon: '💰'
  },
  {
    id: 'kinderopvangtoeslag',
    name: 'Childcare Benefit',
    nameNl: 'Kinderopvangtoeslag',
    description: 'Help paying for registered childcare so you can work or study.',
    category: 'national',
    administrator: 'Belastingdienst',
    eligibilityCriteria: [
      'Both parents work or study',
      'Use registered childcare',
      'Child is under 13',
      'Income below threshold'
    ],
    estimatedAmount: 'Up to 96% of childcare costs',
    icon: '🏫'
  },
  {
    id: 'zorgtoeslag',
    name: 'Healthcare Allowance',
    nameNl: 'Zorgtoeslag',
    description: 'Help with paying your health insurance premium.',
    category: 'national',
    administrator: 'Belastingdienst',
    eligibilityCriteria: [
      'Have Dutch health insurance',
      'Income below threshold',
      'Age 18 or older'
    ],
    estimatedAmount: 'Up to €154 per month',
    icon: '🏥'
  },
  {
    id: 'huurtoeslag',
    name: 'Rent Benefit',
    nameNl: 'Huurtoeslag',
    description: 'Financial support to help pay your rent if you have a lower income.',
    category: 'national',
    administrator: 'Belastingdienst',
    eligibilityCriteria: [
      'Rent social housing',
      'Rent below €879 per month',
      'Income below threshold',
      'Age 18 or older'
    ],
    estimatedAmount: 'Varies based on rent and income',
    icon: '🏠'
  },
  {
    id: 'alo-kop',
    name: 'Single Parent Supplement',
    nameNl: 'ALO-kop (Alleenstaande ouder kop)',
    description: 'Extra financial support specifically for single parents with lower incomes.',
    category: 'national',
    administrator: 'Belastingdienst',
    eligibilityCriteria: [
      'Single parent',
      'Children under 18',
      'Qualify for Kindgebonden budget'
    ],
    estimatedAmount: 'Up to €3,531 per year',
    icon: '💪'
  },

  // Municipal Schemes
  {
    id: 'bijzondere-bijstand',
    name: 'Special Assistance',
    nameNl: 'Bijzondere bijstand',
    description: 'Help for unexpected necessary costs you cannot pay from your regular income.',
    category: 'municipal',
    administrator: 'Your municipality',
    eligibilityCriteria: [
      'Low income',
      'Unexpected necessary costs',
      'Cannot pay from regular income/savings'
    ],
    estimatedAmount: 'Varies per situation',
    icon: '🆘'
  },
  {
    id: 'kwijtschelding',
    name: 'Municipal Tax Remission',
    nameNl: 'Kwijtschelding gemeentelijke belastingen',
    description: 'You may not have to pay municipal taxes if your income is too low.',
    category: 'municipal',
    administrator: 'Your municipality',
    eligibilityCriteria: [
      'Low income (usually below 100-120% of social minimum)',
      'Limited savings'
    ],
    estimatedAmount: 'Full or partial remission of municipal taxes',
    icon: '📋'
  },
  {
    id: 'stadspas',
    name: 'City Pass',
    nameNl: 'Stadspas / Minimapas',
    description: 'Discounts on sports, culture, and other activities for your family.',
    category: 'municipal',
    administrator: 'Your municipality',
    eligibilityCriteria: [
      'Low income',
      'Live in participating municipality'
    ],
    estimatedAmount: 'Various discounts on activities',
    icon: '🎟️'
  },

  // Private Funds
  {
    id: 'stichting-leergeld',
    name: 'Leergeld Foundation',
    nameNl: 'Stichting Leergeld',
    description: 'Help with school costs, sports fees, laptops, and other education-related expenses for children.',
    category: 'private',
    administrator: 'Stichting Leergeld',
    eligibilityCriteria: [
      'Low income family',
      'Children aged 4-18',
      'Education-related need'
    ],
    applicationUrl: 'https://leergeld.nl',
    estimatedAmount: 'Varies per need',
    icon: '📚'
  },
  {
    id: 'jarige-job',
    name: 'Birthday Boxes',
    nameNl: 'Stichting Jarige Job',
    description: 'Birthday boxes worth €35 so every child can celebrate their birthday.',
    category: 'private',
    administrator: 'Stichting Jarige Job',
    eligibilityCriteria: [
      'Low income family',
      'Child is having a birthday'
    ],
    applicationUrl: 'https://jarigejob.nl',
    estimatedAmount: 'Birthday box worth €35',
    icon: '🎂'
  },
  {
    id: 'jeugdfonds',
    name: 'Youth Sports & Culture Fund',
    nameNl: 'Jeugdfonds Sport & Cultuur',
    description: 'Pays for sports club memberships and cultural activities for children.',
    category: 'private',
    administrator: 'Jeugdfonds Sport & Cultuur',
    eligibilityCriteria: [
      'Low income family',
      'Children aged 4-18',
      'Want to participate in sports or culture'
    ],
    applicationUrl: 'https://jeugdfondssportencultuur.nl',
    estimatedAmount: 'Up to €450 per year per child',
    icon: '⚽'
  },
  {
    id: 'sam-kinderen',
    name: "Sam& for All Children",
    nameNl: 'Sam& voor alle kinderen',
    description: 'Single portal to apply for multiple children\'s funds at once (Leergeld, Jarige Job, Jeugdfonds).',
    category: 'private',
    administrator: 'Sam&',
    eligibilityCriteria: [
      'Low income family',
      'Children in household'
    ],
    applicationUrl: 'https://sfrkinderen.nl',
    estimatedAmount: 'Access to multiple funds',
    icon: '🤝'
  }
];

export const getBenefitById = (id: string): Benefit | undefined => {
  return benefits.find(b => b.id === id);
};

export const getBenefitsByCategory = (category: Benefit['category']): Benefit[] => {
  return benefits.filter(b => b.category === category);
};
