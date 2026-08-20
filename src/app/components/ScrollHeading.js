"use client";
import React from "react";
import { motion } from "framer-motion";

/**
 * ScrollHeading Component
 * Reliable bottom-to-top text reveal animation on scroll.
 * Repeatable on every scroll (once: false).
 */
export default function ScrollHeading({
  children,
  as: Component = "h2",
  className = "",
  style = {},
  delay = 0,
  duration = 0.85,
  stagger = 0.2,
  yOffset = 35,
  once = false,
  amount = 0.1,
  ...props
}) {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: yOffset, 
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: duration,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // If children is an array (multiple lines or spans)
  if (Array.isArray(children)) {
    return (
      <Component className={className} style={{ ...style }} {...props}>
        <motion.span
          style={{ display: "block" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once, amount }}
        >
          {children.map((child, idx) => (
            <span
              key={idx}
              style={{
                overflow: "hidden",
                display: "block",
                paddingBottom: "0.08em",
                marginBottom: "-0.08em"
              }}
            >
              <motion.span
                style={{
                  display: "block",
                  willChange: "transform, opacity"
                }}
                variants={itemVariants}
              >
                {child}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </Component>
    );
  }

  // Single string or JSX element
  return (
    <Component className={className} style={{ ...style }} {...props}>
      <span
        style={{
          overflow: "hidden",
          display: "block",
          paddingBottom: "0.08em",
          marginBottom: "-0.08em"
        }}
      >
        <motion.span
          style={{
            display: "block",
            willChange: "transform, opacity"
          }}
          initial={{ y: yOffset, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once, amount }}
          transition={{
            duration: duration,
            delay: delay,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {children}
        </motion.span>
      </span>
    </Component>
  );
}
