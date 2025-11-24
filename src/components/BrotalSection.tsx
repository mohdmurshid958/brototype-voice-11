import { motion } from "framer-motion";

export function BrotalSection() {
  return (
    <motion.section 
      className="relative py-12 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Bottom gradient - very subtle */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-primary/5 via-primary/2 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 flex items-center justify-center relative z-10">
        <h2 className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] font-bold text-muted-foreground/60 tracking-tight">
          Brotal
        </h2>
      </div>
    </motion.section>
  );
}
