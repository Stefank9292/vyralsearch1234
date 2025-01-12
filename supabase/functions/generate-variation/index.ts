import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcriptionId } = await req.json();
    console.log('Generating variation for transcription:', transcriptionId);

    if (!transcriptionId) {
      throw new Error('Transcription ID is required');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get original transcription
    const { data: originalScript, error: fetchError } = await supabaseClient
      .from('scripts')
      .select('original_text')
      .eq('id', transcriptionId)
      .single();

    if (fetchError || !originalScript) {
      console.error('Error fetching original script:', fetchError);
      throw new Error('Original transcription not found');
    }

    // Generate variation using GPT
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a creative script writer that helps create engaging variations of social media content while maintaining the core message.'
          },
          {
            role: 'user',
            content: `Create a new script variation with 3 hook options based on this original script: "${originalScript.original_text}". Include a complete script example and explanation of why it works. Format it with clear sections for Hook Options, Full Script Example, and Why This Works.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate variation');
    }

    const data = await response.json();
    const variation = data.choices[0].message.content;

    // Store variation in database
    const { data: variationScript, error: insertError } = await supabaseClient
      .from('scripts')
      .insert({
        user_id: req.auth.uid,
        original_text: variation,
        script_type: 'variation',
        parent_script_id: transcriptionId
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing variation:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        id: variationScript.id,
        variation: variation 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-variation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});