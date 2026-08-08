"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function ProcessSection() {
  const processSteps = [
    {
      id: 1,
      title: "Discovery & Goals",
      desc: "We analyze your starting point, lifestyle, and define the exact results you want to achieve.",
      x: "15%",
      y: "85%",
    },
    {
      id: 2,
      title: "Custom Blueprint",
      desc: "A tailored training and nutrition system built specifically around your body and schedule.",
      x: "50%",
      y: "50%",
    },
    {
      id: 3,
      title: "Execution & Results",
      desc: "We implement the plan with daily accountability, tracking data to ensure guaranteed progress.",
      x: "85%",
      y: "15%",
    }
  ];

  return (
    <section className="process-section">
      <div className="process-container">
        
        {/* Left Side Text Content */}
        <motion.div 
          className="process-content"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className="process-label">WORLD FITNESS ZONE METHODOLOGY</span>
          <h2 className="process-title">We have the best team and the best process</h2>
          <p className="process-desc">
            Vision is nothing without execution. We don't just hand you a program and hope for the best. 
            We build a comprehensive ecosystem around your lifestyle to ensure your fitness transformation is 
            straightforward, stress-free, and inevitable.
          </p>
          <button className="process-btn">Get Started</button>
        </motion.div>

        {/* Right Side Timeline Area */}
        <div className="process-timeline-area">
          
          {/* Background huge faded circle */}
          <div className="process-bg-circle"></div>

          {/* Vertical connecting line for Mobile */}
          <div className="mobile-timeline-line"></div>

          {/* The SVG Curved Path for Desktop */}
          <div className="process-svg-container">
            <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="process-svg">
              <motion.path 
                d="M 0 350 C 100 450, 350 200, 500 200 S 800 50, 1000 50" 
                fill="none" 
                stroke="var(--color-primary)" 
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          {/* Nodes */}
          {processSteps.map((step, index) => (
            <motion.div 
              className="process-node" 
              key={step.id}
              style={{ left: step.x, top: step.y }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="node-number-bg">{step.id}</div>
              <div className="node-dot">
                <motion.div 
                  className="node-dot-inner"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 0 0px rgba(21, 94, 239, 0.4)",
                      "0 0 0 10px rgba(21, 94, 239, 0)",
                      "0 0 0 0px rgba(21, 94, 239, 0)"
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: index * 0.4,
                    ease: "easeInOut" 
                  }}
                />
              </div>
              <div className="node-content">
                <h4 className="node-title">{step.title}</h4>
                <p className="node-desc">{step.desc}</p>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
