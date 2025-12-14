const express = require('express');
const router = express.Router();

// greenPT API configuration
const GREENPT_API_KEY = process.env.GREENPT_API_KEY;
const GREENPT_BASE_URL = process.env.GREENPT_BASE_URL || 'https://api.greenpt.ai/v1';

/**
 * POST /api/greenpt/chat
 * Proxy chat requests to greenPT API
 */
router.post('/chat', async (req, res) => {
  try {
    const { model, messages, temperature, max_tokens } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!GREENPT_API_KEY) {
      return res.status(500).json({ error: 'greenPT API key not configured' });
    }

    // Call greenPT API
    const response = await fetch(`${GREENPT_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GREENPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'green-r',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('greenPT API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'greenPT API request failed',
        details: errorText,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('greenPT chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat request',
      message: error.message,
    });
  }
});

/**
 * POST /api/greenpt/transcribe
 * Proxy transcription requests to greenPT API
 */
router.post('/transcribe', async (req, res) => {
  try {
    // This endpoint would handle audio transcription
    // For now, return not implemented
    res.status(501).json({
      error: 'Transcription endpoint not yet implemented',
    });
  } catch (error) {
    console.error('greenPT transcribe error:', error);
    res.status(500).json({
      error: 'Failed to process transcription request',
      message: error.message,
    });
  }
});

module.exports = router;
