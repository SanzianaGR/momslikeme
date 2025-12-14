# Architecture Proposal: Hulpwijzer Engine 2.0

## Goal
Improve reliability, auditing, and "smartness" of the benefit matching engine. Move from a purely probabilistic LLM approach to a **Neuro-Symbolic** architecture (AI for understanding, Code for logic).

## 1. Reliability (Neuro-Symbolic Matching)
**Problem**: Current system relies on LLMs to check math (e.g., "Income < 30000"). LLMs are prone to hallucinations and inconsistency with numbers.
**Solution**: Extract *logic* into a deterministic format, not just text.

### Implementation
1.  **Logic Extraction (Scraper)**:
    *   Update `scraper.js` prompt to output a `logic` block in **JSON Logic** format alongside the text description.
    *   Example:
        ```json
        "logic": {
          "and": [
            { "<": [{ "var": "financial.gross_income" }, 30000] },
            { "==": [{ "var": "personal.municipality" }, "Amsterdam"] }
          ]
        }
        ```
2.  **Deterministic Filter (Matcher)**:
    *   Before sending to LLM, run the `user_profile` against this JSON Logic.
    *   *Result*: 100% accurate, explainable hard filtering.
    *   Only pass *passing* or *complex* (logic-free) benefits to the LLM for final qualitative analysis.

## 2. Smartness (Active Clarification)
**Problem**: If a user doesn't provide specific info (e.g., "Do you have a rental contract?"), the current system guesses or defaults to "Unknown".
**Solution**: Feedback loop where the engine asks *questions*.

### Implementation
1.  **Missing Data Detection**:
    *   During the deterministic check, identical variables that are `undefined` in the user profile but required by a strict logic rule.
2.  **Clarification Response**:
    *   Instead of just returning matches, return:
        ```json
        {
          "matches": [...],
          "clarifications": [
            { "question": "Heeft u een huurcontract?", "field": "housing.hasContract", "forBenefit": "Huurtoeslag" }
          ]
        }
        ```

## 3. Data Integrity (Crawler & Verification)
**Problem**: Data is static and unverified.
**Solution**: Automated pipeline.

### Implementation
1.  **Visual Scraper**: Switch from `cheerio` to `puppeteer` to capture JS-rendered content (common in modern government sub-sites).
2.  **Change Detection**: Store a content hash of the source URL. Run a nightly cron. If hash changes, re-scrape and flag for review.
3.  **LLM-as-a-Judge**: Run the extraction with two different models (e.g. Gemini Pro + GPT-4o-mini). Only save if they agree on the Logic rules.

## 4. Explainability (Citations)
**Problem**: User trusts the "Match" but doesn't know why.
**Solution**: Source mapping.

### Implementation
*   During scraping, inject unique IDs into HTML paragraphs/list items.
*   Ask LLM to return `source_id` along with the extracted requirement.
*   UI can highlight the exact government text that triggered the rule.
