"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import serviceImage1 from '../image copy 7.png';
import serviceImage2 from '../image copy 4.png';
import GSAPStaggerText from './GSAPStaggerText';
import GSAPEventImage from './GSAPEventImage';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EventsSection() {
  const sectionRef = useRef(null);

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

  useGSAP(() => {
    if (!sectionRef.current) return;

    const featureItems = sectionRef.current.querySelectorAll('.split-feature-item');
    const buttons = sectionRef.current.querySelectorAll('.split-btn');

    // 60FPS GSAP Feature Items Stagger Entrance
    if (featureItems.length > 0) {
      gsap.fromTo(featureItems,
        { opacity: 0, x: -35 },
        {
          opacity: 1,
          x: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // 60FPS GSAP CTA Button Spring Scale Entrance
    if (buttons.length > 0) {
      gsap.fromTo(buttons,
        { opacity: 0, scale: 0.88, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="events-section">
      {/* Top Wavy SVG */}
      <div className="events-wave-top">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-primary)" fillOpacity="1" d="M0,192 C144,140 288,240 576,180 C864,120 1152,250 1440,192 L1440,320 L0,320 Z"></path>
        </svg>
      </div>

      <div className="events-container split-layout-container">
        
        {/* Services Split Layout (Top Row: Text Left, GSAP 60FPS Image Right) */}
        <div className="split-section">
          {/* Top Row Text (Left) */}
          <div className="split-text">
            <h2 className="split-title">
              <GSAPStaggerText divideBy="letter" delay={0.1}>OUR SERVICES</GSAPStaggerText>
            </h2>
            <h3 className="split-subtitle">
              <GSAPStaggerText divideBy="word" delay={0.22}>A STEP TO CHANGE YOUR LIFE</GSAPStaggerText>
            </h3>
            <p className="split-desc">
              <GSAPStaggerText divideBy="word" delay={0.32}>
                We provide world-class personal training, custom nutrition plans, and expert guidance. Click the button below to start achieving your fitness goals today.
              </GSAPStaggerText>
            </p>

            <div className="split-features-list">
              {serviceFeatures.map((feature, idx) => (
                <div key={idx} className="split-feature-item" style={{ willChange: 'transform, opacity' }}>
                  <span className="split-feature-icon">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button className="split-btn" style={{ willChange: 'transform, opacity' }}>
              GET STARTED NOW
            </button>
          </div>

          {/* Top Row Right: 60FPS GSAP Hardware Accelerated Curtain Reveal */}
          <GSAPEventImage 
            src={serviceImage1} 
            alt="Our Services" 
            badgeText="⚡ HIGH INTENSITY" 
            badgeClass="events-badge-top-left"
            isLeft={false}
            className="large"
          />
        </div>

        {/* Blogs Split Layout (Bottom Row: GSAP 60FPS Image Left, Text Right) */}
        <div className="split-section">
          {/* Bottom Row Left: 60FPS GSAP Hardware Accelerated Curtain Reveal */}
          <GSAPEventImage 
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
              <GSAPStaggerText divideBy="letter" delay={0.1}>RECENT BLOG POSTS</GSAPStaggerText>
            </h2>
            <h3 className="split-subtitle">
              <GSAPStaggerText divideBy="word" delay={0.22}>LATEST FITNESS INSIGHTS</GSAPStaggerText>
            </h3>
            <p className="split-desc">
              <GSAPStaggerText divideBy="word" delay={0.32}>
                Read our latest articles on strength training, recovery, and building a sustainable lifestyle. We share everything you need to know to stay on top of your game.
              </GSAPStaggerText>
            </p>

            <div className="split-features-list">
              {blogFeatures.map((feature, idx) => (
                <div key={idx} className="split-feature-item" style={{ willChange: 'transform, opacity' }}>
                  <span className="split-feature-icon">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button className="split-btn" style={{ willChange: 'transform, opacity' }}>
              READ MORE
            </button>
          </div>
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
