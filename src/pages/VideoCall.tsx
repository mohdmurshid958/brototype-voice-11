import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Monitor,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCall,
  useCallStateHooks,
  CallControls,
  SpeakerLayout,
  CallParticipantsList,
  StreamCall,
} from '@stream-io/video-react-sdk';
import { useStreamVideo } from "@/hooks/useStreamVideo";
import { useVideoCalls } from "@/hooks/useVideoCalls";
import { StreamVideoProvider } from "@/components/StreamVideoProvider";
import { supabase } from "@/integrations/supabase/client";

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
        const newCall = client.call('default', streamCallId);
        await newCall.join({ create: true });
        setCall(newCall);
        
        // Update call status to active using database UUID
        await updateCallStatus(callId, 'active');
      } catch (error) {
        console.error('Error joining call:', error);
      } finally {
        setIsJoining(false);
      }
    };

    initCall();

    return () => {
      if (call) {
        const duration = Math.floor((Date.now() - callStartTime) / 1000);
        updateCallStatus(callId!, 'completed', duration);
        call.leave();
      }
    };
  }, [client, streamCallId, callId]);

  const handleEndCall = async () => {
    if (call && callId) {
      const duration = Math.floor((Date.now() - callStartTime) / 1000);
      await updateCallStatus(callId, 'completed', duration);
      await call.leave();
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
        <div className="fixed inset-0 bg-black flex flex-col">
          {/* Main Video Area */}
          <div className="flex-1 relative">
            <SpeakerLayout />
          </div>

          {/* Bottom Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="max-w-3xl mx-auto">
              <CallControls onLeave={handleEndCall} />
            </div>
          </div>
        </div>
      </StreamCall>
    </StreamVideoProvider>
  );
};

const VideoCall = () => {
  return <VideoCallContent />;
};

export default VideoCall;