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

    const { adminId } = await req.json();

    if (!adminId) {
      throw new Error('Admin ID is required');
    }

    // Generate unique call ID
    const streamCallId = `call_${user.id}_${Date.now()}`;

    // Create video call record
    const { data: videoCall, error: callError } = await supabaseClient
      .from('video_calls')
      .insert({
        stream_call_id: streamCallId,
        student_id: user.id,
        admin_id: adminId,
        status: 'pending',
      })
      .select()
      .single();

    if (callError) {
      console.error('Error creating video call:', callError);
      throw callError;
    }

    console.log('Video call created:', videoCall);

    return new Response(
      JSON.stringify({ 
        success: true, 
        call: videoCall,
        streamCallId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-video-call:', error);
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