import { useState, useEffect } from "react";
import { Video, Search, Plus, Loader2, Phone, PhoneOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useVideoCalls } from "@/hooks/useVideoCalls";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

const Chat = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const { calls, isLoading, createCall, updateCallStatus } = useVideoCalls();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, [calls]);

  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('student_incoming_calls')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'video_calls',
            filter: `status=eq.pending,student_id=eq.${user.id}`,
          },
          async (payload) => {
            const call = payload.new as any;
            
            // Fetch admin profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', call.admin_id)
              .single();

            const adminName = profile?.full_name || 'Admin';

            sonnerToast(
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>{adminName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{adminName} is calling</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={async () => {
                      await updateCallStatus(call.id, 'active');
                      navigate(`/video-call/${call.stream_call_id}`);
                      sonnerToast.dismiss();
                    }}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={async () => {
                      await updateCallStatus(call.id, 'cancelled');
                      sonnerToast.dismiss();
                    }}
                  >
                    <PhoneOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>,
              {
                duration: 30000,
                position: 'bottom-center',
              }
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeSubscription();
  }, [navigate, updateCallStatus]);

  const fetchProfiles = async () => {
    const userIds = [...new Set(calls.map(c => c.admin_id).filter(Boolean))];
    if (userIds.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (error) throw error;

      const profileMap = data.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);

      setProfiles(profileMap);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleStartCall = async () => {
    setIsCreating(true);
    try {
      const result = await createCall();
      if (result) {
        navigate(`/video-call/${result.call.stream_call_id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      completed: { variant: "default", label: "Completed" },
      pending: { variant: "secondary", label: "Pending" },
      active: { variant: "default", label: "Active" },
      missed: { variant: "destructive", label: "Missed" },
      cancelled: { variant: "outline", label: "Cancelled" },
    };
    
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const filteredCalls = calls.filter(call =>
    searchQuery === "" || 
    formatDate(call.created_at).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              onClick={handleStartCall}
              disabled={isCreating}
              size="lg"
              className="rounded-full h-14 w-14 p-0"
            >
              {isCreating ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Video className="h-6 w-6" />
              )}
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
            {filteredCalls.length === 0 ? (
              <Card className="p-8 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No call history yet</p>
              </Card>
            ) : (
              filteredCalls.map((call) => (
                <Card
                  key={call.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => call.status === 'pending' && navigate(`/video-call/${call.stream_call_id}`)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">Admin</h3>
                        {getStatusBadge(call.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(call.created_at)}</p>
                      {call.duration_seconds && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Duration: {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                        </p>
                      )}
                    </div>
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {filteredCalls.filter(c => c.status === 'completed').length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No completed calls</p>
              </Card>
            ) : (
              filteredCalls
                .filter(c => c.status === 'completed')
                .map((call) => (
                  <Card key={call.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">Admin</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(call.created_at)}</p>
                        {call.duration_seconds && (
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                          </p>
                        )}
                      </div>
                      {getStatusBadge(call.status)}
                    </div>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="missed" className="space-y-3">
            {filteredCalls.filter(c => c.status === 'missed').length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No missed calls</p>
              </Card>
            ) : (
              filteredCalls
                .filter(c => c.status === 'missed')
                .map((call) => (
                  <Card key={call.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">Admin</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(call.created_at)}</p>
                      </div>
                      {getStatusBadge(call.status)}
                    </div>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Chat;