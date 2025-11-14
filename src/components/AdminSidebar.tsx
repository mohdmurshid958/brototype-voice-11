import { Home, MessageSquare, FolderKanban, Users, BarChart3, Settings, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { to: "/admin/complaints", icon: MessageSquare, label: "Complaints" },
    { to: "/admin/categories", icon: FolderKanban, label: "Categories" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface-light h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="font-bold text-lg">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Administrator</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => navigate("/login")}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
