import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    // Fetch existing messages with user profile info
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
        // Fetch user profiles for all unique user IDs
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

    // Subscribe to new messages in real-time
    const channel = supabase
      .channel(`call-messages-${callId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "video_call_messages",
          filter: `call_id=eq.${callId}`,
        },
        async (payload) => {
          console.log("New message received:", payload);
          
          // Fetch sender profile info
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", payload.new.user_id)
            .single();
          
          const newMessage = {
            ...payload.new,
            sender_name: profileData?.full_name || "Unknown User"
          } as Message;
          
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callId]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    const { error } = await supabase.from("video_call_messages").insert({
      call_id: callId,
      user_id: user.id,
      message: newMessage.trim(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
    }
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
