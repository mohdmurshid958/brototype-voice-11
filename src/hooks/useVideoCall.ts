import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface CallParticipant {
  userId: string;
  userName: string;
  userRole: string;
}

interface CallSignal {
  type: 'offer' | 'answer' | 'ice-candidate' | 'end-call';
  from: string;
  to: string;
  data?: any;
  userName?: string;
  userRole?: string;
}

export const useVideoCall = (callId: string, remoteUserId?: string) => {
  const { user, userRole } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [remoteParticipant, setRemoteParticipant] = useState<CallParticipant | null>(null);
  const [dbCallId, setDbCallId] = useState<string | null>(null);
  const callStartTimeRef = useRef<Date | null>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);

  // Initialize local media stream - continue call even if media fails
  const initializeMedia = async () => {
    console.log("🎥 Requesting camera and microphone permissions...");
    
    try {
      // Request permissions explicitly to trigger browser prompt
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      console.log("✅ Media permissions granted");
      setLocalStream(stream);
      return stream;
      
    } catch (error: any) {
      console.log("⚠️ Full media access failed, trying alternatives...");
      
      // Try video only
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false,
        });
        console.log("✅ Video only mode");
        setLocalStream(stream);
        toast({
          title: "Video Only Mode",
          description: "Connected without microphone",
        });
        return stream;
      } catch (videoError) {
        // Try audio only
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          console.log("✅ Audio only mode");
          setLocalStream(stream);
          toast({
            title: "Audio Only Mode",
            description: "Connected without camera",
          });
          return stream;
        } catch (audioError) {
          // Continue without any media - call will still work
          console.log("✅ No media mode - call will connect anyway");
          const emptyStream = new MediaStream();
          setLocalStream(emptyStream);
          toast({
            title: "Connecting Without Media",
            description: "You can still receive video and audio",
          });
          return emptyStream;
        }
      }
    }
  };

  // Create peer connection
  const createPeerConnection = (stream: MediaStream) => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    
    // Add local stream tracks to peer connection
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && remoteUserId) {
        console.log("Sending ICE candidate");
        channelRef.current?.send({
          type: 'broadcast',
          event: 'signal',
          payload: {
            type: 'ice-candidate',
            from: user?.id,
            to: remoteUserId,
            data: event.candidate.toJSON(),
          },
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
      if (pc.connectionState === 'connected') {
        setIsConnected(true);
        setIsConnecting(false);
        updateCallStatus('active');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setIsConnected(false);
        if (pc.connectionState === 'failed') {
          updateCallStatus('failed');
        }
      }
    };

    return pc;
  };

  // Create call record in database
  const createCallRecord = async () => {
    if (!user || !remoteUserId) return;

    try {
      // First, check if a call record already exists for this stream_call_id
      const { data: existingCall, error: fetchError } = await supabase
        .from('video_calls')
        .select('id')
        .eq('stream_call_id', callId)
        .maybeSingle();

      if (existingCall) {
        // Use existing call record
        setDbCallId(existingCall.id);
        console.log("Using existing call record:", existingCall.id);
        return;
      }

      // Create new call record if none exists
      const isStudent = userRole === 'student';
      const { data, error } = await supabase
        .from('video_calls')
        .insert({
          stream_call_id: callId,
          student_id: isStudent ? user.id : remoteUserId,
          admin_id: isStudent ? remoteUserId : user.id,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      setDbCallId(data.id);
      console.log("Call record created:", data.id);
    } catch (error) {
      console.error("Error creating call record:", error);
    }
  };

  // Update call status
  const updateCallStatus = async (status: string, additionalData?: any) => {
    if (!dbCallId) return;

    try {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      
      if (status === 'active' && !callStartTimeRef.current) {
        callStartTimeRef.current = new Date();
        updateData.started_at = callStartTimeRef.current.toISOString();
      }
      
      if (status === 'ended' && callStartTimeRef.current) {
        const endTime = new Date();
        const durationSeconds = Math.floor((endTime.getTime() - callStartTimeRef.current.getTime()) / 1000);
        updateData.ended_at = endTime.toISOString();
        updateData.duration_seconds = durationSeconds;
      }

      if (additionalData) {
        Object.assign(updateData, additionalData);
      }

      const { error } = await supabase
        .from('video_calls')
        .update(updateData)
        .eq('id', dbCallId);

      if (error) throw error;
      console.log("Call status updated:", status);
    } catch (error) {
      console.error("Error updating call status:", error);
    }
  };

  // Start call (caller initiates)
  const startCall = async () => {
    if (!user || !remoteUserId) return;
    
    setIsConnecting(true);
    
    try {
      // Create call record
      await createCallRecord();

      const stream = await initializeMedia();
      const pc = createPeerConnection(stream);
      peerConnectionRef.current = pc;

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to remote user
      console.log("Sending offer to:", remoteUserId);
      channelRef.current?.send({
        type: 'broadcast',
        event: 'signal',
        payload: {
          type: 'offer',
          from: user.id,
          to: remoteUserId,
          data: offer,
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          userRole: userRole,
          callId: callId,
        },
      });
    } catch (error) {
      console.error("Error starting call:", error);
      setIsConnecting(false);
      await updateCallStatus('failed');
    }
  };

  // Answer call (receiver responds)
  const answerCall = async (offer: RTCSessionDescriptionInit, callerId: string) => {
    if (!user) return;
    
    setIsConnecting(true);
    
    try {
      const stream = await initializeMedia();
      const pc = createPeerConnection(stream);
      peerConnectionRef.current = pc;

      // Set remote description (offer)
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Add any pending ICE candidates
      for (const candidate of pendingCandidatesRef.current) {
        await pc.addIceCandidate(candidate);
      }
      pendingCandidatesRef.current = [];

      // Create answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer to caller
      console.log("Sending answer to:", callerId);
      channelRef.current?.send({
        type: 'broadcast',
        event: 'signal',
        payload: {
          type: 'answer',
          from: user.id,
          to: callerId,
          data: answer,
        },
      });
    } catch (error) {
      console.error("Error answering call:", error);
      setIsConnecting(false);
    }
  };

  // Handle received answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (peerConnectionRef.current) {
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        
        // Add any pending ICE candidates
        for (const candidate of pendingCandidatesRef.current) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
        pendingCandidatesRef.current = [];
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    }
  };

  // Handle received ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    } else {
      // Queue candidate until remote description is set
      pendingCandidatesRef.current.push(new RTCIceCandidate(candidate));
    }
  };

  // End call
  const endCall = async () => {
    // Update call status to ended
    await updateCallStatus('ended');

    if (remoteUserId && user) {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'signal',
        payload: {
          type: 'end-call',
          from: user.id,
          to: remoteUserId,
        },
      });
    }

    // Clean up
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    setRemoteStream(null);
    setIsConnected(false);
    setIsConnecting(false);
    callStartTimeRef.current = null;
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  };

  // Set up Supabase realtime channel for signaling
  useEffect(() => {
    if (!user) return;

    // Use a shared broadcast channel for all call signals
    const channel = supabase.channel('call-signals');
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'signal' }, ({ payload }: { payload: CallSignal }) => {
        console.log("Received signal:", payload.type, "from:", payload.from);
        
        // Only process signals meant for this user
        if (payload.to !== user.id) return;

        switch (payload.type) {
          case 'offer':
            setRemoteParticipant({
              userId: payload.from,
              userName: payload.userName || 'Unknown User',
              userRole: payload.userRole || 'user',
            });
            // Offer will be handled by IncomingCallToast
            break;
          case 'answer':
            handleAnswer(payload.data);
            break;
          case 'ice-candidate':
            handleIceCandidate(payload.data);
            break;
          case 'end-call':
            endCall();
            break;
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
      endCall();
    };
  }, [user, callId]);

  return {
    localStream,
    remoteStream,
    isConnected,
    isConnecting,
    remoteParticipant,
    startCall,
    answerCall,
    endCall,
    toggleVideo,
    toggleAudio,
  };
};
