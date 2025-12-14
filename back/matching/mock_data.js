/**
 * @fileoverview Mock data for testing
 */

/**
 * Sample user profile - Single mother in Den Haag
 */
export const sampleUser = {
  personal: {
    age: 32,
    municipality: "Den Haag",
    hasPartner: false,
    householdType: "single_parent",
  },
  children: {
    hasChildren: true,
    numberOfChildren: 2,
    childrenAges: [5, 8],
    childrenLiveWithUser: true,
    coParenting: false,
    childrenRegisteredBRP: true,
    childrenWithDisabilities: false,
  },
  housing: {
    situation: "renting",
    monthlyRent: 650,
    rentBaseOnly: 550,
    rentServiceCosts: 100,
    socialHousing: false,
    hasRentalContract: true,
    registeredAtAddress: true,
  },
  financial: {
    monthlyIncomeGross: 2333,
    annualIncomeGross: 28000,
    incomeSource: ["employment"],
    assets: 15000,
    receivingBijstand: false,
  },
  workEducation: {
    employed: true,
    hoursPerWeek: 32,
    selfEmployed: false,
    studying: false,
  },
  health: {
    hasHealthInsurance: true,
    healthInsuranceCompany: "Zilveren Kruis",
    needsChildcare: true,
    childcareHoursPerWeek: 24,
    childcareType: "daycare",
    childcareRegistered: true,
  },
  special: {
    hasUnexpectedCosts: false,
    hasDebts: false,
    recentlyMovedToNL: false,
  },
};

/**
 * Sample benefits catalog
 */
export const benefitsCatalog = [
  // 1. Kinderbijslag
  {
    benefitId: "kinderbijslag",
    info: {
      nameNL: "Kinderbijslag",
      nameEN: "Child Benefit",
      provider: "SVB",
      category: "national",
      subcategory: "children",
      descriptionNL:
        "Kwartaalbijdrage van de overheid om te helpen met de kosten van het opvoeden van kinderen tot 18 jaar",
      descriptionEN:
        "Quarterly government contribution to help with the costs of raising children under 18",
    },
    payment: {
      frequency: "quarterly",
      amountMin: 291.49,
      amountMax: 416.41,
      amountDescription: "€291-416 per quarter per child depending on age",
    },
    eligibility: {
      requiresChildren: true,
      childrenAgeMax: 17,
      incomeTestType: "none",
      registrationRequired: ["BRP"],
    },
    application: {
      applicationURL: "https://www.svb.nl/nl/kinderbijslag",
      applicationMethod: ["online"],
      requiresDiGiD: true,
      requiredDocuments: ["Geboorteakte", "BRP inschrijving"],
      deadlineType: "ongoing",
      deadlineDescription: "Aanvragen binnen 3 maanden na geboorte",
    },
    warnings: {
      toeslagenaffaireRelated: false,
      yearEndSettlement: false,
      importantNotes: ["Universal benefit - everyone with children gets this"],
    },
    contact: {
      phoneNumber: "088-1000222",
      websiteNL: "https://www.svb.nl/nl/kinderbijslag",
      websiteEN: "https://www.svb.nl/en/child-benefit",
    },
  },

  // 2. Huurtoeslag
  {
    benefitId: "huurtoeslag",
    info: {
      nameNL: "Huurtoeslag",
      nameEN: "Rent Subsidy",
      provider: "Belastingdienst",
      category: "national",
      subcategory: "housing",
      descriptionNL:
        "Maandelijkse bijdrage in je huurkosten als je een laag inkomen hebt",
      descriptionEN:
        "Monthly contribution toward rent costs if you have low income",
    },
    payment: {
      frequency: "monthly",
      amountMin: 50,
      amountMax: 350,
      amountDescription: "Tot €350/maand afhankelijk van huur en inkomen",
    },
    eligibility: {
      ageMin: 18,
      housingType: ["renting"],
      rentMin: 250,
      incomeMax: 35000,
      incomeTestType: "gross",
      assetsMax: 38479,
    },
    application: {
      applicationURL: "https://mijn.toeslagen.nl",
      applicationMethod: ["online"],
      requiresDiGiD: true,
      requiredDocuments: [
        "Huurcontract",
        "Inkomensverklaring",
        "BRP inschrijving",
      ],
      deadlineType: "annual",
      deadlineDate: "2025-07-01",
      deadlineDescription: "Aanvragen voor 1 juli voor huidig jaar",
    },
    warnings: {
      toeslagenaffaireRelated: false,
      yearEndSettlement: true,
      reportChangesRequired: true,
      importantNotes: [
        "Alleen kale huur telt (geen servicekosten)",
        "Geen maximale huur meer sinds 2026",
      ],
    },
    contact: {
      phoneNumber: "0800-0543",
      websiteNL: "https://www.belastingdienst.nl/huurtoeslag",
    },
  },

  // 3. Zorgtoeslag
  {
    benefitId: "zorgtoeslag",
    info: {
      nameNL: "Zorgtoeslag",
      nameEN: "Healthcare Allowance",
      provider: "Belastingdienst",
      category: "national",
      subcategory: "healthcare",
      descriptionNL:
        "Maandelijkse tegemoetkoming in de kosten van je zorgverzekering",
      descriptionEN: "Monthly contribution toward your health insurance costs",
    },
    payment: {
      frequency: "monthly",
      amountMin: 7,
      amountMax: 131,
      amountDescription: "Tot €131/maand voor alleenstaanden",
    },
    eligibility: {
      ageMin: 18,
      requiresHealthInsurance: true,
      incomeMax: 37500,
      incomeTestType: "gross",
    },
    application: {
      applicationURL: "https://mijn.toeslagen.nl",
      applicationMethod: ["online"],
      requiresDiGiD: true,
      requiredDocuments: ["Zorgverzekeringspolis", "Inkomensverklaring"],
      deadlineType: "annual",
      deadlineDate: "2025-09-01",
      deadlineDescription: "Aanvragen voor 1 september",
    },
    warnings: {
      yearEndSettlement: true,
      reportChangesRequired: true,
    },
    contact: {
      phoneNumber: "0800-0543",
      websiteNL: "https://www.belastingdienst.nl/zorgtoeslag",
    },
  },

  // 4. Kinderopvangtoeslag
  {
    benefitId: "kinderopvangtoeslag",
    info: {
      nameNL: "Kinderopvangtoeslag",
      nameEN: "Childcare Benefit",
      provider: "Belastingdienst",
      category: "national",
      subcategory: "childcare",
      descriptionNL:
        "Tegemoetkoming in de kosten van kinderopvang voor werkende ouders",
      descriptionEN: "Contribution toward childcare costs for working parents",
    },
    payment: {
      frequency: "monthly",
      amountMin: 100,
      amountMax: 1200,
      amountDescription: "Afhankelijk van inkomen en opvangkosten",
    },
    eligibility: {
      requiresChildren: true,
      childrenAgeMax: 12,
      employedOrStudying: true,
      requiresChildcare: true,
      incomeMax: 90000,
      incomeTestType: "combined",
    },
    application: {
      applicationURL: "https://mijn.toeslagen.nl",
      applicationMethod: ["online"],
      requiresDiGiD: true,
      requiredDocuments: [
        "Opvangcontract",
        "Werkgeversverklaring",
        "LRK nummer",
      ],
      deadlineType: "ongoing",
      deadlineDescription: "Aanvragen binnen 3 maanden na start opvang",
    },
    warnings: {
      toeslagenaffaireRelated: true,
      yearEndSettlement: true,
      reportChangesRequired: true,
      importantNotes: [
        "⚠️ Toeslagenaffaire-gerelateerd - extra voorzichtigheid",
        "Rapporteer uren maandelijks",
      ],
    },
    contact: {
      phoneNumber: "0800-0543",
      websiteNL: "https://www.belastingdienst.nl/kinderopvangtoeslag",
    },
  },

  // 5. Kindgebonden Budget
  {
    benefitId: "kindgebonden_budget",
    info: {
      nameNL: "Kindgebonden Budget",
      nameEN: "Child-Related Budget",
      provider: "Belastingdienst",
      category: "national",
      subcategory: "children",
      descriptionNL:
        "Maandelijkse inkomensafhankelijke bijdrage voor gezinnen met kinderen",
      descriptionEN:
        "Monthly income-tested supplement for families with children",
    },
    payment: {
      frequency: "monthly",
      amountMin: 50,
      amountMax: 120,
      amountDescription: "€600-1200/jaar per kind afhankelijk van inkomen",
    },
    eligibility: {
      requiresChildren: true,
      childrenAgeMax: 17,
      incomeMax: 50000,
      incomeTestType: "gross",
      assetsMax: 140213,
      mustReceiveOtherBenefit: ["kinderbijslag"],
    },
    application: {
      applicationURL: "https://mijn.toeslagen.nl",
      applicationMethod: ["online"],
      requiresDiGiD: true,
      requiredDocuments: ["Inkomensverklaring", "Kinderbijslagbewijs"],
      deadlineType: "annual",
      deadlineDate: "2025-09-01",
      deadlineDescription: "Aanvragen voor 1 september",
    },
    warnings: {
      yearEndSettlement: true,
      reportChangesRequired: true,
    },
    contact: {
      phoneNumber: "0800-0543",
      websiteNL: "https://www.belastingdienst.nl/kindgebonden-budget",
    },
  },

  // 6. ALO-kop (Single Parent Supplement)
  {
    benefitId: "alo_kop",
    info: {
      nameNL: "Alleenstaande ouderkop",
      nameEN: "Single Parent Supplement",
      provider: "Belastingdienst",
      category: "national",
      subcategory: "supplement",
      descriptionNL:
        "Automatische toeslag bovenop andere toeslagen voor alleenstaande ouders",
      descriptionEN:
        "Automatic supplement on top of other benefits for single parents",
    },
    payment: {
      frequency: "monthly",
      amountMin: 60,
      amountMax: 150,
      amountDescription: "€60-150/maand extra bovenop huurtoeslag/zorgtoeslag",
    },
    eligibility: {
      singleParentOnly: true,
      requiresChildren: true,
      mustReceiveOtherBenefit: [
        "huurtoeslag",
        "zorgtoeslag",
        "kindgebonden_budget",
      ],
    },
    application: {
      applicationURL: "https://mijn.toeslagen.nl",
      applicationMethod: ["automatic"],
      requiresDiGiD: true,
      requiredDocuments: [],
      deadlineType: "ongoing",
      deadlineDescription: "Automatisch toegekend bij andere toeslagen",
    },
    warnings: {
      importantNotes: [
        "Automatisch - geen aparte aanvraag nodig",
        "Rapporteer als partner intrekt",
      ],
    },
    contact: {
      phoneNumber: "0800-0543",
      websiteNL: "https://www.belastingdienst.nl/",
    },
  },

  // 7. Bijzondere Bijstand Den Haag
  {
    benefitId: "denhaag_bijzondere_bijstand",
    info: {
      nameNL: "Bijzondere Bijstand",
      nameEN: "Special Assistance",
      provider: "Gemeente Den Haag",
      category: "municipal",
      subcategory: "emergency",
      descriptionNL: "Eenmalige hulp voor onverwachte noodzakelijke kosten",
      descriptionEN: "One-time help for unexpected necessary costs",
    },
    payment: {
      frequency: "one_time",
      amountMin: 100,
      amountMax: 1500,
      amountDescription: "Afhankelijk van situatie en kosten",
    },
    eligibility: {
      municipalities: ["Den Haag"],
      incomeMax: 35000,
      incomeTestType: "gross",
    },
    application: {
      applicationURL: "https://www.denhaag.nl/bijzondere-bijstand",
      applicationMethod: ["online", "phone", "in_person"],
      requiresDiGiD: true,
      requiredDocuments: ["Offerte", "Inkomensverklaring", "Bankafschriften"],
      deadlineType: "before_event",
      deadlineDescription: "VOOR aankoop aanvragen!",
    },
    warnings: {
      importantNotes: [
        "⚠️ Aanvragen VOOR je iets koopt",
        "Haal meerdere offertes",
      ],
    },
    contact: {
      phoneNumber: "14070",
      websiteNL: "https://www.denhaag.nl/bijzondere-bijstand",
    },
  },

  // 8. Den Haag Stadspas
  {
    benefitId: "denhaag_stadspas",
    info: {
      nameNL: "Den Haag Stadspas",
      nameEN: "The Hague City Pass",
      provider: "Gemeente Den Haag",
      category: "municipal",
      subcategory: "discount",
      descriptionNL: "Kortingspas voor sport, cultuur en andere activiteiten",
      descriptionEN: "Discount card for sports, culture and activities",
    },
    payment: {
      frequency: "yearly",
      amountMin: 0,
      amountMax: 0,
      amountDescription: "Gratis pas met kortingen tot 50%",
    },
    eligibility: {
      municipalities: ["Den Haag"],
      incomeMax: 35000,
      incomeTestType: "gross",
    },
    application: {
      applicationURL: "https://www.denhaag.nl/stadspas",
      applicationMethod: ["online"],
      requiresDiGiD: true,
      requiredDocuments: ["Inkomensverklaring"],
      deadlineType: "ongoing",
      deadlineDescription: "Doorlopend aan te vragen",
    },
    warnings: {
      importantNotes: ["Ook voor kinderen", "Geldig 1 jaar"],
    },
    contact: {
      phoneNumber: "14070",
      websiteNL: "https://www.denhaag.nl/stadspas",
    },
  },

  // 9. Jeugdfonds Sport & Cultuur
  {
    benefitId: "jeugdfonds_sport_cultuur",
    info: {
      nameNL: "Jeugdfonds Sport & Cultuur",
      nameEN: "Youth Sports & Culture Fund",
      provider: "Jeugdfonds Sport & Cultuur",
      category: "private",
      subcategory: "children",
      descriptionNL: "Financiële bijdrage voor sport en cultuur voor kinderen",
      descriptionEN:
        "Financial contribution for sports and culture for children",
    },
    payment: {
      frequency: "yearly",
      amountMin: 100,
      amountMax: 400,
      amountDescription: "Tot €400/jaar per kind",
    },
    eligibility: {
      requiresChildren: true,
      childrenAgeMin: 4,
      childrenAgeMax: 17,
      incomeMax: 30000,
      incomeTestType: "gross",
    },
    application: {
      applicationURL: "https://www.jeugdfondssportencultuur.nl",
      applicationMethod: ["online"],
      requiresDiGiD: false,
      requiredDocuments: [
        "Inkomensverklaring",
        "Bevestiging sportclub/cultuurinstelling",
      ],
      deadlineType: "ongoing",
      deadlineDescription: "Doorlopend aan te vragen",
    },
    warnings: {
      importantNotes: ["Voor sport OF cultuur", "Max 1x per jaar per kind"],
    },
    contact: {
      websiteNL: "https://www.jeugdfondssportencultuur.nl",
    },
  },

  // 10. Stichting Leergeld
  {
    benefitId: "stichting_leergeld",
    info: {
      nameNL: "Stichting Leergeld",
      nameEN: "Learning Money Foundation",
      provider: "Stichting Leergeld",
      category: "private",
      subcategory: "education",
      descriptionNL: "Hulp bij schoolkosten voor kinderen",
      descriptionEN: "Help with school costs for children",
    },
    payment: {
      frequency: "one_time",
      amountMin: 50,
      amountMax: 500,
      amountDescription: "Afhankelijk van behoefte en kosten",
    },
    eligibility: {
      requiresChildren: true,
      childrenAgeMin: 4,
      childrenAgeMax: 18,
      incomeMax: 28000,
      incomeTestType: "gross",
    },
    application: {
      applicationURL: "https://www.stichtingleergeld.nl",
      applicationMethod: ["online", "phone"],
      requiresDiGiD: false,
      requiredDocuments: [
        "Inkomensverklaring",
        "Schoolverklaring",
        "Offerte/factuur",
      ],
      deadlineType: "before_event",
      deadlineDescription: "Aanvragen voor aankoop",
    },
    warnings: {
      importantNotes: [
        "Voor schoolspullen, laptop, schoolreisjes",
        "Lokale afdelingen - zoek jouw gemeente",
      ],
    },
    contact: {
      websiteNL: "https://www.stichtingleergeld.nl",
    },
  },
];
