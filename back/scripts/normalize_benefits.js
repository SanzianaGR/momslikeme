/**
 * Normalize benefits.json to ensure consistent data structure
 * 
 * Moves root-level fields (name, description, type, provider) into info object
 * to match the expected schema used by the frontend.
 */

const fs = require('fs');
const path = require('path');

const benefitsPath = path.join(__dirname, '..', '..', 'data', 'benefits.json');

console.log('📦 Loading benefits from:', benefitsPath);

const benefits = JSON.parse(fs.readFileSync(benefitsPath, 'utf8'));

console.log(`📋 Found ${benefits.length} benefits to normalize.`);

let normalizedCount = 0;

const normalized = benefits.map(b => {
  // Ensure info object exists
  if (!b.info) b.info = {};
  
  let changed = false;
  
  // Move root-level fields into info if missing from info
  if (!b.info.name && b.name) {
    b.info.name = b.name;
    delete b.name;
    changed = true;
  }
  if (!b.info.description && b.description) {
    b.info.description = b.description;
    delete b.description;
    changed = true;
  }
  if (!b.info.type && b.type) {
    b.info.type = b.type;
    delete b.type;
    changed = true;
  }
  if (!b.info.provider && b.provider) {
    b.info.provider = b.provider;
    delete b.provider;
    changed = true;
  }
  
  // Also handle application_url if at root in application object
  if (!b.info.application_url && b.application?.url) {
    b.info.application_url = b.application.url;
  }
  
  if (changed) {
    normalizedCount++;
    console.log(`  ✅ Normalized: ${b.benefitId}`);
  }
  
  return b;
});

fs.writeFileSync(benefitsPath, JSON.stringify(normalized, null, 2));

console.log(`\n🎉 Done! Normalized ${normalizedCount} of ${benefits.length} benefits.`);
