import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, MoreVertical, Mail, User as UserIcon, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminUsers() {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userBatch, setUserBatch] = useState("");
  
  const users = [
    { id: 1, name: "John Doe", email: "john@brototype.com", role: "Student", batch: "MERN 2024", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@brototype.com", role: "Student", batch: "MERN 2024", status: "active" },
    { id: 3, name: "Mike Johnson", email: "mike@brototype.com", role: "Student", batch: "Python 2024", status: "active" },
    { id: 4, name: "Sarah Williams", email: "sarah@brototype.com", role: "Student", batch: "MERN 2024", status: "inactive" },
  ];

  const handleAddUser = () => {
    console.log("Adding user:", { userName, userEmail, userBatch });
    setIsDialogOpen(false);
    setUserName("");
    setUserEmail("");
    setUserBatch("");
  };

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Users Management</h1>
              <p className="text-sm md:text-base text-muted-foreground">Manage student accounts and permissions</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="hero-gradient w-full sm:w-auto">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Add New User
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="userName"
                      placeholder="e.g., John Doe"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="e.g., john@brototype.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userBatch" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Batch
                    </Label>
                    <Input
                      id="userBatch"
                      placeholder="e.g., MERN 2024"
                      value={userBatch}
                      onChange={(e) => setUserBatch(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddUser} 
                    className="w-full hero-gradient"
                    disabled={!userName || !userEmail || !userBatch}
                  >
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-10" />
              </div>
            </div>

            {isMobile ? (
              <div className="space-y-3">
                {users.map((user) => (
                  <Card key={user.id} className="p-4 hover:border-primary transition-colors animate-fade-in">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">{user.batch}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge className={user.status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}>
                      {user.status}
                    </Badge>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 font-semibold">User</th>
                      <th className="text-left py-4 px-4 font-semibold">Email</th>
                      <th className="text-left py-4 px-4 font-semibold">Batch</th>
                      <th className="text-left py-4 px-4 font-semibold">Status</th>
                      <th className="text-right py-4 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                        <td className="py-4 px-4 text-muted-foreground">{user.batch}</td>
                        <td className="py-4 px-4">
                          <Badge className={user.status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
