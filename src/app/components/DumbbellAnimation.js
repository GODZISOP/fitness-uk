"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef  = useRef(null);
  const spacerRef  = useRef(null);
  const panelRef   = useRef(null);
  const textRefs   = useRef([]);

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

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    const spacer = spacerRef.current;
    const panel  = panelRef.current;

    const setSpacerHeight = () => {
      if (spacer) {
        spacer.style.height = (window.innerHeight * 4) + "px";
      }
    };
    setSpacerHeight();

    const frameCount   = 168;
    const currentFrame = (i) =>
      `/dumbbell-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.png`;

    const images    = new Array(frameCount);
    let initialized = false;
    let cropX = 0, cropY = 0, srcW = 0, srcH = 0;

    function sizeCanvas() {
      if (!srcW || !srcH) return;
      const pw = window.innerWidth;
      const ph = window.innerHeight;
      const ia = srcW / srcH;
      const pa = pw / ph;

      let cW, cH;
      if (ia > pa) { cW = pw; cH = pw / ia; }
      else         { cH = ph; cW = ph * ia; }

      canvas.style.width  = cW + "px";
      canvas.style.height = cH + "px";
    }

    function computeCropBounds(img) {
      const temp    = document.createElement("canvas");
      temp.width   = img.naturalWidth;
      temp.height  = img.naturalHeight;
      const tempCtx = temp.getContext("2d");
      tempCtx.drawImage(img, 0, 0);

      const pixels = tempCtx.getImageData(0, 0, temp.width, temp.height).data;
      let minX = temp.width, minY = temp.height, maxX = 0, maxY = 0;

      for (let y = 0; y < temp.height; y += 4) {
        for (let x = 0; x < temp.width; x += 4) {
          const i = (y * temp.width + x) * 4;
          if (pixels[i + 3] > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const pad = 20;
      cropX = Math.max(0, minX - pad);
      cropY = Math.max(0, minY - pad);
      srcW  = Math.min(img.naturalWidth  - cropX, (maxX - minX) + pad * 2);
      srcH  = Math.min(img.naturalHeight - cropY, (maxY - minY) + pad * 2);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = srcW * dpr;
      canvas.height = srcH * dpr;
      ctx.scale(dpr, dpr);
      sizeCanvas();
    }

    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.src = currentFrame(i);
      img.onload = () => {
        images[i] = img;
        loadedCount++;
        if (i === 0 && !initialized) {
          initialized = true;
          computeCropBounds(img);
          renderFrame(0);
        }
      };
    }

    function renderFrame(index) {
      const img = images[index];
      if (!img || !srcW) return;
      ctx.clearRect(0, 0, srcW, srcH);
      ctx.drawImage(img, cropX, cropY, srcW, srcH, 0, 0, srcW, srcH);
    }

    function updateStepText(progress) {
      const n = STEPS.length;
      STEPS.forEach((_, i) => {
        const el = textRefs.current[i];
        if (!el) return;
        const p = Math.max(0, Math.min(1, (progress - i / n) / (1 / n)));
        const opacity = p < 0.12 ? p / 0.12 : p > 0.88 ? (1 - p) / 0.12 : 1;
        el.style.opacity   = opacity;
        el.style.transform = `translateY(${(1 - Math.min(1, p * 5)) * 28}px)`;
      });
    }

    function onScroll() {
      const sRect = spacer.getBoundingClientRect();
      const vh    = window.innerHeight;
      const SPACER_H    = spacer.offsetHeight;
      const totalScroll = SPACER_H - vh;
      const scrolledIn  = -sRect.top;

      const isInside = sRect.top <= 0 && sRect.bottom >= vh;
      const isAbove  = sRect.top > 0;
      const isBelow  = sRect.bottom < vh;

      if (isAbove) {
        panel.style.visibility = "hidden";
        panel.style.opacity    = "0";
        panel.style.position   = "absolute";
        panel.style.top        = "0";
        return;
      }

      if (isBelow) {
        panel.style.visibility = "hidden";
        panel.style.opacity    = "0";
        panel.style.position   = "absolute";
        panel.style.top        = SPACER_H - vh + "px";
        return;
      }

      if (isInside) {
        panel.style.visibility = "visible";
        panel.style.opacity    = "1";
        panel.style.position   = "fixed";
        panel.style.top        = "0";
        panel.style.left       = "0";

        const progress   = Math.max(0, Math.min(1, scrolledIn / totalScroll));
        const frameIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
        renderFrame(frameIndex);
        updateStepText(progress);
      }
    }

    const onResize = () => {
      spacer.style.height = (window.innerHeight * 4) + "px";
      sizeCanvas();
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

  // ── MOBILE LAYOUT (Single Full Viewport Section, 1 Image: ezgif-frame-161.png) ──
  if (isMobile) {
    return (
      <section className="mobile-single-dumbbell-section">
        <div className="mobile-single-dumbbell-container">
          <span className="mobile-badge">PRECISION ENGINEERED</span>
          
          <h2 className="mobile-single-title">
            Built for<br />Performance
          </h2>

          <p className="mobile-single-desc">
            Every component engineered to maximise your output. Technique and form — refined through expert guidance.
          </p>

          <div className="mobile-single-img-wrapper">
            <Image
              src="/dumbbell-frames/ezgif-frame-161.png"
              alt="Precision Engineered Dumbbell"
              width={800}
              height={400}
              priority
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "320px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  // ── DESKTOP/LAPTOP LAYOUT (Original 168-Frame Canvas Animation) ──
  return (
    <div style={{ position: "relative", width: "100%", margin: 0, padding: 0 }}>
      {/* Scroll spacer */}
      <div ref={spacerRef} style={{ width: "100%", pointerEvents: "none" }} />

      {/* Fixed viewport panel */}
      <div
        ref={panelRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100vh",
          visibility: "hidden",
          opacity: 0,
          zIndex: 10,
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
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

        {/* Canvas centered below text */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}>
          <canvas ref={canvasRef} style={{ display: "block" }} />
        </div>
      </div>
    </div>
  );
}