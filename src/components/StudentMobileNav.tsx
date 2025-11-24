import LumaBar from "./ui/futuristic-nav";
import { LayoutDashboard, MessageSquare, PlusCircle, Video, User } from "lucide-react";

export function StudentMobileNav() {
  const navItems = [
    { id: 0, icon: <LayoutDashboard size={24} />, label: "Dashboard", href: "/student/dashboard" },
    { id: 1, icon: <MessageSquare size={24} />, label: "Complaints", href: "/student/complaints" },
    { id: 2, icon: <PlusCircle size={24} />, label: "Submit", href: "/student/submit" },
    { id: 3, icon: <Video size={24} />, label: "Video Chat", href: "/student/chat" },
    { id: 4, icon: <User size={24} />, label: "Profile", href: "/student/profile" },
  ];

  return <LumaBar items={navItems} />;
}
