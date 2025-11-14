import LumaBar from "./ui/futuristic-nav";
import { LayoutDashboard, MessageSquare, BarChart3, Users, FolderTree, User } from "lucide-react";

export function AdminMobileNav() {
  const navItems = [
    { id: 0, icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin/dashboard" },
    { id: 1, icon: <MessageSquare size={20} />, label: "Complaints", href: "/admin/complaints" },
    { id: 2, icon: <BarChart3 size={20} />, label: "Analytics", href: "/admin/analytics" },
    { id: 3, icon: <Users size={20} />, label: "Users", href: "/admin/users" },
    { id: 4, icon: <FolderTree size={20} />, label: "Categories", href: "/admin/categories" },
    { id: 5, icon: <User size={20} />, label: "Profile", href: "/admin/profile" },
  ];

  return <LumaBar items={navItems} />;
}
