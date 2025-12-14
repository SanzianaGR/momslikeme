
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '../data/municipality_urls.json');
const XML_URL = "https://organisaties.overheid.nl/archive/exportOO.xml";

async function main() {
    console.log("🚀 Starting Municipality Data Fetcher");
    console.log(`📡 Fetching XML from ${XML_URL}...`);
    
    try {
        const response = await fetch(XML_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const xml = await response.text();
        
        console.log(`   📦 Received ${xml.length} bytes. Parsing...`);
        
        const $ = cheerio.load(xml, { xmlMode: true });
        const results = [];
        
        // Inspect structure - usually <organisatie>
        $('organisatie').each((i, el) => {
            const types = $(el).find('types type').map((_, t) => $(t).text()).get();
            
            // Check if it is a municipality
            if (types.includes('Gemeente')) {
                const name = $(el).find('naam').text();
                // Internet can be in <contact><internet> or similar
                const website = $(el).find('internet').first().text();
                
                if (name && website) {
                    results.push({
                        name: name,
                        url: website,
                        provider: name,
                        type: 'municipal',
                        province: $(el).find('parents parent').first().text() || null
                    });
                }
            }
        });
        
        console.log(`📋 Extracted ${results.length} municipalities.`);
        
        if (results.length > 0) {
            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
            console.log(`✅ Saved to ${OUTPUT_PATH}`);
        } else {
            console.warn("⚠️ No municipalities found. XML structure might be different than expected.");
            console.log("Snippet of XML:", xml.substring(0, 1000));
        }

    } catch (e) {
        console.error(`❌ Error: ${e.message}`);
    }
}

main();
