const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { model } = require('../config/ai');

const benefitsPath = path.join(__dirname, '..', '..', 'data', 'benefits.json');

/**
 * Load benefits from file
 * @returns {import('../matching/schemas').Benefit[]}
 */
function loadBenefits() {
    try {
        return JSON.parse(fs.readFileSync(benefitsPath, 'utf8'));
    } catch (e) {
        return [];
    }
}

/**
 * Save benefits to file
 * @param {import('../matching/schemas').Benefit[]} benefits
 */
function saveBenefits(benefits) {
    fs.writeFileSync(benefitsPath, JSON.stringify(benefits, null, 2));
}

// GET /api/benefits - List all benefits
router.get('/', (req, res) => {
    const benefits = loadBenefits();
    res.json(benefits);
});

// GET /api/benefits/:id - Get single benefit
router.get('/:id', (req, res) => {
    const benefits = loadBenefits();
    const benefit = benefits.find(b => b.benefitId === req.params.id);
    if (!benefit) {
        return res.status(404).json({ error: 'Benefit not found' });
    }
    res.json(benefit);
});

// POST /api/benefits/import - Import benefit (from scraper or external)
router.post('/import', (req, res) => {
    try {
        let benefit = req.body;
        
        // Handle stringified JSON
        if (typeof benefit === 'string') {
            benefit = JSON.parse(benefit.replace(/```json/g, '').replace(/```/g, '').trim());
        }

        // Validate required fields (Benefit schema)
        if (!benefit.benefitId || !benefit.info?.nameNL) {
            return res.status(400).json({ 
                error: 'Missing required fields: benefitId and info.nameNL' 
            });
        }

        benefit.importedAt = new Date().toISOString();

        let benefits = loadBenefits();
        const existingIndex = benefits.findIndex(b => b.benefitId === benefit.benefitId);
        
        if (existingIndex >= 0) {
            benefits[existingIndex] = { ...benefits[existingIndex], ...benefit };
            console.log(`✅ Updated: ${benefit.benefitId}`);
        } else {
            benefits.push(benefit);
            console.log(`✅ Added: ${benefit.benefitId}`);
        }

        saveBenefits(benefits);
        res.json({ 
            success: true, 
            benefitId: benefit.benefitId, 
            action: existingIndex >= 0 ? 'updated' : 'added' 
        });
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/benefits/match - AI-powered eligibility matching
router.post('/match', async (req, res) => {
    try {
        const userProfile = req.body;
        const benefits = loadBenefits();

        // Build context from benefits using the schema
        const benefitsContext = benefits.map(b => ({
            id: b.benefitId,
            name: b.info?.nameNL || b.name,
            provider: b.info?.provider || b.provider,
            category: b.info?.category || b.type,
            eligibility: b.eligibility,
            description: b.info?.descriptionNL || b.description
        }));

        const prompt = `
You are an empathetic social worker helping a single parent find financial support in the Netherlands.

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

AVAILABLE BENEFITS:
${JSON.stringify(benefitsContext, null, 2)}

INSTRUCTIONS:
1. Match national benefits to everyone
2. Match municipal benefits only if municipality matches
3. Check eligibility rules (income, children, etc.)
4. Be inclusive - if unsure, include with "medium" confidence

Return ONLY JSON (no markdown):
{
    "matches": [
        { 
            "benefitId": "id", 
            "confidence": "high|medium", 
            "reason": "One sentence why" 
        }
    ]
}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonResponse = JSON.parse(cleanedText);

        res.json(jsonResponse);
    } catch (error) {
        console.error("Match error:", error);
        res.status(500).json({ error: "Failed to match", details: error.message });
    }
});

module.exports = router;
