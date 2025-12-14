/**
 * Benefits Scraper
 * 
 * This script scrapes government websites and uses AI to extract
 * structured eligibility rules from the page content.
 * 
 * Usage: node scraper.js <url> [benefit-id]
 * Example: node scraper.js https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/toeslagen/zorgtoeslag/ zorgtoeslag
 */

require('dotenv').config();
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Scrape a URL and extract text content
async function scrapeUrl(url) {
    console.log(`📡 Fetching: ${url}`);
    
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; HulpwijzerBot/1.0; educational project)',
            'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, nav, footer
    $('script, style, nav, footer, header, aside, .cookie-banner, .navigation').remove();

    // Extract main content
    const mainContent = $('main, article, .content, .main-content, body').first();
    
    // Get text, clean whitespace
    let text = mainContent.text()
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();

    // Limit to first 8000 chars to avoid token limits
    if (text.length > 8000) {
        text = text.substring(0, 8000) + '...';
    }

    console.log(`📄 Extracted ${text.length} characters`);
    return { text, title: $('title').text().trim() };
}

// Use AI to parse eligibility rules from text
async function parseWithAI(text, pageTitle, suggestedId) {
    console.log(`🤖 Analyzing with AI...`);

    const prompt = `
You are an expert at analyzing Dutch government benefit (toeslagen/regelingen) pages.

Analyze this webpage content and extract STRUCTURED eligibility rules.

PAGE TITLE: ${pageTitle}

PAGE CONTENT:
${text}

INSTRUCTIONS:
1. Identify the benefit/regeling being described
2. Extract ALL eligibility criteria as specific, verifiable rules
3. Look for: income limits, age requirements, residency, family situation, assets, etc.
4. Convert Dutch terms: "bijstandsnorm" = social minimum, "vermogensgrens" = asset limit
5. Be precise with numbers - include the actual thresholds

OUTPUT FORMAT (JSON only, no markdown):
{
    "id": "${suggestedId || 'auto-generated-slug'}",
    "name": "Dutch name of the benefit",
    "name_en": "English translation",
    "provider": "Organization that provides it (e.g., Belastingdienst, Gemeente Amsterdam)",
    "type": "national | municipal | private",
    "municipality": "If municipal, which one? Otherwise null",
    "description": "One paragraph explaining what this benefit is for",
    "eligibility_rules": {
        "max_income": null,
        "max_income_description": "e.g., '150% of social minimum'",
        "min_age": null,
        "max_age": null,
        "requires_children": false,
        "min_children": null,
        "requires_single_parent": false,
        "requires_dutch_residence": true,
        "max_assets": null,
        "other_requirements": ["list", "of", "other", "criteria"]
    },
    "how_to_apply": "Brief description of application process",
    "url": "Source URL",
    "confidence": "high | medium | low",
    "notes": "Any caveats or things we're unsure about"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean markdown formatting
    const cleanedText = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
    
    return JSON.parse(cleanedText);
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║  🕷️  HULPWIJZER BENEFITS SCRAPER                          ║
╠════════════════════════════════════════════════════════════╣
║  Usage:                                                     ║
║    node scraper.js <url> [benefit-id]                       ║
║                                                             ║
║  Examples:                                                  ║
║    node scraper.js https://www.svb.nl/nl/kinderbijslag      ║
║    node scraper.js https://amsterdam.nl/stadspas stadspas   ║
║                                                             ║
║  The script will:                                           ║
║    1. Fetch the webpage                                     ║
║    2. Extract text content                                  ║
║    3. Use AI to parse eligibility rules                     ║
║    4. Save structured JSON to ./data/scraped/               ║
╚════════════════════════════════════════════════════════════╝
        `);
        return;
    }

    const url = args[0];
    const suggestedId = args[1] || null;

    try {
        // Step 1: Scrape
        const { text, title } = await scrapeUrl(url);

        // Step 2: Parse with AI
        const parsed = await parseWithAI(text, title, suggestedId);
        parsed.url = url; // Ensure source URL is set
        parsed.scraped_at = new Date().toISOString();

        // Step 3: Save
        const outputDir = path.join(__dirname, 'data', 'scraped');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filename = `${parsed.id}.json`;
        const outputPath = path.join(outputDir, filename);
        fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2));

        console.log(`\n✅ Saved to: ${outputPath}`);
        console.log(`\n📋 Extracted Rules:`);
        console.log(JSON.stringify(parsed, null, 2));

    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        process.exit(1);
    }
}

main();
