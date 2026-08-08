"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logoImage from "../logo.png";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lock body scroll while loading
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "unset";
    }, 2500); // 2.5 seconds optimal loader time

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
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
            
            <motion.div
              className="loader-logo-wrapper"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Image 
                src={logoImage} 
                alt="World Fitness Zone" 
                height={80} 
                width={200} 
                style={{ objectFit: "contain", height: "auto", width: "160px" }}
                priority
                unoptimized
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
