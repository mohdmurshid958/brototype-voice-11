import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Complaints", value: "48", icon: AlertCircle, color: "text-blue-500", change: "+12%" },
    { label: "Pending", value: "15", icon: Clock, color: "text-yellow-500", change: "+5%" },
    { label: "Resolved", value: "30", icon: CheckCircle, color: "text-green-500", change: "+8%" },
    { label: "Avg. Response Time", value: "1.8 days", icon: TrendingUp, color: "text-purple-500", change: "-15%" },
  ];

  const recentActivity = [
    { student: "John Doe", action: "submitted", complaint: "Lab equipment issue", time: "2 hours ago" },
    { student: "Jane Smith", action: "replied to", complaint: "WiFi connectivity", time: "4 hours ago" },
    { student: "Mike Johnson", action: "submitted", complaint: "Mentor scheduling", time: "6 hours ago" },
    { student: "Sarah Williams", action: "closed", complaint: "Payment delay", time: "8 hours ago" },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className={stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      <span className="text-primary">{activity.student}</span> {activity.action}{" "}
                      <span className="text-muted-foreground">"{activity.complaint}"</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
