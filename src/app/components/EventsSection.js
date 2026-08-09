"use client";
import React from 'react';
import { motion } from 'framer-motion';
import serviceImage1 from '../image copy 7.png';
import serviceImage2 from '../image copy 4.png';
import StaggerText from './StaggerText';
import InteractiveEventImage from './InteractiveEventImage';

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
          <path fill="var(--color-primary)" fillOpacity="1" d="M0,192L48,160C96,128,192,64,288,69.3C384,75,480,149,576,160C672,171,768,117,864,122.7C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="events-container split-layout-container">
        
        {/* Services Split Layout (Top Row: Text Left, Signature Interactive Image Right) */}
        <div className="split-section">
          {/* Top Row Text (Left) */}
          <div className="split-text">
            <h2 className="split-title">
              <StaggerText divideBy="letter" delay={0.1}>OUR SERVICES</StaggerText>
            </h2>
            <h3 className="split-subtitle">
              <StaggerText divideBy="word" delay={0.25}>A STEP TO CHANGE YOUR LIFE</StaggerText>
            </h3>
            <p className="split-desc">
              <StaggerText divideBy="word" delay={0.35}>
                We provide world-class personal training, custom nutrition plans, and expert guidance. Click the button below to start achieving your fitness goals today.
              </StaggerText>
            </p>

            <div className="split-features-list">
              {serviceFeatures.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  className="split-feature-item"
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                >
                  <span className="split-feature-icon">✓</span>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.button 
              className="split-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              GET STARTED NOW
            </motion.button>
          </div>

          {/* Top Row Right: Signature Awwwards-grade Interactive Image Reveal */}
          <InteractiveEventImage 
            src={serviceImage1} 
            alt="Our Services" 
            badgeText="⚡ HIGH INTENSITY" 
            badgeClass="events-badge-top-left"
            isLeft={false}
            className="large"
          />
        </div>

        {/* Blogs Split Layout (Bottom Row: Signature Interactive Image Left, Text Right) */}
        <div className="split-section">
          {/* Bottom Row Left: Signature Awwwards-grade Interactive Image Reveal */}
          <InteractiveEventImage 
            src={serviceImage2} 
            alt="Recent Blogs" 
            badgeText="🔥 PRO RESULTS" 
            badgeClass="events-badge-bottom-right"
            isLeft={true}
            className="small"
          />

          {/* Bottom Row Text (Right) */}
          <div className="split-text">
            <h2 className="split-title">
              <StaggerText divideBy="letter" delay={0.1}>RECENT BLOG POSTS</StaggerText>
            </h2>
            <h3 className="split-subtitle">
              <StaggerText divideBy="word" delay={0.25}>LATEST FITNESS INSIGHTS</StaggerText>
            </h3>
            <p className="split-desc">
              <StaggerText divideBy="word" delay={0.35}>
                Read our latest articles on strength training, recovery, and building a sustainable lifestyle. We share everything you need to know to stay on top of your game.
              </StaggerText>
            </p>

            <div className="split-features-list">
              {blogFeatures.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  className="split-feature-item"
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                >
                  <span className="split-feature-icon">✓</span>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.button 
              className="split-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              READ MORE
            </motion.button>
          </div>
        </div>

      </div>

      {/* Bottom Wavy SVG */}
      <div className="events-wave-bottom">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-primary)" fillOpacity="1" d="M0,128L48,160C96,192,256,288,250.7C384,245,480,171,576,160C672,149,768,203,864,197.3C960,192,1056,128,1152,106.7C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
    </section>
  );
}
