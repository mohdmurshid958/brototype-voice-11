import { motion } from "framer-motion";

export function BrotalSection() {
  return (
    <motion.section 
      className="relative py-0 overflow-visible h-[200px] sm:h-[280px] md:h-[360px] lg:h-[400px]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 flex items-start justify-center relative z-10 -mb-20">
        <h2 
          className="text-[120px] sm:text-[160px] md:text-[220px] lg:text-[280px] font-bold text-muted-foreground/60 tracking-tight leading-none"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0) 100%)'
          }}
        >
          Brotal
        </h2>
      </div>
    </motion.section>
  );
}
