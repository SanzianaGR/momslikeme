/**
 * @fileoverview Hybrid two-tower benefit matching engine
 * Combines BM25 keyword matching and GreenPT embedding similarity with weighted RRF
 * Uses GreenPT's green-embedding and green-rerank models (renewable energy powered)
 * @typedef {import('./schemas').UserProfile} UserProfile
 * @typedef {import('./schemas').Benefit} Benefit
 * @typedef {import('./schemas').MatchAnalysis} MatchAnalysis
 */

const LLMAnalyzer = require("./llm_analyser.js");
const jsonLogic = require("json-logic-js");

module.exports = class BenefitMatcher {
  constructor(apiKey, options = {}) {
    this.llmAnalyzer = new LLMAnalyzer(apiKey);

    // GreenPT configuration
    this.greenptApiKey = apiKey;
    this.greenptBaseUrl =
      options.greenptBaseUrl ||
      process.env.GREENPT_BASE_URL ||
      "https://api.greenpt.ai/v1";
    this.embeddingModel = options.embeddingModel || "green-embedding";
    this.rerankModel = options.rerankModel || "green-rerank";

    // RRF configuration
    this.rrfWeights = {
      bm25: options.bm25Weight || 0.3,
      embeddings: options.embeddingsWeight || 0.7,
    };
    this.rrfK = options.rrfK || 60;

    // Retrieval parameters
    this.topKBM25 = options.topKBM25 || 50;
    this.topKEmbeddings = options.topKEmbeddings || 50;
    this.finalTopK = options.finalTopK || 10;
    this.useReranking = options.useReranking !== false; // Default true
  }

  /**
   * Tokenize text using Trigrams (N-Grams of 3 chars)
   * Best for Dutch compounds e.g. "kinderbijslag" -> "kin", "ind", "nde"...
   * @private
   */
  _tokenize(text) {
    const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const tokens = [];
    if (clean.length < 3) return [clean];
    for (let i = 0; i < clean.length - 2; i++) {
        tokens.push(clean.substring(i, i + 3));
    }
    return tokens;
  }

  /**
   * Calculate BM25 score
   * @private
   */
  _calculateBM25(queryTokens, docTokens, avgDocLength, k1 = 1.5, b = 0.75) {
    const docLength = docTokens.length;
    const tokenCounts = {};

    for (const token of docTokens) {
      tokenCounts[token] = (tokenCounts[token] || 0) + 1;
    }

    let score = 0;
    for (const queryToken of queryTokens) {
      const termFreq = tokenCounts[queryToken] || 0;
      if (termFreq > 0) {
        const numerator = termFreq * (k1 + 1);
        const denominator =
          termFreq + k1 * (1 - b + b * (docLength / avgDocLength));
        score += numerator / denominator;
      }
    }

    return score;
  }

  /**
   * Rank documents using BM25 scoring
   * @private
   */
  _rankBM25(queryText, corpusTexts, topK) {
    const queryTokens = this._tokenize(queryText);
    const tokenizedCorpus = corpusTexts.map((text) => this._tokenize(text));

    const avgDocLength =
      tokenizedCorpus.reduce((sum, tokens) => sum + tokens.length, 0) /
      tokenizedCorpus.length;

    const scores = tokenizedCorpus.map((docTokens) =>
      this._calculateBM25(queryTokens, docTokens, avgDocLength)
    );

    const indexedScores = scores.map((score, idx) => ({ idx, score }));
    indexedScores.sort((a, b) => b.score - a.score);

    const topIndices = indexedScores.slice(0, topK).map((item) => item.idx);
    const topScores = indexedScores.slice(0, topK).map((item) => item.score);

    return { indices: topIndices, scores: topScores };
  }

  /**
   * Generate embeddings using GreenPT API
   * @private
   */
  async _getEmbeddings(texts, batchSize = 100) {
    if (!texts || texts.length === 0) return [];

    const allEmbeddings = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);

      console.log(
        `🌱 Embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          texts.length / batchSize
        )} (${batch.length} texts) with GreenPT`
      );

      try {
        const response = await fetch(`${this.greenptBaseUrl}/embeddings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.greenptApiKey}`,
          },
          body: JSON.stringify({
            model: this.embeddingModel,
            input: batch,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `GreenPT Embedding API error: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        const batchEmbeddings = data.data.map((item) => item.embedding);
        allEmbeddings.push(...batchEmbeddings);

        // Small delay between batches
        if (i + batchSize < texts.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(
          `Error embedding batch ${Math.floor(i / batchSize) + 1}:`,
          error.message
        );
        // Return zero vectors for failed batch
        const dimension = 768; // GreenPT embedding dimension
        const zeroBatch = Array(batch.length)
          .fill(null)
          .map(() => Array(dimension).fill(0));
        allEmbeddings.push(...zeroBatch);
      }
    }

    // Normalize embeddings
    return allEmbeddings.map((emb) => {
      const norm = Math.sqrt(emb.reduce((sum, val) => sum + val * val, 0)) || 1;
      return emb.map((val) => val / norm);
    });
  }

  /**
   * Rerank documents using GreenPT reranker
   * @private
   */
  async _rerankDocuments(query, documents, topK = null) {
    if (!documents || documents.length === 0) return [];

    console.log(
      `🌱 Reranking ${documents.length} documents with GreenPT green-rerank`
    );

    try {
      const response = await fetch(`${this.greenptBaseUrl}/rerank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.greenptApiKey}`,
        },
        body: JSON.stringify({
          model: this.rerankModel,
          query: query,
          documents: documents,
          top_n: topK || documents.length,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `GreenPT Rerank API error: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      // GreenPT rerank returns: { results: [{ index, relevance_score, document }, ...] }
      return data.results.map((result) => ({
        index: result.index,
        score: result.relevance_score,
      }));
    } catch (error) {
      console.error("Error reranking documents:", error.message);
      // Fallback: return original order
      return documents.map((_, idx) => ({ index: idx, score: 0 }));
    }
  }

  /**
   * Calculate cosine similarity between normalized vectors
   * @private
   */
  _cosineSimilarity(vecA, vecB) {
    return vecA.reduce((sum, val, idx) => sum + val * vecB[idx], 0);
  }

  /**
   * Rank documents using embedding similarity
   * @private
   */
  async _rankEmbeddings(queryText, corpusEmbeddings, topK) {
    const [queryEmbedding] = await this._getEmbeddings([queryText]);

    const scores = corpusEmbeddings.map((corpusEmb) =>
      this._cosineSimilarity(queryEmbedding, corpusEmb)
    );

    const indexedScores = scores.map((score, idx) => ({ idx, score }));
    indexedScores.sort((a, b) => b.score - a.score);

    const topIndices = indexedScores.slice(0, topK).map((item) => item.idx);
    const topScores = indexedScores.slice(0, topK).map((item) => item.score);

    return { indices: topIndices, scores: topScores };
  }

  /**
   * Apply weighted Reciprocal Rank Fusion
   * @private
   */
  _reciprocalRankFusion(rankings, weights, k = 60, finalK = null) {
    const allItems = new Set();
    for (const ranking of Object.values(rankings)) {
      ranking.forEach((item) => allItems.add(item));
    }

    const rrfScores = {};
    for (const item of allItems) {
      let score = 0;
      for (const [method, ranking] of Object.entries(rankings)) {
        const weight = weights[method] || 1.0;
        const rankPos = ranking.indexOf(item);
        if (rankPos !== -1) {
          score += weight / (k + rankPos + 1); // 1-indexed
        }
      }
      rrfScores[item] = score;
    }

    const sortedItems = Object.entries(rrfScores).sort((a, b) => b[1] - a[1]);

    if (finalK !== null) {
      return sortedItems.slice(0, finalK);
    }

    return sortedItems;
  }

  /**
   * Create textual representation of user profile
   * @private
   */
  _textifyUser(user) {
    const parts = [];

    // Demographics
    parts.push(`${user.personal.age} jaar oud`);
    parts.push(`woonachtig in ${user.personal.municipality}`);
    if (user.personal.householdType) {
      parts.push(user.personal.householdType);
    }

    // Children
    if (user.children.hasChildren) {
      parts.push(`${user.children.numberOfChildren} kind(eren)`);
      if (user.children.childrenAges?.length) {
        parts.push(`leeftijden ${user.children.childrenAges.join(" ")}`);
      }
    }

    // Housing
    parts.push(`woonsituatie ${user.housing.situation}`);
    if (user.housing.monthlyRent) {
      parts.push(`huur ${user.housing.monthlyRent} euro`);
    }

    // Financial
    if (user.financial.annualIncomeGross) {
      parts.push(`jaarinkomen ${user.financial.annualIncomeGross} euro`);
    }
    if (user.financial.assets !== undefined) {
      parts.push(`vermogen ${user.financial.assets} euro`);
    }

    // Work
    if (user.workEducation.employmentStatus) {
      parts.push(user.workEducation.employmentStatus);
    }
    if (user.workEducation.weeklyWorkHours) {
      parts.push(`${user.workEducation.weeklyWorkHours} uur werken`);
    }

    // Health
    if (user.health.needsChildcare) {
      parts.push("kinderopvang nodig");
    }
    if (user.health.hasChronicIllness) {
      parts.push("chronische ziekte");
    }

    return parts.join(" ");
  }

  /**
   * Create textual representation of benefit
   * @private
   */
  _textifyBenefit(benefit) {
    const parts = [];

    parts.push(benefit.info.nameNL);
    parts.push(benefit.info.nameEN);
    parts.push(benefit.info.descriptionNL || "");
    parts.push(benefit.info.descriptionEN || "");

    const { eligibility } = benefit;
    if (eligibility.minAge) parts.push(`minimumleeftijd ${eligibility.minAge}`);
    if (eligibility.maxAge) parts.push(`maximumleeftijd ${eligibility.maxAge}`);
    if (eligibility.hasChildren) parts.push("met kinderen");
    if (eligibility.housingSituation?.length) {
      parts.push(eligibility.housingSituation.join(" "));
    }
    if (eligibility.maxIncome) {
      parts.push(`maximaal inkomen ${eligibility.maxIncome} euro`);
    }

    return parts.join(" ");
  }

  /**
   * Perform hybrid retrieval with BM25 and embeddings, optionally with reranking
   * @private
   */
  async _hybridRetrieval(userQuery, viableBenefits, viableTexts) {
    console.log("\n=== Hybrid Two-Tower Retrieval (GreenPT Powered 🌱) ===");

    // Tower 1: BM25 keyword matching
    const bm25Result = this._rankBM25(userQuery, viableTexts, this.topKBM25);
    console.log(`✓ BM25 tower: ranked ${viableTexts.length} benefits`);

    // Tower 2: GreenPT Embedding similarity
    const benefitEmbeddings = await this._getEmbeddings(viableTexts);
    const embeddingResult = await this._rankEmbeddings(
      userQuery,
      benefitEmbeddings,
      this.topKEmbeddings
    );
    console.log(
      `✓ GreenPT Embedding tower: ranked ${viableTexts.length} benefits`
    );

    // Apply weighted RRF
    const rankings = {
      bm25: bm25Result.indices,
      embeddings: embeddingResult.indices,
    };

    const fusedResults = this._reciprocalRankFusion(
      rankings,
      this.rrfWeights,
      this.rrfK,
      this.useReranking ? this.finalTopK * 2 : this.finalTopK // Get more candidates if reranking
    );

    console.log(
      `✓ RRF fusion: combined rankings (bm25=${this.rrfWeights.bm25}, embeddings=${this.rrfWeights.embeddings})`
    );

    // Optional: Apply GreenPT reranking as final stage
    let finalResults = fusedResults;
    if (this.useReranking && fusedResults.length > 0) {
      const candidateIndices = fusedResults.map(([idx]) => idx);
      const candidateTexts = candidateIndices.map((idx) => viableTexts[idx]);

      const rerankResults = await this._rerankDocuments(
        userQuery,
        candidateTexts,
        this.finalTopK
      );

      // Map rerank results back to original indices
      finalResults = rerankResults.map((result) => {
        const originalIdx = candidateIndices[result.index];
        const rrfScore =
          fusedResults.find(([idx]) => idx === originalIdx)?.[1] || 0;
        return [
          originalIdx,
          result.score, // Use rerank score as primary
          rrfScore, // Keep RRF score as secondary
        ];
      });

      console.log(
        `✓ GreenPT Reranking: refined to top ${finalResults.length} benefits`
      );
    }

    // Map back to benefit objects with scores
    return finalResults.map(([localIdx, primaryScore, secondaryScore]) => ({
      benefit: viableBenefits[localIdx],
      rerankScore: this.useReranking ? primaryScore : undefined,
      rrfScore: this.useReranking ? secondaryScore : primaryScore,
      bm25Rank: bm25Result.indices.indexOf(localIdx) + 1,
      embeddingRank: embeddingResult.indices.indexOf(localIdx) + 1,
    }));
  }

  /**
   * Match user to benefits using hybrid approach
   * @param {UserProfile} user
   * @param {Benefit[]} benefits
   * @returns {Promise<{matches: MatchAnalysis[], rejected: Object}>}
   */
  async matchBenefits(user, benefits) {
    console.log(`\n=== Starting Hybrid Benefit Matching (GreenPT 🌱) ===`);
    console.log(
      `User: ${user.personal.age} years old, ${user.personal.municipality}`
    );
    console.log(`Total benefits to check: ${benefits.length}\n`);

    // Step 1: Neuro-Symbolic Logic Engine (3-State)
    const viableBenefits = [];
    const rejectionReasons = {};

    for (const benefit of benefits) {
      // If no logic exists, treat as "Maybe" (Legacy support)
      if (!benefit.eligibility?.logic) {
        viableBenefits.push(benefit);
        continue;
      }

      // 1. Strict Check
      const strictPass = jsonLogic.apply(benefit.eligibility.logic, user);
      if (strictPass) {
        viableBenefits.push(benefit);
        continue;
      }

      // 2. Tolerance Check (The "Maybe" State)
      // We re-run logic with a modified user profile where income/assets are reduced by 5%
      // This is a heuristic to catch edge cases
      const tolerantUser = JSON.parse(JSON.stringify(user));
      if (tolerantUser.financial?.annualIncomeGross) {
        tolerantUser.financial.annualIncomeGross *= 0.95; // 5% reduction
      }
      
      const tolerantPass = jsonLogic.apply(benefit.eligibility.logic, tolerantUser);
      if (tolerantPass) {
        // Mark as "Maybe" for downstream processing
        benefit._matchStatus = 'maybe_eligible'; 
        viableBenefits.push(benefit);
        continue;
      }

      // 3. Reject
      rejectionReasons[benefit.benefitId] = ["Strict eligibility rules not met"];
    }

    console.log(
      `✓ Neuro-Symbolic Logic passed: ${viableBenefits.length}/${benefits.length}`
    );

    if (viableBenefits.length === 0) {
      console.log("\n❌ No benefits passed logic filters");
      return {
        matches: [],
        rejected: this._analyzeRejections(rejectionReasons, benefits.length),
      };
    }

    // Step 2: Hybrid retrieval (BM25 + GreenPT Embeddings + RRF + Optional Reranking)
    const userQuery = this._textifyUser(user);
    const viableTexts = viableBenefits.map((b) => this._textifyBenefit(b));

    const rankedResults = await this._hybridRetrieval(
      userQuery,
      viableBenefits,
      viableTexts
    );

    console.log(
      `\n🤖 Running LLM analysis on top ${rankedResults.length} candidates...`
    );

    // Step 3: LLM analysis for top candidates
    const topBenefits = rankedResults.map((r) => r.benefit);
    const analyses = await this.llmAnalyzer.analyzeBenefitsBatched(
      user,
      topBenefits,
      5
    );

    // Step 4: Enhance analyses with calculated fields and retrieval scores
    const enhancedAnalyses = analyses.map((analysis) => {
      const resultInfo = rankedResults.find(
        (r) => r.benefit.benefitId === analysis.benefitId
      );
      const benefit = resultInfo.benefit;

      return {
        ...analysis,
        rerankScore: resultInfo.rerankScore,
        rrfScore: resultInfo.rrfScore,
        bm25Rank: resultInfo.bm25Rank,
        embeddingRank: resultInfo.embeddingRank,
        estimatedAmount: this._estimateAmount(user, benefit),
        priority: this._calculatePriority(analysis.matchScore, benefit),
        urgency: this._calculateUrgency(benefit),
        matchStatus: benefit._matchStatus || 'eligible'
      };
    });

    // Step 5: Filter out benefits with NOT_MET hard requirements
    const finalMatches = enhancedAnalyses.filter((analysis) => {
      const hasNotMet = analysis.hardRequirements?.some(
        (req) => req.status === "not_met"
      );
      if (hasNotMet) {
        const notMetReasons = analysis.hardRequirements
          .filter((req) => req.status === "not_met")
          .map((req) => req.text);
        rejectionReasons[analysis.benefitId] = notMetReasons;
      }
      return !hasNotMet;
    });

    console.log(`✓ Final matches after LLM filtering: ${finalMatches.length}`);

    // Step 6: Rank results
    const rankedMatches = this._rankMatches(finalMatches);

    return {
      matches: rankedMatches,
      rejected: this._analyzeRejections(rejectionReasons, benefits.length),
    };
  }

  /**
   * Estimate benefit amount for user
   * @private
   */
  _estimateAmount(user, benefit) {
    const { payment, info } = benefit;

    let min = payment.amountMin || 0;
    let max = payment.amountMax || payment.amountMin || 0;
    let mostLikely = max;
    let explanation = payment.amountDescription || "";

    // Benefit-specific calculations
    switch (info.nameNL) {
      case "Kinderbijslag":
        if (user.children.childrenAges) {
          let total = 0;
          for (const age of user.children.childrenAges) {
            if (age <= 5) total += 291.49;
            else if (age <= 11) total += 353.95;
            else if (age <= 17) total += 416.41;
          }
          min = max = mostLikely = total;
          explanation = `€${total.toFixed(2)}/kwartaal voor ${
            user.children.childrenAges.length
          } kind(eren)`;
        }
        break;

      case "Huurtoeslag":
        if (user.housing.rentBaseOnly && user.financial.annualIncomeGross) {
          const rent = user.housing.rentBaseOnly;
          const income = user.financial.annualIncomeGross;
          const baseBenefit = Math.min(350, rent * 0.5);
          const incomeReduction = (income / 35000) * baseBenefit * 0.4;
          mostLikely = Math.max(50, baseBenefit - incomeReduction);
          min = mostLikely * 0.7;
          max = 350;
          explanation = `Geschat €${Math.round(
            mostLikely
          )}/maand op basis van huur €${rent} en inkomen`;
        }
        break;

      case "Zorgtoeslag":
        if (user.financial.annualIncomeGross) {
          const income = user.financial.annualIncomeGross;
          if (income < 25000) mostLikely = 131;
          else if (income < 30000) mostLikely = 100;
          else mostLikely = 70;
          min = mostLikely - 20;
          max = 131;
          explanation = `Geschat €${mostLikely}/maand op basis van inkomen`;
        }
        break;
    }

    if (payment.frequency === "quarterly") {
      min /= 3;
      max /= 3;
      mostLikely /= 3;
      explanation += " (omgerekend naar per maand)";
    }

    return {
      min: Math.round(min),
      max: Math.round(max),
      mostLikely: Math.round(mostLikely),
      frequency: "monthly",
      explanation,
    };
  }

  /**
   * Calculate priority
   * @private
   */
  _calculatePriority(score, benefit) {
    if (score > 85) return "high";
    if (score > 70) return "medium";
    return "low";
  }

  /**
   * Calculate urgency based on deadlines
   * @private
   */
  _calculateUrgency(benefit) {
    const { deadlineType, deadlineDate } = benefit.application;

    if (deadlineType === "before_event") {
      return "urgent";
    }

    if (deadlineType === "specific_date" && deadlineDate) {
      const deadline = new Date(deadlineDate);
      const now = new Date();
      const daysUntil = Math.floor((deadline - now) / (1000 * 60 * 60 * 24));

      if (daysUntil < 30) return "urgent";
      if (daysUntil < 90) return "soon";
    }

    if (deadlineType === "annual") {
      return "soon";
    }

    return "flexible";
  }

  /**
   * Rank matches by urgency, priority, score, amount
   * @private
   */
  _rankMatches(analyses) {
    const urgencyOrder = { urgent: 3, soon: 2, flexible: 1 };
    const priorityOrder = { high: 3, medium: 2, low: 1 };

    return analyses.sort((a, b) => {
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }

      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      if (a.matchScore !== b.matchScore) {
        return b.matchScore - a.matchScore;
      }

      const amountA = a.estimatedAmount?.mostLikely || 0;
      const amountB = b.estimatedAmount?.mostLikely || 0;
      return amountB - amountA;
    });
  }

  /**
   * Analyze rejection reasons
   * @private
   */
  _analyzeRejections(rejectionReasons, totalBenefits) {
    const reasonCounts = {};

    for (const reasons of Object.values(rejectionReasons)) {
      for (const reason of reasons) {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      }
    }

    const sorted = Object.entries(reasonCounts)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: ((count / totalBenefits) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalRejected: Object.keys(rejectionReasons).length,
      reasons: sorted,
    };
  }
}
