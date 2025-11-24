import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Settings, Camera, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdminNavigation } from "@/contexts/AdminNavigationContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile, useUpdatePassword, useUploadAvatar } from "@/hooks/useProfile";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRef } from "react";

export default function AdminProfile() {
  const { navigationType, setNavigationType } = useAdminNavigation();
  const [useMenubar, setUseMenubar] = useState(navigationType === "menubar");
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const { data: profile, isLoading } = useProfile(user?.id || "");
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update local state when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleNavigationToggle = (checked: boolean) => {
    setUseMenubar(checked);
    setNavigationType(checked ? "menubar" : "sidebar");
    toast.success(checked ? "Switched to bottom navigation (dock)" : "Switched to sidebar navigation");
  };

  const handleUpdateProfile = () => {
    if (!user) return;
    updateProfile.mutate({
      userId: user.id,
      full_name: fullName,
      email: email,
    });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    uploadAvatar.mutate({ userId: user.id, file });
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <p className="text-muted-foreground">Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Profile Settings</h1>
              <p className="text-sm md:text-base text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            <ThemeToggle />
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
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0).toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      onClick={handleAvatarClick}
                      disabled={uploadAvatar.isPending}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg md:text-xl font-semibold mb-2">Profile Picture</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Click the camera icon to upload a new profile picture (Max 2MB)
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleUpdateProfile}
                    disabled={updateProfile.isPending}
                    className="w-full sm:w-auto"
                  >
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  onClick={handleUpdatePassword}
                  disabled={updatePassword.isPending}
                  className="w-full sm:w-auto"
                >
                  {updatePassword.isPending ? "Updating..." : "Update Password"}
                </Button>
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
                  <div>
                    <p className="font-medium">Use Bottom Navigation</p>
                    <p className="text-sm text-muted-foreground">Switch between sidebar and bottom navigation</p>
                  </div>
                  <Switch checked={useMenubar} onCheckedChange={handleNavigationToggle} />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
