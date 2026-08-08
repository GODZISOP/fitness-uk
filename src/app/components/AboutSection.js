"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import aboutImage from "../image copy 6.png";

export default function AboutSection() {
  const stats = [
    { label: "FITNESS TRAINEE", value: "251", suffix: "K+" },
    { label: "SUCCESS STORIES", value: "150", suffix: "K+" },
    { label: "YEARS OF EXPERIENCE", value: "12", suffix: "+" },
  ];

  return (
    <section className="about-section">
      <div className="about-container">

        {/* Left Content */}
        <motion.div 
          className="about-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-watermark">ABOUT</div>
          <h2 className="about-title">
            <div>WE ARE PUSHING</div>
            <div>THE LIMIT OF YOUR</div>
            <div><span className="text-action">CORE STRENGTH</span></div>
          </h2>
          <p className="about-description">
            We understand that your lifestyle changes, that's why we've made fitness straightforward and stress-free. Join today on a no lock-in contract membership and start achieving your fitness goals, fun value flexibility all 24/7.
          </p>
          <div>
            <button className="about-btn">
              GET STARTED TODAY <span className="arrow">&rarr;</span>
            </button>
          </div>
        </motion.div>

        {/* Center Image */}
        <div className="about-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={aboutImage}
              alt="Core Strength"
              className="about-image"
              priority
            />
          </motion.div>

          <motion.div 
            className="floating-badge"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
        </div>

        {/* Right Stats */}
        <div className="about-right">
          {stats.map((stat, index) => (
            <motion.div 
              className="about-stat-card" 
              key={index}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="stat-label">
                <span className="slash">///</span> {stat.label}
              </div>
              <div className="stat-value">
                <span className="stat-number">{stat.value}</span>
                <span className="stat-suffix">{stat.suffix}</span>
              </div>
            </motion.div>
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
