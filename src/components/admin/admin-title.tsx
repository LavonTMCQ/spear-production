"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export function AdminTitle() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-2">
        <Image
          src="/images/spear-logo.PNG"
          alt="SPEAR Logo"
          width={40}
          height={40}
          className="drop-shadow-sm"
        />
        <motion.div
          className="relative inline-block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h1 className="text-3xl font-bold relative z-10">
            <span className={`transition-colors duration-300 ${isHovered ? 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent' : 'text-foreground'}`}>
              Admin Dashboard
            </span>
          </h1>

          {/* Animated underline */}
          <motion.div
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full absolute bottom-0 left-0"
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />

          {/* Glow effect */}
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg blur-lg z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      <p className="text-slate-500 dark:text-slate-400 mt-2">
        Manage your clients, devices, and system settings
      </p>
    </div>
  );
}
