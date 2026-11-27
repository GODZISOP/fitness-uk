"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import heroImage from "../hero-20-years.jpg";

export default function HeroSection() {
  // Interactive 3D tilt springs for desktop poster showcase
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 20, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 20, mass: 0.6 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);

  const handleStageMouseMove = (e) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handleStageMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <main className="hero-container">
      <div className="hero-content-wrapper">
        <div className="hero-content-left">
          <div className="hero-pill">13-Week Transformation Program</div>

          <h1 className="hero-title">
            <span className="title-filled" style={{ display: "block" }}>ACHIEVE</span>
            <span className="title-outline" style={{ display: "block" }}>YOUR GOALS</span>
            <span className="title-filled" style={{ display: "block" }}>IN JUST</span>
            <span className="title-outline" style={{ display: "block" }}>13 WEEKS</span>
          </h1>

          <p className="hero-description">
            Week 1 is preparation, followed by 12 weeks of momentum, hard work, and mental &amp; physical discipline. Our goal isn&apos;t to keep you indefinitely—it&apos;s to get you results in maximum 13 weeks, and help you move forward.
          </p>

          <div className="hero-actions">
            <a
              href="https://wa.me/447776899913?text=Hi%20Coach%20James%2C%20I%27d%20like%20to%20get%20started%20with%20World%20Fitness%20Zone!"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
            >
              Let&apos;s Get Started →
            </a>
            <Link
              href="/about"
              className="btn-secondary"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
            >
              How It Works
            </Link>
          </div>
        </div>

        <div className="hero-content-right">
          <div
            className="hero-character-wrapper"
            onMouseMove={handleStageMouseMove}
            onMouseLeave={handleStageMouseLeave}
          >
            <div className="hero-glow" />
            <div className="hero-orbit-ring" />
            <div className="hero-shape" />
            <div className="hero-watermark">WORLD FITNESS</div>

            <motion.div
              className="hero-stage-perspective"
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              initial={{ opacity: 0, scale: 0.95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-stage-float">
                <div className="hero-poster-frame">
                  <div className="hero-poster-border-spin" aria-hidden="true" />
                  <div className="hero-poster-inner">
                    <Image
                      src={heroImage}
                      alt="20 Years of Hard Work - World Fitness Zone"
                      className="hero-character"
                      priority
                    />
                    <div className="hero-poster-sheen" aria-hidden="true" />
                  </div>
                </div>

                {/* Left Animated Glass Pill */}
                <div className="hero-floating-chip chip-top-left">
                  <span className="hero-chip-icon icon-blue">
                    <Flame size={16} />
                  </span>
                  <div className="hero-chip-copy">
                    <span className="hero-chip-title">20 Years Strong</span>
                    <span className="hero-chip-sub">Est. 2007 &bull; London</span>
                  </div>
                </div>

                {/* Right Animated Glass Pill */}
                <div className="hero-floating-chip chip-bottom-right">
                  <span className="hero-chip-icon icon-gold">
                    <Trophy size={16} />
                  </span>
                  <div className="hero-chip-copy">
                    <span className="hero-chip-title">500+ Transformations</span>
                    <span className="hero-chip-sub">Real Results &bull; 13 Weeks</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
