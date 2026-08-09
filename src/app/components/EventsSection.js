"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import serviceImage1 from '../image copy 7.png';
import serviceImage2 from '../image copy 4.png';

export default function EventsSection() {
  const serviceFeatures = [
    "Certified 1-on-1 Personal Training",
    "Custom Macro & Nutrition Meal Plans",
    "Real-time Form Correction & Tracking"
  ];

  const blogFeatures = [
    "Expert Strength & Recovery Strategies",
    "Proven Fat Loss & Muscle Building Guides",
    "24/7 VIP Fitness Community Support"
  ];

  return (
    <section className="events-section">
      {/* Top Wavy SVG */}
      <div className="events-wave-top">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-white)" d="M0,0 L1440,0 L1440,160 C1200,260 960,80 720,180 C480,280 240,60 0,160 Z"></path>
        </svg>
      </div>

      <div className="events-container split-layout-container">
        
        {/* Services Split Layout (Top Row: Text Left, Image Right) */}
        <div className="split-section">
          {/* Top Row Text (Left) - 3D Flip Up */}
          <motion.div 
            className="split-text"
            initial={{ opacity: 0, y: 55, rotateX: 18 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="split-title">OUR SERVICES</h2>
            <h3 className="split-subtitle">A STEP TO CHANGE YOUR LIFE</h3>
            <p className="split-desc">
              We provide world-class personal training, custom nutrition plans, and expert guidance. 
              Click the button below to start achieving your fitness goals today.
            </p>

            <div className="split-features-list">
              {serviceFeatures.map((feature, idx) => (
                <div key={idx} className="split-feature-item">
                  <span className="split-feature-icon">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <motion.button 
              className="split-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              GET STARTED NOW
            </motion.button>
          </motion.div>

          {/* Top Row Image (Right - Battle Ropes Athlete) - 3D Flip Up */}
          <motion.div 
            className="split-image-wrapper large"
            initial={{ opacity: 0, y: 65, rotateX: 22, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{ position: 'relative', width: '100%', minHeight: '520px' }}
          >
            <Image 
              src={serviceImage1} 
              alt="Our Services" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="split-image" 
              priority 
            />
            <div className="events-badge events-badge-top-left">
              ⚡ HIGH INTENSITY
            </div>
          </motion.div>
        </div>

        {/* Blogs Split Layout (Bottom Row: Image Left, Text Right) */}
        <div className="split-section">
          {/* Bottom Row Image (Left - image copy 4.png) - 3D Flip Up */}
          <motion.div 
            className="split-image-wrapper small"
            initial={{ opacity: 0, y: 65, rotateX: 22, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{ position: 'relative', width: '100%', minHeight: '520px' }}
          >
            <Image 
              src={serviceImage2} 
              alt="Recent Blogs" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="split-image split-image-cover" 
              priority
            />
            <div className="events-badge events-badge-bottom-right">
              🔥 PRO RESULTS
            </div>
          </motion.div>

          {/* Bottom Row Text (Right) - 3D Flip Up */}
          <motion.div 
            className="split-text"
            initial={{ opacity: 0, y: 55, rotateX: 18 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="split-title">RECENT BLOG POSTS</h2>
            <h3 className="split-subtitle">LATEST FITNESS INSIGHTS</h3>
            <p className="split-desc">
              Read our latest articles on strength training, recovery, and building a sustainable lifestyle.
              We share everything you need to know to stay on top of your game.
            </p>

            <div className="split-features-list">
              {blogFeatures.map((feature, idx) => (
                <div key={idx} className="split-feature-item">
                  <span className="split-feature-icon">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <motion.button 
              className="split-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              READ MORE
            </motion.button>
          </motion.div>
        </div>

      </div>

      {/* Bottom Wavy White SVG to smoothly transition into AboutSection */}
      <div className="events-wave-bottom">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-white)" d="M0,120 L1440,120 L1440,40 C1200,100 960,10 720,60 C480,110 240,20 0,70 Z"></path>
        </svg>
      </div>
    </section>
  );
}
