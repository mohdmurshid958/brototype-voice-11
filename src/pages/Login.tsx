import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInFlow } from "@/components/ui/sign-in-flow";

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (email: string, password: string, name?: string) => {
    // Check for admin credentials - works for both login and signup
    const isAdmin = email === "admin@example.com" && password === "admin@123";
    
    setTimeout(() => {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }, 4000); // Increased timeout to match loading animation duration
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
