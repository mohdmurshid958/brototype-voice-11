import { StudentSidebar } from "@/components/StudentSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const stats = [
    { label: "Total Complaints", value: "12", icon: AlertCircle, color: "text-blue-500" },
    { label: "Pending", value: "3", icon: Clock, color: "text-yellow-500" },
    { label: "Resolved", value: "8", icon: CheckCircle, color: "text-green-500" },
    { label: "Avg. Response Time", value: "2.3 days", icon: Clock, color: "text-purple-500" },
  ];

  const recentComplaints = [
    { id: 1, title: "Lab equipment not working", status: "pending", date: "2025-01-10" },
    { id: 2, title: "WiFi connection issues", status: "resolved", date: "2025-01-08" },
    { id: 3, title: "Mentor scheduling problem", status: "pending", date: "2025-01-12" },
  ];

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome Back, John!</h1>
              <p className="text-muted-foreground">Here's your complaint overview</p>
            </div>
            <Button asChild className="hero-gradient">
              <Link to="/student/submit">
                <Plus className="h-4 w-4 mr-2" />
                New Complaint
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 hover:border-primary transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Complaints</h2>
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        complaint.status === "pending" ? "bg-yellow-500" : "bg-green-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{complaint.title}</p>
                      <p className="text-sm text-muted-foreground">{complaint.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
