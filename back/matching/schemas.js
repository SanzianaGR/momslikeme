/**
 * @fileoverview Schema definitions for Hulpwijzer benefit matching system
 * All schemas use JSDoc for type safety and documentation
 */

/**
 * @typedef {Object} PersonalInfo
 * @property {number} age - User's age
 * @property {string} municipality - Municipality name (e.g., "Den Haag")
 * @property {boolean} hasPartner - Has a partner
 * @property {boolean} [partnerLivesAtSameAddress] - Partner lives at same address
 * @property {'single'|'single_parent'|'couple'|'couple_with_children'} householdType - Type of household
 */

/**
 * @typedef {Object} ChildrenInfo
 * @property {boolean} hasChildren - Has children
 * @property {number} [numberOfChildren] - Number of children
 * @property {number[]} [childrenAges] - Ages of all children
 * @property {boolean} [childrenLiveWithUser] - Children live with user
 * @property {boolean} [coParenting] - Co-parenting arrangement
 * @property {boolean} [childrenRegisteredBRP] - Children registered in BRP
 * @property {boolean} [childrenWithDisabilities] - Any children with disabilities
 */

/**
 * @typedef {Object} HousingInfo
 * @property {'renting'|'owning'|'living_with_family'|'other'} situation - Housing situation
 * @property {number} [monthlyRent] - Total monthly rent
 * @property {number} [rentBaseOnly] - Base rent only (kale huur)
 * @property {number} [rentServiceCosts] - Service costs
 * @property {boolean} [socialHousing] - Is social housing
 * @property {boolean} [hasRentalContract] - Has rental contract
 * @property {boolean} [registeredAtAddress] - Registered at this address
 */

/**
 * @typedef {Object} FinancialInfo
 * @property {number} [monthlyIncomeGross] - Monthly gross income
 * @property {number} [annualIncomeGross] - Annual gross income
 * @property {string[]} [incomeSource] - Sources of income
 * @property {number} [partnerIncome] - Partner's income
 * @property {number} [combinedIncome] - Combined household income
 * @property {number} [assets] - Total assets/savings
 * @property {boolean} [receivingBijstand] - Receiving social assistance
 */

/**
 * @typedef {Object} WorkEducationInfo
 * @property {boolean} [employed] - Currently employed
 * @property {number} [hoursPerWeek] - Working hours per week
 * @property {boolean} [selfEmployed] - Self-employed
 * @property {boolean} [studying] - Currently studying
 * @property {boolean} [inReintegration] - In reintegration program
 */

/**
 * @typedef {Object} HealthInfo
 * @property {boolean} hasHealthInsurance - Has health insurance
 * @property {string} [healthInsuranceCompany] - Insurance company name
 * @property {boolean} [needsChildcare] - Needs childcare
 * @property {number} [childcareHoursPerWeek] - Hours of childcare per week
 * @property {'daycare'|'afterschool'|'childminder'} [childcareType] - Type of childcare
 * @property {boolean} [childcareRegistered] - Childcare is registered
 */

/**
 * @typedef {Object} SpecialInfo
 * @property {boolean} [hasUnexpectedCosts] - Has unexpected costs
 * @property {string[]} [unexpectedCostType] - Types of unexpected costs
 * @property {number} [unexpectedCostAmount] - Amount of unexpected costs
 * @property {boolean} [hasDebts] - Has debts
 * @property {boolean} [recentlyMovedToNL] - Recently moved to Netherlands
 */

/**
 * @typedef {Object} UserProfile
 * @property {PersonalInfo} personal
 * @property {ChildrenInfo} children
 * @property {HousingInfo} housing
 * @property {FinancialInfo} financial
 * @property {WorkEducationInfo} workEducation
 * @property {HealthInfo} health
 * @property {SpecialInfo} special
 */

/**
 * @typedef {Object} BenefitInfo
 * @property {string} nameNL - Benefit name in Dutch
 * @property {string} nameEN - Benefit name in English
 * @property {string} provider - Provider organization
 * @property {string} category - Category (e.g., 'national', 'municipal', 'private')
 * @property {string} subcategory - Subcategory (e.g., 'children', 'housing')
 * @property {string} descriptionNL - Description in Dutch
 * @property {string} descriptionEN - Description in English
 */

/**
 * @typedef {Object} PaymentInfo
 * @typedef {Object} PaymentInfo
 * @property {'monthly'|'quarterly'|'yearly'|'one_time'} frequency
 * @property {string} amountDescription - Description of amount
 */

/**
 * @typedef {Object} EligibilityRequirements
 * @property {number} [ageMin] - Minimum age
 * @property {number} [ageMax] - Maximum age
 * @property {boolean} [requiresChildren] - Children required
 * @property {number} [childrenAgeMin] - Minimum child age
 * @property {number} [childrenAgeMax] - Maximum child age
 * @property {boolean} [singleParentOnly] - Single parent only
 * @property {'single'|'cohabiting'|'any'} [familyStatus] - Family situation requirement
 * @property {string[]} [housingType] - Required housing types
 * @property {number} [rentMin] - Minimum rent
 * @property {number} [rentMax] - Maximum rent
 * @property {number} [incomeMax] - Maximum income
 * @property {'gross'|'combined'|'none'} [incomeTestType] - Type of income test
 * @property {number} [assetsMax] - Maximum assets
 * @property {boolean} [mustBeEmployed] - Must be employed
 * @property {boolean} [mustBeStudying] - Must be studying
 * @property {boolean} [employedOrStudying] - Employed OR studying
 * @property {number} [minimumWorkHours] - Minimum work hours
 * @property {boolean} [requiresChildcare] - Childcare required
 * @property {string[]} [mustReceiveOtherBenefit] - Must receive other benefits
 * @property {string[]} [registrationRequired] - Required registrations
 * @property {'citizen'|'resident'|'any'} [residencyStatus] - Residency requirement
 * @property {'single'|'cohabiting'|'any'} [familyStatus] - Family situation requirement
 * @property {string[]} [otherRequirements] - Requirements that don't fit other fields
 * @property {Object} [logic] - JSON Logic object for hard rules
 * @property {string[]} [soft_rules] - Text rules for LLM evaluation
 * @property {{pass: UserProfile[], fail: UserProfile[]}} [test_cases] - Generated verification data
 */

/**
 * @typedef {Object} ApplicationInfo
 * @property {string} applicationURL - URL for application
 * @property {string[]} applicationMethod - Methods (e.g., 'online', 'phone')
 * @property {boolean} requiresDiGiD - Requires DiGiD
 * @property {string[]} requiredDocuments - Required documents
 * @property {'ongoing'|'annual'|'specific_date'|'before_event'} deadlineType
 * @property {string} [deadlineDate] - Specific deadline date
 * @property {string} deadlineDescription - Description of deadline
 */

/**
 * @typedef {Object} WarningsInfo
 * @property {boolean} [toeslagenaffaireRelated] - Related to scandal
 * @property {boolean} [yearEndSettlement] - Has year-end settlement risk
 * @property {boolean} [reportChangesRequired] - Must report changes
 * @property {string[]} [importantNotes] - Important notes
 */

/**
 * @typedef {Object} ContactInfo
 * @property {string} [phoneNumber] - Contact phone
 * @property {string} websiteNL - Dutch website
 * @property {string} [websiteEN] - English website
 */

/**
 * @typedef {Object} Benefit
 * @property {string} benefitId - Unique identifier
 * @property {BenefitInfo} info
 * @property {PaymentInfo} payment
 * @property {EligibilityRequirements} eligibility
 * @property {ApplicationInfo} application
 * @property {WarningsInfo} warnings
 * @property {ContactInfo} contact
 * @property {{url: string, hash: string, scraped_at: string}} [source] - Provenance data
 */

/**
 * @typedef {Object} Requirement
 * @property {string} text - Requirement description
 * @property {'met'|'not_met'|'unknown'} status - Status
 * @property {string} [reasoning] - Why met/not met
 */

/**
 * @typedef {Object} AmountEstimate
 * @property {number} min - Minimum amount
 * @property {number} max - Maximum amount
 * @property {number} mostLikely - Most likely amount
 * @property {string} frequency - Payment frequency
 * @property {string} explanation - Explanation
 */

/**
 * @typedef {Object} MatchAnalysis
 * @property {string} benefitId - Benefit identifier
 * @property {string} benefitName - Benefit name
 * @property {number} matchScore - Score 0-100
 * @property {Requirement[]} hardRequirements - Hard requirements
 * @property {Requirement[]} softRequirements - Soft requirements
 * @property {AmountEstimate} [estimatedAmount] - Estimated amount
 * @property {string[]} positiveFactors - Positive factors
 * @property {string[]} uncertainFactors - Uncertain factors
 * @property {string[]} missingInfo - Missing information
 * @property {'high'|'medium'|'low'} priority - Priority level
 * @property {'urgent'|'soon'|'flexible'} urgency - Urgency level
 */

/**
 * @typedef {Object} HardCheckResult
 * @property {boolean} passes - All checks passed
 * @property {Array<{requirement: string, passes: boolean, reason: string}>} checks
 * @property {string[]} failedReasons - Reasons for failures
 */

export default {};
