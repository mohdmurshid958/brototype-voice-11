import { useEffect, useState } from "react";
import { Phone, PhoneOff } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface IncomingCall {
  callId: string;
  from: string;
  userName: string;
  userRole: string;
  offer: RTCSessionDescriptionInit;
}

export const IncomingCallToast = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('incoming-calls');

    channel
      .on('broadcast', { event: 'signal' }, ({ payload }: any) => {
        if (payload.to === user.id && payload.type === 'offer') {
          // Generate a unique call ID
          const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          setIncomingCall({
            callId,
            from: payload.from,
            userName: payload.userName || 'Unknown User',
            userRole: payload.userRole || 'user',
            offer: payload.data,
          });

          // Play ringtone sound (optional)
          const audio = new Audio('/ringtone.mp3');
          audio.loop = true;
          audio.play().catch(() => {
            // Handle autoplay policy
          });

          // Auto-dismiss after 30 seconds
          const timeout = setTimeout(() => {
            setIncomingCall(null);
            audio.pause();
          }, 30000);

          return () => {
            clearTimeout(timeout);
            audio.pause();
          };
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const handleAccept = () => {
    if (incomingCall) {
      // Navigate to video call page with caller info
      navigate(`/video-call/${incomingCall.callId}`, {
        state: {
          remoteUserId: incomingCall.from,
          offer: incomingCall.offer,
          isIncoming: true,
        },
      });
      setIncomingCall(null);
    }
  };

  const handleReject = () => {
    if (incomingCall && user) {
      // Send rejection signal
      supabase.channel(`call:${incomingCall.callId}`).send({
        type: 'broadcast',
        event: 'signal',
        payload: {
          type: 'end-call',
          from: user.id,
          to: incomingCall.from,
        },
      });
    }
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  const callerRole = incomingCall.userRole === 'admin' ? 'Admin' : 'Student';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
      <Card className="p-6 shadow-2xl border-2 border-primary bg-background min-w-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-16 w-16 ring-4 ring-primary animate-pulse">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {incomingCall.userName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <p className="text-xl font-bold text-foreground mb-1">
              {incomingCall.userName}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              {callerRole}
            </p>
            <p className="text-base text-foreground font-medium">
              Incoming call...
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="rounded-full h-14 w-14 bg-destructive hover:bg-destructive/90"
              onClick={handleReject}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600"
              onClick={handleAccept}
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
