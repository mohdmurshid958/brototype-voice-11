import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";

export default function AdminComplaints() {
  const complaints = [
    {
      id: 1,
      student: "John Doe",
      title: "Lab equipment not working",
      category: "Infrastructure",
      status: "pending",
      date: "2025-01-10",
    },
    {
      id: 2,
      student: "Jane Smith",
      title: "WiFi connection issues",
      category: "Technical Issues",
      status: "resolved",
      date: "2025-01-08",
    },
    {
      id: 3,
      student: "Mike Johnson",
      title: "Mentor scheduling problem",
      category: "Mentorship",
      status: "in-progress",
      date: "2025-01-12",
    },
    {
      id: 4,
      student: "Sarah Williams",
      title: "Payment processing delay",
      category: "Administrative",
      status: "pending",
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
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Manage Complaints</h1>
          <p className="text-muted-foreground mb-8">Review and respond to student complaints</p>

          <Card className="p-6 mb-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search complaints..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Student</th>
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
                      <td className="py-4 px-4 text-muted-foreground">#{complaint.id}</td>
                      <td className="py-4 px-4 font-medium">{complaint.student}</td>
                      <td className="py-4 px-4">{complaint.title}</td>
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
