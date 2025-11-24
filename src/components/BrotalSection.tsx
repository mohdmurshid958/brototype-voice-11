import { motion } from "framer-motion";

export function BrotalSection() {
  return (
    <motion.section 
      className="relative py-2 overflow-visible"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 flex items-center justify-center relative z-10 translate-y-[30%]">
        <h2 
          className="text-[120px] sm:text-[160px] md:text-[220px] lg:text-[300px] font-bold text-muted-foreground/60 tracking-tight"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)'
          }}
        >
          Brotal
        </h2>
      </div>
    </motion.section>
  );
}
