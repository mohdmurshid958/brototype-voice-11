import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminAnalytics() {
  const categoryData = [
    { name: "Infrastructure", value: 15 },
    { name: "Technical", value: 12 },
    { name: "Mentorship", value: 8 },
    { name: "Administrative", value: 10 },
    { name: "Other", value: 3 },
  ];

  const timelineData = [
    { month: "Jan", complaints: 12 },
    { month: "Feb", complaints: 19 },
    { month: "Mar", complaints: 15 },
    { month: "Apr", complaints: 22 },
    { month: "May", complaints: 18 },
    { month: "Jun", complaints: 25 },
  ];

  const statusData = [
    { name: "Pending", value: 15, color: "#EAB308" },
    { name: "In Progress", value: 8, color: "#3B82F6" },
    { name: "Resolved", value: 30, color: "#22C55E" },
    { name: "Rejected", value: 3, color: "#EF4444" },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground mb-8">Visualize complaint trends and metrics</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Complaints by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Complaints Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="complaints"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </main>
    </div>
  );
}
