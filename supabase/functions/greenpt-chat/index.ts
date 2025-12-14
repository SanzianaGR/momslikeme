import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// System context for Bloom - the benefits assistant with structured flow
const SYSTEM_PROMPT = `You are Bloom, a warm AI assistant helping single parents in the Netherlands discover benefits they're entitled to.

CONVERSATION FLOW - Ask these questions ONE AT A TIME in this exact order:
1. First: Greet warmly and ask if they have children and how many
2. Second: Ask about children's ages (baby/toddler 0-4, school age 4-12, teenager 12-18, or mixed)
3. Third: Ask which municipality/city they live in (e.g., Amsterdam, Rotterdam, Utrecht, etc.)
4. Fourth: Ask about housing situation (renting privately, social housing, own home, living with family)
5. Fifth: Ask about monthly household income (under €1,500 / €1,500-2,500 / €2,500-3,500 / above €3,500)
6. Sixth: Ask about work situation (full-time employed, part-time, looking for work, studying, unable to work)
7. Seventh: Ask if they use registered childcare (daycare, after-school care, etc.)
8. Eighth: Ask about their biggest challenge right now (childcare costs, healthcare expenses, rent/housing, making ends meet, everything feels overwhelming)

CRITICAL RULES:
- Ask ONLY ONE question per message, max 2 sentences
- Acknowledge their previous answer briefly (1 line) before asking the next question
- Look at CURRENT INFO GATHERED to know what's already been answered - don't repeat questions!
- NEVER ask for BSN, full name, address, or personal identifiers
- When all 8 questions are answered, say: "Thank you for trusting me with your story. Let me find what support you're entitled to..."
- Benefits are their RIGHT, not charity

TONE: Warm, supportive, like a helpful friend who knows the Dutch system well.`;

// Document explanation prompt
const DOCUMENT_PROMPT = `You are Bloom, helping a single parent understand a government document. Based on the filename, explain in VERY simple words:
1. What kind of document this likely is
2. What it probably means for them
3. What action they might need to take
4. Any deadlines to watch for

Keep it friendly, under 80 words. No jargon.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, isDocument, profileContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = isDocument ? DOCUMENT_PROMPT : SYSTEM_PROMPT;
    
    // Add profile context if available
    if (profileContext && !isDocument) {
      systemPrompt += `\n\nCURRENT INFO GATHERED:\n${profileContext}\n\nBased on what's missing, ask the next question in the flow.`;
    }
    
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    console.log('Calling Lovable AI with', apiMessages.length, 'messages');

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: apiMessages,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway Error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI request failed', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
