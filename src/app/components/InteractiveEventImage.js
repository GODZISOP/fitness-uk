"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

export default function InteractiveEventImage({ 
  src, 
  alt, 
  badgeText, 
  badgeClass,
  isLeft = false,
  className = "large"
}) {
  const shouldReduceMotion = useReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 5deg ambient cursor tilt
    const tiltY = ((x - centerX) / centerX) * 5;
    const tiltX = -((y - centerY) / centerY) * 5;

    setRotateX(tiltX);
    setRotateY(tiltY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Custom Locomotive/Resn premium easing
  const premiumEase = [0.22, 1, 0.36, 1];

  // Motion variants for Image Container (Clip-path + 3D Tilt + Overshoot scale)
  const containerVariants = shouldReduceMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  } : {
    hidden: { 
      opacity: 0,
      clipPath: 'inset(100% 0% 0% 0% round 24px)',
      rotateX: 12,
      rotateY: isLeft ? -10 : 10,
      scale: 0.88,
      y: 40,
    },
    visible: {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0% round 24px)',
      rotateX: 0,
      rotateY: 0,
      scale: [0.88, 1.035, 1],
      y: 0,
      transition: {
        duration: 1.2,
        ease: premiumEase,
        scale: {
          times: [0, 0.75, 1],
          duration: 1.2,
          ease: premiumEase
        }
      }
    }
  };

  // Motion variants for Badge (staggered 0.35s)
  const badgeVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        delay: 0.35,
        ease: premiumEase
      }
    }
  };

  return (
    <motion.div
      className={`split-image-wrapper ${className} event-signature-container relative overflow-visible`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={isHovered ? { rotateX, rotateY, scale: 1.025 } : {}}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '520px',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.6s ease-out'
      }}
    >
      {/* Ambient Glow Pulse Layer */}
      <motion.div 
        className="event-glow-pulse"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: [0, 0.8, 0.2], scale: [0.9, 1.05, 1] }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 1.4, ease: premiumEase }}
      />

      <Image 
        src={src} 
        alt={alt} 
        fill 
        sizes="(max-width: 768px) 100vw, 50vw" 
        className="split-image" 
        priority 
      />

      {/* Choreographed Badge Entrance */}
      {badgeText && (
        <motion.div 
          className={`events-badge ${badgeClass}`}
          variants={badgeVariants}
        >
          {badgeText}
        </motion.div>
      )}
    </motion.div>
  );
}
