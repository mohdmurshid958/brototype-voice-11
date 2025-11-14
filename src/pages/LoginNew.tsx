import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/sign-in-flow";
import { MessageSquare, Database, Settings, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LoadingStep = "collection" | "data" | "environment" | "complete";

export default function LoginNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<LoadingStep | null>(null);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  const loadingSteps: { step: LoadingStep; label: string; icon: any }[] = [
    { step: "collection", label: "Finding collection...", icon: Database },
    { step: "data", label: "Adding data...", icon: Settings },
    { step: "environment", label: "Setting environment...", icon: Settings },
    { step: "complete", label: "Complete!", icon: CheckCircle2 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      setIsLoading(true);
      
      // Simulate loading steps
      for (let i = 0; i < loadingSteps.length; i++) {
        setLoadingStep(loadingSteps[i].step);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Show reverse animation
      setReverseCanvasVisible(true);
      setTimeout(() => {
        setInitialCanvasVisible(false);
      }, 50);
      
      setTimeout(() => {
        setIsLoading(false);
        setLoadingStep(null);
        toast({
          title: "Account created successfully!",
          description: "You can now log in with your credentials.",
        });
        setIsSignUp(false);
        setEmail("");
        setPassword("");
        setName("");
      }, 2000);
    } else {
      // Login
      if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-background relative overflow-hidden">
      {/* Canvas Background */}
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-background"
              colors={[
                [239, 68, 68],
                [239, 68, 68],
              ]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-background"
              colors={[
                [239, 68, 68],
                [239, 68, 68],
              ]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_hsl(var(--background))_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <MessageSquare className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-2xl font-bold text-foreground">Brototype Portal</h1>
          </div>

          {/* Form Card */}
          <motion.div className="glass-effect rounded-3xl p-8 border border-border/50">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 py-8"
                >
                  <h2 className="text-2xl font-bold text-center text-foreground">
                    Creating Account
                  </h2>
                  <div className="space-y-4">
                    {loadingSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = loadingStep === step.step;
                      const isComplete = loadingSteps.findIndex(s => s.step === loadingStep) > index;
                      
                      return (
                        <motion.div
                          key={step.step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isActive ? "bg-primary/10" : isComplete ? "bg-muted/50" : ""
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${
                            isActive ? "text-primary animate-pulse" : 
                            isComplete ? "text-green-500" : "text-muted-foreground"
                          }`} />
                          <span className={`text-sm ${
                            isActive || isComplete ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {step.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      {isSignUp ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {isSignUp ? "Sign up to get started" : "Sign in to continue"}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                      <div>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>

                    {!isSignUp && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setRole("student")}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            role === "student"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("admin")}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            role === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full hero-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      ← Back to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
