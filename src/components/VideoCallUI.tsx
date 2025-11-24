import { useState, useEffect } from "react";
import {
  useCallStateHooks,
  useCall,
  ParticipantView,
} from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Monitor,
  MonitorOff,
  Users,
  Wifi,
  WifiOff,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoCallChat } from "./VideoCallChat";
import { VirtualBackgroundSelector } from "./VirtualBackgroundSelector";
import { CallRecordingControls } from "./CallRecordingControls";
import { ReactionPicker } from "./ReactionPicker";

interface VideoCallUIProps {
  onLeave: () => void;
  callId: string;
}

export const VideoCallUI = ({ onLeave, callId }: VideoCallUIProps) => {
  const call = useCall();
  const { useParticipants, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const { toast } = useToast();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [virtualBackground, setVirtualBackground] = useState<string | null>(null);
  const [speakingParticipants, setSpeakingParticipants] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Array<{id: string, emoji: string, x: number, y: number}>>([]);

  useEffect(() => {
    if (!call) return;
    
    // Initialize call with audio enabled by default
    const initializeCall = async () => {
      try {
        // Ensure microphone is enabled
        if (call.microphone.state.status !== 'enabled') {
          await call.microphone.enable();
        }
        setIsMicOn(call.microphone.state.status === 'enabled');
        setIsCameraOn(call.camera.state.status === 'enabled');
      } catch (error) {
        console.error("Error initializing call:", error);
      }
    };
    
    initializeCall();

    // Listen for speaking events and screen share changes
    const handleParticipantUpdates = () => {
      const speaking = new Set<string>();
      let hasScreenShare = false;
      
      participants.forEach((p) => {
        if (p.isDominantSpeaker || p.isSpeaking) {
          speaking.add(p.sessionId);
        }
        
        // Check if this participant has an active screen share
        if (p.screenShareStream && p.screenShareStream.active) {
          hasScreenShare = true;
          console.log("Active screen share detected from:", p.name, p.sessionId);
        }
      });
      
      setSpeakingParticipants(speaking);
      
      // Update local screen sharing state based on own screen share status
      if (call.screenShare) {
        const myScreenShareActive = call.screenShare.state.status === 'enabled';
        if (myScreenShareActive !== isScreenSharing) {
          setIsScreenSharing(myScreenShareActive);
        }
      }
    };

    // Set up interval to check updates
    const interval = setInterval(handleParticipantUpdates, 200);

    return () => clearInterval(interval);
  }, [call, participants, isScreenSharing]);

  const toggleMicrophone = async () => {
    if (!call) return;
    try {
      if (isMicOn) {
        await call.microphone.disable();
        setIsMicOn(false);
      } else {
        // Request permission explicitly if needed
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permError) {
          toast({
            title: "Microphone Permission Required",
            description: "Please allow microphone access in your browser settings.",
            variant: "destructive",
          });
          return;
        }
        await call.microphone.enable();
        setIsMicOn(true);
      }
    } catch (error) {
      console.error("Error toggling microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Failed to toggle microphone. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleCamera = async () => {
    if (!call) return;
    try {
      if (isCameraOn) {
        await call.camera.disable();
        setIsCameraOn(false);
      } else {
        // Request permission explicitly if needed
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (permError) {
          toast({
            title: "Camera Permission Required",
            description: "Please allow camera access in your browser settings.",
            variant: "destructive",
          });
          return;
        }
        await call.camera.enable();
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error("Error toggling camera:", error);
      toast({
        title: "Camera Error",
        description: "Failed to toggle camera. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleScreenShare = async () => {
    if (!call) return;
    try {
      const currentState = call.screenShare.state.status;
      console.log("Current screen share state:", currentState);
      
      if (currentState === 'enabled') {
        await call.screenShare.disable();
        console.log("Screen share disabled");
        setIsScreenSharing(false);
        toast({
          title: "Screen Sharing Stopped",
          description: "You stopped sharing your screen.",
        });
      } else {
        // Request screen share permission
        try {
          await navigator.mediaDevices.getDisplayMedia({ video: true });
          await call.screenShare.enable();
          console.log("Screen share enabled");
          setIsScreenSharing(true);
          toast({
            title: "Screen Sharing Started",
            description: "You are now sharing your screen.",
          });
        } catch (permError) {
          console.error("Screen share permission denied:", permError);
          toast({
            title: "Screen Share Cancelled",
            description: "Screen sharing was cancelled or permission denied.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
      toast({
        title: "Screen Share Error",
        description: "Failed to toggle screen sharing. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Find screen sharing participant - check for active screen share stream
  const screenShareParticipant = participants.find(
    (p) => {
      const hasStream = p.screenShareStream && p.screenShareStream.active;
      if (hasStream) {
        console.log("Found screen share from:", p.name, p.sessionId);
      }
      return hasStream;
    }
  );
  
  const screenShareStream = screenShareParticipant?.screenShareStream;
  
  useEffect(() => {
    if (screenShareParticipant && screenShareStream) {
      console.log("Screen share active:", {
        participant: screenShareParticipant.name,
        sessionId: screenShareParticipant.sessionId,
        streamId: screenShareStream.id,
        active: screenShareStream.active,
        tracks: screenShareStream.getTracks().map(t => ({
          kind: t.kind,
          enabled: t.enabled,
          readyState: t.readyState
        }))
      });
    }
  }, [screenShareParticipant, screenShareStream]);

  // Check if participant is speaking
  const isSpeaking = (sessionId: string) => speakingParticipants.has(sessionId);

  // Get participant audio/video status
  const getParticipantStatus = (participant: any) => {
    const hasAudio = !participant.audioMuted;
    const hasVideo = !participant.videoMuted;
    const isConnected = participant.connectionQuality !== "unknown";
    
    return { hasAudio, hasVideo, isConnected };
  };

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex flex-col">
      {/* Main Video Area */}
      <div className="flex-1 relative p-4">
        {/* Screen Share View (Priority) */}
        {screenShareParticipant && screenShareStream && (
          <div className="absolute inset-4 bg-black rounded-lg overflow-hidden z-10">
            <video
              key={`screen-${screenShareParticipant.sessionId}-${screenShareStream.id}`}
              ref={(videoElement) => {
                if (videoElement && screenShareStream) {
                  console.log("Setting screen share stream to video element");
                  videoElement.srcObject = screenShareStream;
                  videoElement.play()
                    .then(() => console.log("Screen share video playing"))
                    .catch(e => {
                      console.error("Screen share play error:", e);
                      // Try to play again after a short delay
                      setTimeout(() => {
                        videoElement.play().catch(err => console.error("Retry failed:", err));
                      }, 500);
                    });
                }
              }}
              className="w-full h-full object-contain bg-black"
              autoPlay
              playsInline
              muted={false}
            />
            <div className="absolute top-4 left-4 bg-black/90 px-4 py-2 rounded-full shadow-lg">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                {screenShareParticipant.name || "Guest"} is presenting
              </span>
            </div>
            
            {/* Small participant thumbnails when screen sharing */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              {participants.slice(0, 3).map((participant) => (
                <div
                  key={participant.sessionId}
                  className="w-24 h-16 bg-[#202124] rounded-lg overflow-hidden border-2 border-[#5f6368]"
                >
                  <video
                    ref={(video) => {
                      if (video && participant.videoStream) {
                        video.srcObject = participant.videoStream;
                        video.play().catch(() => {});
                      }
                    }}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  {!participant.videoStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#202124]">
                      <span className="text-white text-xs font-medium">
                        {(participant.name || "G")[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remote Participants Grid */}
        {!screenShareParticipant && (
          <div className={cn(
            "grid gap-4 h-full",
            remoteParticipants.length === 0 && "grid-cols-1",
            remoteParticipants.length === 1 && "grid-cols-1",
            remoteParticipants.length === 2 && "grid-cols-2",
            remoteParticipants.length >= 3 && "grid-cols-2 grid-rows-2"
          )}>
            {remoteParticipants.length > 0 ? (
              remoteParticipants.map((participant) => (
                <div
                  key={participant.sessionId}
                  className={cn(
                    "relative bg-[#202124] rounded-lg overflow-hidden transition-all duration-300 flex items-center justify-center",
                    isSpeaking(participant.sessionId) && "ring-4 ring-blue-500"
                  )}
                >
                  <video
                    key={`video-${participant.sessionId}`}
                    ref={(video) => {
                      if (video && participant.videoStream) {
                        video.srcObject = participant.videoStream;
                        video.play().catch(e => console.error("Video play error:", e));
                      }
                    }}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  {!participant.videoStream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#202124]">
                      <div className="w-32 h-32 rounded-full bg-[#5f6368] flex items-center justify-center">
                        <span className="text-6xl font-medium text-white">
                          {(participant.name || "G")[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 rounded-lg flex items-center gap-2">
                    {!getParticipantStatus(participant).hasAudio && (
                      <MicOff className="w-4 h-4 text-white" />
                    )}
                    <span className="text-white text-sm font-medium">
                      {participant.name || "Guest"}
                    </span>
                    {isSpeaking(participant.sessionId) && (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-[#5f6368] mx-auto mb-4 flex items-center justify-center">
                    <Video className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white/70">Waiting for others to join...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Local Participant (Picture-in-Picture) */}
        {localParticipant && (
          <div className={cn(
            "absolute bottom-28 right-8 w-48 h-36 bg-[#202124] rounded-lg overflow-hidden shadow-2xl border-2 transition-all duration-300 flex items-center justify-center",
            isSpeaking(localParticipant.sessionId) ? "border-blue-500" : "border-[#5f6368]"
          )}>
            <video
              ref={(video) => {
                if (video && localParticipant.videoStream) {
                  video.srcObject = localParticipant.videoStream;
                  video.play();
                }
              }}
              className="w-full h-full object-cover scale-x-[-1]"
              autoPlay
              playsInline
              muted
            />
            {!localParticipant.videoStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#202124]">
                <div className="w-16 h-16 rounded-full bg-[#5f6368] flex items-center justify-center">
                  <span className="text-2xl font-medium text-white">
                    {(localParticipant.name || "Y")[0].toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded-md flex items-center gap-1.5">
              {!isMicOn && (
                <MicOff className="w-3 h-3 text-white" />
              )}
              <span className="text-white text-xs font-medium">You</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#202124] border-t border-[#5f6368]/20 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-3">
          {/* Microphone Toggle */}
          <Button
            onClick={toggleMicrophone}
            variant="ghost"
            size="lg"
            className={cn(
              "rounded-full w-12 h-12 p-0",
              isMicOn ? "bg-[#3c4043] hover:bg-[#5f6368]" : "bg-red-600 hover:bg-red-700"
            )}
          >
            {isMicOn ? (
              <Mic className="w-5 h-5 text-white" />
            ) : (
              <MicOff className="w-5 h-5 text-white" />
            )}
          </Button>

          {/* Camera Toggle */}
          <Button
            onClick={toggleCamera}
            variant="ghost"
            size="lg"
            className={cn(
              "rounded-full w-12 h-12 p-0",
              isCameraOn ? "bg-[#3c4043] hover:bg-[#5f6368]" : "bg-red-600 hover:bg-red-700"
            )}
          >
            {isCameraOn ? (
              <Video className="w-5 h-5 text-white" />
            ) : (
              <VideoOff className="w-5 h-5 text-white" />
            )}
          </Button>

          {/* Screen Share Toggle */}
          <Button
            onClick={toggleScreenShare}
            variant="ghost"
            size="lg"
            className={cn(
              "rounded-full w-12 h-12 p-0",
              isScreenSharing ? "bg-blue-600 hover:bg-blue-700" : "bg-[#3c4043] hover:bg-[#5f6368]"
            )}
          >
            {isScreenSharing ? (
              <MonitorOff className="w-5 h-5 text-white" />
            ) : (
              <Monitor className="w-5 h-5 text-white" />
            )}
          </Button>

          {/* Participants List */}
          <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full w-12 h-12 p-0 bg-[#3c4043] hover:bg-[#5f6368]"
              >
                <Users className="w-5 h-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-[#202124] border-l border-[#5f6368]/20">
              <SheetHeader>
                <SheetTitle className="text-white">Participants ({participants.length})</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                <div className="space-y-4">
                  {participants.map((participant) => {
                    const status = getParticipantStatus(participant);
                    const isLocal = participant.sessionId === localParticipant?.sessionId;
                    
                    return (
                      <div
                        key={participant.sessionId}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border border-[#5f6368]/20 transition-all",
                          isSpeaking(participant.sessionId) && "border-blue-500 bg-blue-500/5"
                        )}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-[#5f6368] flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {(participant.name || "G")[0].toUpperCase()}
                            </span>
                          </div>
                          {isSpeaking(participant.sessionId) && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#202124] animate-pulse" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {participant.name || "Guest"}
                            {isLocal && " (You)"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {status.isConnected ? (
                              <Wifi className="w-3 h-3 text-green-500" />
                            ) : (
                              <WifiOff className="w-3 h-3 text-red-500" />
                            )}
                            {status.hasAudio ? (
                              <Mic className="w-3 h-3 text-white/60" />
                            ) : (
                              <MicOff className="w-3 h-3 text-white/60" />
                            )}
                            {status.hasVideo ? (
                              <Video className="w-3 h-3 text-white/60" />
                            ) : (
                              <VideoOff className="w-3 h-3 text-white/60" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Call Recording */}
          <CallRecordingControls callId={callId} />

          {/* Virtual Background */}
          <VirtualBackgroundSelector
            onBackgroundChange={setVirtualBackground}
            currentBackground={virtualBackground}
          />

          {/* Chat Toggle */}
          <Sheet open={showChat} onOpenChange={setShowChat}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full w-12 h-12 p-0 bg-[#3c4043] hover:bg-[#5f6368]"
              >
                <MessageSquare className="w-5 h-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96 p-0 bg-[#202124] border-l border-[#5f6368]/20">
              <VideoCallChat callId={callId} />
            </SheetContent>
          </Sheet>

          {/* Reaction Picker */}
          <ReactionPicker 
            onReactionSend={(emoji) => {
              const newReaction = {
                id: Math.random().toString(),
                emoji,
                x: Math.random() * 80 + 10,
                y: Math.random() * 60 + 20
              };
              setReactions(prev => [...prev, newReaction]);
              setTimeout(() => {
                setReactions(prev => prev.filter(r => r.id !== newReaction.id));
              }, 3000);
            }}
          />

          {/* End Call */}
          <Button
            onClick={onLeave}
            variant="ghost"
            size="lg"
            className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700"
          >
            <Phone className="w-5 h-5 text-white rotate-[135deg]" />
          </Button>
        </div>
      </div>

      {/* Participant Info Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
        <div className="bg-black/80 px-4 py-2 rounded-full">
          <span className="text-white text-sm font-medium">
            {participants.length} participant{participants.length !== 1 ? "s" : ""}
          </span>
        </div>
        
        {remoteParticipants.length > 0 && (
          <div className="bg-black/80 px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white text-sm font-medium">
              Connected with {remoteParticipants[0].name || "Guest"}
            </span>
          </div>
        )}
      </div>

      {/* Reactions Overlay */}
      {reactions.map((reaction) => (
        <div
          key={reaction.id}
          className="absolute z-40 text-6xl animate-reaction pointer-events-none"
          style={{
            left: `${reaction.x}%`,
            top: `${reaction.y}%`,
          }}
        >
          {reaction.emoji}
        </div>
      ))}
    </div>
  );
};
