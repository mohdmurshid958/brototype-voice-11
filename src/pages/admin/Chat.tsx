import { useState, useEffect } from "react";
import { Video, Search, Check, X, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useVideoCalls } from "@/hooks/useVideoCalls";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const { calls, isLoading, updateCallStatus } = useVideoCalls();

  useEffect(() => {
    fetchProfiles();
  }, [calls]);

  const fetchProfiles = async () => {
    const userIds = [...new Set(calls.map(c => c.student_id))];
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

  const handleAcceptCall = async (call: any) => {
    await updateCallStatus(call.id, 'active');
    navigate(`/video-call/${call.stream_call_id}`);
  };

  const handleRejectCall = async (callId: string) => {
    await updateCallStatus(callId, 'cancelled');
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

  const pendingCalls = calls.filter(c => c.status === 'pending');
  const activeCalls = calls.filter(c => c.status === 'active');
  const pastCalls = calls.filter(c => ['completed', 'cancelled', 'missed'].includes(c.status));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Video Chat Management</h1>
          <p className="text-muted-foreground">Manage student video call requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCalls.length}</p>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Video className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCalls.length}</p>
                <p className="text-sm text-muted-foreground">Active Calls</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {calls.filter(c => 
                    c.status === 'completed' && 
                    new Date(c.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </p>
                <p className="text-sm text-muted-foreground">Today's Calls</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="pending">
              Pending {pendingCalls.length > 0 && `(${pendingCalls.length})`}
            </TabsTrigger>
            <TabsTrigger value="active">
              Active {activeCalls.length > 0 && `(${activeCalls.length})`}
            </TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-3">
            {pendingCalls.length === 0 ? (
              <Card className="p-8 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No pending call requests</p>
              </Card>
            ) : (
              pendingCalls.map((call) => {
                const profile = profiles[call.student_id];
                return (
                  <Card key={call.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {profile?.full_name || 'Student'}
                          </h3>
                          {getStatusBadge(call.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(call.created_at)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleAcceptCall(call)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectCall(call.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Active Tab */}
          <TabsContent value="active" className="space-y-3">
            {activeCalls.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No active calls</p>
              </Card>
            ) : (
              activeCalls.map((call) => {
                const profile = profiles[call.student_id];
                return (
                  <Card key={call.id} className="p-4 border-primary">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{profile?.full_name || 'Student'}</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(call.created_at)}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/video-call/${call.stream_call_id}`)}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Past Tab */}
          <TabsContent value="past" className="space-y-3">
            {pastCalls.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No call history</p>
              </Card>
            ) : (
              pastCalls.map((call) => {
                const profile = profiles[call.student_id];
                return (
                  <Card key={call.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{profile?.full_name || 'Student'}</h3>
                          {getStatusBadge(call.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(call.created_at)}</p>
                        {call.duration_seconds && (
                          <p className="text-xs text-muted-foreground">
                            Duration: {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Chat;