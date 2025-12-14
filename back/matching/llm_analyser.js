/**
 * @fileoverview LLM-based analysis for generating human-readable explanations
 * Uses greenPT API (privacy-focused, EU-hosted, renewable energy)
 * @typedef {import('./schemas').UserProfile} UserProfile
 * @typedef {import('./schemas').Benefit} Benefit
 * @typedef {import('./schemas').MatchAnalysis} MatchAnalysis
 */

/** --------------------------------------------------------------
 * LLM-based analysis for generating human‑readable explanations
 * Uses greenPT API (privacy‑focused, EU‑hosted, renewable energy)
 * -------------------------------------------------------------- */
class LLMAnalyzer {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey || process.env.GREENPT_API_KEY;
    this.baseURL =
      options.baseURL ||
      process.env.GREENPT_BASE_URL ||
      "https://api.greenpt.ai/v1";
    // "greenl" (Mistral Small) or "greenr" (GPT‑OSS 120B)
    this.model = options.model || process.env.GREENPT_MODEL || "greenr";
  }

  /** --------------------------------------------------------------
   * Build the prompt that will be sent to the model
   * -------------------------------------------------------------- */
  _createPrompt(user, benefits) {
    // ---- strip sensitive data ---------------------------------
    const cleanUser = {
      personal: {
        age: user.personal.age,
        municipality: user.personal.municipality,
        householdType: user.personal.householdType,
      },
      children: user.children,
      housing: {
        situation: user.housing.situation,
        monthlyRent: user.housing.monthlyRent,
        rentBaseOnly: user.housing.rentBaseOnly,
      },
      financial: {
        annualIncomeGross: user.financial.annualIncomeGross,
        assets: user.financial.assets,
      },
      workEducation: user.workEducation,
      health: {
        hasHealthInsurance: user.health.hasHealthInsurance,
        needsChildcare: user.health.needsChildcare,
        childcareHoursPerWeek: user.health.childcareHoursPerWeek,
        childcareRegistered: user.health.childcareRegistered,
      },
    };

    // ---- keep only the fields we need -------------------------
    const cleanBenefits = benefits.map((b) => ({
      benefitId: b.benefitId,
      nameNL: b.info.nameNL,
      nameEN: b.info.nameEN,
      descriptionEN: b.info.descriptionEN,
      eligibility: b.eligibility,
      payment: b.payment,
      warnings: b.warnings,
    }));

    return `You are an expert at analyzing Dutch financial benefit eligibility for single mothers.

Given a user profile and list of benefits, analyze how well the user matches each benefit.

For each benefit, identify:
1. Hard requirements (MUST meet) - age, location, children, housing, income
2. Soft requirements (NICE to meet) - assets, work hours, specific circumstances

Mark each requirement as:
- "met": User clearly satisfies this requirement
- "not_met": User clearly does NOT satisfy this requirement
- "unknown": Insufficient information to determine

IMPORTANT RULES:
- If income/assets are missing, mark as "unknown" (do NOT assume)
- Only mark "not_met" when there is CLEAR mismatch
- Be conservative – when in doubt, use "unknown"
- Provide brief, clear reasoning in Dutch for each requirement

User Profile:
${JSON.stringify(cleanUser, null, 2)}

Benefits to analyze:
${JSON.stringify(cleanBenefits, null, 2)}

Return ONLY valid JSON matching this schema:
{
  "analyses": [
    {
      "benefitId": "string",
      "benefitName": "string (use nameEN)",
      "matchScore": 0-100,
      "hardRequirements": [
        {
          "text": "Leeftijd 18+ (jij bent 32)",
          "status": "met|not_met|unknown",
          "reasoning": "Je bent 32 jaar oud, dus je voldoet aan de leeftijdseis"
        }
      ],
      "softRequirements": [
        {
          "text": "Vermogen onder €38.479",
          "status": "met|not_met|unknown",
          "reasoning": "Geen informatie over vermogen"
        }
      ],
      "positiveFactors": ["Array of positive factors in Dutch"],
      "uncertainFactors": ["Array of uncertain factors in Dutch"],
      "missingInfo": ["Array of missing information in Dutch"]
    }
  ]
}`;
  }

  /** --------------------------------------------------------------
   * Call the greenPT endpoint for one (or a small batch of) benefits
   * -------------------------------------------------------------- */
  async analyzeBenefits(user, benefits) {
    try {
      const prompt = this._createPrompt(user, benefits);

      console.log(prompt);

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "You are an expert at analyzing Dutch financial benefit eligibility. Always respond with valid JSON only.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 4096,
          temperature: 0.3, // lower temperature → more deterministic JSON
        }),
      });

      console.log(response);

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(
          `greenPT API error: ${response.status} ${response.statusText}\n${errBody}`
        );
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content ?? "";
      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return parsed.analyses || [];
    } catch (error) {
      console.error("LLM Analysis Error:", error.message);
      // fallback – same shape the UI expects
      return benefits.map((b) => ({
        benefitId: b.benefitId,
        benefitName: b.info.nameEN,
        matchScore: 50,
        hardRequirements: [],
        softRequirements: [],
        positiveFactors: [],
        uncertainFactors: ["AI analysis temporarily unavailable"],
        missingInfo: [],
      }));
    }
  }

  /** --------------------------------------------------------------
   * Process a large list in batches (default 5 per request)
   * -------------------------------------------------------------- */
  async analyzeBenefitsBatched(user, benefits, batchSize = 5) {
    const allAnalyses = [];

    for (let i = 0; i < benefits.length; i += batchSize) {
      const batch = benefits.slice(i, i + batchSize);
      console.log(
        `Analyzing batch ${i / batchSize + 1}/${Math.ceil(
          benefits.length / batchSize
        )}`
      );

      const batchAnalyses = await this.analyzeBenefits(user, batch);
      allAnalyses.push(...batchAnalyses);

      // small pause to avoid hitting rate limits
      if (i + batchSize < benefits.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return allAnalyses;
  }
}
module.exports = LLMAnalyzer;
