import { useState } from "react";

export function BrotalSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 flex items-center justify-center">
        <div
          className="relative inline-block overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h2 
            className={`text-[120px] md:text-[200px] lg:text-[280px] font-bold text-foreground transition-all duration-500 ease-in-out whitespace-nowrap ${
              isHovered ? 'tracking-normal' : 'tracking-tighter'
            }`}
            style={{
              transform: isHovered ? 'translateX(0)' : 'translateX(0)',
            }}
          >
            <span className="inline-block transition-all duration-500">
              {isHovered ? 'Brototype' : 'Brotal'}
            </span>
          </h2>
          
          {/* Animated underline */}
          <div 
            className={`absolute bottom-4 left-0 h-2 bg-primary rounded-full transition-all duration-500 ease-in-out ${
              isHovered ? 'w-full' : 'w-0'
            }`}
          />
        </div>
      </div>
    </section>
  );
}
