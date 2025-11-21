import { StudentSidebar } from "@/components/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useStudentNavigation } from "@/contexts/StudentNavigationContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile, useUpdatePassword } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

export default function StudentProfile() {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id || "");
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const { navigationType, setNavigationType } = useStudentNavigation();
  const [useMenubar, setUseMenubar] = useState(navigationType === "menubar");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleNavigationToggle = (checked: boolean) => {
    setUseMenubar(checked);
    setNavigationType(checked ? "menubar" : "sidebar");
    toast({
      title: "Navigation updated",
      description: checked ? "Switched to bottom navigation" : "Switched to sidebar navigation",
    });
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    updateProfile.mutate({
      userId: user.id,
      full_name: fullName,
      email: email,
    });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    updatePassword.mutate(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <p className="text-muted-foreground">Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full transition-navigation">
      <StudentSidebar />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage your account information</p>
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
                      <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
                      <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg md:text-xl font-semibold mb-2">{profile?.full_name || "User"}</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="hero-gradient w-full sm:w-auto"
                      onClick={handleSaveProfile}
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? "Saving..." : "Save Changes"}
                    </Button>
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
                    <Input 
                      id="currentPassword" 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full sm:w-fit"
                    onClick={handleChangePassword}
                    disabled={updatePassword.isPending}
                  >
                    {updatePassword.isPending ? "Updating..." : "Update Password"}
                  </Button>
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
                    <Label htmlFor="navigation-mode">Use Bottom Navigation</Label>
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
