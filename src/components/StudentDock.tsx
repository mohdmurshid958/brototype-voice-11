import { LayoutDashboard, MessageSquare, PlusCircle, User } from "lucide-react";
import { NavLink } from "./NavLink";
import { Dock, DockIcon } from "./ui/dock";

export function StudentDock() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none hidden md:block">
      <Dock className="pointer-events-auto">
        <DockIcon>
          <NavLink to="/student/dashboard" end>
            <LayoutDashboard className="h-5 w-5" />
          </NavLink>
        </DockIcon>
        <DockIcon>
          <NavLink to="/student/complaints">
            <MessageSquare className="h-5 w-5" />
          </NavLink>
        </DockIcon>
        <DockIcon>
          <NavLink to="/student/submit">
            <PlusCircle className="h-5 w-5" />
          </NavLink>
        </DockIcon>
        <DockIcon>
          <NavLink to="/student/profile">
            <User className="h-5 w-5" />
          </NavLink>
        </DockIcon>
      </Dock>
    </div>
  );
}
