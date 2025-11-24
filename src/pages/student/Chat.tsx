import { useState, useEffect } from "react";
import { Video, Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useVideoCalls } from "@/hooks/useVideoCalls";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Chat = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const { calls, isLoading, createCall } = useVideoCalls();
  const { toast } = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, profiles(id, full_name, avatar_url)')
        .eq('role', 'admin');

      if (error) throw error;

      const adminList = data
        .filter(item => item.profiles)
        .map(item => ({
          id: item.profiles!.id,
          name: item.profiles!.full_name || 'Admin',
          avatar: item.profiles!.avatar_url,
        }));

      setAdmins(adminList);
      if (adminList.length > 0) {
        setSelectedAdminId(adminList[0].id);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleStartCall = async () => {
    if (!selectedAdminId) {
      toast({
        title: 'Error',
        description: 'Please select an admin to call',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await createCall(selectedAdminId);
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
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Start New Video Call</h2>
              <p className="text-sm text-muted-foreground">Request a video consultation with an admin</p>
            </div>
            
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Select Admin</label>
                <Select value={selectedAdminId} onValueChange={setSelectedAdminId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {admins.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {admin.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleStartCall}
                disabled={isCreating || !selectedAdminId}
                size="lg"
                className="rounded-full h-12 w-12 p-0"
              >
                {isCreating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
            </div>
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