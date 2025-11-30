import { useEffect, useState } from "react";
import { Phone, PhoneOff } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 duration-300">
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-full shadow-2xl border-2 border-white/10 px-6 py-4 min-w-[400px] max-w-[500px]">
        <div className="flex items-center justify-between gap-6">
          {/* Avatar and Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar className="h-14 w-14 ring-2 ring-white/20 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {callerRole === 'Admin' ? 'A' : incomingCall.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-lg truncate">
                {callerDisplay}
              </p>
              <p className="text-gray-300 text-sm">
                {callerRole} calling...
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              size="lg"
              className="rounded-full h-14 w-14 p-0 bg-red-500 hover:bg-red-600 shadow-lg border-2 border-white/20"
              onClick={handleReject}
            >
              <PhoneOff className="h-6 w-6 text-white" />
            </Button>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 p-0 bg-green-500 hover:bg-green-600 shadow-lg border-2 border-white/20"
              onClick={handleAccept}
            >
              <Phone className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
