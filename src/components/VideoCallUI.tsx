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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCallUIProps {
  onLeave: () => void;
}

export const VideoCallUI = ({ onLeave }: VideoCallUIProps) => {
  const call = useCall();
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    if (!call) return;
    
    // Get initial states
    const updateStates = () => {
      setIsMicOn(call.microphone.state.status === 'enabled');
      setIsCameraOn(call.camera.state.status === 'enabled');
    };
    
    updateStates();
  }, [call]);

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

  // Separate local and remote participants
  const remoteParticipants = participants.filter(
    (p) => p.sessionId !== localParticipant?.sessionId
  );

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Main Video Area */}
      <div className="flex-1 relative p-4">
        {/* Remote Participants Grid */}
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
                className="relative bg-muted rounded-lg overflow-hidden"
              >
                <ParticipantView
                  participant={participant}
                  ParticipantViewUI={null}
                />
                <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-full">
                  <span className="text-white text-sm font-medium">
                    {participant.name || "Guest"}
                  </span>
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

        {/* Local Participant (Picture-in-Picture) */}
        {localParticipant && (
          <div className="absolute bottom-24 right-8 w-64 h-48 bg-muted rounded-lg overflow-hidden shadow-xl border-2 border-border">
            <ParticipantView
              participant={localParticipant}
              ParticipantViewUI={null}
            />
            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-full">
              <span className="text-white text-xs font-medium">You</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-background/95 via-background/90 to-transparent backdrop-blur-sm border-t border-border p-6">
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
