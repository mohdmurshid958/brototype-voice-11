import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle, Users } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import { useComplaints } from "@/hooks/useComplaints";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: complaints, isLoading: complaintsLoading } = useComplaints();

  const recentActivity = complaints?.slice(0, 5).map((complaint) => ({
    student: complaint.profiles?.full_name || "Unknown",
    action: "submitted",
    complaint: complaint.title,
    time: formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true }),
  })) || [];

  const statCards = [
    {
      label: "Total Complaints",
      value: statsLoading ? "..." : stats?.totalComplaints.toString() || "0",
      icon: AlertCircle,
      color: "text-blue-500",
    },
    {
      label: "Active",
      value: statsLoading ? "..." : stats?.activeComplaints.toString() || "0",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Resolved",
      value: statsLoading ? "..." : stats?.resolvedComplaints.toString() || "0",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Total Students",
      value: statsLoading ? "..." : stats?.totalStudents.toString() || "0",
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <main className="flex-1 p-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <Card key={stat.label} className="p-6 hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
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
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {complaintsLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, i) => (
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
                ))
              ) : (
                <p className="text-muted-foreground">No recent activity</p>
              )}
            </div>
          </Card>
        </div>
      </main>
  );
}
