import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AdminNavigationProvider, useAdminNavigation } from "./contexts/AdminNavigationContext";
import { Navbar } from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import StudentComplaintDetail from "./pages/student/ComplaintDetail";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import StudentComplaints from "./pages/student/Complaints";
import StudentProfile from "./pages/student/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminComplaints from "./pages/admin/Complaints";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminUsers from "./pages/admin/Users";
import AdminCategories from "./pages/admin/Categories";
import AdminProfile from "./pages/admin/Profile";
import AdminComplaintDetail from "./pages/admin/ComplaintDetail";
import { AdminDock } from "./components/AdminDock";
import { AdminMobileNav } from "./components/AdminMobileNav";
import { StudentMobileNav } from "./components/StudentMobileNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const { navigationType } = useAdminNavigation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStudentRoute = location.pathname.startsWith('/student');
  const showNavbar = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/submit" element={<SubmitComplaint />} />
        <Route path="/student/complaints" element={<StudentComplaints />} />
        <Route path="/student/complaints/:id" element={<StudentComplaintDetail />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/complaints/:id" element={<AdminComplaintDetail />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {isAdminRoute && navigationType === "menubar" && <AdminDock />}
      {isAdminRoute && <AdminMobileNav />}
      {isStudentRoute && <StudentMobileNav />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdminNavigationProvider>
            <AppContent />
          </AdminNavigationProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
