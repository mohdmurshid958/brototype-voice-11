import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, TrendingUp, Bell, Users, LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  image: string;
}

const features: Feature[] = [
  {
    icon: Shield,
    title: "Secure Login",
    desc: "Protected student and admin access with encrypted authentication. Your data is safeguarded with industry-standard security protocols, ensuring complete privacy and confidentiality.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070"
  },
  {
    icon: TrendingUp,
    title: "Real-time Tracking",
    desc: "Monitor complaint status instantly with live updates. Stay informed at every step of the resolution process with instant notifications and real-time status changes.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070"
  },
  {
    icon: Bell,
    title: "Fast Response",
    desc: "Quick admin acknowledgment within 24 hours. Our dedicated team ensures your concerns are addressed promptly, keeping you informed throughout the entire process.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074"
  },
  {
    icon: Users,
    title: "Transparency",
    desc: "Full visibility into the complaint resolution process. Track every update, response, and action taken, ensuring complete accountability and trust in the system.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
  },
];

export function StickyFeatures() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionRect = section.getBoundingClientRect();
      const isInSection = sectionRect.top <= 150 && sectionRect.bottom >= window.innerHeight / 2;

      if (isInSection) {
        const now = Date.now();
        if (now - lastScrollTime.current < 800) return; // Throttle scroll

        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }

        scrollTimeout.current = setTimeout(() => {
          if (e.deltaY > 0 && currentFeatureIndex < features.length - 1) {
            // Scrolling down - still have features to show
            e.preventDefault();
            setCurrentFeatureIndex(prev => prev + 1);
            lastScrollTime.current = now;
          } else if (e.deltaY < 0 && currentFeatureIndex > 0) {
            // Scrolling up - still have features to show
            e.preventDefault();
            setCurrentFeatureIndex(prev => prev - 1);
            lastScrollTime.current = now;
          }
          // If at first feature scrolling up, or last feature scrolling down, allow normal scroll
        }, 50);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [currentFeatureIndex]);

  const currentFeature = features[currentFeatureIndex];

  return (
    <section ref={sectionRef} id="features" className="min-h-screen flex items-center justify-center py-24 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto">
            Everything you need for effective complaint management
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto items-center">
          {/* LEFT: Feature Content */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeatureIndex}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/20">
                  <currentFeature.icon className="h-10 w-10 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {currentFeature.title}
                  </h3>
                  <p className="text-muted-foreground text-xl leading-relaxed">
                    {currentFeature.desc}
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-3 pt-4">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeatureIndex(index)}
                      className="group relative"
                    >
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === currentFeatureIndex
                            ? 'w-12 bg-primary'
                            : 'w-2 bg-muted-foreground/30 group-hover:bg-primary/50'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Sticky Image */}
          <div className="hidden lg:block relative">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeatureIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 z-10" />
                  <img
                    src={currentFeature.image}
                    alt={currentFeature.title}
                    className="w-full h-[500px] object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Feature counter */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-background border-4 border-primary shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {currentFeatureIndex + 1}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of {features.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Image */}
        <div className="lg:hidden mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeatureIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 z-10" />
              <img
                src={currentFeature.image}
                alt={currentFeature.title}
                className="w-full h-[300px] object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
