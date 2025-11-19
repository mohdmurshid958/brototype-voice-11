import { useNavigate, useParams } from "react-router-dom";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { useComplaint, useComplaintResponses } from "@/hooks/useComplaints";
import { format } from "date-fns";

export default function StudentComplaintDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: complaint, isLoading } = useComplaint(id!);
  const { data: responses, isLoading: responsesLoading } = useComplaintResponses(id!);

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

  if (isLoading || responsesLoading) {
    return (
      <div className="flex min-h-screen">
        <StudentSidebar />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto flex items-center justify-center">
            <p>Loading complaint details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex min-h-screen">
        <StudentSidebar />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Complaint not found</p>
              <Button onClick={() => navigate("/student/complaints")} className="mt-4">
                Back to Complaints
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/student/complaints")}
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
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(complaint.created_at), "MMM dd, yyyy")}</span>
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
                {!responses || responses.length === 0 ? (
                  <Card className="p-6 text-center bg-muted/30">
                    <p className="text-muted-foreground">No responses yet. We'll update you soon!</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {responses.map((response, index) => (
                      <div key={response.id} className="relative pl-8 pb-4">
                        {index !== responses.length - 1 && (
                          <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
                        )}
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="font-semibold">
                              {response.profiles?.full_name || "Admin"}
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={`${getStatusColor(response.status)} border text-xs`}>
                                Status: {response.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(response.created_at), "MMM dd, yyyy HH:mm")}
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
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
