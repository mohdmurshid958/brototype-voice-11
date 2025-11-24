import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StreamCall } from '@stream-io/video-react-sdk';
import { useStreamVideo } from "@/hooks/useStreamVideo";
import { useVideoCalls } from "@/hooks/useVideoCalls";
import { StreamVideoProvider } from "@/components/StreamVideoProvider";
import { supabase } from "@/integrations/supabase/client";
import { VideoCallUI } from "@/components/VideoCallUI";

const VideoCallContent = () => {
  const navigate = useNavigate();
  const { callId } = useParams(); // This is now the database UUID
  const { client, isLoading: isClientLoading } = useStreamVideo();
  const { updateCallStatus } = useVideoCalls();
  const [call, setCall] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [callStartTime] = useState(Date.now());
  const [streamCallId, setStreamCallId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the stream_call_id from database using the callId (UUID)
    const fetchCallData = async () => {
      if (!callId) return;
      
      const { data, error } = await supabase
        .from('video_calls')
        .select('stream_call_id')
        .eq('id', callId)
        .single();

      if (error) {
        console.error('Error fetching call data:', error);
        return;
      }

      setStreamCallId(data.stream_call_id);
    };

    fetchCallData();
  }, [callId]);

  useEffect(() => {
    if (!client || !streamCallId || !callId) return;

    const initCall = async () => {
      setIsJoining(true);
      try {
        console.log('Initializing call with ID:', streamCallId);
        
        // Request camera and microphone permissions explicitly
        try {
          await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          console.log('Camera and microphone permissions granted');
        } catch (permError) {
          console.error('Permission error:', permError);
          // Show a user-friendly error
          alert('Camera and microphone access is required for video calls. Please allow access in your browser settings.');
          throw permError;
        }
        
        const newCall = client.call('default', streamCallId);
        
        // Get or create the call - this allows both users to join the same call
        await newCall.getOrCreate();
        
        // Join the call with audio and video
        await newCall.join({ 
          create: false 
        });
        
        console.log('Successfully joined call');
        
        setCall(newCall);
        
        // Enable microphone and camera
        try {
          await newCall.microphone.enable();
          await newCall.camera.enable();
          console.log('Microphone and camera enabled');
        } catch (deviceError) {
          console.warn('Could not enable devices:', deviceError);
          // Continue - user can enable manually
        }
        
        // Update call status to active using database UUID
        await updateCallStatus(callId, 'active');
      } catch (error) {
        console.error('Error joining call:', error);
        console.error('Call ID:', streamCallId);
        console.error('Client:', client);
      } finally {
        setIsJoining(false);
      }
    };

    initCall();

    return () => {
      if (call) {
        const duration = Math.floor((Date.now() - callStartTime) / 1000);
        updateCallStatus(callId!, 'completed', duration);
        // Check if call is still active before leaving
        if (call.state.callingState !== 'left') {
          call.leave().catch(err => console.warn('Error leaving call:', err));
        }
      }
    };
  }, [client, streamCallId, callId]);

  const handleEndCall = async () => {
    if (call && callId) {
      const duration = Math.floor((Date.now() - callStartTime) / 1000);
      await updateCallStatus(callId, 'completed', duration);
      // Check if call is still active before leaving
      if (call.state.callingState !== 'left') {
        await call.leave().catch(err => console.warn('Error leaving call:', err));
      }
    }
    navigate(-1);
  };

  if (isClientLoading || isJoining) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Connecting to call...</p>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to connect to call</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <StreamVideoProvider client={client}>
      <StreamCall call={call}>
        <VideoCallUI onLeave={handleEndCall} callId={callId!} />
      </StreamCall>
    </StreamVideoProvider>
  );
};

const VideoCall = () => {
  return <VideoCallContent />;
};

export default VideoCall;