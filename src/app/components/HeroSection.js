"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "../image.png";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const spacerRef = useRef(null);
  const panelRef  = useRef(null);

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
            <div className="hero-pill">Sweat Today, Shine Tomorrow</div>
            <h1 className="hero-title">
              <span className="title-filled" style={{ display: "block" }}>STRONGER</span>
              <span className="title-outline" style={{ display: "block" }}>EVERYDAY</span>
              <span className="title-filled" style={{ display: "block" }}>FITTER</span>
              <span className="title-outline" style={{ display: "block" }}>FOREVER</span>
            </h1>
            <p className="hero-description">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Let&apos;s Get Started →</a>
              <Link href="/about" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>How It Works</Link>
            </div>
          </div>

          <div className="hero-content-right">
            <div className="hero-character-wrapper">
              <div className="hero-glow" />
              <div className="hero-shape" />
              <div className="hero-watermark">WORLD FITNESS</div>
              <Image src={heroImage} alt="Fitness Trainer" className="hero-character" priority />
              <div className="stat-block card-top-right">
                <div className="stat-number">100%</div>
                <div className="stat-text">Top Rated Trainers every program is built around your goals.</div>
              </div>
              <div className="stat-block card-bottom-left">
                <div className="stat-number">500+</div>
                <div className="stat-text">Active Users real people, real results from beginners to athletes.</div>
              </div>
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
                Sweat Today, Shine Tomorrow
              </div>

              <h1 ref={titleRef} className="hero-title">
                <span className="title-filled" style={{ display: "block" }}>STRONGER</span>
                <span className="title-outline" style={{ display: "block" }}>EVERYDAY</span>
                <span className="title-filled" style={{ display: "block" }}>FITTER</span>
                <span className="title-outline" style={{ display: "block" }}>FOREVER</span>
              </h1>

              <p ref={descRef} className="hero-description">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
              </p>

              <div ref={actionsRef} className="hero-actions">
                <a href="#contact" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Let&apos;s Get Started →</a>
                <Link href="/about" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>How It Works</Link>
              </div>
            </div>

            <div className="hero-content-right">
              <div ref={imageRef} className="hero-character-wrapper">
                <div className="hero-glow" />
                <div className="hero-shape" />
                <div className="hero-watermark">WORLD FITNESS</div>
                <Image src={heroImage} alt="Fitness Trainer" className="hero-character" priority />

                <div ref={stat1Ref} className="stat-block card-top-right">
                  <div className="stat-number">100%</div>
                  <div className="stat-text">Top Rated Trainers every program is built around your goals.</div>
                </div>

                <div ref={stat2Ref} className="stat-block card-bottom-left">
                  <div className="stat-number">500+</div>
                  <div className="stat-text">Active Users real people, real results from beginners to athletes.</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
