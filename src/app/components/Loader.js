"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

let hasShownLoader = false;

export default function Loader() {
  // Initialize state synchronously using the module-level variable. 
  // On client-side navigation, this prevents the split-second flash.
  const [isLoading, setIsLoading] = useState(!hasShownLoader);

  useEffect(() => {
    if (hasShownLoader) {
      return;
    }

    // Lock scrolling on mobile and desktop
    document.body.style.overflow = "hidden";

    // 2.5 seconds optimal loader time. 
    const timer = setTimeout(() => {
      setIsLoading(false);
      hasShownLoader = true;
      document.body.style.overflow = "unset";
    }, 2500); 

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!isLoading) return null;

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
                src="/logo-compressed.webp" 
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
