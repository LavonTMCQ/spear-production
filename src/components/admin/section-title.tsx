"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SectionTitleProps {
  title: string;
  viewAllLink?: string;
}

export function SectionTitle({ title, viewAllLink }: SectionTitleProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="flex items-center justify-between mb-6">
      <motion.div
        className="relative inline-block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h2 className="text-xl font-bold relative z-10">
          <span className={`transition-colors duration-300 ${isHovered ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' : 'text-foreground'}`}>
            {title}
          </span>
        </h2>
        
        {/* Animated underline */}
        <motion.div 
          className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full absolute bottom-0 left-0"
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      
      {viewAllLink && (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs" 
          onClick={() => window.location.href = viewAllLink}
        >
          View All
        </Button>
      )}
    </div>
  );
}
