import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import io from "socket.io-client";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  sender_name?: string;
}

interface VideoCallChatProps {
  callId: string;
}

export const VideoCallChat = ({ callId }: VideoCallChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const [senderName, setSenderName] = useState<string>("");

  useEffect(() => {
    // Fetch user profile info
    const fetchUserProfile = async () => {
      if (!user) return;
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      
      setSenderName(profileData?.full_name || "Unknown User");
    };

    fetchUserProfile();

    // Connect to Socket.IO
    const projectId = "vlqyebuhvebsvpdtqlxq";
    const socketUrl = `wss://${projectId}.supabase.co/functions/v1/video-call-socket?callId=${callId}`;
    
    console.log("Connecting to WebSocket:", socketUrl);
    
    socketRef.current = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socketRef.current.on("message", (data: any) => {
      console.log("Message received via Socket.IO:", data);
      
      const newMessage: Message = {
        id: data.id,
        user_id: data.user_id,
        message: data.message,
        created_at: data.created_at,
        sender_name: data.sender_name,
      };
      
      setMessages((prev) => [...prev, newMessage]);
    });

    socketRef.current.on("connect_error", (error: any) => {
      console.error("Socket.IO connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat server",
        variant: "destructive",
      });
    });

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data: messagesData, error } = await supabase
        .from("video_call_messages")
        .select("*")
        .eq("call_id", callId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      if (messagesData) {
        const userIds = [...new Set(messagesData.map(msg => msg.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        const profileMap = new Map(
          profilesData?.map(p => [p.id, p.full_name]) || []
        );

        const messagesWithNames = messagesData.map(msg => ({
          ...msg,
          sender_name: profileMap.get(msg.user_id) || "Unknown User"
        }));
        
        setMessages(messagesWithNames);
      }
    };

    fetchMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [callId, user, toast]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !socketRef.current) return;

    setSending(true);
    
    const messageData = {
      id: crypto.randomUUID(),
      call_id: callId,
      user_id: user.id,
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
      sender_name: senderName,
    };

    // Save to database
    const { error } = await supabase.from("video_call_messages").insert({
      call_id: callId,
      user_id: user.id,
      message: newMessage.trim(),
    });

    if (error) {
      console.error("Error saving message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      setSending(false);
      return;
    }

    // Emit via Socket.IO
    socketRef.current.emit("message", messageData);
    console.log("Message sent via Socket.IO:", messageData);
    
    setNewMessage("");
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#202124]">
      <div className="p-4 border-b border-[#5f6368]/20">
        <h3 className="text-white font-medium">In-call messages</h3>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.user_id === user?.id ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.user_id === user?.id
                    ? "bg-blue-600 text-white"
                    : "bg-[#3c4043] text-white"
                }`}
              >
                {msg.user_id !== user?.id && (
                  <p className="text-xs text-white/70 mb-1">{msg.sender_name}</p>
                )}
                <p className="text-sm break-words">{msg.message}</p>
              </div>
              <span className="text-xs text-white/50 mt-1">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-[#5f6368]/20">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="bg-[#3c4043] border-[#5f6368]/20 text-white placeholder:text-white/50"
            disabled={sending}
          />
          <Button
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
