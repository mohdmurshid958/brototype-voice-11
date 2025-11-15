import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, MapPin, Building, Calendar, Settings, Camera, LogOut } from "lucide-react";
import { useState } from "react";
import { useAdminNavigation } from "@/contexts/AdminNavigationContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminProfile() {
  const { navigationType, setNavigationType } = useAdminNavigation();
  const [useMenubar, setUseMenubar] = useState(navigationType === "menubar");
  const navigate = useNavigate();

  const handleNavigationToggle = (checked: boolean) => {
    setUseMenubar(checked);
    setNavigationType(checked ? "menubar" : "sidebar");
    toast.success(checked ? "Switched to bottom navigation (dock)" : "Switched to sidebar navigation");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid gap-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="relative mx-auto sm:mx-0">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg md:text-xl font-semibold mb-2">Profile Picture</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Click the camera icon to upload a new profile picture
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        First Name
                      </Label>
                      <Input id="firstName" defaultValue="Admin" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="User" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input id="email" type="email" defaultValue="admin@brototype.com" />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input id="phone" type="tel" defaultValue="+91 1234567890" />
                  </div>

                  <div>
                    <Label htmlFor="role" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Role
                    </Label>
                    <Input id="role" defaultValue="Administrator" disabled />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="hero-gradient w-full sm:w-auto">Save Changes</Button>
                    <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              <Button className="w-full sm:w-fit">Update Password</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Navigation Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="navigation-mode">Use Bottom Navigation (Dock)</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between sidebar and bottom navigation bar
                </p>
              </div>
              <Switch
                id="navigation-mode"
                checked={useMenubar}
                onCheckedChange={handleNavigationToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Logout</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  className="w-full sm:w-auto"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
);
}
