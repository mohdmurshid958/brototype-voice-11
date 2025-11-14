import LumaBar from "./ui/futuristic-nav";
import { LayoutDashboard, MessageSquare, PlusCircle, User } from "lucide-react";

export function StudentMobileNav() {
  const navItems = [
    { id: 0, icon: <LayoutDashboard size={24} />, label: "Dashboard", href: "/student/dashboard" },
    { id: 1, icon: <MessageSquare size={24} />, label: "Complaints", href: "/student/complaints" },
    { id: 2, icon: <PlusCircle size={24} />, label: "Submit", href: "/student/submit" },
    { id: 3, icon: <User size={24} />, label: "Profile", href: "/student/profile" },
  ];

  return <LumaBar items={navItems} />;
}
