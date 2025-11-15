import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send, Clock, CheckCircle, Shield, Bell, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 hover:scale-105 transition-transform"
            >
              <MessageSquare className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">Complaint Management System</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent"
            >
              Raise Your Voice, Get Heard 💬
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              A transparent complaint system for Brototype students — fast, fair, and reliable.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild className="hero-gradient text-lg h-12 px-8 hover:scale-105 transition-transform">
                <Link to="/student/dashboard">Submit a Complaint</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-12 px-8 hover:scale-105 transition-transform">
                <Link to="/admin/dashboard">Admin Login</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-surface-light">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Simple process, powerful results</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { icon: Send, title: "Submit", desc: "File your complaint with detailed information" },
              { icon: Clock, title: "Review", desc: "Admin team reviews your submission" },
              { icon: MessageSquare, title: "Respond", desc: "Get timely responses and updates" },
              { icon: CheckCircle, title: "Resolve", desc: "Track resolution in real-time" },
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-primary/50 h-full">
                  <div className="h-16 w-16 rounded-full hero-gradient flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need for effective complaint management</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { icon: Shield, title: "Secure Login", desc: "Protected student and admin access" },
              { icon: TrendingUp, title: "Real-time Tracking", desc: "Monitor complaint status instantly" },
              { icon: Bell, title: "Fast Response", desc: "Quick admin acknowledgment" },
              { icon: Users, title: "Transparency", desc: "Full visibility into the process" },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 hero-gradient">
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join the Brototype Complaint Portal — where your voice matters.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" variant="secondary" asChild className="text-lg h-12 px-8">
              <Link to="/student/dashboard">Get Started Now</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Brototype. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
