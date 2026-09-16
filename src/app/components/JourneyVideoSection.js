"use client";
import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import "./JourneyVideoSection.css";

// 20-Year Journey (10 steps from 2006 to 2026 for continuity)
const journeyVideos = [
  { src: "/InShot_20231211_172201089.mp4", year: "2006", label: "The Foundation", desc: "Where it all started. The foundation was laid with iron and sweat." },
  { src: "/InShot_20200202_150002946.mp4", year: "2008", label: "Early Hustle", desc: "Heavy lifting and a caloric surplus. Turning potential into raw power." },
  { src: "/VID_23150317_141157_769.mp4", year: "2011", label: "Building Mass", desc: "Consistency pays off. The physique begins to take serious shape." },
  { src: "/20200212_042253.mp4", year: "2013", label: "Raw Strength", desc: "Pushing limits, breaking plateaus, and mastering the form." },
  { src: "/20200214_041437.mp4", year: "2016", label: "Gaining Size", desc: "A period of heavy bulk and uncompromising training." },
  { src: "/VID_28661006_121137_850.mp4", year: "2018", label: "The Shred", desc: "Stripping away the fat to reveal the muscle built over the years." },
  { src: "/VID_30360726_125933_193.mp4", year: "2020", label: "Iron Discipline", desc: "A lifestyle cemented. No days off, no excuses." },
  { src: "/InShot_20200219_103451929.mp4", year: "2022", label: "Relentless Focus", desc: "Refining the physique. Every detail matters." },
  { src: "/w0rldfitnessz0ne_20231214_1.mp4", year: "2024", label: "Beast Mode", desc: "Unlocking a new level of density and vascularity." },
  { src: "/InShot_20200212_051728266.mp4", year: "2026", label: "Peak Evolution", desc: "20 Years of discipline. The ultimate physical mastery." }
];

export default function JourneyVideoSection() {
  const containerRef = useRef(null);

  // Track overall scroll progress for a cool timeline line fill
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section className="timeline-journey-section" ref={containerRef}>
      
      <motion.div 
        className="timeline-journey-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <span className="timeline-journey-tag">The Evolution</span>
        <h2 className="timeline-journey-title">20 Years of Discipline</h2>
        <p className="timeline-journey-desc">
          A journey forged in iron, sweat, and relentless dedication. Scroll down to witness the continuous evolution from 2016 to peak conditioning today.
        </p>
      </motion.div>

      <div className="timeline-container">
        {/* The central line */}
        <div className="timeline-line-track">
          <motion.div 
            className="timeline-line-fill"
            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
          />
        </div>

        {journeyVideos.map((vid, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={index} className={`timeline-row ${isEven ? "row-even" : "row-odd"}`}>
              
              <div className="timeline-dot">
                <div className="timeline-dot-inner" />
              </div>

              <motion.div 
                className="timeline-content"
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="timeline-year">{vid.year}</div>
                <h3 className="timeline-title">{vid.label}</h3>
                <p className="timeline-text">{vid.desc}</p>
              </motion.div>

              <motion.div 
                className="timeline-video-wrapper"
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div 
                  className="timeline-video-frame"
                  initial={{ 
                    borderColor: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255, 201, 40, 0)"
                  }}
                  whileInView={{ 
                    borderColor: "#ffc928",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(255, 201, 40, 0.4)"
                  }}
                  viewport={{ margin: "-30% 0px -30% 0px" }}
                  transition={{ duration: 0.5 }}
                >
                  <video 
                    className="timeline-video"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                  >
                    <source src={vid.src} type="video/mp4" />
                  </video>
                </motion.div>
              </motion.div>
              
            </div>
          );
        })}
      </div>
    </section>
  );
}
