import { StudentSidebar } from "@/components/StudentSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function StudentComplaints() {
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

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Complaints</h1>
          <p className="text-muted-foreground mb-8">View and track all your submitted complaints</p>

          <Card className="p-6">
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
                        <Button variant="ghost" size="sm">
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
