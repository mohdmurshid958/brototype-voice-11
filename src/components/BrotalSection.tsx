import { motion } from "framer-motion";

export function BrotalSection() {
  return (
    <motion.section 
      className="relative py-20 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 flex items-center justify-center relative z-10">
        <h2 className="text-[80px] sm:text-[120px] md:text-[180px] lg:text-[240px] font-bold text-muted-foreground/60 tracking-tight">
          Brotal
        </h2>
      </div>
    </motion.section>
  );
}
