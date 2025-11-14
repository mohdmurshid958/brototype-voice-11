import { Home, MessageSquare, FolderKanban, Users, BarChart3, User, LogOut, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { to: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { to: "/admin/complaints", icon: MessageSquare, label: "Complaints" },
    { to: "/admin/categories", icon: FolderKanban, label: "Categories" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/admin/profile", icon: User, label: "Profile" },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} border-r border-border bg-surface-light h-screen sticky top-0 flex-col transition-all duration-300 hidden md:flex`}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Administrator</p>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          <Menu className="h-5 w-5" />
        </button>
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
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? link.label : undefined}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
          onClick={() => navigate("/login")}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
