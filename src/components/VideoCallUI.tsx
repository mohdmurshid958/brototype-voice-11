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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoCallUIProps {
  onLeave: () => void;
}

export const VideoCallUI = ({ onLeave }: VideoCallUIProps) => {
  const call = useCall();
  const { useParticipants, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [speakingParticipants, setSpeakingParticipants] = useState<Set<string>>(new Set());

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

    // Listen for speaking events
    const handleDominantSpeakerChange = () => {
      const speaking = new Set<string>();
      participants.forEach((p) => {
        if (p.isDominantSpeaker || p.isSpeaking) {
          speaking.add(p.sessionId);
        }
      });
      setSpeakingParticipants(speaking);
    };

    // Set up interval to check speaking status
    const interval = setInterval(handleDominantSpeakerChange, 200);

    return () => clearInterval(interval);
  }, [call, participants]);

  const toggleMicrophone = async () => {
    if (!call) return;
    try {
      if (isMicOn) {
        await call.microphone.disable();
      } else {
        await call.microphone.enable();
      }
      setIsMicOn(!isMicOn);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  };

  const toggleCamera = async () => {
    if (!call) return;
    try {
      if (isCameraOn) {
        await call.camera.disable();
      } else {
        await call.camera.enable();
      }
      setIsCameraOn(!isCameraOn);
    } catch (error) {
      console.error("Error toggling camera:", error);
    }
  };

  const toggleScreenShare = async () => {
    if (!call) return;
    try {
      if (isScreenSharing) {
        await call.screenShare.disable();
      } else {
        await call.screenShare.enable();
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  // Find screen sharing participant
  const screenShareParticipant = participants.find(
    (p) => p.screenShareStream !== undefined
  );

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
        {screenShareParticipant && (
          <div className="absolute inset-4 bg-black rounded-lg overflow-hidden z-10 flex items-center justify-center">
            <video
              ref={(video) => {
                if (video && screenShareParticipant.screenShareStream) {
                  video.srcObject = screenShareParticipant.screenShareStream;
                  video.play();
                }
              }}
              className="w-full h-full object-contain"
              autoPlay
              playsInline
            />
            <div className="absolute top-4 left-4 bg-black/80 px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                {screenShareParticipant.name || "Guest"} is sharing
              </span>
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
                    ref={(video) => {
                      if (video && participant.videoStream) {
                        video.srcObject = participant.videoStream;
                        video.play();
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
    </div>
  );
};
