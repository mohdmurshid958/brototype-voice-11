import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { callId, status, durationSeconds } = await req.json();

    if (!callId || !status) {
      throw new Error('Call ID and status are required');
    }

    const updateData: any = { status };

    if (status === 'active' && !updateData.started_at) {
      updateData.started_at = new Date().toISOString();
    }

    if (status === 'completed' || status === 'cancelled') {
      updateData.ended_at = new Date().toISOString();
      if (durationSeconds) {
        updateData.duration_seconds = durationSeconds;
      }
    }

    const { data: videoCall, error: updateError } = await supabaseClient
      .from('video_calls')
      .update(updateData)
      .eq('id', callId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating call status:', updateError);
      throw updateError;
    }

    console.log('Call status updated:', videoCall);

    return new Response(
      JSON.stringify({ success: true, call: videoCall }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update-call-status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});