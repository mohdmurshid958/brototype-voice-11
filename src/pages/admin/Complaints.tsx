import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useComplaints } from "@/hooks/useComplaints";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function AdminComplaints() {
  const navigate = useNavigate();
  const { data: complaints, isLoading } = useComplaints();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComplaints = complaints?.filter((complaint) =>
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Manage Complaints</h1>
          <p className="text-muted-foreground mb-6 md:mb-8">Review and respond to student complaints</p>

          <Card className="p-4 md:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search complaints..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {isLoading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading complaints...</p>
            </Card>
          ) : filteredComplaints.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No complaints found</p>
            </Card>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredComplaints.map((complaint) => (
                  <Card key={complaint.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-sm">{complaint.title}</h3>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {complaint.profiles?.full_name || "Unknown"}
                        </span>
                        <span>•</span>
                        <span className="bg-muted px-2 py-1 rounded">{complaint.category}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View & Respond
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <Card className="hidden md:block overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Student</th>
                        <th className="text-left p-4 font-medium">Title</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((complaint) => (
                        <tr key={complaint.id} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="p-4 font-medium">
                            {complaint.profiles?.full_name || "Unknown"}
                          </td>
                          <td className="p-4">{complaint.title}</td>
                          <td className="p-4">
                            <span className="bg-muted px-3 py-1 rounded-full text-sm">
                              {complaint.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                          </td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View & Respond
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
