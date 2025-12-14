/**
 * @fileoverview Test runner for benefit matching engine
 */

import BenefitMatcher from "./matcher.js";
import { sampleUser, benefitsCatalog } from "./mock_data.js";
import dotenv from "dotenv";

async function runTest() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         HULPWIJZER BENEFIT MATCHING TEST                 ║");
  console.log(
    "╚════════════════════════════════════════════════════════════╝\n"
  );

  dotenv.config();

  // Display user profile
  console.log("📋 USER PROFILE");
  console.log("─".repeat(60));
  console.log(`Name: Alleenstaande moeder`);
  console.log(`Age: ${sampleUser.personal.age}`);
  console.log(`Municipality: ${sampleUser.personal.municipality}`);
  console.log(`Household: ${sampleUser.personal.householdType}`);
  console.log(
    `Children: ${
      sampleUser.children.numberOfChildren
    } (ages: ${sampleUser.children.childrenAges.join(", ")})`
  );
  console.log(
    `Housing: ${sampleUser.housing.situation} (€${sampleUser.housing.monthlyRent}/month)`
  );
  console.log(`Base rent: €${sampleUser.housing.rentBaseOnly}/month`);
  console.log(`Income: €${sampleUser.financial.annualIncomeGross}/year`);
  console.log(`Assets: €${sampleUser.financial.assets}`);
  console.log(
    `Working: ${sampleUser.workEducation.employed ? "Yes" : "No"} (${
      sampleUser.workEducation.hoursPerWeek
    }h/week)`
  );
  console.log(
    `Health insurance: ${sampleUser.health.hasHealthInsurance ? "Yes" : "No"}`
  );
  console.log(
    `Childcare: ${sampleUser.health.needsChildcare ? "Yes" : "No"} (${
      sampleUser.health.childcareHoursPerWeek
    }h/week, ${
      sampleUser.health.childcareRegistered ? "registered" : "not registered"
    })`
  );
  console.log("");

  // Initialize matcher
  const apiKey = process.env.GREENPT_API_KEY;
  if (!apiKey) {
    console.error("❌ Error: GREENPT_API_KEY environment variable not set");
    console.log("\nSet it with: export GREENPT_API_KEY=your_key_here");
    console.log("Or add to your .env file:");
    console.log("GREENPT_API_KEY=your_key_here\n");
    process.exit(1);
  }

  console.log("✅ Using GreenPT API (100% renewable energy 🌱)\n");

  const matcher = new BenefitMatcher(apiKey);

  // Run matching
  const { matches, rejected } = await matcher.matchBenefits(
    sampleUser,
    benefitsCatalog
  );

  // Display results
  console.log(
    "\n╔════════════════════════════════════════════════════════════╗"
  );
  console.log("║                    MATCHING RESULTS                       ║");
  console.log(
    "╚════════════════════════════════════════════════════════════╝\n"
  );

  console.log(`✅ Found ${matches.length} matching benefits\n`);

  if (matches.length === 0) {
    console.log("No benefits match your profile.\n");

    if (rejected.totalRejected > 0) {
      console.log("❌ REJECTION ANALYSIS:");
      console.log("─".repeat(60));
      for (const { reason, count, percentage } of rejected.reasons) {
        console.log(`• ${reason}`);
        console.log(`  Rejected: ${count} benefits (${percentage}%)\n`);
      }
    }

    return;
  }

  // Group by priority
  const highPriority = matches.filter((m) => m.priority === "high");
  const mediumPriority = matches.filter((m) => m.priority === "medium");
  const lowPriority = matches.filter((m) => m.priority === "low");

  // Display high priority
  if (highPriority.length > 0) {
    console.log("🔥 HIGH PRIORITY\n");
    for (const match of highPriority) {
      printMatch(match);
    }
  }

  // Display medium priority
  if (mediumPriority.length > 0) {
    console.log("📌 MEDIUM PRIORITY\n");
    for (const match of mediumPriority) {
      printMatch(match);
    }
  }

  // Display low priority
  if (lowPriority.length > 0) {
    console.log("📋 WORTH CHECKING\n");
    for (const match of lowPriority) {
      printMatch(match);
    }
  }

  // Summary
  console.log(
    "\n╔════════════════════════════════════════════════════════════╗"
  );
  console.log("║                         SUMMARY                           ║");
  console.log(
    "╚════════════════════════════════════════════════════════════╝\n"
  );

  const totalMonthly = matches.reduce((sum, m) => {
    return sum + (m.estimatedAmount?.mostLikely || 0);
  }, 0);

  const totalAnnual = totalMonthly * 12;

  console.log(`💰 Total Estimated Monthly: €${Math.round(totalMonthly)}`);
  console.log(`💰 Total Estimated Annual: €${Math.round(totalAnnual)}`);
  console.log("");

  console.log("Benefits by urgency:");
  const urgent = matches.filter((m) => m.urgency === "urgent").length;
  const soon = matches.filter((m) => m.urgency === "soon").length;
  const flexible = matches.filter((m) => m.urgency === "flexible").length;
  console.log(`  • Urgent (< 30 days): ${urgent}`);
  console.log(`  • Soon (30-90 days): ${soon}`);
  console.log(`  • Flexible: ${flexible}`);
  console.log("");
}

function printMatch(match) {
  const urgencyEmoji = {
    urgent: "🚨",
    soon: "⏰",
    flexible: "📅",
  };

  console.log("─".repeat(60));
  console.log(
    `${match.benefitName} - ${match.matchScore}% match ${
      urgencyEmoji[match.urgency]
    }`
  );
  console.log(`Provider: ${match.benefitId.split("_")[0]}`);

  // Display retrieval metadata if available
  if (match.rerankScore !== undefined) {
    console.log(`🌱 GreenPT Rerank Score: ${match.rerankScore.toFixed(4)}`);
  }
  if (match.rrfScore !== undefined) {
    console.log(`RRF Score: ${match.rrfScore.toFixed(4)}`);
    console.log(
      `Rankings: BM25 #${match.bm25Rank}, Embeddings #${match.embeddingRank}`
    );
  }

  if (match.estimatedAmount) {
    console.log(
      `Estimated: €${match.estimatedAmount.mostLikely}/${match.estimatedAmount.frequency}`
    );
    if (match.estimatedAmount.explanation) {
      console.log(`  ${match.estimatedAmount.explanation}`);
    }
  }

  console.log("");

  // Hard requirements
  if (match.hardRequirements?.length > 0) {
    console.log("Hard Requirements:");
    for (const req of match.hardRequirements) {
      const icon =
        req.status === "met" ? "✓" : req.status === "not_met" ? "✗" : "?";
      console.log(`  ${icon} ${req.text}`);
      if (req.reasoning) {
        console.log(`     ${req.reasoning}`);
      }
    }
    console.log("");
  }

  // Soft requirements
  if (match.softRequirements?.length > 0) {
    console.log("Soft Requirements:");
    for (const req of match.softRequirements) {
      const icon =
        req.status === "met" ? "✓" : req.status === "not_met" ? "✗" : "?";
      console.log(`  ${icon} ${req.text}`);
    }
    console.log("");
  }

  // Positive factors
  if (match.positiveFactors?.length > 0) {
    console.log("✓ Why you qualify:");
    for (const factor of match.positiveFactors) {
      console.log(`  • ${factor}`);
    }
    console.log("");
  }

  // Uncertain factors
  if (match.uncertainFactors?.length > 0) {
    console.log("⚠️ Important to check:");
    for (const factor of match.uncertainFactors) {
      console.log(`  • ${factor}`);
    }
    console.log("");
  }

  // Missing info
  if (match.missingInfo?.length > 0) {
    console.log("❓ Missing information:");
    for (const info of match.missingInfo) {
      console.log(`  • ${info}`);
    }
    console.log("");
  }

  console.log("");
}

// Run test
runTest().catch((error) => {
  console.error("❌ Error running test:", error);
  console.error(error.stack);
  process.exit(1);
});
