
const BenefitMatcher = require('../matching/matcher').default;
const path = require('path');
const fs = require('fs');

// Load benefits data
const benefitsPath = path.join(__dirname, '..', '..', 'data', 'benefits.json');
function loadBenefits() {
    try {
        return JSON.parse(fs.readFileSync(benefitsPath, 'utf8'));
    } catch (e) {
        console.error('Error loading benefits:', e);
        return [];
    }
}

/**
 * Process match request
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function processMatch(req, res) {
    try {
        const userProfile = req.body;
        
        // Basic validation - check for key profile fields
        if (!userProfile.personal || !userProfile.financial) {
            return res.status(400).json({ 
                error: 'Invalid profile', 
                details: 'Missing required sections (personal, financial)' 
            });
        }

        const benefits = loadBenefits();
        
        // Initialize matcher with API key from env
        const matcher = new BenefitMatcher(process.env.GREENPT_API_KEY);
        
        // Run matching logic
        const results = await matcher.matchBenefits(userProfile, benefits);
        
        res.json(results);
        
    } catch (error) {
        console.error('Matching flow error:', error);
        res.status(500).json({ 
            error: 'Failed to process match', 
            details: error.message 
        });
    }
}

module.exports = {
    processMatch
};
