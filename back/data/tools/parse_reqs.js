/**
 * Batch Scraper
 * 
 * Scrapes all URLs defined in data/scrape-targets.json
 * and outputs a combined benefits.json file.
 * 
 * Usage: node batch-scrape.js
 */

require('dotenv').config();
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Rate limit helper (respect API limits)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeUrl(url) {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; HulpwijzerBot/1.0; educational project)',
            'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header, aside').remove();

    let text = $('main, article, .content, body').first().text()
        .replace(/\s+/g, ' ')
        .trim();

    if (text.length > 8000) {
        text = text.substring(0, 8000);
    }

    return { text, title: $('title').text().trim() };
}

async function parseWithAI(text, title, target) {
    const prompt = `
Analyze this Dutch government benefit page and extract structured eligibility rules.

PAGE: ${title}
CONTENT: ${text}

Return JSON only (no markdown):
{
    "id": "${target.id}",
    "name": "Dutch name",
    "name_en": "English name",
    "provider": "${target.provider}",
    "type": "national|municipal|private",
    "municipality": null,
    "category": "child|health|housing|financial|culture",
    "description": "What this benefit is for",
    "eligibility_rules": {
        "max_income": null,
        "max_income_percent_of_minimum": null,
        "min_age": null,
        "max_age": null,
        "requires_children": false,
        "child_age_range": null,
        "requires_dutch_residence": true,
        "max_assets": null,
        "other": []
    },
    "url": "${target.url}",
    "confidence": "high|medium|low"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
    
    return JSON.parse(responseText);
}

async function main() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  🕷️  HULPWIJZER BATCH SCRAPER                             ║
╚════════════════════════════════════════════════════════════╝
    `);

    const targetsPath = path.join(__dirname, 'data', 'scrape-targets.json');
    const targets = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));

    console.log(`📋 Found ${targets.length} targets to scrape\n`);

    const results = [];
    const errors = [];

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        console.log(`[${i + 1}/${targets.length}] Scraping: ${target.id}...`);

        try {
            const { text, title } = await scrapeUrl(target.url);
            console.log(`   📄 Extracted ${text.length} chars`);

            const parsed = await parseWithAI(text, title, target);
            parsed.scraped_at = new Date().toISOString();
            results.push(parsed);

            console.log(`   ✅ Parsed successfully (confidence: ${parsed.confidence})`);

            // Save individual file
            const scrapedDir = path.join(__dirname, 'data', 'scraped');
            if (!fs.existsSync(scrapedDir)) {
                fs.mkdirSync(scrapedDir, { recursive: true });
            }
            fs.writeFileSync(
                path.join(scrapedDir, `${target.id}.json`),
                JSON.stringify(parsed, null, 2)
            );

        } catch (err) {
            console.log(`   ❌ Error: ${err.message}`);
            errors.push({ id: target.id, error: err.message });
        }

        // Rate limit: wait between requests
        if (i < targets.length - 1) {
            console.log(`   ⏳ Waiting 2s (rate limit)...`);
            await sleep(2000);
        }
    }

    // Save combined output
    const outputPath = path.join(__dirname, 'data', 'benefits-scraped.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log(`
════════════════════════════════════════════════════════════
✅ Completed: ${results.length}/${targets.length} benefits scraped
❌ Errors: ${errors.length}
📁 Output: ${outputPath}
════════════════════════════════════════════════════════════
    `);

    if (errors.length > 0) {
        console.log('Errors:');
        errors.forEach(e => console.log(`  - ${e.id}: ${e.error}`));
    }
}

main().catch(console.error);
