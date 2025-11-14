import { Home, MessageSquare, List, Bell, Settings, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export function StudentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/student/dashboard", icon: Home, label: "Dashboard" },
    { to: "/student/submit", icon: MessageSquare, label: "Submit Complaint" },
    { to: "/student/complaints", icon: List, label: "My Complaints" },
    { to: "/student/notifications", icon: Bell, label: "Notifications" },
    { to: "/student/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface-light h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="font-bold text-lg">Student Portal</h2>
        <p className="text-sm text-muted-foreground">John Doe</p>
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
