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

    // Listen on a broadcast channel for all incoming calls
    const channel = supabase.channel('call-signals');

    channel
      .on('broadcast', { event: 'signal' }, ({ payload }: any) => {
        // Only process offer signals meant for this user
        if (payload.to === user.id && payload.type === 'offer') {
          console.log('📞 Incoming call from:', payload.userName);
          
          setIncomingCall({
            callId: payload.callId || `call-${Date.now()}`,
            from: payload.from,
            userName: payload.userName || 'Unknown User',
            userRole: payload.userRole || 'user',
            offer: payload.data,
          });

          // Play ringtone sound (optional)
          const audio = new Audio('/ringtone.mp3');
          audio.loop = true;
          audio.play().catch(() => {
            console.log('Could not play ringtone');
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
      // Send rejection signal on the shared broadcast channel
      supabase.channel('call-signals').send({
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

  const callerRole = incomingCall.userRole === 'admin' ? 'Admin' : 
    incomingCall.userRole === 'student' ? 'Student' : 'User';
  const callerDisplay = incomingCall.userRole === 'admin' ? 'Admin' : incomingCall.userName;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
      <Card className="p-6 shadow-2xl border-2 border-primary bg-background min-w-[380px]">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20 ring-4 ring-primary animate-pulse">
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
              {callerRole === 'Admin' ? 'A' : incomingCall.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground mb-1">
              {callerDisplay}
            </p>
            <p className="text-base text-muted-foreground mb-2">
              {callerRole} calling...
            </p>
          </div>

          <div className="flex gap-6">
            <Button
              size="lg"
              className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600 shadow-lg"
              onClick={handleReject}
            >
              <PhoneOff className="h-7 w-7" />
            </Button>
            <Button
              size="lg"
              className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600 shadow-lg"
              onClick={handleAccept}
            >
              <Phone className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
