"use client";
import React, { useRef } from "react";
import Image from "next/image";
import aboutImage from "../image copy 6.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function GSAPStatCard({ label, value, suffix, index }) {
  const cardRef = useRef(null);
  const numRef = useRef(null);

  useGSAP(() => {
    if (!cardRef.current || !numRef.current) return;

    const targetVal = parseInt(value, 10);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 88%",
        toggleActions: "play none none reverse",
      }
    });

    // 60FPS 3D Perspective Card Cascading Entrance
    tl.fromTo(cardRef.current,
      { opacity: 0, x: 65, rotateY: -22, scale: 0.9, y: 20 },
      { 
        opacity: 1, 
        x: 0, 
        rotateY: 0, 
        scale: 1, 
        y: 0, 
        duration: 0.85, 
        delay: index * 0.14, 
        ease: "power3.out", 
        force3D: true 
      }
    );

    // Smooth Number Count Up
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: targetVal,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.innerText = Math.floor(counterObj.val);
        }
      }
    }, "-=0.5");

  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="about-stat-card" style={{ willChange: "transform, opacity", transformStyle: "preserve-3d" }}>
      <div className="stat-label">
        <span className="slash">///</span> {label}
      </div>
      <div className="stat-value">
        <span className="stat-number">
          <span ref={numRef}>0</span>
        </span>
        <span className="stat-suffix">{suffix}</span>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const centerWrapRef = useRef(null);
  const badgeRef = useRef(null);

  const stats = [
    { label: "FITNESS TRAINEE", value: "251", suffix: "K+" },
    { label: "SUCCESS STORIES", value: "150", suffix: "K+" },
    { label: "YEARS OF EXPERIENCE", value: "12", suffix: "+" },
  ];

  const titleLines = [
    "WE ARE PUSHING",
    "THE LIMIT OF YOUR",
    "CORE STRENGTH"
  ];

  useGSAP(() => {
    if (!sectionRef.current) return;

    // 1. Watermark Smooth Scale & Opacity Reveal
    gsap.fromTo(".about-watermark",
      { opacity: 0, scale: 0.75, y: -20 },
      {
        opacity: 0.08,
        scale: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 2. Editorial Masked Staggered Title Lines Reveal
    gsap.fromTo(".about-title-line",
      { opacity: 0, y: 45, rotateX: 25 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: leftRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 3. Description & Button Reveal
    gsap.fromTo([".about-description", ".about-btn"],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.15,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: leftRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 4. Center Athlete Image 60FPS Smooth 3D Depth Entrance
    if (centerWrapRef.current) {
      gsap.fromTo(centerWrapRef.current,
        { 
          opacity: 0,
          scale: 0.9, 
          y: 45,
          rotateX: 10
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          duration: 1.1,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: centerWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // 5. 100% EFFORT Badge Spring Entrance
    if (badgeRef.current) {
      gsap.fromTo(badgeRef.current,
        { opacity: 0, scale: 0, rotate: -45 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.8,
          delay: 0.45,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: centerWrapRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // 6. Ambient Gym Icons Smooth Floating Bobbing Animation
    gsap.to(".decorative-gym", {
      y: -12,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.easeInOut"
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="about-section" id="about">
      <div className="about-container">

        {/* Left Content */}
        <div ref={leftRef} className="about-left">
          <div className="about-watermark">
            ABOUT
          </div>

          <div className="about-title" style={{ perspective: "1000px" }}>
            {titleLines.map((line, i) => (
              <div key={i} className="about-title-line" style={{ willChange: "transform, opacity", overflow: "hidden" }}>
                {i === 2 ? <span className="text-action">{line}</span> : line}
              </div>
            ))}
          </div>

          <p className="about-description">
            We understand that your lifestyle changes, that's why we've made fitness straightforward and stress-free. Join today on a no lock-in contract membership and start achieving your fitness goals, fun value flexibility all 24/7.
          </p>

          <div>
            <button className="about-btn" style={{ willChange: "transform, opacity" }}>
              GET STARTED TODAY <span className="arrow">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Center Image with 60FPS GSAP Reveal */}
        <div className="about-center" style={{ perspective: "1200px" }}>
          <div ref={centerWrapRef} className="about-image-wrap" style={{ position: "relative", width: "100%", height: "100%", willChange: "clip-path, transform" }}>
            <Image
              src={aboutImage}
              alt="Core Strength"
              className="about-image"
              priority
            />
          </div>

          {/* Floating Badge with GSAP Spring Spin */}
          <div ref={badgeRef} className="floating-badge">
            <span className="badge-text">100%</span>
            <span className="badge-sub">EFFORT</span>
          </div>

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

        {/* Right Stats with GSAP 3D Entrance */}
        <div className="about-right">
          {stats.map((stat, index) => (
            <GSAPStatCard
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
