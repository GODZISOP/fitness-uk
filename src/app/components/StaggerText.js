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
  const items = divideBy === 'letter' ? text.split('') : text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: divideBy === 'letter' ? 0.03 : 0.08,
        delayChildren: delay,
      }
    }
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 45,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 120,
      }
    }
  };

  return (
    <motion.div
      className={`stagger-text-container ${className}`}
      style={{ display: 'inline-flex', flexWrap: 'wrap', ...style }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {item}{divideBy === 'word' && index < items.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.div>
  );
}
