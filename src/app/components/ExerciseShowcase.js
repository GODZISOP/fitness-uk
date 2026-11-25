"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  Dumbbell,
  Flame,
  Lock,
  ShieldCheck,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ICON_MAP = {
  dumbbell: Dumbbell,
  flame: Flame,
  shield: ShieldCheck,
  sparkles: Sparkles,
};

function WatermarkOverlay({ subtle = false }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        userSelect: "none",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1rem",
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          alignContent: "space-evenly",
          justifyItems: "center",
          transform: "rotate(-24deg)",
          opacity: subtle ? 0.16 : 0.22,
        }}
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <span
            key={idx}
            style={{
              fontFamily: "var(--font-primary)",
              fontWeight: 900,
              fontSize: "0.95rem",
              letterSpacing: "2.5px",
              color: "#071a2b",
              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
              whiteSpace: "nowrap",
            }}
          >
            WORLD FITNESS ZONE
          </span>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <span
          style={{
            background: "rgba(7, 26, 43, 0.78)",
            color: "#FFC928",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "1.4px",
            padding: "0.28rem 0.65rem",
            borderRadius: "50px",
            backdropFilter: "blur(4px)",
          }}
        >
          © WORLD FITNESS ZONE
        </span>
      </div>
    </div>
  );
}

export default function ExerciseShowcase({
  audience,
  eyebrow,
  titleLead,
  titleOutline,
  subtitle,
  guides,
  benefitsTitle,
  benefits,
  ctaTitle,
  ctaHighlight,
  ctaDescription,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar isScrolled={isScrolled} theme="default" />

      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-white)",
          color: "var(--color-charcoal)",
          paddingTop: "120px",
          paddingBottom: "90px",
          fontFamily: "var(--font-secondary)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(21, 94, 239, 0.08)",
                color: "var(--color-primary)",
                border: "1px solid rgba(21, 94, 239, 0.2)",
                padding: "0.4rem 1.1rem",
                borderRadius: "50px",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "1.8px",
                textTransform: "uppercase",
                marginBottom: "1.1rem",
              }}
            >
              {eyebrow}
            </span>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.3rem)",
                fontFamily: "var(--font-primary)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "1.25rem",
                textTransform: "uppercase",
                color: "var(--color-deep-navy)",
              }}
            >
              {titleLead}{" "}
              <span style={{ WebkitTextStroke: "1.5px var(--color-deep-navy)", color: "transparent" }}>
                {titleOutline}
              </span>
            </h1>

            <p
              style={{
                maxWidth: "680px",
                margin: "0 auto 2rem",
                color: "#475467",
                fontSize: "1.1rem",
                lineHeight: 1.65,
              }}
            >
              {subtitle}
            </p>

            {/* Audience Switcher */}
            <div
              style={{
                display: "inline-flex",
                background: "#f1f5f9",
                padding: "0.35rem",
                borderRadius: "50px",
                border: "1px solid #e2e8f0",
                gap: "0.35rem",
              }}
            >
              <Link
                href="/exercises/men"
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "50px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  backgroundColor: audience === "men" ? "var(--color-deep-navy)" : "transparent",
                  color: audience === "men" ? "#ffffff" : "#475467",
                }}
              >
                For Men
              </Link>
              <Link
                href="/exercises/women"
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "50px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  backgroundColor: audience === "women" ? "var(--color-deep-navy)" : "transparent",
                  color: audience === "women" ? "#ffffff" : "#475467",
                }}
              >
                For Women
              </Link>
            </div>
          </motion.div>

          {/* 4 Workout Cards Grid: 2 Visible Free Previews + 2 Blurred Premium Locked */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
              gap: "2.25rem",
              marginBottom: "4.5rem",
            }}
          >
            {guides.map((guide, index) => {
              const isLocked = Boolean(guide.locked);
              return (
                <motion.article
                  key={guide.title}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "24px",
                    border: isLocked
                      ? "1.5px solid rgba(255, 201, 40, 0.55)"
                      : "1px solid #e2e8f0",
                    boxShadow: isLocked
                      ? "0 16px 40px rgba(7, 26, 43, 0.1)"
                      : "0 14px 36px rgba(7, 26, 43, 0.06)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image Container with Watermark + Optional Blur Lock Overlay */}
                  <div
                    onClick={() => {
                      if (!isLocked) setLightboxImage(guide);
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    role={isLocked ? undefined : "button"}
                    tabIndex={isLocked ? -1 : 0}
                    onKeyDown={(e) => {
                      if (!isLocked && (e.key === "Enter" || e.key === " ")) {
                        setLightboxImage(guide);
                      }
                    }}
                    aria-label={
                      isLocked
                        ? `${guide.title} — Locked for Personalised Access`
                        : `View full size ${guide.title}`
                    }
                    style={{
                      position: "relative",
                      background: "#f8fafc",
                      cursor: isLocked ? "default" : "zoom-in",
                      borderBottom: "1px solid #e2e8f0",
                      overflow: "hidden",
                      minHeight: "360px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={guide.image}
                      alt={guide.title}
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "460px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                        filter: isLocked ? "blur(15px) brightness(0.75)" : "none",
                        transform: isLocked ? "scale(1.06)" : "none",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Brand Watermark on every image */}
                    <WatermarkOverlay subtle={!isLocked} />

                    {isLocked ? (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          zIndex: 3,
                          background:
                            "linear-gradient(180deg, rgba(7,26,43,0.45) 0%, rgba(7,26,43,0.78) 100%)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: "1.75rem",
                          color: "#ffffff",
                        }}
                      >
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            background: "rgba(255, 201, 40, 0.2)",
                            border: "1.5px solid #FFC928",
                            color: "#FFC928",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "1rem",
                          }}
                        >
                          <Lock size={24} />
                        </div>

                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            color: "#FFC928",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Premium Training Blueprint
                        </span>

                        <h3
                          style={{
                            fontFamily: "var(--font-primary)",
                            fontSize: "1.35rem",
                            fontWeight: 800,
                            marginBottom: "0.6rem",
                            color: "#ffffff",
                          }}
                        >
                          Unlock Full Workout Chart
                        </h3>

                        <p
                          style={{
                            fontSize: "0.88rem",
                            lineHeight: 1.55,
                            color: "#e2e8f0",
                            maxWidth: "300px",
                            marginBottom: "1.25rem",
                          }}
                        >
                          Get personalised access with extra personalised training, exact form cues, and progressive weekly plans.
                        </p>

                        <a
                          href="https://wa.me/447776899913?text=Hi%20Coach%20James%2C%20I%20want%20Personalised%20Access%20with%20Extra%20Personalised%20Training!"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.45rem",
                            backgroundColor: "var(--color-action-yellow)",
                            color: "#071a2b",
                            fontWeight: 800,
                            fontSize: "0.86rem",
                            padding: "0.85rem 1.5rem",
                            borderRadius: "50px",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            boxShadow: "0 10px 24px rgba(255, 201, 40, 0.3)",
                          }}
                        >
                          GET PERSONALISED ACCESS &rarr;
                        </a>
                      </div>
                    ) : (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "12px",
                          right: "12px",
                          zIndex: 3,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          background: "rgba(7, 26, 43, 0.85)",
                          color: "#ffffff",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "50px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        <ZoomIn size={14} /> Tap to Expand
                      </span>
                    )}
                  </div>

                  {/* Card Details */}
                  <div
                    style={{
                      padding: "1.75rem",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.65rem",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          color: isLocked ? "#92400e" : "var(--color-primary)",
                          background: isLocked
                            ? "rgba(255, 201, 40, 0.22)"
                            : "rgba(21, 94, 239, 0.08)",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "50px",
                        }}
                      >
                        {isLocked ? `🔒 ${guide.badge}` : guide.badge}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
                        {guide.level}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: "var(--font-primary)",
                        fontSize: "1.55rem",
                        fontWeight: 800,
                        color: "var(--color-deep-navy)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {guide.title}
                    </h2>

                    <p
                      style={{
                        color: "#475467",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        marginBottom: "1.1rem",
                      }}
                    >
                      {guide.summary}
                    </p>

                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "0 0 1.25rem 0",
                        display: "grid",
                        gap: "0.55rem",
                      }}
                    >
                      {guide.highlights.map((item) => (
                        <li
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.55rem",
                            fontSize: "0.92rem",
                            color: "var(--color-deep-navy)",
                            fontWeight: 500,
                          }}
                        >
                          {isLocked ? (
                            <Lock size={16} style={{ color: "#d97706", flexShrink: 0 }} />
                          ) : (
                            <CheckCircle2
                              size={17}
                              style={{ color: "var(--color-primary)", flexShrink: 0 }}
                            />
                          )}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {isLocked && (
                      <a
                        href="https://wa.me/447776899913?text=Hi%20Coach%20James%2C%20I%20want%20Personalised%20Access%20with%20Extra%20Personalised%20Training!"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginTop: "auto",
                          display: "block",
                          textAlign: "center",
                          backgroundColor: "var(--color-deep-navy)",
                          color: "#ffffff",
                          padding: "0.9rem 1.2rem",
                          borderRadius: "50px",
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          textDecoration: "none",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Get Personalised Access + Extra Training &rarr;
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Benefits Section */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "4.5rem" }}
          >
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <span
                style={{
                  color: "var(--color-primary)",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Why These Workouts Work
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
                  fontWeight: 800,
                  color: "var(--color-deep-navy)",
                  textTransform: "uppercase",
                }}
              >
                {benefitsTitle}
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {benefits.map((benefit) => {
                const Icon = ICON_MAP[benefit.icon] || Dumbbell;
                return (
                  <div
                    key={benefit.title}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "20px",
                      padding: "1.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "rgba(255, 201, 40, 0.18)",
                        color: "var(--color-deep-navy)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-primary)",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "var(--color-deep-navy)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {benefit.title}
                    </h3>
                    <p style={{ color: "#475467", fontSize: "0.93rem", lineHeight: 1.6, margin: 0 }}>
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Personalised Access + Extra Personalised Training CTA Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              textAlign: "center",
              background: "linear-gradient(135deg, #071a2b 0%, #0f2942 100%)",
              color: "#ffffff",
              borderRadius: "24px",
              padding: "3.75rem 2rem",
              boxShadow: "0 20px 50px rgba(7, 26, 43, 0.16)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(255, 201, 40, 0.16)",
                color: "var(--color-action-yellow)",
                border: "1px solid rgba(255, 201, 40, 0.35)",
                padding: "0.35rem 1rem",
                borderRadius: "50px",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Want More Workouts &amp; 1-on-1 Coaching?
            </span>

            <h2
              style={{
                fontSize: "clamp(1.85rem, 4vw, 2.9rem)",
                fontFamily: "var(--font-primary)",
                fontWeight: 800,
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              {ctaTitle}{" "}
              <span style={{ color: "var(--color-action-yellow)" }}>{ctaHighlight}</span>
            </h2>

            <p
              style={{
                maxWidth: "660px",
                margin: "0 auto 2.25rem",
                color: "#cbd5e1",
                fontSize: "1.08rem",
                lineHeight: 1.65,
              }}
            >
              {ctaDescription}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/447776899913?text=Hi%20Coach%20James%2C%20I%20want%20Personalised%20Access%20with%20Extra%20Personalised%20Training!"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--color-action-yellow)",
                  color: "#071a2b",
                  fontWeight: 800,
                  padding: "1rem 2.3rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                  fontSize: "1rem",
                  letterSpacing: "0.5px",
                  boxShadow: "0 10px 24px rgba(255, 201, 40, 0.25)",
                }}
              >
                GET PERSONALISED ACCESS WITH EXTRA TRAINING &rarr;
              </a>
              <a
                href="https://wa.me/447776899913?text=Hi%20Coach%20James%2C%20I%27d%20like%20to%20book%20a%20free%20consultation!"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  fontWeight: 700,
                  padding: "1rem 2rem",
                  borderRadius: "50px",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                }}
              >
                Book Free Consultation
              </a>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Watermarked Lightbox Modal for Free Preview Charts */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10020,
              background: "rgba(7, 26, 43, 0.88)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                position: "relative",
                maxWidth: "760px",
                width: "100%",
                maxHeight: "90vh",
                background: "#ffffff",
                borderRadius: "20px",
                padding: "1rem",
                overflow: "auto",
              }}
            >
              <button
                onClick={() => setLightboxImage(null)}
                aria-label="Close Preview"
                style={{
                  position: "sticky",
                  top: "0.25rem",
                  float: "right",
                  zIndex: 5,
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: "var(--color-deep-navy)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
              <div style={{ position: "relative" }}>
                <img
                  src={lightboxImage.image}
                  alt={lightboxImage.title}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "12px",
                    display: "block",
                    userSelect: "none",
                  }}
                />
                <WatermarkOverlay subtle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
