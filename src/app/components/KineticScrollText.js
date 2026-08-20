"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * KineticScrollText Component
 * Multi-layer oversized typography banner that glides horizontally based on scroll velocity.
 */
export default function KineticScrollText({
  text1 = "WORLD FITNESS ZONE ✦ PUSH THE LIMITS ✦ CORE STRENGTH ✦ UNLEASH YOUR POWER ✦ ",
  text2 = "NO LOCK-IN CONTRACT ✦ 24/7 ACCESS ✦ ELITE COACHING ✦ SCIENCE-BACKED ✦ ",
  direction = 1,
  speed = 1,
  className = ""
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const x1 = useTransform(smoothProgress, [0, 1], ["0%", `-${35 * speed}%`]);
  const x2 = useTransform(smoothProgress, [0, 1], [`-${35 * speed}%`, "0%"]);

  return (
    <div 
      ref={containerRef}
      className={`kinetic-scroll-container ${className}`}
      style={{
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
        pointerEvents: "none",
        padding: "2rem 0",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}
    >
      {/* Row 1: Leftward slide */}
      <motion.div
        style={{
          x: x1,
          display: "flex",
          whiteSpace: "nowrap",
          willChange: "transform"
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="kinetic-text-row kinetic-row-filled">
            {text1}
          </span>
        ))}
      </motion.div>

      {/* Row 2: Rightward slide */}
      <motion.div
        style={{
          x: x2,
          display: "flex",
          whiteSpace: "nowrap",
          willChange: "transform"
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="kinetic-text-row kinetic-row-outline">
            {text2}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
