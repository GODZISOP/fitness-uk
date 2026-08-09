"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import serviceImage1 from '../image copy 7.png';
import serviceImage2 from '../image copy 4.png';

export default function EventsSection() {
  return (
    <section className="events-section">
      {/* Top Wavy SVG */}
      <div className="events-wave-top">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-primary)" fillOpacity="1" d="M0,192L48,160C96,128,192,64,288,69.3C384,75,480,149,576,160C672,171,768,117,864,122.7C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="events-container split-layout-container">
        
        {/* Services Split Layout */}
        <div className="split-section">
          {/* 1. Top Row Left Text */}
          <motion.div 
            className="split-text"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
          >
            <h2 className="split-title">OUR SERVICES</h2>
            <h3 className="split-subtitle">A STEP TO CHANGE YOUR LIFE</h3>
            <p className="split-desc">
              We provide world-class personal training, custom nutrition plans, and expert guidance. 
              Click the button below to start achieving your fitness goals today.
            </p>
            <button className="split-btn">GET STARTED NOW</button>
          </motion.div>

          {/* 2. Top Row Right Image */}
          <motion.div 
            className="split-image-wrapper large"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.3, ease: "easeOut" }}
          >
            <Image 
              src={serviceImage1} 
              alt="Our Services" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="split-image" 
              priority 
            />
          </motion.div>
        </div>

        {/* Blogs Split Layout */}
        <div className="split-section reverse">
          {/* 3. Bottom Row Left Image */}
          <motion.div 
            className="split-image-wrapper small"
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.45, ease: "easeOut" }}
          >
            <Image 
              src={serviceImage2} 
              alt="Recent Blogs" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="split-image split-image-cover" 
            />
          </motion.div>

          {/* 4. Bottom Row Right Text */}
          <motion.div 
            className="split-text"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.6, ease: "easeOut" }}
          >
            <h2 className="split-title">RECENT BLOG POSTS</h2>
            <h3 className="split-subtitle">LATEST FITNESS INSIGHTS</h3>
            <p className="split-desc">
              Read our latest articles on strength training, recovery, and building a sustainable lifestyle.
              We share everything you need to know to stay on top of your game.
            </p>
            <button className="split-btn">READ MORE</button>
          </motion.div>
        </div>

      </div>

      {/* Bottom Wavy SVG */}
      <div className="events-wave-bottom">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-primary)" fillOpacity="1" d="M0,128L48,160C96,192,192,256,288,250.7C384,245,480,171,576,160C672,149,768,203,864,197.3C960,192,1056,128,1152,106.7C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
    </section>
  );
}
