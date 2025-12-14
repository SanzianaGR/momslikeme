import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GREENPT_API_KEY = Deno.env.get('GREENPT_API_KEY');
const GREENPT_BASE_URL = 'https://api.greenpt.ai/v1';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple JSON-Logic evaluator for eligibility rules
function evaluateLogic(logic: any, data: any): boolean {
  if (!logic) return true;
  
  // Handle simple operators
  if (logic.and) {
    return logic.and.every((condition: any) => evaluateLogic(condition, data));
  }
  if (logic.or) {
    return logic.or.some((condition: any) => evaluateLogic(condition, data));
  }
  
  // Handle comparisons
  const operators = ['>=', '<=', '>', '<', '==', '!='];
  for (const op of operators) {
    if (logic[op]) {
      const [left, right] = logic[op];
      const leftVal = resolveVar(left, data);
      const rightVal = resolveVar(right, data);
      
      switch (op) {
        case '>=': return leftVal >= rightVal;
        case '<=': return leftVal <= rightVal;
        case '>': return leftVal > rightVal;
        case '<': return leftVal < rightVal;
        case '==': return leftVal == rightVal;
        case '!=': return leftVal != rightVal;
      }
    }
  }
  
  return true;
}

function resolveVar(value: any, data: any): any {
  if (typeof value === 'object' && value.var) {
    const path = value.var.split('.');
    let result = data;
    for (const key of path) {
      result = result?.[key];
    }
    return result ?? 0;
  }
  return value;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userProfile = await req.json();
    console.log('Received profile for matching:', JSON.stringify(userProfile));

    // Validate profile
    if (!userProfile) {
      return new Response(
        JSON.stringify({ error: 'User profile is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get benefits from database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: benefits, error } = await supabase
      .from('benefits')
      .select('*');

    if (error) {
      console.error('Error fetching benefits:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch benefits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${benefits?.length || 0} benefits to match`);

    // Match benefits using eligibility logic
    const matches = [];
    for (const benefit of benefits || []) {
      const isEligible = evaluateLogic(benefit.eligibility_logic, userProfile);
      
      if (isEligible) {
        matches.push({
          benefitId: benefit.benefit_id,
          name: benefit.name,
          nameNl: benefit.name_nl,
          description: benefit.description,
          descriptionNl: benefit.description_nl,
          provider: benefit.provider,
          type: benefit.type,
          estimatedAmount: benefit.estimated_amount,
          applicationUrl: benefit.application_url,
          eligibilitySummary: benefit.eligibility_summary,
          requiredDocuments: benefit.required_documents,
          applicationSteps: benefit.application_steps,
          matchScore: 0.85, // Default high score for rule-based matches
          matchReasons: benefit.eligibility_summary || [],
        });
      }
    }

    console.log(`Matched ${matches.length} benefits`);

    return new Response(JSON.stringify({ matches }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Benefits matching error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process match request',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
