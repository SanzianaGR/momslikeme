/**
 * Hulpwijzer Benefit Scraper (Single URL)
 * 
 * Usage: node scraper.js <url> <benefitId> <provider> [type]
 * Example: node scraper.js https://www.svb.nl/nl/kinderbijslag kinderbijslag SVB national
 */

import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from this directory (back/.env)
dotenv.config({ path: path.join(__dirname, '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: { temperature: 0.0 }
});

const BENEFITS_PATH = path.join(__dirname, '..', 'data', 'benefits.json');

/**
 * Scrape a URL and extract text
 */
/**
 * Fetch a single page and extract text
 */
async function fetchPageText(url) {
    try {
        console.log(`   📡 Fetching sub-page: ${url}`);
        const response = await fetch(url, { headers: { 'User-Agent': 'HulpwijzerBot/1.0' } });
        if (!response.ok) return "";
        const html = await response.text();
        const $ = cheerio.load(html);
        $('script, style, nav, footer, header, aside').remove();
        return $('main, article, .content, body').first().text().replace(/\s+/g, ' ').trim().substring(0, 5000);
    } catch (e) {
        return "";
    }
}

/**
 * Smart Scrape: Fetches main page + relevant sub-pages (Conditions, Amounts)
 */
async function scrapeUrl(url) {
    console.log(`📡 Fetching Main: ${url}`);
    
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; HulpwijzerBot/1.0)',
            'Accept-Language': 'nl-NL,nl;q=0.9'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`); // 404s still throw to let scraper handle them
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // 1. Extract Main Text
    $('script, style, nav, footer, header, aside').remove();
    let combinedText = "=== MAIN PAGE ===\n" + 
        $('main, article, .content, body').first().text().replace(/\s+/g, ' ').trim().substring(0, 8000);

    // 2. Find Relevant Sub-links (Smart Crawl)
    const keywords = ['voorwaarden', 'bedragen', 'hoeveel', 'eisen'];
    const subLinks = new Set();
    
    $('a').each((_, el) => {
        const text = $(el).text().toLowerCase();
        const href = $(el).attr('href');
        if (href && keywords.some(k => text.includes(k))) {
            try {
                const fullUrl = new URL(href, url).href;
                // Avoid looping back to main or external sites (simple heuristic)
                if (fullUrl !== url && fullUrl.startsWith(new URL(url).origin)) {
                    subLinks.add(fullUrl);
                }
            } catch (e) {}
        }
    });

    // 3. Fetch Top 2 Sub-links
    const linksToFetch = Array.from(subLinks).slice(0, 2); // Limit to avoid overload
    if (linksToFetch.length > 0) {
        console.log(`   🔎 Found ${linksToFetch.length} relevant sub-pages: ${linksToFetch.join(', ')}`);
        for (const link of linksToFetch) {
            const subText = await fetchPageText(link);
            if (subText.length > 200) {
                combinedText += `\n\n=== SUB-PAGE (${link}) ===\n${subText}`;
            }
        }
    }

    console.log(`📄 Total Extracted Chars: ${combinedText.length}`);
    return { text: combinedText, title: $('title').text().trim() };
}

/**
 * Use AI to parse into Benefit schema
 */
import jsonLogic from 'json-logic-js';

/**
 * Use AI to parse into Benefit schema with Neuro-Symbolic Logic
 */
async function parseWithAI(text, pageTitle, target) {
    console.log(`🤖 Parsing with AI (Neuro-Symbolic Mode)...`);

    let currentPrompt = `
Extract benefit data and LOGIC from this Dutch government page context.

PAGE: ${pageTitle}
BENEFIT TARGET: ${target.id}
PROVIDER: ${target.provider}
TYPE: ${target.type}

CONTENT:
${text}

INSTRUCTIONS:
1. **CONTENT MATCH CHECK**: Is the provided CONTENT actually about the "${target.id}" benefit? 
   - If NO (e.g. generic landing page, 404 text, login screen), return ONLY: {"content_mismatch": true, "reason": "..."}
   - If YES, proceed to extraction.

2. **FACTUAL EXTRACTION ONLY (Temperature 0)**:
   - Extract standard JSON fields.
   - If a value is NOT present in text, return null. DO NOT GUESS or use external knowledge.

3. **LOGIC SYNTHESIS (CRITICAL)**: Convert eligibility rules into JSON Logic format.
   - **Supported Operators ONLY**: "and", "or", "<", ">", "<=", ">=", "==", "!=", "in", "var".
   - **FORBIDDEN**: "exists", "soft_rules", "TODO", "not_null". Use {"!=": [{"var": "field"}, null]} to check existence.
   - **Variables**: ALIGN with UserProfile schema: "personal.age", "financial.annualIncomeGross", "children.numberOfChildren".

4. **SOFT RULES**: If a rule is qualitative (e.g. "distress"), put it in the "soft_rules" ARRAY, NOT inside the "logic" object.

5. **TEST CASES**: Generate 2 PASS and 2 FAIL user profiles. FAIL cases must fail the Logic strictly.

6. **HUMAN-READABLE ELIGIBILITY** (IMPORTANT): Extract clear bullet points answering "Who can apply?":
   - Age requirements (e.g., "You must be 18 or older")
   - Income limits (e.g., "Annual income below €40,857") 
   - Residency requirements (e.g., "You must live in the Netherlands")
   - Family situation requirements (e.g., "You must have children under 18")
   - Any other eligibility criteria mentioned
   - Store in "eligibility_summary" array with 3-6 clear bullet points.

7. **REQUIRED DOCUMENTS**: List documents needed to apply:
   - Common: DigiD, income proof, ID, rent contract, etc.
   - If not mentioned, return empty array [].
   - Store in "required_documents" array.

8. **APPLICATION STEPS**: Extract step-by-step application process:
   - How to apply (online via DigiD, in-person, phone)
   - Where to apply (specific website URL, office location)
   - When to apply (deadlines, timing)
   - Store in "application_steps" array with 2-5 steps.

Return ONLY valid JSON:
{
    "benefitId": "${target.id}",
    "content_mismatch": false,
    "info": {
        "name": "...",
        "provider": "...",
        "type": "${target.type}",
        "description": "...",
        "application_url": "...",
        "eligibility_summary": ["Bullet 1", "Bullet 2", ...],
        "required_documents": ["Document 1", ...],
        "application_steps": ["Step 1: ...", "Step 2: ...", ...]
    },
    "eligibility": {
        "logic": { ...JSON Logic... },
        "soft_rules": ["..."],
        "test_cases": { ... }
    },
    ...
}
`;


    let attempts = 0;
    let lastBenefit = null;

    while (attempts < 4) { // Increased to 4 attempts
        try {
            const result = await model.generateContent(currentPrompt);
            const responseText = result.response.text()
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            
            const benefit = JSON.parse(responseText);
            
            // Check for Mismatch Flag
            if (benefit.content_mismatch) {
                console.warn(`   ⚠️ Content Mismatch detected: ${benefit.reason}`);
                return benefit; // Return early, do not save or verifying logic
            }

            lastBenefit = benefit; // Keep track of latest attempt

            // SELF-CORRECTION LOOP
            if (benefit.eligibility?.logic && benefit.eligibility?.test_cases) {
                console.log("   ⚖️ Verifying generated logic...");
                
                // Helper: Flatten nested object for JSON Logic (e.g., {personal: {age: 25}} -> {"personal.age": 25})
                const flattenObject = (obj, prefix = '') => {
                    const result = {};
                    for (const [key, value] of Object.entries(obj)) {
                        const newKey = prefix ? `${prefix}.${key}` : key;
                        if (value && typeof value === 'object' && !Array.isArray(value)) {
                            Object.assign(result, flattenObject(value, newKey));
                        } else {
                            result[newKey] = value;
                        }
                    }
                    return result;
                };

                // Get test cases (handle both .pass/.fail and .pass_cases/.fail_cases)
                const passCases = benefit.eligibility.test_cases.pass || benefit.eligibility.test_cases.pass_cases || [];
                const failCases = benefit.eligibility.test_cases.fail || benefit.eligibility.test_cases.fail_cases || [];
                
                // Ensure they're arrays
                const passArray = Array.isArray(passCases) ? passCases : [];
                const failArray = Array.isArray(failCases) ? failCases : [];
                
                // Check PASS cases
                for (const testCase of passArray) {
                    // Flatten the profile if it exists, otherwise flatten the whole testCase
                    const testData = testCase.profile ? flattenObject(testCase.profile) : flattenObject(testCase);
                    if (!jsonLogic.apply(benefit.eligibility.logic, testData)) {
                        throw new Error(`Logic failed on a PASS test case. User: ${JSON.stringify(testCase)}`);
                    }
                }
                
                // Check FAIL cases
                for (const testCase of failArray) {
                    const testData = testCase.profile ? flattenObject(testCase.profile) : flattenObject(testCase);
                    if (jsonLogic.apply(benefit.eligibility.logic, testData)) {
                        throw new Error(`Logic passed on a FAIL test case. User: ${JSON.stringify(testCase)}`);
                    }
                }
                console.log("   ✅ Logic verification successful!");
                benefit.source = {
                    url: target.url,
                    scraped_at: new Date().toISOString()
                };
                return benefit;
            } else {
                 return benefit; 
            }

        } catch (e) {
            console.warn(`   ⚠️ Attempt ${attempts + 1} failed: ${e.message}. Retrying...`);
            currentPrompt += `\n\nPREVIOUS ATTEMPT FAILED. ERROR: ${e.message}. \nFIX THE LOGIC. Use {"!=": [{"var": "field"}, null]} for existence checks.`;
            attempts++;
        }
    }
    
    // FALLBACK: If we have a parsed benefit but logic is flawed, return it anyway (maybe log a warning)
    if (lastBenefit) {
        console.warn("   ⚠️ Logic verification failed after retries. Saving data without verified logic guarantee.");
        lastBenefit.source = {
            url: target.url,
            scraped_at: new Date().toISOString()
        };
        // Optional: Remove flawed logic to prevent runtime errors? Or keep it for manual review?
        // Let's keep it but maybe mark it.
        lastBenefit._logicVerificationFailed = true;
        return lastBenefit;
    }

    throw new Error("Failed to generate valid JSON after 4 attempts");
}

/**
 * Add or update benefit in benefits.json
 */
function saveBenefit(benefit) {
    let benefits = [];
    try {
        benefits = JSON.parse(fs.readFileSync(BENEFITS_PATH, 'utf8'));
    } catch (e) {
        benefits = [];
    }

    const idx = benefits.findIndex(b => b.benefitId === benefit.benefitId);
    if (idx >= 0) {
        benefits[idx] = benefit;
        console.log(`✅ Updated: ${benefit.benefitId}`);
    } else {
        benefits.push(benefit);
        console.log(`✅ Added: ${benefit.benefitId}`);
    }

    fs.writeFileSync(BENEFITS_PATH, JSON.stringify(benefits, null, 2));
}

// Exportable Scraper Function
export async function scrapeBenefit(url, benefitId, provider, type = 'national') {
    const target = { id: benefitId, url, provider, type };
    console.log(`\n🚀 Starting Scrape: ${benefitId}`);
    
    try {
        const { text, title } = await scrapeUrl(url);
        const benefit = await parseWithAI(text, title, target);
        benefit.scrapedAt = new Date().toISOString();
        
        saveBenefit(benefit);
        
        console.log(`✅ Scrape Complete: ${benefit.benefitId}`);
        return benefit;
    } catch (error) {
        console.error(`❌ Error scraping ${benefitId}: ${error.message}`);
        throw error;
    }
}

// CLI Entry Point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [url, benefitId, provider, type] = process.argv.slice(2);
    if (!url || !benefitId || !provider) {
        console.log(`Usage: node scraper.js <url> <benefitId> <provider> [type]`);
        process.exit(1);
    }
    scrapeBenefit(url, benefitId, provider, type);
}
