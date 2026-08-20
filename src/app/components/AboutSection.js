"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import aboutImage from "../image copy 6.png";

import ScrollHeading from "./ScrollHeading";

function StatCard({ label, value, suffix, index }) {
  return (
    <motion.div
      className="about-stat-card"
      initial={{ opacity: 0, x: 35, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="stat-label">
        <span className="slash">///</span> {label}
      </div>
      <div className="stat-value">
        <motion.span
          className="stat-number"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        >
          {value}
        </motion.span>
        <span className="stat-suffix">{suffix}</span>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const stats = [
    { label: "FITNESS TRAINEE", value: "251", suffix: "K+" },
    { label: "SUCCESS STORIES", value: "150", suffix: "K+" },
    { label: "YEARS OF EXPERIENCE", value: "12", suffix: "+" },
  ];

  return (
    <section className="about-section" id="about">
      <div className="about-container">

        {/* Left Content */}
        <motion.div
          className="about-left"
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="about-watermark"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            ABOUT
          </motion.div>

          <ScrollHeading
            as="h2"
            className="about-title"
            once={false}
            duration={0.95}
            stagger={0.22}
          >
            {[
              "WE ARE PUSHING",
              "THE LIMIT OF YOUR",
              <span key="core-strength" className="text-action">
                CORE STRENGTH
              </span>
            ]}
          </ScrollHeading>

          <motion.p
            className="about-description"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.25, ease: "easeOut" }}
          >
            We understand that your lifestyle changes, that's why we've made fitness straightforward and stress-free. Join today on a no lock-in contract membership and start achieving your fitness goals, fun value flexibility all 24/7.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <button className="about-btn">
              GET STARTED TODAY <span className="arrow">&rarr;</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Center Athlete Image */}
        <motion.div
          className="about-center"
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="about-image-wrap" style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={aboutImage}
              alt="Core Strength"
              className="about-image"
              priority
            />
          </div>

          {/* Floating Badge */}
          <motion.div
            className="floating-badge"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <span className="badge-text">100%</span>
            <span className="badge-sub">EFFORT</span>
          </motion.div>

          <div className="decorative-gym gym-icon-1">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(7, 26, 43, 0.15)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <rect x="2" y="9" width="4" height="6" fill="rgba(7, 26, 43, 0.1)"></rect>
              <rect x="18" y="9" width="4" height="6" fill="rgba(7, 26, 43, 0.1)"></rect>
              <rect x="6" y="7" width="2" height="10" fill="rgba(7, 26, 43, 0.15)"></rect>
              <rect x="16" y="7" width="2" height="10" fill="rgba(7, 26, 43, 0.15)"></rect>
            </svg>
          </div>

          <div className="decorative-gym gym-icon-2">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="14" r="7" fill="rgba(21, 94, 239, 0.1)"></circle>
              <path d="M9 11V6a3 3 0 0 1 6 0v5"></path>
            </svg>
          </div>

          <div className="decorative-ring" />
        </motion.div>

        {/* Right Stats */}
        <div className="about-right">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              index={index}
            />
          ))}
        </div>

      </div>

      {/* Marquee Ticker */}
      <div className="about-ticker">
        <div className="ticker-track">
          {Array(4).fill(0).map((_, i) => (
            <div className="ticker-content" key={i}>
              <span>CARDIO</span>
              <span className="star">✦</span>
              <span>BENCH PRESS</span>
              <span className="star">✦</span>
              <span>DEAD LIFT</span>
              <span className="star">✦</span>
              <span>PILATES</span>
              <span className="star">✦</span>
              <span>DUMBBELL</span>
              <span className="star">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
