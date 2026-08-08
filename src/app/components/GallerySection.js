"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GalleryIntro from "./GalleryIntro";

import img1 from "../image copy.png";
import img2 from "../image copy 2.png";
import img3 from "../image copy 3.png";
import img4 from "../image copy 4.png";

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const scrollRef = useRef(null);

  const cards = [
    { id: "01", title: "Strength & Power", src: img1, tag: "HEAVY LIFTING" },
    { id: "02", title: "Conditioning", src: img2, tag: "ENDURANCE" },
    { id: "03", title: "Core Power", src: img3, tag: "STRENGTH" },
    { id: "04", title: "Agility & Form", src: img4, tag: "PERFORMANCE" },
  ];

  // GSAP Horizontal Scroll for Desktop (runs only when window >= 768px)
  useGSAP(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    
    let timeoutId;
    let triggers = [];

    timeoutId = setTimeout(() => {
      if (!containerRef.current || !trackRef.current) return;
      
      const track = trackRef.current;
      const container = containerRef.current;
      
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const rightSectionWidth = track.parentElement.offsetWidth;
        return Math.max(0, trackWidth - rightSectionWidth);
      };

      const t1 = gsap.fromTo(".gallery-left-content > *", {
        x: -40, opacity: 0
      }, {
        x: 0, opacity: 1,
        stagger: 0.15, duration: 0.8, ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "restart none none reverse"
        }
      });
      triggers.push(t1);

      const t2 = gsap.fromTo(".desktop-gallery-card", {
        y: 40, opacity: 0
      }, {
        y: 0, opacity: 1,
        stagger: 0.15, duration: 0.8, ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 70%",
          toggleActions: "restart none none reverse"
        }
      });
      triggers.push(t2);

      const t3 = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
      triggers.push(t3);
      
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      triggers.forEach(t => {
        if (t && t.scrollTrigger) t.scrollTrigger.kill();
        if (t && t.kill) t.kill();
      });
    };
  }, { scope: containerRef });

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const scrollRowLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRowRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ── DESKTOP/LAPTOP VIEW (GSAP Sticky Horizontal Scroll) ── */}
      <div className="desktop-only-gallery">
        <GalleryIntro />
        <section className="gallery-section" ref={containerRef} id="gallery">
          <div className="gallery-layout">
            <div className="gallery-left">
              <div className="gallery-left-content">
                <h2 className="gallery-title">
                  <span className="title-light">Visual</span><br/>
                  <span className="title-bold">Narratives</span>
                </h2>
                <p className="gallery-description">
                  Scroll down to explore this curated collection of visual aesthetics. 
                  Each image tells a unique story through form, shadow, and light.
                </p>
                <div className="scroll-prompt">
                  SCROLL TO EXPLORE &rarr;
                </div>
              </div>
            </div>

            <div className="gallery-right">
              <div className="gallery-track" ref={trackRef}>
                {cards.map((card, index) => (
                  <div 
                    className="gallery-card desktop-gallery-card" 
                    key={card.id}
                    onClick={() => setSelectedIdx(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <Image 
                      src={card.src} 
                      alt={card.title} 
                      fill 
                      className="gallery-img" 
                      placeholder="blur"
                    />
                    <div className="card-overlay"></div>
                    <div className="card-number">{card.id}</div>
                    <h3 className="card-title">{card.title}</h3>
                  </div>
                ))}
                <div className="gallery-end">
                  End
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── MOBILE VIEW (Touch Carousel Row with Left/Right Buttons) ── */}
      <div className="mobile-only-gallery">
        <section className="clean-gallery-section" id="gallery-mobile">
          <div className="clean-gallery-container">
            <motion.div 
              className="clean-gallery-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <span className="gallery-badge">WORKOUT GALLERY</span>
              <h2 className="clean-gallery-title">EXCELLENCE IN MOTION</h2>
              <p className="clean-gallery-subtitle">
                Tap any image to expand full screen
              </p>
            </motion.div>

            <div className="gallery-carousel-wrapper">
              <button 
                className="row-scroll-btn left" 
                onClick={scrollRowLeft}
                aria-label="Scroll Left"
              >
                ‹
              </button>

              <div className="gallery-row-scroll" ref={scrollRef}>
                {cards.map((card, index) => (
                  <motion.div 
                    className="gallery-row-card"
                    key={card.id}
                    onClick={() => setSelectedIdx(index)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <div className="card-img-wrapper" style={{ height: "340px", position: "relative", overflow: "hidden", background: "var(--color-deep-navy)" }}>
                      <Image 
                        src={card.src} 
                        alt={card.title} 
                        fill
                        sizes="280px"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center center",
                        }}
                      />
                      <div className="zoom-icon-badge">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                      </div>
                    </div>

                    <div className="mobile-card-info">
                      <span className="card-tag">{card.tag}</span>
                      <h3 className="card-name">{card.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                className="row-scroll-btn right" 
                onClick={scrollRowRight}
                aria-label="Scroll Right"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox Full-Screen Modal (Works on both Laptop & Mobile) */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div 
            className="gallery-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
          >
            <motion.div 
              className="gallery-lightbox-modal"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="lightbox-close-btn"
                onClick={() => setSelectedIdx(null)}
                aria-label="Close"
              >
                ✕
              </button>

              <button className="lightbox-nav-btn prev" onClick={handlePrev} aria-label="Previous">
                ‹
              </button>
              <button className="lightbox-nav-btn next" onClick={handleNext} aria-label="Next">
                ›
              </button>

              <div className="lightbox-img-container">
                <Image 
                  src={cards[selectedIdx].src} 
                  alt={cards[selectedIdx].title} 
                  fill 
                  className="lightbox-img" 
                  priority 
                />
              </div>

              <div className="lightbox-caption">
                <span className="lightbox-tag">{cards[selectedIdx].tag}</span>
                <h3 className="lightbox-title">{cards[selectedIdx].title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
