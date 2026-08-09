"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import faqImage from '../zjBzVg-Photoroom.png';

export default function ProcessSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqItems = [
    {
      id: "01",
      title: "Personal Training",
      desc: "Our personal trainers can help you create a personalized fitness plan, correct your form in real-time, and track your progress to guarantee your goals."
    },
    {
      id: "02",
      title: "Expert Trainer",
      desc: "Our gym is proud to offer a team of highly skilled and certified trainers dedicated to helping you achieve your ultimate health & fitness goals."
    },
    {
      id: "03",
      title: "Flexible Time & 24/7 Access",
      desc: "There are many fitness classes that are offered during off-peak and peak hours, such as early morning, afternoon, or late evening to fit your busy life."
    },
    {
      id: "04",
      title: "Customized Nutrition & Progress Tracking",
      desc: "Receive personalized meal guidelines, macro calculations, and continuous body composition tracking to accelerate your transformation."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq-process-section" id="process">
      {/* Top Wavy White Edge */}
      <div className="faq-wave-top">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-white)" d="M0,0 L1440,0 L1440,40 C1200,100 960,10 720,60 C480,110 240,20 0,70 Z"></path>
        </svg>
      </div>

      <div className="faq-process-container">

        {/* Left Side FAQ / Why Choose Content */}
        <div 
          className="faq-left-content"
          data-aos="fade-right"
          data-aos-duration="800"
        >
          <span className="faq-eyebrow">WHY CHOOSE US</span>
          <h2 className="faq-main-title">
            Why Should People Choose <span className="highlight-brand">World Fitness Zone</span> Services
          </h2>

          <div className="faq-accordion-list">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`faq-item ${isOpen ? 'active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="faq-item-header">
                    <div className="faq-item-title-wrap">
                      <span className="faq-check-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <h3 className="faq-item-title">{item.title}</h3>
                    </div>
                    <span className="faq-toggle-icon">
                      {isOpen ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      )}
                    </span>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className="faq-item-body"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="faq-item-desc">{item.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="faq-cta-wrap">
            <button className="faq-join-btn">
              JOIN TODAY &rarr;
            </button>
          </div>
        </div>

        {/* Right Side Image & Floating Stat Cards */}
        <div 
          className="faq-right-image-area"
          data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="900"
        >
          {/* Yellow Circle Backdrop */}
          <div className="faq-bg-circle"></div>

          {/* Image Wrapper */}
          <div className="faq-image-wrapper">
            <Image
              src={faqImage}
              alt="World Fitness Zone Athlete"
              className="faq-model-img"
              priority
            />
          </div>

          {/* Floating Stat Card 1: Heart Rate */}
          <motion.div
            className="faq-stat-card card-top-right"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="stat-icon heart-bg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">70 bpm</div>
              <div className="stat-label">Heart Rate</div>
            </div>
          </motion.div>

          {/* Floating Stat Card 2: Fat Burning */}
          <motion.div
            className="faq-stat-card card-bottom-left"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="stat-icon flame-bg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 1.5c-1.2 2.4-2.8 4.2-3.9 6.3-1.1 2.1-1.6 4.3-1.6 6.5 0 4.4 3.6 8 8 8s8-3.6 8-8c0-2.2-.5-4.4-1.6-6.5-1.1-2.1-2.7-3.9-3.9-6.3L13.5 1.5zm1 14c-1.4 0-2.5-1.1-2.5-2.5 0-.8.4-1.5 1-2 .6.5 1.5 1.2 1.5 2 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-.8-.4-1.5-1-2 .6.5 1.5 1.2 1.5 2 0 1.4-1.1 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">24%</div>
              <div className="stat-label">Fat Burning</div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Bottom Wavy White Edge */}
      <div className="faq-wave-bottom">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path fill="var(--color-white)" d="M0,120 L1440,120 L1440,80 C1200,20 960,110 720,60 C480,10 240,100 0,50 Z"></path>
        </svg>
      </div>
    </section>
  );
}



