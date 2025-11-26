import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Monitor,
  MoreVertical,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVideoCall } from "@/hooks/useVideoCall";
import { useAuth } from "@/contexts/AuthContext";

const VideoCall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { callId } = useParams();
  const { user } = useAuth();
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [duration, setDuration] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Get state from navigation (for incoming calls)
  const { remoteUserId, offer, isIncoming } = location.state || {};

  const {
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
  } = useVideoCall(callId || 'default', remoteUserId);

  // Set up local video
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set up remote video
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Start or answer call
  useEffect(() => {
    const initCall = async () => {
      if (isIncoming && offer) {
        // Answer incoming call
        answerCall(offer, remoteUserId);
      } else if (remoteUserId && !isIncoming) {
        // Start outgoing call
        startCall();
      }
    };
    
    initCall();
  }, []);

  // Call duration timer
  useEffect(() => {
    if (!isConnected) return;
    
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    endCall();
    navigate(-1);
  };

  const handleToggleVideo = () => {
    const enabled = toggleVideo();
    setIsVideoOn(enabled);
  };

  const handleToggleAudio = () => {
    const enabled = toggleAudio();
    setIsAudioOn(enabled);
  };

  const participantName = remoteParticipant?.userName || "Connecting...";
  const participantRole = remoteParticipant?.userRole || "User";

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-medium">{formatDuration(duration)}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <div className="absolute inset-0 bg-black">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-primary/50">
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                    {participantName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold text-white mb-1">{participantName}</h2>
                <p className="text-gray-400">{isConnecting ? "Connecting..." : participantRole}</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <Card className="absolute top-20 right-4 w-48 h-36 overflow-hidden border-2 border-primary/50 shadow-2xl">
          <div className="relative w-full h-full bg-black">
            {localStream && isVideoOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">
              You
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          {/* Microphone */}
          <Button
            variant={isAudioOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full h-14 w-14 p-0"
            onClick={handleToggleAudio}
          >
            {isAudioOn ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>

          {/* Video */}
          <Button
            variant={isVideoOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full h-14 w-14 p-0"
            onClick={handleToggleVideo}
          >
            {isVideoOn ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

          {/* End Call */}
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full h-14 w-14 p-0 bg-red-500 hover:bg-red-600"
            onClick={handleEndCall}
          >
            <Phone className="h-6 w-6 rotate-[135deg]" />
          </Button>
        </div>

        {/* Call Info */}
        <div className="text-center mt-4">
          <p className="text-white/60 text-sm">
            {!isConnected && isConnecting && "Connecting..."}
            {isConnected && "Connected"}
            {!isAudioOn && " • Microphone off"}
            {!isVideoOn && " • Camera off"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
