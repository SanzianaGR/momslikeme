import { ParentProfile, Benefit, BenefitMatch } from '@/types';
import { benefits } from '@/data/benefits';

/**
 * Simple two-tower matching simulation
 * In production, this would use embeddings and vector similarity
 * For now, we use rule-based matching with scoring
 */

interface MatchingSignal {
  signal: string;
  weight: number;
  applies: (profile: Partial<ParentProfile>, benefit: Benefit) => boolean;
  reason: string;
}

const matchingSignals: MatchingSignal[] = [
  {
    signal: 'has_children',
    weight: 0.3,
    applies: (profile) => (profile.numberOfChildren ?? 0) > 0,
    reason: 'You have children in your household'
  },
  {
    signal: 'low_income',
    weight: 0.25,
    applies: (profile) => {
      if (!profile.monthlyIncome) return false;
      const income = typeof profile.monthlyIncome === 'string' 
        ? (profile.monthlyIncome === 'low' ? 1000 : profile.monthlyIncome === 'medium' ? 2000 : 4000)
        : profile.monthlyIncome;
      return income < 2300;
    },
    reason: 'Based on your income level'
  },
  {
    signal: 'single_parent',
    weight: 0.2,
    applies: (profile, benefit) => {
      // ALO-kop is specifically for single parents
      if (benefit.id === 'alo-kop') return true;
      return false;
    },
    reason: 'As a single parent, you qualify for extra support'
  },
  {
    signal: 'childcare_needs',
    weight: 0.2,
    applies: (profile, benefit) => {
      if (benefit.id === 'kinderopvangtoeslag') {
        return profile.hasChildcareNeeds === true;
      }
      return false;
    },
    reason: 'You indicated childcare needs'
  },
  {
    signal: 'renting',
    weight: 0.15,
    applies: (profile, benefit) => {
      if (benefit.id === 'huurtoeslag') {
        return profile.housingType === 'rent' || profile.housingType === 'social';
      }
      return false;
    },
    reason: 'You are renting your home'
  },
  {
    signal: 'health_insurance',
    weight: 0.15,
    applies: (profile, benefit) => {
      if (benefit.id === 'zorgtoeslag') {
        return profile.healthInsurance === true;
      }
      return false;
    },
    reason: 'You have Dutch health insurance'
  },
  {
    signal: 'young_children',
    weight: 0.1,
    applies: (profile) => {
      const ages = profile.childrenAges;
      if (!ages) return false;
      if (typeof ages === 'string') {
        return ages === 'young' || ages === 'mixed';
      }
      return ages.some(age => age < 13);
    },
    reason: 'You have young children'
  },
  {
    signal: 'school_age',
    weight: 0.1,
    applies: (profile, benefit) => {
      const ages = profile.childrenAges;
      if (!ages) return false;
      let hasSchoolAge = false;
      if (typeof ages === 'string') {
        hasSchoolAge = ages === 'school' || ages === 'teen' || ages === 'mixed';
      } else {
        hasSchoolAge = ages.some(age => age >= 4 && age <= 18);
      }
      return hasSchoolAge && ['stichting-leergeld', 'jeugdfonds', 'sam-kinderen'].includes(benefit.id);
    },
    reason: 'You have school-age children'
  }
];

export function calculateBenefitMatches(profile: Partial<ParentProfile>): BenefitMatch[] {
  const matches: BenefitMatch[] = [];

  for (const benefit of benefits) {
    let totalScore = 0;
    const matchReasons: string[] = [];
    const missingInfo: string[] = [];

    // Check each matching signal
    for (const signal of matchingSignals) {
      if (signal.applies(profile, benefit)) {
        totalScore += signal.weight;
        matchReasons.push(signal.reason);
      }
    }

    // Add base score for having children (most benefits require this)
    if ((profile.numberOfChildren ?? 0) > 0) {
      totalScore += 0.1;
    }

    // Check for missing info that would improve matching
    if (profile.monthlyIncome === undefined) {
      missingInfo.push('Monthly income');
    }
    if (profile.municipality === undefined) {
      missingInfo.push('Municipality');
    }
    if (profile.housingType === undefined) {
      missingInfo.push('Housing situation');
    }

    // Normalize score to 0-1 range
    const normalizedScore = Math.min(1, totalScore);

    // Only include if there's some relevance
    if (normalizedScore > 0.1) {
      matches.push({
        benefit,
        matchScore: normalizedScore,
        matchReasons: [...new Set(matchReasons)],
        missingInfo
      });
    }
  }

  // Sort by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

export function parseProfileFromConversation(conversation: string): Partial<ParentProfile> {
  const profile: Partial<ParentProfile> = {
    rawConversation: conversation
  };

  const lowerConvo = conversation.toLowerCase();

  // Extract number of children
  const childrenMatch = lowerConvo.match(/(\d+)\s*(children|kids|child|kinderen|kind)/);
  if (childrenMatch) {
    profile.numberOfChildren = parseInt(childrenMatch[1]);
  }

  // Extract ages
  const ageMatches = lowerConvo.matchAll(/(\d+)\s*(years?\s*old|jaar|maanden?)/g);
  const ages: number[] = [];
  for (const match of ageMatches) {
    const age = parseInt(match[1]);
    if (age < 25) ages.push(age); // Reasonable child age
  }
  if (ages.length > 0) {
    profile.childrenAges = ages;
    profile.numberOfChildren = profile.numberOfChildren || ages.length;
  }

  // Extract income mentions
  const incomeMatch = lowerConvo.match(/€?\s*(\d{3,4})\s*(per month|monthly|maand)/);
  if (incomeMatch) {
    profile.monthlyIncome = parseInt(incomeMatch[1]);
  }

  // Check for housing type
  if (lowerConvo.includes('rent') || lowerConvo.includes('huur')) {
    profile.housingType = 'rent';
  } else if (lowerConvo.includes('social housing') || lowerConvo.includes('sociale')) {
    profile.housingType = 'social';
  } else if (lowerConvo.includes('own') || lowerConvo.includes('koop')) {
    profile.housingType = 'own';
  }

  // Check for childcare needs
  if (lowerConvo.includes('childcare') || lowerConvo.includes('opvang') || lowerConvo.includes('daycare')) {
    profile.hasChildcareNeeds = true;
  }

  // Employment status
  if (lowerConvo.includes('part-time') || lowerConvo.includes('parttime')) {
    profile.employmentStatus = 'part-time';
  } else if (lowerConvo.includes('work') || lowerConvo.includes('job') || lowerConvo.includes('employed')) {
    profile.employmentStatus = 'employed';
  } else if (lowerConvo.includes('unemployed') || lowerConvo.includes('looking for work')) {
    profile.employmentStatus = 'unemployed';
  }

  // Always assume health insurance in NL
  profile.healthInsurance = true;

  return profile;
}
