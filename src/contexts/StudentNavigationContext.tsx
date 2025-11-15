import { createContext, useContext, useState, ReactNode } from "react";

type NavigationType = "menubar" | "sidebar";

interface StudentNavigationContextType {
  navigationType: NavigationType;
  setNavigationType: (type: NavigationType) => void;
}

const StudentNavigationContext = createContext<StudentNavigationContextType | undefined>(undefined);

export function StudentNavigationProvider({ children }: { children: ReactNode }) {
  const [navigationType, setNavigationType] = useState<NavigationType>("sidebar");

  return (
    <StudentNavigationContext.Provider value={{ navigationType, setNavigationType }}>
      {children}
    </StudentNavigationContext.Provider>
  );
}

export function useStudentNavigation() {
  const context = useContext(StudentNavigationContext);
  if (context === undefined) {
    throw new Error("useStudentNavigation must be used within a StudentNavigationProvider");
  }
  return context;
}
