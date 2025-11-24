import { useState } from "react";
import { Video, Phone, Search, Check, X, Clock, MessageSquare, Calendar } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<string | null>(null);

  // Mock data for call requests
  const callRequests = [
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

  const pastCalls = [
    {
      id: "5",
      studentName: "James Taylor",
      studentAvatar: "",
      studentId: "STU2024005",
      date: "Today, 1:15 PM",
      duration: "12 min",
      status: "completed",
    },
    {
      id: "6",
      studentName: "Lisa Anderson",
      studentAvatar: "",
      studentId: "STU2024006",
      date: "Today, 11:30 AM",
      duration: "8 min",
      status: "completed",
    },
    {
      id: "7",
      studentName: "David Martinez",
      studentAvatar: "",
      studentId: "STU2024007",
      date: "Yesterday, 3:45 PM",
      duration: "20 min",
      status: "completed",
    },
  ];

  const handleAcceptCall = (callId: string) => {
    navigate(`/video-call/${callId}`);
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
                <p className="text-2xl font-bold text-foreground">{callRequests.length}</p>
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
              Pending ({callRequests.length})
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
            {callRequests.map((request) => (
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
                      onClick={() => handleAcceptCall(request.id)}
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
            {pastCalls.map((call) => (
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
