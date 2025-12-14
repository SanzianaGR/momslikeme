import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GREENPT_API_KEY = Deno.env.get('GREENPT_API_KEY');
const GREENPT_BASE_URL = 'https://api.greenpt.ai/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Instructions for the benefits assistant (embedded in first message since GreenPT doesn't support system prompts)
const ASSISTANT_CONTEXT = `You are Bloom, a warm AI assistant helping single parents in the Netherlands find benefits. Be concise, empathetic, and use simple language. Never ask for BSN numbers. Remind parents that benefits are their RIGHT.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, temperature, max_tokens } = await req.json();

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

    // Embed context in first user message (GreenPT doesn't support system prompts)
    const enrichedMessages = messages.map((msg: any, idx: number) => {
      if (idx === 0 && msg.role === 'user') {
        return { ...msg, content: `[Context: ${ASSISTANT_CONTEXT}]\n\nUser: ${msg.content}` };
      }
      return msg;
    });

    console.log('Calling GreenPT API with', enrichedMessages.length, 'messages');

    const response = await fetch(`${GREENPT_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GREENPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || 'green-r',
        messages: enrichedMessages,
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
