"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import serviceImage1 from '../image copy 9.png';
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
    <section className="events-section" id="events">
      {/* Top Wavy SVG */}
      <div className="events-wave-top">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-primary)" fillOpacity="1" d="M0,192 C144,140 288,240 576,180 C864,120 1152,250 1440,192 L1440,320 L0,320 Z"></path>
        </svg>
      </div>

      <div className="events-container split-layout-container">
        
        {/* Services Split Layout (Top Row: Text Left, Image Right) */}
        <div className="split-section">
          {/* Top Row Text (Left) */}
          <motion.div 
            className="split-text"
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.h2 
              className="split-title"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              OUR SERVICES
            </motion.h2>

            <motion.h3 
              className="split-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              A STEP TO CHANGE YOUR LIFE
            </motion.h3>

            <motion.p 
              className="split-desc"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We provide world-class personal training, custom nutrition plans, and expert guidance. Click the button below to start achieving your fitness goals today.
            </motion.p>

            <div className="split-features-list">
              {serviceFeatures.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  className="split-feature-item"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                >
                  <span className="split-feature-icon">✓</span>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button className="split-btn">
                GET STARTED NOW
              </button>
            </motion.div>
          </motion.div>

          {/* Top Row Right Image */}
          <motion.div 
            className="split-image-wrapper large relative"
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ position: 'relative', width: '100%' }}
          >
            <Image 
              src={serviceImage1} 
              alt="Our Services" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="split-image first-service-image" 
              priority 
            />
          </motion.div>
        </div>

        {/* Blogs Split Layout (Bottom Row: Image Left on Desktop, Text Top on Mobile) */}
        <div className="split-section reverse">
          {/* Bottom Row Text */}
          <motion.div 
            className="split-text"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.h2 
              className="split-title"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            >
              RECENT BLOG POSTS
            </motion.h2>

            <motion.h3 
              className="split-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              LATEST FITNESS INSIGHTS
            </motion.h3>

            <motion.p 
              className="split-desc"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Read our latest articles on strength training, recovery, and building a sustainable lifestyle. We share everything you need to know to stay on top of your game.
            </motion.p>

            <div className="split-features-list">
              {blogFeatures.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  className="split-feature-item"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                >
                  <span className="split-feature-icon">✓</span>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button className="split-btn">
                READ MORE
              </button>
            </motion.div>
          </motion.div>

          {/* Bottom Row Image */}
          <motion.div 
            className="split-image-wrapper small gsap-image-container relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ position: 'relative', width: '100%' }}
          >
            <Image 
              src={serviceImage2} 
              alt="Recent Blogs" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="split-image" 
              priority 
            />
            <div className="events-badge events-badge-bottom-right">
              🔥 PRO RESULTS
            </div>
          </motion.div>
        </div>

      </div>

      {/* Bottom Wavy SVG */}
      <div className="events-wave-bottom">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-primary)" fillOpacity="1" d="M0,0 L1440,0 L1440,128 C1152,60 864,180 576,120 C288,60 144,150 0,128 Z"></path>
        </svg>
      </div>
    </section>
  );
}
