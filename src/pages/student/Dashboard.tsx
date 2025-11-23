
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/hooks/useComplaints";
import { useMemo } from "react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: complaints, isLoading } = useComplaints(user?.id);

  const stats = useMemo(() => {
    if (!complaints) return [
      { label: "Total Complaints", value: "0", icon: AlertCircle, color: "text-blue-500" },
      { label: "Pending", value: "0", icon: Clock, color: "text-yellow-500" },
      { label: "Resolved", value: "0", icon: CheckCircle, color: "text-green-500" },
      { label: "In Progress", value: "0", icon: Clock, color: "text-purple-500" },
    ];

    const total = complaints.length;
    const pending = complaints.filter(c => c.status === "pending").length;
    const resolved = complaints.filter(c => c.status === "resolved").length;
    const inProgress = complaints.filter(c => c.status === "in_progress").length;

    return [
      { label: "Total Complaints", value: total.toString(), icon: AlertCircle, color: "text-blue-500" },
      { label: "Pending", value: pending.toString(), icon: Clock, color: "text-yellow-500" },
      { label: "Resolved", value: resolved.toString(), icon: CheckCircle, color: "text-green-500" },
      { label: "In Progress", value: inProgress.toString(), icon: Clock, color: "text-purple-500" },
    ];
  }, [complaints]);

  const recentComplaints = useMemo(() => {
    if (!complaints) return [];
    return complaints
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [complaints]);

  return (
    <main className="flex-1 p-8 pb-24 min-h-screen w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
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
            {isLoading ? (
              <p className="text-muted-foreground">Loading complaints...</p>
            ) : recentComplaints.length === 0 ? (
              <p className="text-muted-foreground">No complaints yet. Submit your first complaint!</p>
            ) : (
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          complaint.status === "pending" 
                            ? "bg-yellow-500" 
                            : complaint.status === "resolved" 
                            ? "bg-green-500" 
                            : "bg-blue-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{complaint.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/student/complaints/${complaint.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
  );
}
