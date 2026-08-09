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
          {/* Top Row Image with 3D Tilt & Floating Badge */}
          <motion.div 
            className="split-image-wrapper large"
            initial={{ opacity: 0, scale: 0.85, y: 50, rotateX: 10, rotateY: -12 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image 
              src={serviceImage1} 
              alt="Our Services" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="split-image" 
              priority 
            />
            <motion.div 
              className="events-badge events-badge-top-left"
              initial={{ opacity: 0, scale: 0.5, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.4 },
                scale: { duration: 0.5, delay: 0.4 },
                y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              ⚡ HIGH INTENSITY
            </motion.div>
          </motion.div>

          {/* Top Row Staggered Text Mask Reveal */}
          <motion.div 
            className="split-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <motion.h2 
              className="split-title"
              initial={{ opacity: 0, letterSpacing: "4px" }}
              whileInView={{ opacity: 1, letterSpacing: "1px" }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
            >
              OUR SERVICES
            </motion.h2>

            <motion.h3 
              className="split-subtitle"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              A STEP TO CHANGE YOUR LIFE
            </motion.h3>

            <motion.p 
              className="split-desc"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              We provide world-class personal training, custom nutrition plans, and expert guidance. 
              Click the button below to start achieving your fitness goals today.
            </motion.p>

            <motion.button 
              className="split-btn"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(255, 201, 40, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              GET STARTED NOW
            </motion.button>
          </motion.div>
        </div>

        {/* Blogs Split Layout */}
        <div className="split-section reverse">
          {/* Bottom Row Image with 3D Tilt & Floating Badge */}
          <motion.div 
            className="split-image-wrapper small"
            initial={{ opacity: 0, scale: 0.85, y: 50, rotateX: -10, rotateY: 12 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image 
              src={serviceImage2} 
              alt="Recent Blogs" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="split-image split-image-cover" 
            />
            <motion.div 
              className="events-badge events-badge-bottom-right"
              initial={{ opacity: 0, scale: 0.5, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false }}
              animate={{ y: [0, 6, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.5 },
                scale: { duration: 0.5, delay: 0.5 },
                y: { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
            >
              🔥 PRO RESULTS
            </motion.div>
          </motion.div>

          {/* Bottom Row Staggered Text Mask Reveal */}
          <motion.div 
            className="split-text"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" }}
          >
            <motion.h2 
              className="split-title"
              initial={{ opacity: 0, letterSpacing: "4px" }}
              whileInView={{ opacity: 1, letterSpacing: "1px" }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              RECENT BLOG POSTS
            </motion.h2>

            <motion.h3 
              className="split-subtitle"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              LATEST FITNESS INSIGHTS
            </motion.h3>

            <motion.p 
              className="split-desc"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Read our latest articles on strength training, recovery, and building a sustainable lifestyle.
              We share everything you need to know to stay on top of your game.
            </motion.p>

            <motion.button 
              className="split-btn"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.55 }}
              whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(255, 201, 40, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              READ MORE
            </motion.button>
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
