"use client";

import React, { useEffect, useRef } from "react";

const STEPS = [
  {
    tag: "Step 01",
    heading: "Built for\nPerformance",
    sub: "Every component engineered to maximise your output.",
  },
  {
    tag: "Step 02",
    heading: "Precision\nEngineered",
    sub: "Technique and form — refined through expert guidance.",
  },
  {
    tag: "Step 03",
    heading: "Achieve\nYour Best",
    sub: "Consistency and coaching that delivers real results.",
  },
];

export default function DumbbellAnimation() {
  const canvasRef  = useRef(null);
  const spacerRef  = useRef(null);
  const panelRef   = useRef(null);
  const textRefs   = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const spacer = spacerRef.current;
    const panel  = panelRef.current;

    const setSpacerHeight = () => {
      if (spacer) {
        const multiplier = window.innerWidth < 768 ? 2.5 : 4;
        spacer.style.height = (window.innerHeight * multiplier) + "px";
      }
    };
    setSpacerHeight();

    const frameCount   = 168;
    const currentFrame = (i) =>
      `/dumbbell-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.png`;

    const images    = new Array(frameCount);
    let initialized = false;
    let cropX = 0, cropY = 0, srcW = 0, srcH = 0;

    // ── JS objectFit: responsive fill ────────────────────────────────────────
    function sizeCanvas() {
      if (!srcW || !srcH) return;
      const pw = window.innerWidth;
      const ph = window.innerHeight;
      const ia = srcW / srcH;
      const isMobile = pw < 768;

      let cW, cH;
      if (isMobile) {
        // On mobile portrait, scale up width so dumbbell fills screen vertically
        cW = pw * 1.75;
        cH = cW / ia;
      } else {
        const pa = pw / ph;
        if (ia > pa) { cW = pw; cH = pw / ia; }
        else         { cH = ph; cW = ph * ia; }
      }
      canvas.style.width  = cW + "px";
      canvas.style.height = cH + "px";
    }

    // ── Draw frame ───────────────────────────────────────────────────────────
    function drawFrame(progress) {
      if (!initialized) return;
      let f = Math.round(Math.max(0, Math.min(1, progress)) * (frameCount - 1));
      while (f >= 0 && (!images[f] || !images[f].complete)) f--;
      if (f < 0) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[f], cropX, cropY, srcW, srcH, 0, 0, canvas.width, canvas.height);
    }

    // ── Text animation ───────────────────────────────────────────────────────
    function animateText(progress) {
      const n = STEPS.length;
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = Math.max(0, Math.min(1, (progress - i / n) / (1 / n)));
        const opacity = p < 0.12 ? p / 0.12 : p > 0.88 ? (1 - p) / 0.12 : 1;
        el.style.opacity   = opacity;
        el.style.transform = `translateY(${(1 - Math.min(1, p * 5)) * 28}px)`;
      });
    }

    // ── MAIN SCROLL HANDLER ──────────────────────────────────────────────────
    function onScroll() {
      const sRect = spacer.getBoundingClientRect();
      const vh    = window.innerHeight;

      // Total scroll distance the spacer travels through the viewport
      const SPACER_H    = spacer.offsetHeight;
      const totalScroll = SPACER_H - vh;

      // How far past the top of the viewport the spacer has scrolled
      const scrolledIn  = -sRect.top;

      // Is user inside the section?
      const isInside = sRect.top <= 0 && sRect.bottom >= vh;
      const isAbove  = sRect.top > 0;   // haven't reached section yet
      const isBelow  = sRect.bottom < vh; // have passed section

      if (isAbove) {
        // Section not reached yet — hide panel completely
        panel.style.visibility = "hidden";
        panel.style.opacity    = "0";
        panel.style.position   = "absolute";
        panel.style.top        = "0";
        return;
      }

      if (isBelow) {
        // Passed section — hide panel and park it at bottom of spacer
        panel.style.visibility = "hidden";
        panel.style.opacity    = "0";
        panel.style.position   = "absolute";
        panel.style.top        = SPACER_H - vh + "px";
        return;
      }

      // ── INSIDE SECTION: lock user in viewport ──
      panel.style.visibility = "visible";
      panel.style.position   = "fixed";
      panel.style.top        = "0";
      panel.style.left       = "0";

      const progress = Math.max(0, Math.min(1, scrolledIn / totalScroll));

      if (initialized) drawFrame(progress);
      animateText(progress);

      // Panel fade in on entry, fade out on exit
      const panelOpacity =
        progress < 0.05 ? progress / 0.05 :       // fade in first 5%
        progress > 0.90 ? (1 - progress) / 0.10 : // fade out last 10%
        1;
      panel.style.opacity    = String(Math.max(0, panelOpacity));
      canvas.style.opacity   = "1"; // canvas always full opacity inside section
    }

    // ── Preload ──────────────────────────────────────────────────────────────
    const firstImg = new Image();
    firstImg.onload = () => {
      images[0] = firstImg;
      cropX = Math.floor(firstImg.width  * 0.05);
      cropY = Math.floor(firstImg.height * 0.08);
      srcW  = firstImg.width  - cropX * 2;
      srcH  = firstImg.height - cropY * 2;
      canvas.width  = srcW;
      canvas.height = srcH;
      canvas.style.opacity = "1";
      initialized = true;
      sizeCanvas();
      drawFrame(0);
      onScroll(); // re-run scroll logic now that we're initialized
    };
    firstImg.src = currentFrame(0);

    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      img.onload = () => { images[i] = img; };
      img.src = currentFrame(i);
    }

    const onResize = () => { setSpacerHeight(); sizeCanvas(); onScroll(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll(); // initial call

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    /* Outer wrapper — position:relative so absolute-parked panel stays within section */
    <div style={{ position: "relative", width: "100%", background: "#FFFFFF", margin: 0, padding: 0 }}>

      {/* Spacer — creates the scroll height (4× viewport = generous animation time) */}
      <div
        ref={spacerRef}
        style={{ width: "100%", height: "400vh", pointerEvents: "none" }}
      />

      {/* Panel — initially hidden, becomes fixed when user scrolls into section */}
      <div
        ref={panelRef}
        style={{
          position: "absolute",    // starts absolute (parked at top of spacer)
          top: 0, left: 0,
          width: "100%", height: "100vh",
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          zIndex: 50,
          visibility: "hidden",   // hidden until user reaches section
          opacity: 0,
        }}
      >
        {/* Text above dumbbell */}
        <div style={{
          position: "absolute",
          top: "clamp(120px, 16vh, 160px)",
          left: 0, right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 2,
          pointerEvents: "none",
        }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              ref={(el) => (textRefs.current[i] = el)}
              style={{
                position: "absolute",
                textAlign: "center",
                opacity: i === 0 ? 1 : 0,
                willChange: "opacity, transform",
              }}
            >
              <span style={{
                display: "inline-block",
                fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#1C3A5E", background: "#EAF2FF",
                padding: "5px 14px", borderRadius: "100px", marginBottom: "12px",
              }}>
                {step.tag}
              </span>
              <h2 style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "clamp(24px, 4.5vw, 68px)", fontWeight: 900,
                lineHeight: 1.05, color: "#0A0A0A",
                whiteSpace: "pre-line", marginBottom: "8px",
              }}>
                {step.heading}
              </h2>
              <p style={{ fontSize: "clamp(13px, 1.1vw, 16px)", color: "#666", lineHeight: 1.65 }}>
                {step.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Dumbbell canvas */}
        <canvas
          ref={canvasRef}
          style={{ display: "block", opacity: 1, position: "relative", zIndex: 1 }}
        />
      </div>
    </div>
  );
}