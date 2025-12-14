
import { scrapeBenefit } from '../scraper.mjs';

// Municipal Benefits Configuration
const MUNICIPAL_BENEFITS = [
    // --- AMSTERDAM ---
    {
        id: 'amsterdam-bijzondere-bijstand',
        url: 'https://www.amsterdam.nl/werk-inkomen/bijstand/bijzondere-bijstand/',
        provider: 'Gemeente Amsterdam',
        type: 'municipal'
    },
    {
        id: 'amsterdam-scholierenvergoeding',
        url: 'https://www.amsterdam.nl/werk-inkomen/pak-je-kans/scholierenvergoeding/',
        provider: 'Gemeente Amsterdam',
        type: 'municipal'
    },
    {
        id: 'amsterdam-stadspas',
        url: 'https://www.amsterdam.nl/stadspas/aanvragen/',
        provider: 'Gemeente Amsterdam',
        type: 'municipal'
    },

    // --- ROTTERDAM ---
    {
        id: 'rotterdam-bijzondere-bijstand',
        url: 'https://www.rotterdam.nl/bijzondere-bijstand',
        provider: 'Gemeente Rotterdam',
        type: 'municipal'
    },
    {
        id: 'rotterdam-jeugdtegoed',
        url: 'https://www.rotterdam.nl/jeugdtegoed',
        provider: 'Gemeente Rotterdam',
        type: 'municipal'
    },

    // --- DEN HAAG ---
    {
        id: 'denhaag-bijzondere-bijstand',
        url: 'https://www.denhaag.nl/nl/werk-bijstand-en-uitkering/uitkering-en-bijstand/uitkering-of-bijstand-aanvragen/bijzondere-bijstand-aanvragen.htm',
        provider: 'Gemeente Den Haag',
        type: 'municipal'
    },
    {
        id: 'denhaag-ooievaarspas',
        url: 'https://www.denhaag.nl/nl/geld-en-schulden/ooievaarspas-aanvragen/',
        provider: 'Gemeente Den Haag',
        type: 'municipal'
    }
];

// Rate Limit Config
const CALL_DELAY_MS = 10000; // 10s delay to be polite and avoid blocks

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runMunicipalScrape() {
    console.log("🏙️  Starting Municipal Benefits Scrape");
    console.log("--------------------------------------");
    
    console.log(`📋 Found ${MUNICIPAL_BENEFITS.length} municipal benefits to scrape.`);

    for (const [index, item] of MUNICIPAL_BENEFITS.entries()) {
        console.log(`\n[${index + 1}/${MUNICIPAL_BENEFITS.length}] Processing ${item.id}...`);
        try {
            await scrapeBenefit(item.url, item.id, item.provider, item.type);
            console.log(`   ✅ Success`);
        } catch (e) {
            console.error(`   ❌ Failed: ${e.message}`);
        }
        
        if (index < MUNICIPAL_BENEFITS.length - 1) {
            console.log(`   ⏳ Waiting ${CALL_DELAY_MS/1000}s...`);
            await sleep(CALL_DELAY_MS);
        }
    }

    console.log("\n🎉 Municipal Scrape Complete.");
}

runMunicipalScrape();
