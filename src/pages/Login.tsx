import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInFlow } from "@/components/ui/sign-in-flow";

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (email: string, password: string, name?: string) => {
    // Check for admin credentials
    if (email === "admin@example.com" && password === "admin@123") {
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } else {
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 2000);
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
