"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function StaggerText({ 
  children, 
  divideBy = 'word', 
  delay = 0.1, 
  className = '', 
  style = {} 
}) {
  const text = typeof children === 'string' ? children : '';
  if (!text) return children;

  const items = divideBy === 'letter' ? text.split('') : text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: divideBy === 'letter' ? 0.04 : 0.1,
        delayChildren: delay,
      }
    }
  };

  const itemVariant = {
    hidden: {
      opacity: 0,
      y: 25,
      rotateX: 40,
      scale: 0.9,
    },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }
    }
  };

  return (
    <motion.span
      className={`stagger-text-wrap ${className}`}
      style={{ display: 'inline-flex', flexWrap: 'wrap', perspective: '1000px', ...style }}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariant}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {item}{divideBy === 'word' && index < items.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}
