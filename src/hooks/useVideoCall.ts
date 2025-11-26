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
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);

  // Initialize local media stream
  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast({
        title: "Camera/Microphone Error",
        description: "Unable to access camera or microphone. Please check permissions.",
        variant: "destructive",
      });
      throw error;
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
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setIsConnected(false);
      }
    };

    return pc;
  };

  // Start call (caller initiates)
  const startCall = async () => {
    if (!user || !remoteUserId) return;
    
    setIsConnecting(true);
    
    try {
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
          userName: user.user_metadata?.full_name || user.email,
          userRole: userRole,
        },
      });
    } catch (error) {
      console.error("Error starting call:", error);
      setIsConnecting(false);
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
  const endCall = () => {
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

    const channel = supabase.channel(`call:${callId}`);
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
