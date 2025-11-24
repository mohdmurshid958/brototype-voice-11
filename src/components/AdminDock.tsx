import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, BarChart3, Users, FolderTree, Video, User } from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { ThemeToggle } from "./ThemeToggle";

export function AdminDock() {
  const location = useLocation();
  
  const dockItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { title: "Complaints", icon: MessageSquare, href: "/admin/complaints" },
    { title: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { title: "Users", icon: Users, href: "/admin/users" },
    { title: "Categories", icon: FolderTree, href: "/admin/categories" },
    { title: "Video Chat", icon: Video, href: "/admin/chat" },
    { title: "Profile", icon: User, href: "/admin/profile" },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <Dock className="items-end pb-3">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href}>
              <DockItem className={`aspect-square rounded-full ${isActive ? 'bg-primary' : 'bg-muted hover:bg-muted/80'}`}>
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>
                  <Icon className={`h-full w-full ${isActive ? 'text-primary-foreground' : 'text-foreground'}`} />
                </DockIcon>
              </DockItem>
            </Link>
          );
        })}
        <DockItem className="aspect-square rounded-full bg-muted hover:bg-muted/80">
          <DockLabel>Theme</DockLabel>
          <DockIcon>
            <ThemeToggle />
          </DockIcon>
        </DockItem>
      </Dock>
    </div>
  );
}
