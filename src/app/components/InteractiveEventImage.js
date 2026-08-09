"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function InteractiveEventImage({ 
  src, 
  alt, 
  badgeText, 
  badgeClass,
  className = "large"
}) {
  return (
    <motion.div
      className={`split-image-wrapper ${className} event-signature-container relative`}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '520px',
        willChange: 'transform, opacity',
      }}
    >
      <Image 
        src={src} 
        alt={alt} 
        fill 
        sizes="(max-width: 768px) 100vw, 50vw" 
        className="split-image" 
        priority 
      />

      {badgeText && (
        <motion.div 
          className={`events-badge ${badgeClass}`}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {badgeText}
        </motion.div>
      )}
    </motion.div>
  );
}
