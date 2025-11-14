import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [studentEmail, setStudentEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/student/dashboard");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <MessageSquare className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-2xl font-bold">Brototype Portal</h1>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <form onSubmit={handleStudentLogin} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="student-email">Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  placeholder="student@brototype.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="student-password">Password</Label>
                <Input id="student-password" type="password" required />
              </div>
              <Button type="submit" className="w-full hero-gradient">
                Login as Student
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <form onSubmit={handleAdminLogin} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@brototype.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input id="admin-password" type="password" required />
              </div>
              <Button type="submit" className="w-full hero-gradient">
                Login as Admin
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
}
