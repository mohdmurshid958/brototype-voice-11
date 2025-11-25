import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const VideoCall = () => {
  const navigate = useNavigate();
  const { callId } = useParams();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [duration, setDuration] = useState(0);

  // Mock participant data
  const participant = {
    name: "Dr. Sarah Johnson",
    avatar: "",
    role: "Admin",
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    navigate(-1);
  };

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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          {isVideoOn ? (
            <div className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-primary/50">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                  {participant.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold text-white mb-1">{participant.name}</h2>
              <p className="text-gray-400">{participant.role}</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="h-32 w-32 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                <VideoOff className="h-16 w-16 text-gray-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-1">{participant.name}</h2>
              <p className="text-gray-400">Video is off</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <Card className="absolute top-20 right-4 w-48 h-36 overflow-hidden border-2 border-primary/50 shadow-2xl">
          <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            {isVideoOn ? (
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    You
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <VideoOff className="h-8 w-8 text-muted-foreground" />
            )}
            <div className="absolute bottom-2 left-2 text-xs text-white font-medium">
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
            onClick={() => setIsAudioOn(!isAudioOn)}
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
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

          {/* Screen Share */}
          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            className="rounded-full h-14 w-14 p-0"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
          >
            <Monitor className="h-6 w-6" />
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
            {isScreenSharing && "Screen sharing active • "}
            {!isAudioOn && "Microphone off • "}
            {!isVideoOn && "Camera off"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
