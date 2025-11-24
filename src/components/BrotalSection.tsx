import { useState } from "react";
import SplitText from "./SplitText";

export function BrotalSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Gradient background behind text - using hero gradient style */}
      <div className="absolute inset-0 hero-gradient opacity-30" />
      
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 flex items-center justify-center relative z-10">
        <div
          className="relative inline-block overflow-visible"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? (
            <SplitText
              text="Brototype"
              tag="h2"
              className="text-[80px] sm:text-[120px] md:text-[180px] lg:text-[240px] font-bold text-muted-foreground/60 tracking-tight"
              delay={50}
              duration={0.8}
              ease="power2.inOut"
              splitType="chars"
              from={{ opacity: 0, y: 30, scale: 0.8 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.1}
              rootMargin="0px"
              textAlign="center"
            />
          ) : (
            <h2 className="text-[80px] sm:text-[120px] md:text-[180px] lg:text-[240px] font-bold text-muted-foreground/60 tracking-tight transition-all duration-500">
              Brotal
            </h2>
          )}
        </div>
      </div>
    </section>
  );
}
