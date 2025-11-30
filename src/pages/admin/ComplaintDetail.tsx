import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Calendar, User, Tag, Send, Paperclip, Eye } from "lucide-react";
import { useComplaint, useComplaintResponses, useCreateComplaintResponse } from "@/hooks/useComplaints";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

export default function AdminComplaintDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [newResponse, setNewResponse] = useState("");
  const [newStatus, setNewStatus] = useState("in-progress");
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);

  const { data: complaint, isLoading: complaintLoading } = useComplaint(id || "");
  const { data: responses, isLoading: responsesLoading } = useComplaintResponses(id || "");
  const createResponse = useCreateComplaintResponse();

  const handleSendResponse = () => {
    if (!newResponse.trim() || !user || !id) return;

    createResponse.mutate(
      {
        complaint_id: id,
        user_id: user.id,
        message: newResponse,
        status: newStatus,
      },
      {
        onSuccess: () => {
          setNewResponse("");
        },
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (complaintLoading) {
    return (
      <main className="flex-1 p-8">
        <p className="text-muted-foreground">Loading complaint...</p>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="flex-1 p-8">
        <p className="text-muted-foreground">Complaint not found</p>
      </main>
    );
  }

  return (
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
                    <span>{complaint.profiles?.full_name || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{complaint.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{complaint.description}</p>
              </div>

              {/* Attachment */}
              {complaint.attachment_url && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachment
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setAttachmentDialogOpen(true)}
                    className="inline-flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">View Attachment</span>
                  </Button>
                </div>
              )}

              {/* Attachment Dialog */}
              <Dialog open={attachmentDialogOpen} onOpenChange={setAttachmentDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Attachment</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4">
                    <img 
                      src={complaint.attachment_url} 
                      alt="Complaint attachment" 
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              {/* Responses */}
              <div>
                <h3 className="font-semibold mb-4">Response History</h3>
                <div className="space-y-4">
                  {responsesLoading ? (
                    <p className="text-muted-foreground text-sm">Loading responses...</p>
                  ) : responses && responses.length > 0 ? (
                    responses.map((response) => (
                      <div key={response.id} className="border-l-2 border-primary pl-4 py-2">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-sm">{response.profiles?.full_name || "Admin"}</p>
                          <Badge className={getStatusColor(response.status)} variant="outline">
                            {response.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatDistanceToNow(new Date(response.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{response.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No responses yet</p>
                  )}
                </div>
              </div>

              {/* Response Form */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Add Response</h3>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your response..."
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleSendResponse}
                      disabled={!newResponse.trim() || createResponse.isPending}
                      className="w-full sm:w-auto"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {createResponse.isPending ? "Sending..." : "Send Response"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
  );
}
