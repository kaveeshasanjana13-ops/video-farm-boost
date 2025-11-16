import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  onClick?: () => void;
}

interface AnimeNavbarProps {
  items: NavItem[];
  className?: string;
}

export const AnimeNavbar: React.FC<AnimeNavbarProps> = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const location = useLocation();

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="flex items-center bg-background/90 backdrop-blur-xl rounded-full px-8 py-4 shadow-xl border border-border/30 hover:shadow-2xl transition-all duration-500 hover:border-primary/20">
        {items.map((item, index) => (
          <div
            key={item.name}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-0 bg-gradient-primary rounded-full opacity-10"
                layoutId="hoverBackground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.15, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  bounce: 0.2, 
                  duration: 0.4
                }}
              />
            )}
            
            <Link
              to={item.href}
              onClick={item.onClick}
              className={cn(
                "relative z-10 px-5 py-3 text-sm font-semibold transition-all duration-300 rounded-full group",
                location.pathname === item.href || 
                (item.href.includes('#') && location.hash === item.href.split('#')[1])
                  ? "text-primary shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:shadow-md"
              )}
            >
              <motion.span
                initial={{ opacity: 0.8 }}
                animate={{ 
                  opacity: hoveredIndex === index ? 1 : 0.8,
                  scale: hoveredIndex === index ? 1.1 : 1,
                  fontWeight: hoveredIndex === index ? 600 : 500
                }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  bounce: 0.1
                }}
                className="tracking-wide"
              >
                {item.name}
              </motion.span>
              
              {(location.pathname === item.href || 
                (item.href.includes('#') && location.hash === item.href.split('#')[1])) && (
                <motion.div
                  className="absolute bottom-1 left-1/2 w-2 h-2 bg-gradient-primary rounded-full shadow-glow"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0, scale: 0, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    type: "spring", 
                    bounce: 0.4, 
                    duration: 0.8,
                    delay: 0.1
                  }}
                  style={{ x: '-50%' }}
                />
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};