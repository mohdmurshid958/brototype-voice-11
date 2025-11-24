import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Bell, Users } from "lucide-react";

interface Feature {
  icon: any;
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
  const [activeImage, setActiveImage] = useState(features[0].image);
  const [fadeImage, setFadeImage] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentBox = contentRef.current;
    if (!contentBox) return;

    const handleScroll = () => {
      const featureElements = contentBox.querySelectorAll('[data-feature-index]');
      
      featureElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const contentRect = contentBox.getBoundingClientRect();
        
        if (rect.top >= contentRect.top && rect.top < contentRect.top + contentRect.height / 2) {
          const index = parseInt(element.getAttribute('data-feature-index') || '0');
          const newImage = features[index].image;
          
          if (newImage !== activeImage) {
            setFadeImage(false);
            setTimeout(() => {
              setActiveImage(newImage);
              setFadeImage(true);
            }, 200);
          }
        }
      });
    };

    contentBox.addEventListener('scroll', handleScroll);
    return () => contentBox.removeEventListener('scroll', handleScroll);
  }, [activeImage]);

  return (
    <section id="features" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto mb-12">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Everything you need for effective complaint management
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {/* LEFT: Scrollable Content */}
          <div 
            ref={contentRef}
            className="h-[80vh] overflow-y-scroll snap-y snap-mandatory scroll-smooth pr-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                data-feature-index={index}
                className="h-[80vh] snap-start flex flex-col justify-center p-8 bg-surface-elevated rounded-2xl mb-0 border border-border/50"
              >
                <div className="w-16 h-16 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT: Sticky Image */}
          <div className="hidden lg:block">
            <div className="sticky top-20 h-[80vh] bg-muted rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={activeImage}
                alt="Feature visualization"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  fadeImage ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
