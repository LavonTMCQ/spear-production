"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function VRTitleSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-32 md:h-40 w-full"></div>;
  }

  return (
    <div className="relative h-32 md:h-40 w-full overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800/50">
      {/* VR Grid Effect */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30"></div>

      {/* Glowing Orbs */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-purple-500/20 blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '20%', left: '10%' }}
      />

      <motion.div
        className="absolute w-24 h-24 rounded-full bg-indigo-500/20 blur-xl"
        animate={{
          x: [0, -70, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '40%', right: '15%' }}
      />

      <motion.div
        className="absolute w-16 h-16 rounded-full bg-cyan-500/20 blur-xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ bottom: '30%', right: '30%' }}
      />

      {/* Title Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 z-10">
        <motion.div
          className="flex items-center space-x-4 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/spear-logo.PNG"
            alt="SPEAR Logo"
            width={60}
            height={60}
            className="drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            SPEAR
          </h1>
        </motion.div>

        <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent flex-1"></div>
          <motion.p
            className="text-xs md:text-sm text-center text-blue-100/80 font-light tracking-widest uppercase px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Secure Platform for Extended Augmented Reality
          </motion.p>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent flex-1"></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>

      {/* No headset icon */}
    </div>
  );
}
