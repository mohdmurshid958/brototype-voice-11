import { createContext, useContext, useState, ReactNode } from "react";

type NavigationType = "menubar" | "sidebar";

interface AdminNavigationContextType {
  navigationType: NavigationType;
  setNavigationType: (type: NavigationType) => void;
}

const AdminNavigationContext = createContext<AdminNavigationContextType | undefined>(undefined);

export function AdminNavigationProvider({ children }: { children: ReactNode }) {
  const [navigationType, setNavigationType] = useState<NavigationType>("menubar");

  return (
    <AdminNavigationContext.Provider value={{ navigationType, setNavigationType }}>
      {children}
    </AdminNavigationContext.Provider>
  );
}

export function useAdminNavigation() {
  const context = useContext(AdminNavigationContext);
  if (context === undefined) {
    throw new Error("useAdminNavigation must be used within an AdminNavigationProvider");
  }
  return context;
}
