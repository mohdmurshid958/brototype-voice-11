import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInFlow } from "@/components/ui/sign-in-flow";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const { signIn, signUp, user, userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if already logged in
    if (user && userRole) {
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }
  }, [user, userRole, navigate]);

  const handleSubmit = async (email: string, password: string, name?: string) => {
    try {
      if (isSignup) {
        if (!name) {
          toast({
            title: "Error",
            description: "Please provide your full name",
            variant: "destructive",
          });
          return;
        }
        await signUp(email, password, name);
        toast({
          title: "Success",
          description: "Account created successfully! Please sign in.",
        });
        setIsSignup(false);
      } else {
        await signIn(email, password);
        // Navigation will happen automatically via useEffect
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const handleToggleMode = () => {
    setIsSignup(!isSignup);
  };

  return (
    <SignInFlow 
      onSubmit={handleSubmit}
      isSignup={isSignup}
      onToggleMode={handleToggleMode}
    />
  );
}
