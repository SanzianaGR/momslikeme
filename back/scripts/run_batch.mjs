
import { scrapeBenefit } from '../scraper.mjs';
import { NATIONAL_BENEFITS, PRIVATE_FUNDS } from './batch_data.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const MUNICIPALITIES_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../data/schemes/data/data/municipalities/nl_municipalities.json');

// Rate Limit Config
const CALL_DELAY_MS = 5000;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBatch() {
    console.log("🚀 Starting Mass Scrape Operation");
    console.log("---------------------------------");

    // 1. National & Private
    const todoList = [...NATIONAL_BENEFITS, ...PRIVATE_FUNDS];
    
    console.log(`📋 Found ${todoList.length} defined benefits to scrape.`);

    for (const [index, item] of todoList.entries()) {
        console.log(`\n[${index + 1}/${todoList.length}] Processing ${item.id}...`);
        try {
            await scrapeBenefit(item.url, item.id, item.provider, item.type);
            console.log(`   ✅ Success`);
        } catch (e) {
            console.error(`   ❌ Failed: ${e.message}`);
        }
        
        if (index < todoList.length - 1) {
            console.log(`   ⏳ Waiting ${CALL_DELAY_MS/1000}s...`);
            await sleep(CALL_DELAY_MS);
        }
    }

    // 2. Municipalities (Placeholder)
    console.log("\n--- Processing Municipalities ---");
    try {
        const municipalities = JSON.parse(fs.readFileSync(MUNICIPALITIES_PATH, 'utf8'));
        console.log(`ℹ️ Found ${municipalities.length} municipalities.`);
        console.log("⚠️ NOTE: Skipping municipal scrape as generic URLs are not defined.");
        console.log("   (To fix: Add a 'municipal_finder_url' logic or specific URLs per city)");
    } catch (e) {
        console.warn(`⚠️ Could not read municipalities file: ${e.message}`);
    }

    console.log("\n🎉 Batch Operation Complete.");
}

runBatch();
