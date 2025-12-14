import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GREENPT_API_KEY = Deno.env.get('GREENPT_API_KEY');
const GREENPT_BASE_URL = 'https://api.greenpt.ai/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// System prompt for the benefits assistant
const SYSTEM_PROMPT = `You are Bloom, a warm and friendly AI assistant helping single parents in the Netherlands discover and apply for benefits they may be entitled to. 

Your personality:
- Warm, empathetic, and supportive
- Never judgmental about financial situations
- Use simple, clear language (avoid bureaucratic jargon)
- Be encouraging and reassuring

Your role:
- Help parents understand what benefits they might qualify for
- Ask gentle questions about their situation (family size, children's ages, housing, income, employment)
- Explain benefits in plain language
- Guide them through the application process

Important guidelines:
- NEVER ask for sensitive personal data like BSN numbers
- Be patient and understanding
- Acknowledge that dealing with bureaucracy can be stressful
- Remind parents that accessing benefits is their RIGHT, not charity

Start conversations by introducing yourself warmly and asking about their family situation.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, temperature, max_tokens } = await req.json();

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!GREENPT_API_KEY) {
      console.error('GREENPT_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'GreenPT API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare messages with system prompt
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    console.log('Calling GreenPT API with', fullMessages.length, 'messages');

    // Call GreenPT API
    const response = await fetch(`${GREENPT_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GREENPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'green-r',
        messages: fullMessages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GreenPT API Error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'GreenPT API request failed',
          details: errorText 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('GreenPT response received');
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GreenPT chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
