export interface BenefitFull {
  id: string;
  name: string;
  nameNl?: string;
  category: 'national' | 'municipal' | 'private';
  municipality?: string;
  schemeType?: string;
  administrator: string;
  officialWebsite: string;
  shortDescription: string;
  shortDescriptionNl?: string;
  eligibilityPlainLanguage: string | string[];
  eligibilityPlainLanguageNl?: string | string[];
  requiredDocuments: string[];
  requiredDocumentsNl?: string[];
  howToApply: string[];
  howToApplyNl?: string[];
  notes?: string[];
  notesNl?: string[];
}

export const allBenefits: BenefitFull[] = [
  // National Benefits
  {
    id: "kinderbijslag",
    name: "Child Benefit",
    nameNl: "Kinderbijslag",
    category: "national",
    administrator: "SVB",
    officialWebsite: "https://www.svb.nl/nl/kinderbijslag",
    shortDescription: "Quarterly child benefit to help cover the costs of raising children.",
    shortDescriptionNl: "Driemaandelijkse kinderbijslag om de kosten van het opvoeden van kinderen te helpen dekken.",
    eligibilityPlainLanguage: "You can receive this if you have one or more children under 18 and you live or work in the Netherlands. Income does not matter.",
    eligibilityPlainLanguageNl: "Je kunt dit ontvangen als je een of meer kinderen onder de 18 hebt en je in Nederland woont of werkt. Inkomen maakt niet uit.",
    requiredDocuments: [
      "Valid ID or residence permit",
      "BSN (citizen service number) for parent and child (if available)",
      "Proof the child lives with you (if requested)",
      "Bank account (IBAN) for payment"
    ],
    requiredDocumentsNl: [
      "Geldig identiteitsbewijs of verblijfsvergunning",
      "BSN voor ouder en kind (indien beschikbaar)",
      "Bewijs dat het kind bij je woont (indien gevraagd)",
      "Bankrekening (IBAN) voor betaling"
    ],
    howToApply: [
      "Check the SVB page for your situation",
      "Apply via SVB (online or with assistance)",
      "Provide documents if SVB requests them",
      "SVB confirms and pays quarterly"
    ],
    howToApplyNl: [
      "Bekijk de SVB-pagina voor jouw situatie",
      "Vraag aan via SVB (online of met hulp)",
      "Lever documenten aan als SVB erom vraagt",
      "SVB bevestigt en betaalt per kwartaal"
    ],
    notes: ["Many parents receive this automatically, but not always (e.g., moving to NL or new circumstances)."],
    notesNl: ["Veel ouders ontvangen dit automatisch, maar niet altijd (bijv. bij verhuizing naar NL of nieuwe omstandigheden)."]
  },
  {
    id: "kindgebonden_budget",
    name: "Child-related Budget",
    nameNl: "Kindgebonden budget",
    category: "national",
    administrator: "Belastingdienst",
    officialWebsite: "https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/kindgebonden-budget",
    shortDescription: "Extra monthly financial support for parents with children, depending on income.",
    shortDescriptionNl: "Extra maandelijkse financiële steun voor ouders met kinderen, afhankelijk van inkomen.",
    eligibilityPlainLanguage: "You may receive this if you have children under 18 and your household income is below a certain level. Single parents often receive a higher amount (ALO-kop).",
    eligibilityPlainLanguageNl: "Je kunt dit ontvangen als je kinderen onder de 18 hebt en je huishoudinkomen onder een bepaald niveau ligt. Alleenstaande ouders ontvangen vaak een hoger bedrag (ALO-kop).",
    requiredDocuments: [
      "DigiD (for online application)",
      "Valid ID or residence permit",
      "BSN for parent and child(ren)",
      "Income information (current/expected yearly income)",
      "Bank account (IBAN)"
    ],
    requiredDocumentsNl: [
      "DigiD (voor online aanvraag)",
      "Geldig identiteitsbewijs of verblijfsvergunning",
      "BSN voor ouder en kind(eren)",
      "Inkomensinformatie (huidig/verwacht jaarinkomen)",
      "Bankrekening (IBAN)"
    ],
    howToApply: [
      "Log in via Toeslagen (Belastingdienst) using DigiD",
      "Apply and enter your situation (household, children, income)",
      "Upload documents if requested",
      "Keep income changes updated to avoid repayment"
    ],
    howToApplyNl: [
      "Log in via Toeslagen (Belastingdienst) met DigiD",
      "Vraag aan en vul je situatie in (huishouden, kinderen, inkomen)",
      "Upload documenten indien gevraagd",
      "Houd inkomenswijzigingen bijgewerkt om terugbetaling te voorkomen"
    ],
    notes: ["If income changes during the year, update Toeslagen to reduce the risk of paying money back."],
    notesNl: ["Als je inkomen tijdens het jaar verandert, werk Toeslagen bij om het risico op terugbetaling te verminderen."]
  },
  {
    id: "kinderopvangtoeslag",
    name: "Childcare Benefit",
    nameNl: "Kinderopvangtoeslag",
    category: "national",
    administrator: "Belastingdienst",
    officialWebsite: "https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/kinderopvangtoeslag",
    shortDescription: "Contribution towards the cost of registered childcare.",
    shortDescriptionNl: "Bijdrage aan de kosten van geregistreerde kinderopvang.",
    eligibilityPlainLanguage: "You may receive this if you use registered childcare and you work, study, or follow an approved reintegration program. The amount depends on income and childcare hours.",
    eligibilityPlainLanguageNl: "Je kunt dit ontvangen als je geregistreerde kinderopvang gebruikt en je werkt, studeert, of een goedgekeurd re-integratietraject volgt. Het bedrag hangt af van inkomen en opvanguren.",
    requiredDocuments: [
      "DigiD",
      "Childcare contract",
      "Childcare provider details (registered provider)",
      "Number of childcare hours and hourly rate",
      "Proof of work/study/reintegration program (if requested)",
      "Income estimate for the year",
      "Bank account (IBAN)"
    ],
    requiredDocumentsNl: [
      "DigiD",
      "Kinderopvangcontract",
      "Gegevens kinderopvangaanbieder (geregistreerd)",
      "Aantal opvanguren en uurtarief",
      "Bewijs van werk/studie/re-integratietraject (indien gevraagd)",
      "Inkomensschatting voor het jaar",
      "Bankrekening (IBAN)"
    ],
    howToApply: [
      "Check that your childcare provider is registered",
      "Apply via Toeslagen (Belastingdienst) with DigiD",
      "Enter childcare hours, costs, and your situation",
      "Update changes quickly (hours, income, provider) to avoid repayment"
    ],
    howToApplyNl: [
      "Controleer of je kinderopvangaanbieder geregistreerd is",
      "Vraag aan via Toeslagen (Belastingdienst) met DigiD",
      "Vul opvanguren, kosten en je situatie in",
      "Werk wijzigingen snel bij (uren, inkomen, aanbieder) om terugbetaling te voorkomen"
    ],
    notes: ["This allowance has strict rules. Missing updates can lead to repayment."],
    notesNl: ["Deze toeslag heeft strikte regels. Ontbrekende updates kunnen leiden tot terugbetaling."]
  },
  {
    id: "zorgtoeslag",
    name: "Healthcare Allowance",
    nameNl: "Zorgtoeslag",
    category: "national",
    administrator: "Belastingdienst",
    officialWebsite: "https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/zorgtoeslag",
    shortDescription: "Monthly allowance to help pay for health insurance.",
    shortDescriptionNl: "Maandelijkse toeslag om te helpen betalen voor zorgverzekering.",
    eligibilityPlainLanguage: "You may receive this if you are 18 or older, have Dutch health insurance, and your income is below a certain limit.",
    eligibilityPlainLanguageNl: "Je kunt dit ontvangen als je 18 jaar of ouder bent, een Nederlandse zorgverzekering hebt, en je inkomen onder een bepaalde grens ligt.",
    requiredDocuments: [
      "DigiD",
      "Valid ID or residence permit",
      "BSN",
      "Proof you have Dutch health insurance (usually checked automatically)",
      "Income estimate for the year",
      "Bank account (IBAN)"
    ],
    requiredDocumentsNl: [
      "DigiD",
      "Geldig identiteitsbewijs of verblijfsvergunning",
      "BSN",
      "Bewijs dat je Nederlandse zorgverzekering hebt (meestal automatisch gecontroleerd)",
      "Inkomensschatting voor het jaar",
      "Bankrekening (IBAN)"
    ],
    howToApply: [
      "Apply via Toeslagen (Belastingdienst) with DigiD",
      "Enter your household situation and income estimate",
      "Update income changes during the year"
    ],
    howToApplyNl: [
      "Vraag aan via Toeslagen (Belastingdienst) met DigiD",
      "Vul je huishoudsituatie en inkomensschatting in",
      "Werk inkomenswijzigingen tijdens het jaar bij"
    ]
  },
  {
    id: "huurtoeslag",
    name: "Rent Benefit",
    nameNl: "Huurtoeslag",
    category: "national",
    administrator: "Belastingdienst",
    officialWebsite: "https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/huurtoeslag",
    shortDescription: "Monthly help with paying rent for an independent rental home.",
    shortDescriptionNl: "Maandelijkse hulp bij het betalen van huur voor een zelfstandige huurwoning.",
    eligibilityPlainLanguage: "You may receive this if you rent an independent home, your rent is below a maximum limit, and your income and savings are below thresholds.",
    eligibilityPlainLanguageNl: "Je kunt dit ontvangen als je een zelfstandige woning huurt, je huur onder een maximum ligt, en je inkomen en spaargeld onder drempels liggen.",
    requiredDocuments: [
      "DigiD",
      "Rental contract",
      "Rent amount and service costs breakdown",
      "Proof of address / registration (if requested)",
      "Income estimate for the year",
      "Savings/assets information (if requested)",
      "Bank account (IBAN)"
    ],
    requiredDocumentsNl: [
      "DigiD",
      "Huurcontract",
      "Huurbedrag en servicekosten specificatie",
      "Bewijs van adres / inschrijving (indien gevraagd)",
      "Inkomensschatting voor het jaar",
      "Spaargeld/vermogen informatie (indien gevraagd)",
      "Bankrekening (IBAN)"
    ],
    howToApply: [
      "Check if your home is an independent rental home",
      "Apply via Toeslagen (Belastingdienst) with DigiD",
      "Enter rent details, household details, and income estimate",
      "Update changes (moving, rent change, income) promptly"
    ],
    howToApplyNl: [
      "Controleer of je woning een zelfstandige huurwoning is",
      "Vraag aan via Toeslagen (Belastingdienst) met DigiD",
      "Vul huurgegevens, huishoudgegevens en inkomensschatting in",
      "Werk wijzigingen (verhuizing, huurwijziging, inkomen) snel bij"
    ],
    notes: ["Savings/assets limits can affect eligibility."],
    notesNl: ["Spaargeld/vermogenslimieten kunnen van invloed zijn op je recht."]
  },
  {
    id: "alo_kop",
    name: "Single Parent Supplement",
    nameNl: "Alleenstaande ouderkop (ALO-kop)",
    category: "national",
    administrator: "Belastingdienst",
    officialWebsite: "https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/alleenstaande-ouderkop",
    shortDescription: "Extra amount for single parents, added automatically to the child-related budget.",
    shortDescriptionNl: "Extra bedrag voor alleenstaande ouders, automatisch toegevoegd aan het kindgebonden budget.",
    eligibilityPlainLanguage: "You receive this automatically if you are a single parent and eligible for kindgebonden budget. No separate application is needed.",
    eligibilityPlainLanguageNl: "Je ontvangt dit automatisch als je alleenstaande ouder bent en recht hebt op kindgebonden budget. Geen aparte aanvraag nodig.",
    requiredDocuments: [
      "No separate documents (it is included via kindgebonden budget)."
    ],
    requiredDocumentsNl: [
      "Geen aparte documenten (het is inbegrepen via kindgebonden budget)."
    ],
    howToApply: [
      "Apply for kindgebonden budget (if you don't already receive it)",
      "If you qualify as a single parent, ALO-kop is included automatically"
    ],
    howToApplyNl: [
      "Vraag kindgebonden budget aan (als je dit nog niet ontvangt)",
      "Als je kwalificeert als alleenstaande ouder, wordt ALO-kop automatisch toegevoegd"
    ],
    notes: ["If your household situation changes (partner moves in/out), it can change your amount."],
    notesNl: ["Als je huishoudsituatie verandert (partner trekt in/uit), kan dit je bedrag veranderen."]
  },
  
  // Private Funds
  {
    id: "stichting_leergeld",
    name: "Leergeld Foundation",
    nameNl: "Stichting Leergeld",
    category: "private",
    administrator: "Stichting Leergeld Nederland (local Leergeld foundations)",
    officialWebsite: "https://www.leergeld.nl/",
    shortDescription: "Helps children from low-income families with school, sports, culture and wellbeing costs.",
    shortDescriptionNl: "Helpt kinderen uit gezinnen met een laag inkomen met school-, sport-, cultuur- en welzijnskosten.",
    eligibilityPlainLanguage: "For families with limited income. You apply through the local Leergeld foundation in your municipality (postcode search).",
    eligibilityPlainLanguageNl: "Voor gezinnen met een beperkt inkomen. Je vraagt aan via de lokale Leergeld-stichting in je gemeente (postcode zoeken).",
    requiredDocuments: [
      "Proof of identity (if requested by the local foundation)",
      "Proof of address (postcode / municipality)",
      "Proof of income / benefits (recent)",
      "Details of the child(ren) (age/school if relevant)",
      "Quote/invoice or description of what is needed (e.g., laptop, school items)"
    ],
    requiredDocumentsNl: [
      "Identiteitsbewijs (indien gevraagd door lokale stichting)",
      "Adresbewijs (postcode / gemeente)",
      "Inkomens-/uitkeringsbewijs (recent)",
      "Gegevens van het kind/de kinderen (leeftijd/school indien relevant)",
      "Offerte/factuur of beschrijving van wat nodig is (bijv. laptop, schoolspullen)"
    ],
    howToApply: [
      "Go to the Leergeld website and search by postcode for your local foundation",
      "Start the application via the local foundation",
      "Provide the requested proof documents"
    ],
    howToApplyNl: [
      "Ga naar de Leergeld-website en zoek op postcode naar je lokale stichting",
      "Start de aanvraag via de lokale stichting",
      "Lever de gevraagde bewijsstukken aan"
    ],
    notes: ["Local offerings differ by municipality."],
    notesNl: ["Lokaal aanbod verschilt per gemeente."]
  },
  {
    id: "nationaal_fonds_kinderhulp",
    name: "National Children's Help Fund",
    nameNl: "Nationaal Fonds Kinderhulp",
    category: "private",
    administrator: "Nationaal Fonds Kinderhulp",
    officialWebsite: "https://kinderhulp.nl/",
    shortDescription: "Supports children and young people (0–21) growing up in poverty with practical help.",
    shortDescriptionNl: "Ondersteunt kinderen en jongeren (0-21) die opgroeien in armoede met praktische hulp.",
    eligibilityPlainLanguage: "Parents cannot apply directly. A professional helper (e.g., social worker, municipal wijkteam, youth worker) submits the application for the child.",
    eligibilityPlainLanguageNl: "Ouders kunnen niet rechtstreeks aanvragen. Een professionele hulpverlener (bijv. maatschappelijk werker, wijkteam, jongerenwerker) dient de aanvraag in voor het kind.",
    requiredDocuments: [
      "Contact details of a professional helper (social worker / wijkteam / youth care / debt counselor)",
      "Basic family situation summary (income/stressors) prepared by the professional",
      "Details of the child(ren) and what support is needed",
      "Quote/invoice or cost estimate for the requested item/activity (if applicable)"
    ],
    requiredDocumentsNl: [
      "Contactgegevens van een professionele hulpverlener (maatschappelijk werker / wijkteam / jeugdzorg / schuldhulpverlener)",
      "Korte samenvatting gezinssituatie (inkomen/stressoren) opgesteld door de professional",
      "Gegevens van het kind/de kinderen en welke ondersteuning nodig is",
      "Offerte/factuur of kostenschatting voor het gevraagde item/activiteit (indien van toepassing)"
    ],
    howToApply: [
      "Contact a professional helper (wijkteam / social worker / debt counselor)",
      "The professional registers and submits the request via Kinderhulp's application process"
    ],
    howToApplyNl: [
      "Neem contact op met een professionele hulpverlener (wijkteam / maatschappelijk werker / schuldhulpverlener)",
      "De professional registreert en dient de aanvraag in via het aanvraagproces van Kinderhulp"
    ],
    notes: ["Important: A professional helper is needed to apply on your behalf."],
    notesNl: ["Belangrijk: Een professionele hulpverlener is nodig om namens jou aan te vragen."]
  },
  {
    id: "sun_urgente_noden",
    name: "Emergency Aid Foundation",
    nameNl: "SUN Nederland (Stichting Urgente Noden)",
    category: "private",
    administrator: "SUN Nederland (network of local emergency aid agencies)",
    officialWebsite: "https://www.sunnederland.nl/",
    shortDescription: "Emergency financial support for urgent needs when other provisions are not available in time.",
    shortDescriptionNl: "Financiële noodhulp voor urgente behoeften wanneer andere voorzieningen niet op tijd beschikbaar zijn.",
    eligibilityPlainLanguage: "You cannot apply directly. A professional helper submits an urgent request to the local SUN agency for your municipality when no (timely) other solution exists.",
    eligibilityPlainLanguageNl: "Je kunt niet rechtstreeks aanvragen. Een professionele hulpverlener dient een urgente aanvraag in bij het lokale SUN-bureau voor je gemeente wanneer geen (tijdige) andere oplossing bestaat.",
    requiredDocuments: [
      "Contact details of a professional helper (social worker / wijkteam / debt counselor)",
      "Proof of urgent financial need (rent arrears, essential bills, emergency costs)",
      "Proof that other options (e.g., municipal schemes) are not available / not fast enough",
      "Bank statements / income overview (usually requested by the helper)"
    ],
    requiredDocumentsNl: [
      "Contactgegevens van een professionele hulpverlener (maatschappelijk werker / wijkteam / schuldhulpverlener)",
      "Bewijs van urgente financiële nood (huurachterstand, essentiële rekeningen, noodkosten)",
      "Bewijs dat andere opties (bijv. gemeentelijke regelingen) niet beschikbaar / niet snel genoeg zijn",
      "Bankafschriften / inkomenenoverzicht (meestal gevraagd door de hulpverlener)"
    ],
    howToApply: [
      "Ask a professional helper in your municipality to contact the local SUN agency",
      "The helper submits the urgent request with supporting documents"
    ],
    howToApplyNl: [
      "Vraag een professionele hulpverlener in je gemeente om contact op te nemen met het lokale SUN-bureau",
      "De hulpverlener dient de urgente aanvraag in met ondersteunende documenten"
    ],
    notes: ["SUN only processes requests through professionals."],
    notesNl: ["SUN verwerkt alleen aanvragen via professionals."]
  },
  {
    id: "noodfonds_energie",
    name: "Energy Emergency Fund",
    nameNl: "Noodfonds Energie",
    category: "private",
    administrator: "Noodfonds Energie (national emergency fund for energy costs)",
    officialWebsite: "https://www.noodfondsenergie.nl/",
    shortDescription: "Temporary support for households with high energy bills and lower incomes.",
    shortDescriptionNl: "Tijdelijke steun voor huishoudens met hoge energierekeningen en lagere inkomens.",
    eligibilityPlainLanguage: "Availability depends on whether the fund is open. If open, eligibility is based on household income and energy costs.",
    eligibilityPlainLanguageNl: "Beschikbaarheid hangt af van of het fonds open is. Indien open, is recht gebaseerd op huishoudinkomen en energiekosten.",
    requiredDocuments: [
      "DigiD or identity verification method (if required during the application)",
      "Recent energy bill / contract details",
      "Household income information (recent payslips/benefits overview)",
      "Bank account (IBAN)"
    ],
    requiredDocumentsNl: [
      "DigiD of identiteitsverificatiemethode (indien vereist tijdens aanvraag)",
      "Recente energierekening / contractgegevens",
      "Huishoudinkomen informatie (recente loonstroken/uitkeringsoverzicht)",
      "Bankrekening (IBAN)"
    ],
    howToApply: [
      "Check if the fund is currently open on the official website",
      "Apply online via noodfondsenergie.nl and follow the steps shown there"
    ],
    howToApplyNl: [
      "Controleer of het fonds momenteel open is op de officiële website",
      "Vraag online aan via noodfondsenergie.nl en volg de daar getoonde stappen"
    ],
    notes: ["This fund may open/close depending on the period; always check availability."],
    notesNl: ["Dit fonds kan openen/sluiten afhankelijk van de periode; controleer altijd beschikbaarheid."]
  },

  // Municipal Schemes - Amsterdam
  {
    id: "amsterdam_bijzondere_bijstand",
    name: "Special Assistance (Amsterdam)",
    nameNl: "Bijzondere bijstand Amsterdam",
    category: "municipal",
    municipality: "Amsterdam",
    schemeType: "bijzondere_bijstand",
    administrator: "Gemeente Amsterdam",
    officialWebsite: "https://www.amsterdam.nl/werk-en-inkomen/bijzondere-bijstand/",
    shortDescription: "Financial support for necessary and unexpected costs that you cannot pay yourself.",
    shortDescriptionNl: "Financiële steun voor noodzakelijke en onverwachte kosten die je niet zelf kunt betalen.",
    eligibilityPlainLanguage: [
      "You live in Amsterdam or Weesp",
      "You have low income and limited savings",
      "The costs are necessary and exceptional",
      "The costs are not covered by another scheme"
    ],
    eligibilityPlainLanguageNl: [
      "Je woont in Amsterdam of Weesp",
      "Je hebt een laag inkomen en beperkt spaargeld",
      "De kosten zijn noodzakelijk en uitzonderlijk",
      "De kosten worden niet gedekt door een andere regeling"
    ],
    requiredDocuments: [
      "Valid ID or residence permit",
      "Proof of address (if requested)",
      "Recent income statements (salary, benefits)",
      "Recent bank statements",
      "Invoices or quotes for the exceptional costs",
      "Rental contract and rent proof (if housing-related)"
    ],
    requiredDocumentsNl: [
      "Geldig identiteitsbewijs of verblijfsvergunning",
      "Adresbewijs (indien gevraagd)",
      "Recente inkomensverklaringen (salaris, uitkering)",
      "Recente bankafschriften",
      "Facturen of offertes voor de uitzonderlijke kosten",
      "Huurcontract en huurbewijs (indien woninggerelateerd)"
    ],
    howToApply: [
      "Check whether your cost type is listed on the website",
      "Apply online or request a paper form",
      "Upload or send the required documents",
      "Wait for the municipality's decision"
    ],
    howToApplyNl: [
      "Controleer of je kostensoort op de website staat",
      "Vraag online aan of vraag een papieren formulier aan",
      "Upload of verstuur de vereiste documenten",
      "Wacht op het besluit van de gemeente"
    ]
  },
  {
    id: "amsterdam_stadspas",
    name: "Stadspas (Amsterdam)",
    nameNl: "Stadspas Amsterdam",
    category: "municipal",
    municipality: "Amsterdam",
    schemeType: "stadspas",
    administrator: "Gemeente Amsterdam",
    officialWebsite: "https://www.amsterdam.nl/stadspas/stadspas-aanvragen/",
    shortDescription: "City pass that gives discounts for sports, culture, and activities.",
    shortDescriptionNl: "Stadspas die kortingen geeft voor sport, cultuur en activiteiten.",
    eligibilityPlainLanguage: [
      "You live in Amsterdam or Weesp",
      "You have a low income and limited savings",
      "You are 18 or older"
    ],
    eligibilityPlainLanguageNl: [
      "Je woont in Amsterdam of Weesp",
      "Je hebt een laag inkomen en beperkt spaargeld",
      "Je bent 18 jaar of ouder"
    ],
    requiredDocuments: [
      "DigiD (for online application)",
      "Proof of income",
      "Proof of identity"
    ],
    requiredDocumentsNl: [
      "DigiD (voor online aanvraag)",
      "Inkomensbewijs",
      "Identiteitsbewijs"
    ],
    howToApply: [
      "Apply online via the Stadspas website",
      "Upload the requested documents",
      "Receive the pass by mail if approved"
    ],
    howToApplyNl: [
      "Vraag online aan via de Stadspas-website",
      "Upload de gevraagde documenten",
      "Ontvang de pas per post indien goedgekeurd"
    ]
  },

  // Municipal Schemes - Rotterdam
  {
    id: "rotterdam_bijzondere_bijstand",
    name: "Special Assistance (Rotterdam)",
    nameNl: "Bijzondere bijstand Rotterdam",
    category: "municipal",
    municipality: "Rotterdam",
    schemeType: "bijzondere_bijstand",
    administrator: "Gemeente Rotterdam",
    officialWebsite: "https://www.rotterdam.nl/bijzondere-bijstand",
    shortDescription: "Support for exceptional and necessary costs for residents with low income.",
    shortDescriptionNl: "Steun voor uitzonderlijke en noodzakelijke kosten voor inwoners met een laag inkomen.",
    eligibilityPlainLanguage: [
      "You live in Rotterdam",
      "You have low income and limited savings",
      "The costs are necessary and exceptional"
    ],
    eligibilityPlainLanguageNl: [
      "Je woont in Rotterdam",
      "Je hebt een laag inkomen en beperkt spaargeld",
      "De kosten zijn noodzakelijk en uitzonderlijk"
    ],
    requiredDocuments: [
      "DigiD (if applying online)",
      "Proof of income",
      "Recent bank statements",
      "Invoices or quotes for the costs",
      "Valid ID"
    ],
    requiredDocumentsNl: [
      "DigiD (indien online aanvragen)",
      "Inkomensbewijs",
      "Recente bankafschriften",
      "Facturen of offertes voor de kosten",
      "Geldig identiteitsbewijs"
    ],
    howToApply: [
      "Select the type of cost on the website",
      "Apply online with DigiD or by mail",
      "Submit the required documents"
    ],
    howToApplyNl: [
      "Selecteer het type kosten op de website",
      "Vraag online aan met DigiD of per post",
      "Dien de vereiste documenten in"
    ]
  },
  {
    id: "rotterdam_kwijtschelding",
    name: "Municipal Tax Remission (Rotterdam)",
    nameNl: "Kwijtschelding gemeentelijke belastingen Rotterdam",
    category: "municipal",
    municipality: "Rotterdam",
    schemeType: "kwijtschelding_gemeentelijke_belastingen",
    administrator: "Gemeente Rotterdam",
    officialWebsite: "https://www.rotterdam.nl/kwijtschelding-afvalstoffenheffing-aanvragen",
    shortDescription: "Reduction or exemption from municipal taxes for low-income households.",
    shortDescriptionNl: "Vermindering of vrijstelling van gemeentelijke belastingen voor huishoudens met een laag inkomen.",
    eligibilityPlainLanguage: [
      "You have low income and limited savings",
      "You are unable to pay municipal taxes"
    ],
    eligibilityPlainLanguageNl: [
      "Je hebt een laag inkomen en beperkt spaargeld",
      "Je bent niet in staat om gemeentelijke belastingen te betalen"
    ],
    requiredDocuments: [
      "DigiD",
      "Recent bank statements",
      "Proof of income",
      "Tax assessment letter (if available)"
    ],
    requiredDocumentsNl: [
      "DigiD",
      "Recente bankafschriften",
      "Inkomensbewijs",
      "Belastingaanslag (indien beschikbaar)"
    ],
    howToApply: [
      "Complete the online checklist",
      "Submit the remission request",
      "Upload the requested documents"
    ],
    howToApplyNl: [
      "Vul de online checklist in",
      "Dien het kwijtscheldingsverzoek in",
      "Upload de gevraagde documenten"
    ]
  },

  // Municipal Schemes - Utrecht
  {
    id: "utrecht_bijzondere_bijstand",
    name: "Special Assistance (Utrecht)",
    nameNl: "Bijzondere bijstand Utrecht",
    category: "municipal",
    municipality: "Utrecht",
    schemeType: "bijzondere_bijstand",
    administrator: "Gemeente Utrecht",
    officialWebsite: "https://www.utrecht.nl/werk-en-inkomen/bijzondere-bijstand/",
    shortDescription: "Financial support for special costs you cannot pay yourself.",
    shortDescriptionNl: "Financiële steun voor bijzondere kosten die je niet zelf kunt betalen.",
    eligibilityPlainLanguage: [
      "You live in Utrecht",
      "You have low income and limited savings",
      "The costs are necessary and exceptional"
    ],
    eligibilityPlainLanguageNl: [
      "Je woont in Utrecht",
      "Je hebt een laag inkomen en beperkt spaargeld",
      "De kosten zijn noodzakelijk en uitzonderlijk"
    ],
    requiredDocuments: [
      "Valid ID or residence permit",
      "Proof of income",
      "Recent bank statements",
      "Invoices or cost estimates",
      "Proof of housing costs (if applicable)"
    ],
    requiredDocumentsNl: [
      "Geldig identiteitsbewijs of verblijfsvergunning",
      "Inkomensbewijs",
      "Recente bankafschriften",
      "Facturen of kostenschattingen",
      "Bewijs van woonkosten (indien van toepassing)"
    ],
    howToApply: [
      "Check eligibility on the Utrecht website",
      "Apply online or via the municipality",
      "Provide all required documents"
    ],
    howToApplyNl: [
      "Controleer je recht op de Utrecht-website",
      "Vraag online of via de gemeente aan",
      "Lever alle vereiste documenten aan"
    ]
  },
  {
    id: "utrecht_u_pas",
    name: "U-pas (Utrecht)",
    nameNl: "U-pas Utrecht",
    category: "municipal",
    municipality: "Utrecht",
    schemeType: "stadspas",
    administrator: "Gemeente Utrecht",
    officialWebsite: "https://www.u-pas.nl/",
    shortDescription: "City pass for discounts on sports, culture, and activities.",
    shortDescriptionNl: "Stadspas voor kortingen op sport, cultuur en activiteiten.",
    eligibilityPlainLanguage: [
      "You live in Utrecht",
      "You have a low income",
      "You meet the U-pas income thresholds"
    ],
    eligibilityPlainLanguageNl: [
      "Je woont in Utrecht",
      "Je hebt een laag inkomen",
      "Je voldoet aan de U-pas inkomensgrenzen"
    ],
    requiredDocuments: [
      "DigiD",
      "Proof of income",
      "Proof of address"
    ],
    requiredDocumentsNl: [
      "DigiD",
      "Inkomensbewijs",
      "Adresbewijs"
    ],
    howToApply: [
      "Apply online via the U-pas website",
      "Upload income documents",
      "Receive the pass if approved"
    ],
    howToApplyNl: [
      "Vraag online aan via de U-pas-website",
      "Upload inkomensdocumenten",
      "Ontvang de pas indien goedgekeurd"
    ]
  }
];

export const municipalities = ['Amsterdam', 'Rotterdam', 'Utrecht'] as const;
export type Municipality = typeof municipalities[number];

export const getBenefitsByCategory = (category: 'national' | 'municipal' | 'private') => 
  allBenefits.filter(b => b.category === category);

export const getBenefitsByMunicipality = (municipality: string) =>
  allBenefits.filter(b => b.municipality === municipality);
