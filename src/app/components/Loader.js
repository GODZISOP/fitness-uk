"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2.5 seconds optimal loader time. 
    // In the background, Next.js preloads all priority images, 
    // and DumbbellAnimation fetches 168 frames in parallel.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="global-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="loader-content">
            <div className="loader-circle-spinner"></div>
            
            <div className="loader-logo-wrapper">
              <img 
                src="/logo.png" 
                alt="World Fitness Zone" 
                style={{ objectFit: "contain", height: "auto", width: "160px" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
