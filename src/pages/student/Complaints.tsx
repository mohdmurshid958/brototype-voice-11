import { StudentSidebar } from "@/components/StudentSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentComplaints() {
  const navigate = useNavigate();
  
  const complaints = [
    {
      id: 1,
      title: "Lab equipment not working",
      category: "Infrastructure",
      status: "pending",
      date: "2025-01-10",
    },
    {
      id: 2,
      title: "WiFi connection issues",
      category: "Technical Issues",
      status: "resolved",
      date: "2025-01-08",
    },
    {
      id: 3,
      title: "Mentor scheduling problem",
      category: "Mentorship",
      status: "pending",
      date: "2025-01-12",
    },
    {
      id: 4,
      title: "Payment processing delay",
      category: "Administrative",
      status: "in-progress",
      date: "2025-01-11",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500";
      case "resolved":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Complaints</h1>
          <p className="text-muted-foreground mb-6 md:mb-8">View and track all your submitted complaints</p>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm flex-1">{complaint.title}</h3>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="bg-muted px-2 py-1 rounded">{complaint.category}</span>
                    <span>{complaint.date}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/student/complaints/${complaint.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="p-6 hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">Title</th>
                    <th className="text-left py-4 px-4 font-semibold">Category</th>
                    <th className="text-left py-4 px-4 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 font-semibold">Date</th>
                    <th className="text-right py-4 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 font-medium">{complaint.title}</td>
                      <td className="py-4 px-4 text-muted-foreground">{complaint.category}</td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{complaint.date}</td>
                      <td className="py-4 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/student/complaints/${complaint.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
