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
    
    // Get initial states
    const updateStates = () => {
      setIsMicOn(call.microphone.state.status === 'enabled');
      setIsCameraOn(call.camera.state.status === 'enabled');
    };
    
    updateStates();

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
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Main Video Area */}
      <div className="flex-1 relative p-4">
        {/* Screen Share View (Priority) */}
        {screenShareParticipant && (
          <div className="absolute inset-4 bg-black rounded-lg overflow-hidden z-10">
            <ParticipantView
              participant={screenShareParticipant}
              ParticipantViewUI={null}
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
                    "relative bg-muted rounded-lg overflow-hidden transition-all duration-300",
                    isSpeaking(participant.sessionId) && "ring-4 ring-primary ring-offset-2 ring-offset-background animate-pulse"
                  )}
                >
                  <ParticipantView
                    participant={participant}
                    ParticipantViewUI={null}
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-full flex items-center gap-2">
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
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Video className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Waiting for others to join...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Local Participant (Picture-in-Picture) */}
        {localParticipant && (
          <div className={cn(
            "absolute bottom-24 right-8 w-64 h-48 bg-muted rounded-lg overflow-hidden shadow-xl border-2 transition-all duration-300",
            isSpeaking(localParticipant.sessionId) ? "border-primary ring-2 ring-primary" : "border-border"
          )}>
            <ParticipantView
              participant={localParticipant}
              ParticipantViewUI={null}
            />
            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-full flex items-center gap-2">
              <span className="text-white text-xs font-medium">You</span>
              {isSpeaking(localParticipant.sessionId) && (
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background/95 via-background/90 to-transparent backdrop-blur-sm border-t border-border p-6">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          {/* Microphone Toggle */}
          <Button
            onClick={toggleMicrophone}
            variant={isMicOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
          >
            {isMicOn ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </Button>

          {/* Camera Toggle */}
          <Button
            onClick={toggleCamera}
            variant={isCameraOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
          >
            {isCameraOn ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>

          {/* Screen Share Toggle */}
          <Button
            onClick={toggleScreenShare}
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14"
          >
            {isScreenSharing ? (
              <MonitorOff className="w-6 h-6" />
            ) : (
              <Monitor className="w-6 h-6" />
            )}
          </Button>

          {/* Participants List */}
          <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full w-14 h-14"
              >
                <Users className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Participants ({participants.length})</SheetTitle>
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
                          "flex items-center gap-3 p-3 rounded-lg border transition-all",
                          isSpeaking(participant.sessionId) && "border-primary bg-primary/5"
                        )}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {(participant.name || "G")[0].toUpperCase()}
                            </span>
                          </div>
                          {isSpeaking(participant.sessionId) && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {participant.name || "Guest"}
                            {isLocal && " (You)"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {status.isConnected ? (
                              <Wifi className="w-3 h-3 text-green-500" />
                            ) : (
                              <WifiOff className="w-3 h-3 text-destructive" />
                            )}
                            {status.hasAudio ? (
                              <Mic className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <MicOff className="w-3 h-3 text-muted-foreground" />
                            )}
                            {status.hasVideo ? (
                              <Video className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <VideoOff className="w-3 h-3 text-muted-foreground" />
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
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
          >
            <Phone className="w-6 h-6 rotate-[135deg]" />
          </Button>
        </div>
      </div>
    </div>
  );
};
