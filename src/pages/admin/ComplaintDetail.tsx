import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, User, Tag, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminComplaintDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [newResponse, setNewResponse] = useState("");
  const [newStatus, setNewStatus] = useState("opened");

  // Mock data
  const [complaint, setComplaint] = useState({
    id: 1,
    student: "John Doe",
    title: "Lab equipment not working",
    category: "Infrastructure",
    status: "in-progress",
    date: "2025-01-10",
    description: "The computers in Lab 3 are not functioning properly. Multiple students have reported issues with the monitors and keyboards not responding.",
    responses: [
      {
        id: 1,
        from: "Admin",
        message: "We have received your complaint and will look into it shortly.",
        timestamp: "2025-01-10 10:30 AM",
        status: "opened"
      },
      {
        id: 2,
        from: "Admin",
        message: "Our technical team is currently investigating the issue. We expect to have it resolved within 24 hours.",
        timestamp: "2025-01-11 02:15 PM",
        status: "in-progress"
      }
    ]
  });

  const handleSendResponse = () => {
    if (!newResponse.trim()) return;

    const response = {
      id: complaint.responses.length + 1,
      from: "Admin",
      message: newResponse,
      timestamp: new Date().toLocaleString(),
      status: newStatus
    };

    setComplaint({
      ...complaint,
      status: newStatus,
      responses: [...complaint.responses, response]
    });

    setNewResponse("");
    
    toast({
      title: "Response sent",
      description: "Your response has been sent to the student.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "opened":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/complaints")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Complaints
          </Button>

          <Card className="p-4 md:p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold">{complaint.title}</h1>
                  </div>
                  <Badge className={`${getStatusColor(complaint.status)} border w-fit`}>
                    {complaint.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{complaint.student}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{complaint.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{complaint.category}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              {/* Responses Timeline */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Updates & Responses</h2>
                <div className="space-y-4">
                  {complaint.responses.map((response, index) => (
                    <div key={response.id} className="relative pl-8 pb-4">
                      {index !== complaint.responses.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
                      )}
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="font-semibold">{response.from}</span>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`${getStatusColor(response.status)} border text-xs`}>
                              Status: {response.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {response.timestamp}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {response.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Response */}
              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-lg font-semibold">Add Response</h2>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your response here..."
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opened">Opened</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleSendResponse}
                      className="hero-gradient w-full sm:w-auto"
                      disabled={!newResponse.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
