import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { StreamClient } from "https://esm.sh/@stream-io/node-sdk@0.1.13";

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

    const { callId } = await req.json();

    if (!callId) {
      throw new Error('Call ID is required');
    }

    const apiKey = Deno.env.get('GETSTREAM_API_KEY');
    const apiSecret = Deno.env.get('GETSTREAM_API_SECRET');

    if (!apiKey || !apiSecret) {
      throw new Error('GetStream credentials not configured');
    }

    const client = new StreamClient(apiKey, apiSecret);
    const token = client.createToken(user.id);

    // Record participant
    const { data: participant, error: participantError } = await supabaseClient
      .from('call_participants')
      .insert({
        call_id: callId,
        user_id: user.id,
        stream_user_token: token,
        joined_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (participantError) {
      console.error('Error recording participant:', participantError);
      throw participantError;
    }

    console.log('User joined call:', participant);

    return new Response(
      JSON.stringify({ 
        success: true, 
        token,
        userId: user.id,
        participant 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in join-video-call:', error);
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