# Hulpwijzer Backend Technical Context

## Overview
This backend powers the Hulpwijzer application, designed to help single parents in the Netherlands find government benefits they are eligible for. It combines web scraping to build a knowledge base of benefits with a sophisticated AI-powered matching engine to determine user eligibility.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose) - primarily for User auth
- **AI/ML**: 
  - Google Gemini (Flash 2.0) for scraping and analysis
  - GreenPT (Custom/External API) for embeddings and reranking
- **Scraping**: Cheerio + Fetch
- **Data Storage**: Local JSON (`data/benefits.json`) for benefits knowledge base.

## Architecture

### 1. Data Ingestion (Scraper)
- **Entry Point**: `scraper.js`
- **Architecture**: **Self-Correcting Neuro-Symbolic Scraper**
  1.  **Extraction**: Fetches HTML and uses **Gemini 2.0 Flash** to extract data.
  2.  **Logic Synthesis**: The LLM compiles eligibility rules into **JSON Logic** (`{"<": [{"var": "income"}, 30000]}`).
  3.  **Self-Correction**: The LLM generates 4 test cases (Pass/Fail). The scraper executes the generated logic against these cases. If mismatches occur, it **auto-retries** generation.
  4.  **Provenance**: Saves source URL, timestamp, and version hash.

### 2. Matching Engine (`BenefitMatcher`)
- **Entry Point**: `controllers/matchController.js` -> `matching/matcher.js`
- **Flow**:
  1.  **Input**: `UserProfile`.
  2.  **Step 1: Neuro-Symbolic Filter (3-State Logic)**:
      - **Eligible**: Strict JSON Logic pass.
      - **Maybe Eligible**: Strict fail, but passes with **5% Tolerance** (Fuzzy Logic).
      - **Not Eligible**: Strict fail beyond tolerance.
      - *Note*: Benefits without logic fall back to "Maybe" (Legacy support).
  3.  **Step 2: Hybrid Retrieval (Trigram + Embedding)**:
      - **Tower 1**: BM25 with **Trigram Tokenization** (handles Dutch compounds like `kinderbijslag`).
      - **Tower 2**: Semantic Search (GreenPT Embeddings).
      - **Fusion**: RRF.
  4.  **Step 3: Analysis**: LLM verifies Soft Rules (qualitative checks).
  5.  **Step 4: Refinement**: Ranking by Urgency/Priority.

## Key Files
- `index.js`: App entry point.
- `scraper.mjs`: Self-correcting benefit extraction tool (ES Module).
- `scripts/run_batch.mjs`: Mass- `scraper.mjs`: Standalone script for populating benefit data.
- `matching/matcher.js`: Core class implementing the hybrid retrieval and matching logic.
- `matching/schemas.js`: JSDoc type definitions serving as the source of truth for data structures.
- `../data/benefits.json`: The database of available benefits (located in project root).

## Environment Variables
- `GEMINI_API_KEY`: Core AI services.
- `GREENPT_API_KEY`: Semantic search.
- `MONGODB_URI`: User auth.

## Current Status (Engine 2.0)
- **Neuro-Symbolic**: Active. Hard rules are deterministic.
- **Data Status**: `benefits.json` is partially migrated. New scrapes include Logic. Old items are treated as "Maybe Eligible".
- **Retrieval**: Trigram optimization is Active.
