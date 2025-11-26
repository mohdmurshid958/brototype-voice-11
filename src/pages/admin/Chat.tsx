import { useState, useEffect } from "react";
import { Video, Phone, Search, Check, X, Clock, MessageSquare, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [studentUsers, setStudentUsers] = useState<any[]>([]);
  const [pastCalls, setPastCalls] = useState<any[]>([]);
  const [pendingCalls, setPendingCalls] = useState<any[]>([]);

  // Fetch past calls
  useEffect(() => {
    const fetchCalls = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('video_calls')
        .select('*')
        .eq('admin_id', user.id)
        .in('status', ['ended', 'failed'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        // Fetch student profiles
        const studentIds = data.map(call => call.student_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', studentIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        setPastCalls(data.map(call => {
          const profile = profileMap.get(call.student_id);
          return {
            id: call.id,
            studentName: profile?.full_name || profile?.email || 'Unknown Student',
            studentAvatar: "",
            studentId: call.student_id,
            date: new Date(call.created_at).toLocaleString(),
            duration: call.duration_seconds ? `${Math.floor(call.duration_seconds / 60)} min` : 'N/A',
            status: call.status === 'ended' ? 'completed' : call.status,
          };
        }));
      }

      // Fetch pending calls
      const { data: pendingData, error: pendingError } = await supabase
        .from('video_calls')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!pendingError && pendingData) {
        // Fetch student profiles
        const studentIds = pendingData.map(call => call.student_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', studentIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        setPendingCalls(pendingData.map(call => {
          const profile = profileMap.get(call.student_id);
          return {
            id: call.id,
            studentName: profile?.full_name || profile?.email || 'Unknown Student',
            studentAvatar: "",
            studentId: call.student_id,
            requestTime: new Date(call.created_at).toLocaleTimeString(),
            status: 'pending',
            topic: 'Video Call Request',
          };
        }));
      }
    };

    fetchCalls();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('admin_calls')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_calls',
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

  // Mock data for call requests (keeping as fallback)
  const mockCallRequests = [
    {
      id: "1",
      studentName: "John Smith",
      studentAvatar: "",
      studentId: "STU2024001",
      requestTime: "2 minutes ago",
      status: "pending",
      topic: "Complaint #C-1234 Discussion",
    },
    {
      id: "2",
      studentName: "Emma Wilson",
      studentAvatar: "",
      studentId: "STU2024002",
      requestTime: "15 minutes ago",
      status: "pending",
      topic: "General Inquiry",
    },
    {
      id: "3",
      studentName: "Michael Brown",
      studentAvatar: "",
      studentId: "STU2024003",
      requestTime: "1 hour ago",
      status: "pending",
      topic: "Account Issue",
    },
  ];

  const activeCall = {
    id: "4",
    studentName: "Sarah Davis",
    studentAvatar: "",
    studentId: "STU2024004",
    duration: "5:32",
    topic: "Complaint Follow-up",
  };

  // Fetch student users
  useEffect(() => {
    const fetchStudents = async () => {
      // First get student user_ids
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'student');
      
      if (roleError || !roleData || roleData.length === 0) {
        console.error('Error fetching student roles:', roleError);
        return;
      }

      // Then get their profiles
      const studentIds = roleData.map(r => r.user_id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', studentIds);
      
      if (!profileError && profileData) {
        setStudentUsers(profileData.map(profile => ({
          id: profile.id,
          name: profile.full_name || profile.email || 'Unknown Student',
        })));
      }
    };
    
    fetchStudents();
  }, []);

  const handleAcceptCall = async (callRecordId: string, studentId?: string) => {
    if (!studentId) return;

    // Find the call record to get the stream_call_id
    const call = pendingCalls.find(c => c.id === callRecordId);
    if (!call) return;

    // Get the actual video_calls record to find stream_call_id
    const { data: callData, error: callError } = await supabase
      .from('video_calls')
      .select('stream_call_id, id')
      .eq('id', callRecordId)
      .single();

    if (callError || !callData) {
      console.error('Error fetching call:', callError);
      return;
    }

    // Update call status to active
    await supabase
      .from('video_calls')
      .update({ status: 'active', started_at: new Date().toISOString() })
      .eq('id', callRecordId);

    navigate(`/video-call/${callData.stream_call_id}`, {
      state: {
        remoteUserId: studentId,
        isIncoming: true,
      },
    });
  };

  const handleCallStudent = async (studentId: string) => {
    if (!user) return;

    // Create a call record
    const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const { error } = await supabase
      .from('video_calls')
      .insert({
        stream_call_id: callId,
        student_id: studentId,
        admin_id: user.id,
        status: 'pending',
      });

    if (error) {
      console.error('Error creating call:', error);
      alert('Failed to create call');
      return;
    }

    navigate(`/video-call/${callId}`, {
      state: {
        remoteUserId: studentId,
        isIncoming: false,
      },
    });
  };

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
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
                <p className="text-2xl font-bold text-foreground">{pendingCalls.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Calls</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Video className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today's Calls</p>
                <p className="text-2xl font-bold text-foreground">{pastCalls.filter(c => c.date.includes("Today")).length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Check className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Available Students */}
        <Card className="mb-6 p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-xl font-semibold text-foreground mb-4">Available Students</h2>
          {studentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No student users available</p>
          ) : (
            <div className="space-y-3">
              {studentUsers.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Student</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleCallStudent(student.id)}
                    size="sm"
                    className="rounded-full"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or ID..."
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
              Pending ({pendingCalls.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active (1)
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Calls
            </TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-3">
            {pendingCalls.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No pending call requests</p>
              </Card>
            ) : pendingCalls.map((request) => (
              <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={request.studentAvatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {request.studentName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{request.studentName}</h3>
                      <Badge variant="outline" className="text-xs">{request.studentId}</Badge>
                    </div>
                    <p className="text-sm text-foreground mb-1">{request.topic}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Requested {request.requestTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptCall(request.id, request.studentId)}
                      className="rounded-full"
                      size="default"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Active Call */}
          <TabsContent value="active" className="space-y-3">
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-green-500">
                  <AvatarImage src={activeCall.studentAvatar} />
                  <AvatarFallback className="bg-green-500 text-white text-lg">
                    {activeCall.studentName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{activeCall.studentName}</h3>
                    <Badge variant="outline" className="text-xs">{activeCall.studentId}</Badge>
                    <Badge className="text-xs bg-green-500">Live</Badge>
                  </div>
                  <p className="text-sm text-foreground mb-1">{activeCall.topic}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Video className="h-3 w-3" />
                    <span>Duration: {activeCall.duration}</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate(`/video-call/${activeCall.id}`)}
                  className="rounded-full bg-green-500 hover:bg-green-600"
                >
                  Join Call
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Past Calls */}
          <TabsContent value="past" className="space-y-3">
            {pastCalls.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No past calls yet</p>
              </Card>
            ) : pastCalls.map((call) => (
              <Card key={call.id} className="p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={call.studentAvatar} />
                    <AvatarFallback className="bg-muted text-foreground">
                      {call.studentName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{call.studentName}</h3>
                      <Badge variant="outline" className="text-xs">{call.studentId}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="h-3 w-3" />
                      <span>{call.date}</span>
                      <span>•</span>
                      <span>{call.duration}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCall(call.id)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Call Details Sheet */}
        <Sheet open={!!selectedCall} onOpenChange={(open) => !open && setSelectedCall(null)}>
          <SheetContent className="w-full sm:max-w-lg">
            {selectedCall && (() => {
              const call = pastCalls.find(c => c.id === selectedCall);
              if (!call) return null;
              
              return (
                <>
                  <SheetHeader>
                    <SheetTitle>Call Details</SheetTitle>
                    <SheetDescription>
                      Complete information about this video call
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    {/* Student Info */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={call.studentAvatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                          {call.studentName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{call.studentName}</h3>
                        <Badge variant="outline" className="mt-1">{call.studentId}</Badge>
                      </div>
                    </div>

                    <Separator />

                    {/* Call Information */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Date & Time</p>
                          <p className="text-sm text-muted-foreground">{call.date}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Duration</p>
                          <p className="text-sm text-muted-foreground">{call.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Status</p>
                          <Badge className="mt-1 bg-green-500">Completed</Badge>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Call Type</p>
                          <p className="text-sm text-muted-foreground">Video Call</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Call Notes */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-2">Call Notes</p>
                          <div className="p-3 rounded-lg bg-muted/50 border border-border">
                            <p className="text-sm text-muted-foreground">
                              Discussed complaint resolution and provided necessary guidance. 
                              Student was satisfied with the explanation and no further action required.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigate(`/video-call/${call.id}`)}
                        className="flex-1"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Call Again
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedCall(null)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Chat;
