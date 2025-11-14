"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  id: number;
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface LumaBarProps {
  items: NavItem[];
}

const LumaBar = ({ items }: LumaBarProps) => {
  const location = useLocation();
  const activeIndex = items.findIndex(item => location.pathname === item.href) || 0;
  const [active, setActive] = useState(activeIndex);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="relative flex items-center justify-center gap-3 bg-background/80 backdrop-blur-2xl rounded-full px-4 py-3 shadow-xl border border-border overflow-hidden">
        
        {/* Active Indicator Glow */}
        <motion.div
          layoutId="active-indicator"
          className="absolute w-12 h-12 bg-primary/30 rounded-full blur-xl -z-10"
          animate={{
            left: `calc(${active * (100 / items.length)}% + ${100 / items.length / 2}%)`,
            translateX: "-50%",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />

        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <motion.div key={item.id} className="relative flex flex-col items-center group">
              {/* Button */}
              <Link to={item.href}>
                <motion.button
                  onClick={() => setActive(index)}
                  whileHover={{ scale: 1.2 }}
                  animate={{ scale: isActive ? 1.3 : 1 }}
                  className={`flex items-center justify-center w-12 h-12 relative z-10 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.icon}
                </motion.button>
              </Link>

              {/* Tooltip */}
              <span className="absolute bottom-full mb-2 px-2 py-1 text-xs rounded-md bg-popover text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LumaBar;
