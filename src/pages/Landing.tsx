import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Clock, CheckCircle, Shield, Bell, TrendingUp, Users, AlertCircle, FileText, Eye, PenTool } from "lucide-react";
import { motion } from "framer-motion";
import DisplayCards from "@/components/ui/display-cards";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { CTASection } from "@/components/ui/cta-with-rectangle";
import { BrotalSection } from "@/components/BrotalSection";
import { StickyFeatures } from "@/components/StickyFeatures";

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Dotted Surface Background */}
        <DottedSurface className="absolute inset-0" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 hover:scale-105 transition-all hover:glow-effect backdrop-blur-sm"
            >
              <MessageSquare className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-semibold">Complaint Management System</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in-0 slide-in-from-bottom-4 duration-1000"
            >
              Raise Your Voice, Get Heard 💬
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              A transparent complaint system for Brototype students — fast, fair, and reliable.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <Button size="lg" asChild className="hero-gradient text-lg h-14 px-10 hover:scale-105 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/50">
                <Link to="/student/dashboard">
                  Submit a Complaint
                  <Send className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-14 px-10 hover:scale-105 transition-all border-primary/30 hover:border-primary hover:bg-primary/5">
                <Link to="/admin/dashboard">Admin Login</Link>
              </Button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Users className="h-4 w-4 text-primary" />
              <p>
                Trusted by <span className="font-semibold text-primary">500+ students</span> at Brototype
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">
              <span className="text-primary">Simple Process</span>
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to resolve your concerns efficiently
            </p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { 
                number: "01", 
                title: "Submit Complaint", 
                desc: "File your complaint with detailed information and supporting evidence through our intuitive form", 
                icon: PenTool 
              },
              { 
                number: "02", 
                title: "Admin Review", 
                desc: "Our dedicated admin team promptly reviews your submission and assesses priority levels", 
                icon: Eye 
              },
              { 
                number: "03", 
                title: "Get Updates", 
                desc: "Receive timely responses and real-time status updates throughout the resolution process", 
                icon: CheckCircle 
              },
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants}>
                <div
                  className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full"
                >
                  <div className="absolute -top-6 -right-6 text-9xl font-bold text-primary/50 group-hover:text-primary/60 transition-colors">
                    {step.number}
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <StickyFeatures />

      {/* Complaints Demo Section */}
      <section className="py-12 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 md:space-y-6 order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary backdrop-blur-sm">
                <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm font-semibold">Live Demo</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Track Your Complaints in{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Real-Time
                </span>
              </h2>
              
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                See how complaints are managed transparently. From submission to resolution, 
                track every step of the process with instant updates and clear communication.
              </p>

              <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                {[
                  { icon: AlertCircle, title: "Instant Submission", desc: "Submit complaints in seconds with our intuitive interface" },
                  { icon: Clock, title: "Real-time Updates", desc: "Get notified immediately when status changes" },
                  { icon: CheckCircle, title: "Quick Resolution", desc: "Average resolution time of 24-48 hours" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-surface-elevated border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-0.5 md:mb-1 text-sm md:text-base">{feature.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button size="lg" asChild className="hero-gradient mt-4 md:mt-6 hover:scale-105 transition-transform shadow-lg w-full sm:w-auto">
                <Link to="/student/dashboard">
                  Try It Now
                  <Send className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Right Side - Display Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px] order-1 lg:order-2 w-full overflow-hidden"
            >
              <div className="scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100 origin-center">
                <DisplayCards
                  cards={[
                    {
                      icon: <AlertCircle className="size-4 text-destructive" />,
                      title: "Urgent",
                      description: "AC not working in Lab 2",
                      date: "2 hours ago",
                      iconClassName: "text-destructive",
                      titleClassName: "text-destructive",
                      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
                    },
                    {
                      icon: <FileText className="size-4 text-primary" />,
                      title: "In Progress",
                      description: "WiFi connectivity issues",
                      date: "1 day ago",
                      iconClassName: "text-primary",
                      titleClassName: "text-primary",
                      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
                    },
                    {
                      icon: <CheckCircle className="size-4 text-emerald-500" />,
                      title: "Resolved",
                      description: "Projector repaired successfully",
                      date: "3 days ago",
                      iconClassName: "text-emerald-500",
                      titleClassName: "text-emerald-500",
                      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10"
                    }
                  ]}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        badge={{ text: "Get Started" }}
        title="Ready to Resolve Your Concerns?"
        description="Join thousands of students who have found solutions through our efficient complaint management system"
        action={{
          text: "Start Your Journey",
          href: "/login",
          variant: "default"
        }}
        withGlow={true}
      />

      {/* Brotal Section */}
      <BrotalSection />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p>© 2025 Brototype. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-border">|</span>
                <Link to="/terms-conditions" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Developed by</span>
              <a 
                href="https://github.com/muhammedshamilmt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline"
              >
                Muhammed Shamil
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
