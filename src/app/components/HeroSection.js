"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import heroImage from "../hero-20-years.jpg";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const spacerRef = useRef(null);
  const panelRef  = useRef(null);

  // Interactive 3D tilt springs for desktop poster showcase
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 20, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 20, mass: 0.6 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const handleStageMouseMove = (e) => {
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

  // Each content element ref
  const pillRef    = useRef(null);
  const titleRef   = useRef(null);
  const descRef    = useRef(null);
  const actionsRef = useRef(null);
  const imageRef   = useRef(null);
  const stat1Ref   = useRef(null);
  const stat2Ref   = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const spacer = spacerRef.current;
    const panel  = panelRef.current;
    if (!spacer || !panel) return;

    const elements = [
      { ref: pillRef,    start: 0.00, end: 0.08 },
      { ref: titleRef,   start: 0.05, end: 0.25 },
      { ref: descRef,    start: 0.25, end: 0.40 },
      { ref: actionsRef, start: 0.40, end: 0.55 },
      { ref: imageRef,   start: 0.50, end: 0.75 },
      { ref: stat1Ref,   start: 0.70, end: 0.85 },
      { ref: stat2Ref,   start: 0.80, end: 0.95 },
    ];

    const SCROLL_HEIGHT = window.innerHeight * 4;
    spacer.style.height = SCROLL_HEIGHT + "px";

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function onScroll() {
      const sRect = spacer.getBoundingClientRect();
      const vh    = window.innerHeight;
      const SPACER_H    = spacer.offsetHeight;
      const totalScroll = SPACER_H - vh;
      const scrolledIn  = -sRect.top;

      const isAbove  = sRect.top > 0;
      const isBelow  = sRect.bottom < vh;

      if (isAbove) {
        panel.style.visibility = "visible";
        panel.style.opacity    = "1";
        panel.style.position   = "absolute";
        panel.style.top        = "0";
        elements.forEach(({ ref, start }) => {
          if (!ref.current) return;
          if (start <= 0.60) {
            ref.current.style.opacity   = "1";
            ref.current.style.transform = "translateY(0px)";
          } else {
            ref.current.style.opacity   = "0";
            ref.current.style.transform = "translateY(25px)";
          }
        });
        return;
      }

      if (isBelow) {
        panel.style.visibility = "visible";
        panel.style.opacity    = "1";
        panel.style.position   = "absolute";
        panel.style.top        = SPACER_H - vh + "px";
        panel.style.left       = "0";
        elements.forEach(({ ref }) => {
          if (!ref.current) return;
          ref.current.style.opacity   = "1";
          ref.current.style.transform = "translateY(0px)";
        });
        return;
      }

      panel.style.visibility = "visible";
      panel.style.position   = "fixed";
      panel.style.top        = "0";
      panel.style.left       = "0";

      const progress = Math.max(0, Math.min(1, scrolledIn / totalScroll));
      panel.style.opacity = "1";

      elements.forEach(({ ref, start, end }) => {
        if (!ref.current) return;
        const p = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        const eased = easeInOut(p);
        ref.current.style.opacity   = String(eased);
        ref.current.style.transform = `translateY(${(1 - eased) * 25}px)`;
      });
    }

    const onResize = () => {
      spacer.style.height = (window.innerHeight * 4) + "px";
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile]);

  // ── MOBILE LAYOUT (Direct static render, zero JS scroll lock, 100% instant display) ──
  if (isMobile) {
    return (
      <main className="hero-container" style={{ paddingTop: "80px", minHeight: "100vh", position: "relative" }}>
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
              <a href="https://wa.me/447776899913?text=Hi%20Coach%20James%2C%20I%27d%20like%20to%20get%20started%20with%20World%20Fitness%20Zone!" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Let&apos;s Get Started →</a>
              <Link href="/about" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>How It Works</Link>
            </div>
          </div>

          <div className="hero-content-right">
            <div className="hero-character-wrapper">
              <div className="hero-glow" />
              <div className="hero-orbit-ring" />
              <div className="hero-shape" />
              <div className="hero-watermark">WORLD FITNESS</div>

              <motion.div
                className="hero-stage-float"
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
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

                {/* Top-Left Animated Badge */}
                <div className="hero-floating-chip chip-top-left">
                  <span className="hero-chip-icon icon-blue">
                    <Flame size={15} />
                  </span>
                  <div className="hero-chip-copy">
                    <span className="hero-chip-title">20 Years Strong</span>
                    <span className="hero-chip-sub">Est. 2007 &bull; London</span>
                  </div>
                </div>

                {/* Bottom-Right Animated Badge */}
                <div className="hero-floating-chip chip-bottom-right">
                  <span className="hero-chip-icon icon-gold">
                    <Trophy size={15} />
                  </span>
                  <div className="hero-chip-copy">
                    <span className="hero-chip-title">500+ Results</span>
                    <span className="hero-chip-sub">Proven Discipline</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── DESKTOP LAYOUT (Cinematic Scroll Lock) ──
  return (
    <div style={{ position: "relative", width: "100%", margin: 0, padding: 0 }}>
      {/* Scroll spacer */}
      <div ref={spacerRef} style={{ width: "100%", pointerEvents: "none" }} />

      {/* Fixed hero panel */}
      <div
        ref={panelRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100vh",
          visibility: "visible",
          opacity: 1,
          zIndex: 40,
          overflow: "hidden",
        }}
      >
        <main className="hero-container" style={{ paddingTop: "80px" }}>
          <div className="hero-content-wrapper">
            <div className="hero-content-left">
              <div ref={pillRef} className="hero-pill">
                13-Week Transformation Program
              </div>

              <h1 ref={titleRef} className="hero-title">
                <span className="title-filled" style={{ display: "block" }}>ACHIEVE</span>
                <span className="title-outline" style={{ display: "block" }}>YOUR GOALS</span>
                <span className="title-filled" style={{ display: "block" }}>IN JUST</span>
                <span className="title-outline" style={{ display: "block" }}>13 WEEKS</span>
              </h1>

              <p ref={descRef} className="hero-description">
                Week 1 is preparation, followed by 12 weeks of momentum, hard work, and mental &amp; physical discipline. Our goal isn&apos;t to keep you indefinitely—it&apos;s to get you results in maximum 13 weeks, and help you move forward.
              </p>

              <div ref={actionsRef} className="hero-actions">
                <a href="https://wa.me/447776899913?text=Hi%20Coach%20James%2C%20I%27d%20like%20to%20get%20started%20with%20World%20Fitness%20Zone!" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Let&apos;s Get Started →</a>
                <Link href="/about" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>How It Works</Link>
              </div>
            </div>

            <div className="hero-content-right">
              <div
                ref={imageRef}
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
                  initial={{ opacity: 0, scale: 0.92, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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

                    {/* Top-Left Animated Glass Pill */}
                    <div className="hero-floating-chip chip-top-left">
                      <span className="hero-chip-icon icon-blue">
                        <Flame size={16} />
                      </span>
                      <div className="hero-chip-copy">
                        <span className="hero-chip-title">20 Years Strong</span>
                        <span className="hero-chip-sub">Est. 2007 &bull; London</span>
                      </div>
                    </div>

                    {/* Bottom-Right Animated Glass Pill */}
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
      </div>
    </div>
  );
}
