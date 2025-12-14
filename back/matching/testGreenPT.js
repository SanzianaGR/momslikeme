/**
 * @fileoverview Test greenPT integration
 */

import "dotenv/config";
import LLMAnalyzer from "./llm_analyser.js";
import { sampleUser, benefitsCatalog } from "./mock_data.js";

async function testGreenPT() {
  console.log("\n🌱 Testing greenPT Integration");
  console.log("=".repeat(80));

  // Check environment
  const apiKey = process.env.GREENPT_API_KEY;
  if (!apiKey) {
    console.error("\n❌ GREENPT_API_KEY not found in .env file");
    console.log("\nPlease add to back/.env:");
    console.log("GREENPT_API_KEY=your_key_here");
    console.log("GREENPT_MODEL=greenr");
    process.exit(1);
  }

  console.log("✅ API Key found");
  console.log(`Model: ${process.env.GREENPT_MODEL || "greenr (default)"}`);

  // Initialize analyzer
  const analyzer = new LLMAnalyzer(apiKey, {
    model: process.env.GREENPT_MODEL || "greenr",
  });

  // Test with 2 benefits
  const testBenefits = benefitsCatalog.slice(0, 2);
  console.log(`\n🔍 Analyzing ${testBenefits.length} benefits:`);
  testBenefits.forEach((b) => console.log(`  - ${b.info.nameNL}`));

  try {
    console.log("\n⏳ Calling greenPT API...");
    const start = Date.now();
    const analyses = await analyzer.analyzeBenefits(sampleUser, testBenefits);
    const duration = ((Date.now() - start) / 1000).toFixed(2);

    console.log(`✅ Complete in ${duration}s`);
    console.log("\n" + "=".repeat(80));
    console.log("RESULTS");
    console.log("=".repeat(80));

    analyses.forEach((analysis, i) => {
      console.log(`\n${i + 1}. ${analysis.benefitName}`);
      console.log(`   Score: ${analysis.matchScore}/100`);

      if (analysis.hardRequirements?.length > 0) {
        console.log("\n   Hard Requirements:");
        analysis.hardRequirements.forEach((req) => {
          const icon =
            req.status === "met" ? "✓" : req.status === "not_met" ? "✗" : "?";
          console.log(`     ${icon} ${req.text}`);
        });
      }

      if (analysis.positiveFactors?.length > 0) {
        console.log("\n   ✅ Positive:");
        analysis.positiveFactors.forEach((f) => console.log(`     • ${f}`));
      }

      if (analysis.uncertainFactors?.length > 0) {
        console.log("\n   ⚠️  Uncertain:");
        analysis.uncertainFactors.forEach((f) => console.log(`     • ${f}`));
      }

      if (analysis.missingInfo?.length > 0) {
        console.log("\n   ❓ Missing Info:");
        analysis.missingInfo.forEach((f) => console.log(`     • ${f}`));
      }
    });

    console.log("\n" + "=".repeat(80));
    console.log("🌱 greenPT test successful! (100% renewable energy)");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.stack) console.error(error.stack);

    process.exit(1);
  }
}

testGreenPT();
