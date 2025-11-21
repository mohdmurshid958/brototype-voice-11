import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, PlusCircle, User, LogOut } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

export function StudentMenubar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <Menubar className="shadow-lg backdrop-blur-sm bg-background/95">
        <MenubarMenu>
          <MenubarTrigger className={isActive("/student/dashboard") ? "bg-accent" : ""}>
            <Link to="/student/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className={isActive("/student/complaints") ? "bg-accent" : ""}>
            <Link to="/student/complaints" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Complaints</span>
            </Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className={isActive("/student/submit") ? "bg-accent" : ""}>
            <Link to="/student/submit" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Submit</span>
            </Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>
            <User className="h-4 w-4" />
            <span className="ml-2">Account</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem asChild>
              <Link to="/student/profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger asChild>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
