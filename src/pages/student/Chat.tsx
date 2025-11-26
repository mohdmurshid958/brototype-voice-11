import { useState, useEffect } from "react";
import { Video, Phone, Search, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [pastCalls, setPastCalls] = useState<any[]>([]);

  // Fetch past calls
  useEffect(() => {
    const fetchCalls = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('video_calls')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        // Fetch admin profiles
        const adminIds = data.filter(call => call.admin_id).map(call => call.admin_id!);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', adminIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        setPastCalls(data.map(call => {
          const profile = call.admin_id ? profileMap.get(call.admin_id) : null;
          return {
            id: call.id,
            adminName: profile?.full_name || profile?.email || 'Unknown Admin',
            adminAvatar: "",
            date: new Date(call.created_at).toLocaleString(),
            duration: call.duration_seconds ? `${Math.floor(call.duration_seconds / 60)} min` : 'N/A',
            status: call.status === 'ended' ? 'completed' : call.status,
            type: "video",
          };
        }));
      }
    };

    fetchCalls();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('student_calls')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_calls',
          filter: `student_id=eq.${user?.id}`,
        },
        () => {
          fetchCalls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Mock data for past calls (keeping as fallback)
  const mockPastCalls = [
    {
      id: "1",
      adminName: "Dr. Sarah Johnson",
      adminAvatar: "",
      date: "Today, 2:30 PM",
      duration: "15 min",
      status: "completed",
      type: "video",
    },
    {
      id: "2",
      adminName: "Prof. Michael Chen",
      adminAvatar: "",
      date: "Yesterday, 4:15 PM",
      duration: "8 min",
      status: "missed",
      type: "video",
    },
    {
      id: "3",
      adminName: "Dr. Sarah Johnson",
      adminAvatar: "",
      date: "Dec 15, 10:00 AM",
      duration: "22 min",
      status: "completed",
      type: "video",
    },
  ];

  // Fetch admin users
  useEffect(() => {
    const fetchAdmins = async () => {
      // First get admin user_ids
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (roleError || !roleData || roleData.length === 0) {
        console.error('Error fetching admin roles:', roleError);
        return;
      }

      // Then get their profiles
      const adminIds = roleData.map(r => r.user_id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', adminIds);
      
      if (!profileError && profileData) {
        setAdminUsers(profileData.map(profile => ({
          id: profile.id,
          name: profile.full_name || profile.email || 'Unknown Admin',
        })));
      }
    };
    
    fetchAdmins();
  }, []);

  const handleStartCall = (adminId?: string) => {
    if (!adminId && adminUsers.length > 0) {
      // Default to first admin if none specified
      adminId = adminUsers[0].id;
    }
    
    if (!adminId) {
      alert('No admin users available');
      return;
    }

    const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    navigate(`/video-call/${callId}`, {
      state: {
        remoteUserId: adminId,
        isIncoming: false,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Video Chat</h1>
          <p className="text-muted-foreground">Connect with admins via video call</p>
        </div>

        {/* New Call Card */}
        <Card className="mb-6 p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Start New Video Call</h2>
              <p className="text-sm text-muted-foreground">Request a video consultation with an admin</p>
            </div>
            <Button
              onClick={() => handleStartCall()}
              size="lg"
              className="rounded-full h-14 w-14 p-0"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search call history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="all">All Calls</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="missed">Missed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {pastCalls.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No call history yet</p>
              </Card>
            ) : pastCalls.map((call) => (
              <Card
                key={call.id}
                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/video-call/${call.id}`)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={call.adminAvatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {call.adminName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{call.adminName}</h3>
                      {call.status === "missed" && (
                        <Badge variant="destructive" className="text-xs">Missed</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="h-3 w-3" />
                      <span>{call.date}</span>
                      <span>•</span>
                      <span>{call.duration}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCall();
                    }}
                  >
                    <Video className="h-5 w-5 text-primary" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {pastCalls.filter(call => call.status === "completed").length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No completed calls yet</p>
              </Card>
            ) : pastCalls.filter(call => call.status === "completed").map((call) => (
              <Card
                key={call.id}
                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={call.adminAvatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {call.adminName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate mb-1">{call.adminName}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="h-3 w-3" />
                      <span>{call.date}</span>
                      <span>•</span>
                      <span>{call.duration}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Video className="h-5 w-5 text-primary" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="missed" className="space-y-3">
            {pastCalls.filter(call => call.status === "missed" || call.status === "failed").length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No missed calls</p>
              </Card>
            ) : pastCalls.filter(call => call.status === "missed" || call.status === "failed").map((call) => (
              <Card
                key={call.id}
                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={call.adminAvatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {call.adminName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{call.adminName}</h3>
                      <Badge variant="destructive" className="text-xs">Missed</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="h-3 w-3" />
                      <span>{call.date}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Chat;
