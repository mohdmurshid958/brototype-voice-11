import { motion } from "framer-motion";

export function BrotalSection() {
  return (
    <motion.section 
      className="relative py-0 overflow-visible h-[280px] sm:h-[360px] md:h-[460px] lg:h-[520px]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 flex items-start justify-center relative z-10 mt-16 sm:mt-20 md:mt-24 lg:mt-28">
        <h2 
          className="text-[140px] sm:text-[200px] md:text-[280px] lg:text-[360px] font-bold text-muted-foreground/60 tracking-tight leading-none"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 85%)'
          }}
        >
          Brotal
        </h2>
      </div>
    </motion.section>
  );
}
