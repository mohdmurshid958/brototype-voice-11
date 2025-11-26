import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AdminNavigationProvider, useAdminNavigation } from "./contexts/AdminNavigationContext";
import { StudentNavigationProvider, useStudentNavigation } from "./contexts/StudentNavigationContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import StudentComplaintDetail from "./pages/student/ComplaintDetail";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import StudentComplaints from "./pages/student/Complaints";
import StudentProfile from "./pages/student/Profile";
import StudentChat from "./pages/student/Chat";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminComplaints from "./pages/admin/Complaints";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminUsers from "./pages/admin/Users";
import AdminCategories from "./pages/admin/Categories";
import AdminProfile from "./pages/admin/Profile";
import AdminComplaintDetail from "./pages/admin/ComplaintDetail";
import AdminChat from "./pages/admin/Chat";
import VideoCall from "./pages/VideoCall";
import { AdminDock } from "./components/AdminDock";
import { AdminMobileNav } from "./components/AdminMobileNav";
import { AdminSidebar } from "./components/AdminSidebar";
import { StudentDock } from "./components/StudentDock";
import { StudentMobileNav } from "./components/StudentMobileNav";
import { StudentSidebar } from "./components/StudentSidebar";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsConditions from "./pages/terms-conditions";

const queryClient = new QueryClient();

// Protected route component
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to correct dashboard based on role
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const { navigationType: adminNavigationType } = useAdminNavigation();
  const { navigationType: studentNavigationType } = useStudentNavigation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStudentRoute = location.pathname.startsWith('/student');
  const showNavbar = location.pathname === '/';
  
  const showAdminSidebar = isAdminRoute && adminNavigationType === "sidebar";
  const showStudentSidebar = isStudentRoute && studentNavigationType === "sidebar";

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showAdminSidebar || showStudentSidebar ? "flex min-h-screen w-full" : ""}>
        {showAdminSidebar && <AdminSidebar />}
        {showStudentSidebar && <StudentSidebar />}
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/submit" element={<ProtectedRoute requiredRole="student"><SubmitComplaint /></ProtectedRoute>} />
          <Route path="/student/complaints" element={<ProtectedRoute requiredRole="student"><StudentComplaints /></ProtectedRoute>} />
          <Route path="/student/complaints/:id" element={<ProtectedRoute requiredRole="student"><StudentComplaintDetail /></ProtectedRoute>} />
          <Route path="/student/chat" element={<ProtectedRoute requiredRole="student"><StudentChat /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute requiredRole="student"><StudentProfile /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute requiredRole="admin"><AdminComplaints /></ProtectedRoute>} />
          <Route path="/admin/complaints/:id" element={<ProtectedRoute requiredRole="admin"><AdminComplaintDetail /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute requiredRole="admin"><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/chat" element={<ProtectedRoute requiredRole="admin"><AdminChat /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute requiredRole="admin"><AdminProfile /></ProtectedRoute>} />
          
          <Route path="/video-call/:callId?" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />
        
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      {isAdminRoute && adminNavigationType === "menubar" && <AdminDock />}
      {isAdminRoute && <AdminMobileNav />}
      {isStudentRoute && studentNavigationType === "menubar" && <StudentDock />}
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
          <AuthProvider>
            <AdminNavigationProvider>
              <StudentNavigationProvider>
                <AppContent />
              </StudentNavigationProvider>
            </AdminNavigationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
