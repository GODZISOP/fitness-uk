"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Star,
  Zap,
  Utensils,
  Activity,
  Users,
  Sparkles,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollHeading from "../components/ScrollHeading";
import SwarmCursor from "../components/SwarmCursor";
import "./about.css";

// Project assets
import showcaseAthleteImg from "../zjBzVg-Photoroom.png";
import runnerCharacterImg from "../image copy 10.png";
import coachImg1 from "../image copy.png";
import coachImg2 from "../image copy 2.png";
import coachImg3 from "../image copy 4.png";
import coachPortrait from "../image copy 6.png";
import newCoachStrength from "../coach_strength.jpg";
import imageCopy11 from "../image copy 11.png";
import imageCopy12 from "../image copy 12.png";

const AnimatedCounter = ({ from = 0, to, duration = 1.5 }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView) {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}%</span>;
};

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Responsive state for parallax
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showcaseRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ["start 85%", "center center"]
  });
  
  // Line & Dots
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const dot0Scale = useTransform(scrollYProgress, [0.0, 0.2], [0, 1]);
  const dot1Scale = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const dot2Scale = useTransform(scrollYProgress, [0.8, 1.0], [0, 1]);

  // Massive "W" Parallax
  const wY = useTransform(scrollYProgress, [0, 1], [150, 0]);
  const wOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const wScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  // Right Typography Parallax (Staggered)
  const text1Y = useTransform(scrollYProgress, [0.1, 0.7], [50, 0]);
  const text1Opacity = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  
  const numY = useTransform(scrollYProgress, [0.2, 0.8], [80, 0]);
  const numOpacity = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  
  const titleY = useTransform(scrollYProgress, [0.3, 0.9], [60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.3, 0.9], [0, 1]);
  
  const descY = useTransform(scrollYProgress, [0.4, 1.0], [40, 0]);
  const descOpacity = useTransform(scrollYProgress, [0.4, 1.0], [0, 1]);

  // --- COACH SECTION PARALLAX (Vertical Line & Blast) ---
  const coachRef = useRef(null);
  const { scrollYProgress: coachScroll } = useScroll({
    target: coachRef,
    offset: ["start 90%", "start 0%"]
  });

  const smoothCoachScroll = useSpring(coachScroll, { stiffness: 80, damping: 20 });

  // 1. Vertical Line drops from absolute top of section to center (0.0 to 0.45)
  const dropLineHeight = useTransform(smoothCoachScroll, [0, 0.45], ["0%", "50%"]);
  const lineOpacity = useTransform(smoothCoachScroll, [0.45, 0.50], [1, 0]);

  // 2. Blast ring expands from center (0.45 to 0.55)
  const blastScale = useTransform(smoothCoachScroll, [0.45, 0.55], [1, 100]);
  const blastOpacity = useTransform(smoothCoachScroll, [0.45, 0.55], [1, 0]);
  const blastBorderWidth = useTransform(smoothCoachScroll, [0.45, 0.55], ["8px", "0px"]);

  // 3. Image reveal after blast (0.55 to 0.75)
  const imgOverlayHeight = useTransform(smoothCoachScroll, [0.55, 0.75], ["100%", "0%"]);
  const coachImgScale = useTransform(smoothCoachScroll, [0.55, 0.75], [1.1, 1]);
  const coachImgOpacity = useTransform(smoothCoachScroll, [0.55, 0.75], [0, 1]); // Hides the card shadow initially

  // 4. Text reveals staggering after blast (0.55 to 0.95)
  const coachSubY = useTransform(smoothCoachScroll, [0.55, 0.70], [30, 0]);
  const coachSubOpacity = useTransform(smoothCoachScroll, [0.55, 0.70], [0, 1]);
  
  const coachTitleY = useTransform(smoothCoachScroll, [0.60, 0.75], [30, 0]);
  const coachTitleOpacity = useTransform(smoothCoachScroll, [0.60, 0.75], [0, 1]); 
  
  const coachRoleY = useTransform(smoothCoachScroll, [0.65, 0.80], [30, 0]);
  const coachRoleOpacity = useTransform(smoothCoachScroll, [0.65, 0.80], [0, 1]);
  
  const coachBioY = useTransform(smoothCoachScroll, [0.70, 0.85], [30, 0]);
  const coachBioOpacity = useTransform(smoothCoachScroll, [0.70, 0.85], [0, 1]);
  
  const coachBtnY = useTransform(smoothCoachScroll, [0.75, 0.90], [30, 0]);
  const coachBtnOpacity = useTransform(smoothCoachScroll, [0.75, 0.90], [0, 1]);

  // --- STRATEGIC SECTION PARALLAX ---
  const stratRef = useRef(null);
  const { scrollYProgress: stratScroll } = useScroll({
    target: stratRef,
    offset: ["start 90%", "end 80%"] 
  });
  const smoothStratScroll = useSpring(stratScroll, { stiffness: 80, damping: 20 });

  // Cards Fan Out (0.0 to 0.3)
  const stratCardOpacity = useTransform(smoothStratScroll, [0, 0.2], [0, 1]);
  const card1X = useTransform(smoothStratScroll, [0, 0.3], [-150, 0]);
  const card1RotateY = useTransform(smoothStratScroll, [0, 0.3], isDesktop ? [-45, 0] : [0, 0]);
  
  const card2Y = useTransform(smoothStratScroll, [0, 0.3], [150, 0]);
  const card2Scale = useTransform(smoothStratScroll, [0, 0.3], [0.8, 1]);
  
  const card3X = useTransform(smoothStratScroll, [0, 0.3], [150, 0]);
  const card3RotateY = useTransform(smoothStratScroll, [0, 0.3], isDesktop ? [45, 0] : [0, 0]);

  // Bottom Row Parallax (0.3 to 0.7)
  const stratCol1X = useTransform(smoothStratScroll, [0.3, 0.6], [-100, 0]);
  const stratCol1Opacity = useTransform(smoothStratScroll, [0.3, 0.6], [0, 1]);
  
  const stratCol2Y = useTransform(smoothStratScroll, [0.4, 0.7], [100, 0]);
  const stratCol2Opacity = useTransform(smoothStratScroll, [0.4, 0.7], [0, 1]);
  
  const stratCol3X = useTransform(smoothStratScroll, [0.5, 0.8], [100, 0]);
  const stratCol3Opacity = useTransform(smoothStratScroll, [0.5, 0.8], [0, 1]);

  // Progress Bars mapped strictly to scroll (0.6 to 1.0)
  const bar1W = useTransform(smoothStratScroll, [0.6, 0.85], ["0%", "95%"]);
  const bar2W = useTransform(smoothStratScroll, [0.65, 0.90], ["0%", "90%"]);
  const bar3W = useTransform(smoothStratScroll, [0.70, 0.95], ["0%", "88%"]);
  const bar4W = useTransform(smoothStratScroll, [0.75, 1.0], ["0%", "85%"]);

  const quotes = [
    {
      text: "Your muscles grow while you sleep. Make 7-9 hours your secret weapon for maximum progress.",
      location: "London, UK",
      date: "Nov. 20"
    },
    {
      text: "Consistency beats intensity every single time. Show up, execute the plan, and results will compound.",
      location: "Manchester, UK",
      date: "Nov. 22"
    },
    {
      text: "Fuel your body with intention. Nutrition is the bedrock of athletic performance and lean gains.",
      location: "Birmingham, UK",
      date: "Nov. 24"
    },
    {
      text: "Progressive overload is not just for weights — it applies to your mindset, discipline, and daily habits.",
      location: "London HQ",
      date: "Nov. 26"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    setTimeout(handleScroll, 200);
    setTimeout(handleScroll, 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const masterCoach = {
    name: "Marcus Vance",
    role: "Head Strength & Conditioning Coach",
    bio: "Former national powerlifting coach with 12+ years experience molding elite physique & explosive strength. I believe in a science-backed approach to pushing limits.",
    image: coachImg1,
  };

  return (
    <div className="about-page-wrapper">
      {/* Universal Navbar */}
      <Navbar isScrolled={isScrolled} />

      {/* ── HERO SECTION ── */}
      <section className="about-hero-section">
        <SwarmCursor
          color="#FFC928"
          accentColor="#155EEF"
          count={8}
          size={5}
          speed={2.5}
          spread={100}
          wander={0.25}
          trail={0.75}
          scatterOnClick
        >
          {/* Hero Top Content Row: Left Typography & Right Character */}
          <div className="about-hero-content-row">
            {/* Hero Title & Actions */}
            <motion.div
            className="about-hero-main"
            initial={{ opacity: 0, x: -80, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="about-hero-tag"
              initial={{ opacity: 0, scale: 0.8, x: -30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, type: "spring", bounce: 0.4 }}
            >
              <span className="about-hero-tag-dot" />
              <span>World Fitness Zone Philosophy</span>
            </motion.div>

            <ScrollHeading
              as="h1"
              className="about-hero-title"
              once={false}
              duration={1.2}
              stagger={0.25}
              yOffset={100}
            >
              {[
                <span key="h1" className="title-line">Be healthier.</span>,
                <span key="h2" className="title-line">Be stronger.</span>,
                <span key="h3" className="title-line highlight-line">Be confident.</span>
              ]}
            </ScrollHeading>

            <motion.div
              className="about-hero-actions"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.3 }}
            >
              <Link href="/#contact" className="about-btn-yellow">
                <span>Try for free</span>
                <span className="about-btn-icon-circle">
                  <ArrowUpRight size={16} strokeWidth={3} />
                </span>
              </Link>

              <a
                href="#story"
                onClick={(e) => scrollToSection(e, "#story")}
                className="about-btn-soft"
              >
                <span>Our Philosophy</span>
                <ArrowDown size={16} strokeWidth={2.5} />
              </a>
            </motion.div>
          </motion.div>

          {/* Athletic Runner Character from image copy 10.png */}
          <motion.div
            className="about-hero-character-wrapper"
            initial={{ opacity: 0, scale: 0.8, x: 150, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, type: "spring", bounce: 0.4, delay: 0.15 }}
          >
            <div className="about-character-image-box">
              <Image
                src={runnerCharacterImg}
                alt="Athletic Fitness Runner"
                width={640}
                height={860}
                className="about-character-img"
                priority
              />
              <div className="about-character-shadow" />
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM 3 FLOATING BENTO DOCK CARDS ── */}
        <motion.div
          className="about-bento-dock"
          initial={{ opacity: 0, y: 120, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3, delay: 0.3 }}
        >
          {/* Card 1: 10,000+ Satisfied Clients */}
          <div className="bento-card-light">
            <div>
              <div className="bento-card-light-header">
                <div className="avatar-stack-wrapper">
                  <div className="stacked-avatar" style={{ overflow: "hidden", position: "relative" }}>
                    <Image src="/client-avatars.jpg" alt="Client 1" fill style={{ objectFit: "cover", objectPosition: "left center" }} />
                  </div>
                  <div className="stacked-avatar" style={{ overflow: "hidden", position: "relative" }}>
                    <Image src="/client-avatars.jpg" alt="Client 2" fill style={{ objectFit: "cover", objectPosition: "center" }} />
                  </div>
                  <div className="stacked-avatar" style={{ overflow: "hidden", position: "relative" }}>
                    <Image src="/client-avatars.jpg" alt="Client 3" fill style={{ objectFit: "cover", objectPosition: "right center" }} />
                  </div>
                </div>
                <div>
                  <ScrollHeading as="div" className="bento-clients-count" once={false} duration={0.65}>
                    10,000+
                  </ScrollHeading>
                  <div className="bento-clients-subtitle">satisfied clients</div>
                </div>
              </div>

              <p className="bento-card-light-body">
                They arrive with different goals, yet they all find the support and motivation they need. Their success is the ultimate validation of our method.
              </p>
            </div>

            <div className="bento-card-rating-badge">
              <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#059669" color="#059669" />
                ))}
              </div>
              <span style={{ marginLeft: "6px" }}>4.9/5 Rating</span>
            </div>
          </div>

          {/* Card 2: Interactive Quote Slider (Royal Blue) */}
          <div className="bento-card-blue">
            <div>
              <div className="bento-card-blue-nav">
                <button
                  onClick={handlePrevQuote}
                  className="bento-nav-arrow-btn"
                  aria-label="Previous quote"
                >
                  <ArrowLeft size={16} />
                </button>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  {quotes.map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: i === quoteIndex ? "16px" : "6px" }}
                      animate={{ width: i === quoteIndex ? "16px" : "6px", backgroundColor: i === quoteIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)" }}
                      style={{
                        height: "2px",
                        borderRadius: "2px",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNextQuote}
                  className="bento-nav-arrow-btn"
                  aria-label="Next quote"
                >
                  <ArrowRight size={16} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  className="bento-quote-text"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  &ldquo;{quotes[quoteIndex].text}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="bento-card-blue-footer">
              <span className="bento-location-tag">{quotes[quoteIndex].location}</span>
              <span>{quotes[quoteIndex].date}</span>
            </div>
          </div>

          {/* Card 3: 14 Days Free Pass (Action Yellow) */}
          <Link href="/#contact" className="bento-card-yellow">
            <div className="bento-card-yellow-top">
              <div className="bento-yellow-arrow-circle">
                <ArrowUpRight size={18} strokeWidth={3} />
              </div>
            </div>

            <div className="bento-card-yellow-content">
              <h3 className="bento-yellow-title">
                Get 14 days for free
              </h3>
              <p className="bento-yellow-desc">Just give us a call or message us in the chat</p>
            </div>
          </Link>
        </motion.div>
        </SwarmCursor>
      </section>

      {/* ── STRATEGIC IMPACT LAYOUT (Replacing Pushing the Limits) ── */}
      <section className="strategic-impact-section" id="story" ref={stratRef}>
        <div className="strategic-container">
          
          {/* Top Row: 3 Highlight Cards */}
          <div className="strategic-cards-row" style={{ perspective: isDesktop ? '1200px' : 'none' }}>
            {/* Card 1 */}
            <motion.div 
              className="strategic-card" 
              style={{ 
                x: card1X, 
                rotateY: card1RotateY, 
                opacity: stratCardOpacity, 
                transformOrigin: "right",
                willChange: "transform, opacity"
              }}
            >
              <div className="strategic-card-image">
                <Image src={newCoachStrength} alt="Strength Mastery" fill style={{objectFit:"cover"}} />
              </div>
              <div className="strategic-card-content">
                <span className="strategic-card-num">01</span>
                <h3 className="strategic-card-title">STRENGTH<br/>MASTERY</h3>
                <div className="strategic-card-footer">
                  <span>RESISTANCE & POWER PROTOCOLS</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              className="strategic-card" 
              style={{ 
                y: card2Y, 
                scale: card2Scale, 
                opacity: stratCardOpacity,
                willChange: "transform, opacity"
              }}
            >
              <div className="strategic-card-image">
                <Image src={imageCopy11} alt="Elite Mobility" fill style={{objectFit:"cover", objectPosition: "center bottom"}} />
              </div>
              <div className="strategic-card-content">
                <span className="strategic-card-num">02</span>
                <h3 className="strategic-card-title">ELITE<br/>MOBILITY</h3>
                <div className="strategic-card-footer">
                  <span>DYNAMIC MOVEMENT & FLEXIBILITY</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              className="strategic-card" 
              style={{ 
                x: card3X, 
                rotateY: card3RotateY, 
                opacity: stratCardOpacity, 
                transformOrigin: "left",
                willChange: "transform, opacity"
              }}
            >
              <div className="strategic-card-image">
                <Image 
                  src={imageCopy12} 
                  alt="Nutrition Lab" 
                  fill 
                  style={{
                    objectFit: "cover", 
                    objectPosition: "center top"
                  }} 
                />
              </div>
              <div className="strategic-card-content">
                <span className="strategic-card-num">03</span>
                <h3 className="strategic-card-title">NUTRITION<br/>LAB</h3>
                <div className="strategic-card-footer">
                  <span>MACRO OPTIMIZATION & RECOVERY</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          </div>

          <hr className="strategic-divider" />

          {/* Bottom Row: 3 Columns */}
          <div className="strategic-details-row">
            
            {/* Col 1: Services */}
            <motion.div 
              className="strategic-col-services" 
              style={{ 
                x: stratCol1X, 
                opacity: stratCol1Opacity 
              }}
            >
              <h4 className="strategic-col-title">COACHING PILLARS</h4>
              <ul className="strategic-services-list">
                <li><Zap size={16} /> OLYMPIC WEIGHTLIFTING</li>
                <li><Activity size={16} /> MOBILITY WORKSHOPS</li>
                <li><Utensils size={16} /> METABOLIC CONDITIONING</li>
                <li><Users size={16} /> COMPETITIVE PREP</li>
                <li><Star size={16} /> RECOVERY LABS</li>
              </ul>
              <Link href="/#programs" className="strategic-explore-link">
                EXPLORE PROGRAMS <ArrowUpRight size={16} />
              </Link>
            </motion.div>

            {/* Col 2: Core Message */}
            <motion.div 
              className="strategic-col-center" 
              style={{ y: stratCol2Y, opacity: stratCol2Opacity }}
            >
              <ScrollHeading as="h2" className="strategic-main-title" once={false} duration={0.8}>
                SCIENCE-BACKED COACHING.<br/>
                <span className="text-yellow-highlight">MEASURABLE RESULTS.</span>
              </ScrollHeading>
              <p className="strategic-desc">
                We design elite training programs that combine explosive strength training with tailored nutrition. We don&apos;t just build muscle; we build resilient athletes and drive peak human performance.
              </p>
            </motion.div>

            {/* Col 3: Skills / Metrics */}
            <motion.div 
              className="strategic-col-skills" 
              style={{ 
                x: stratCol3X, 
                opacity: stratCol3Opacity 
              }}
            >
              <h4 className="strategic-col-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                CORE METRICS 
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }}>
                  <span className="live-pulse"></span>
                  <span style={{ fontSize: "0.6rem", color: "#22c55e", letterSpacing: "0.1em" }}>LIVE</span>
                </div>
              </h4>
              
              <div className="strategic-skill-item">
                <div className="skill-label">
                  <span>STRENGTH GAINS</span>
                  <AnimatedCounter to={95} duration={1.5} />
                </div>
                <div className="skill-bar-bg">
                  <motion.div className="skill-bar-fill" style={{ width: bar1W }} />
                </div>
              </div>
              
              <div className="strategic-skill-item">
                <div className="skill-label">
                  <span>FAT LOSS</span>
                  <AnimatedCounter to={90} duration={1.5} />
                </div>
                <div className="skill-bar-bg">
                  <motion.div className="skill-bar-fill" style={{ width: bar2W }} />
                </div>
              </div>
              
              <div className="strategic-skill-item">
                <div className="skill-label">
                  <span>MOBILITY</span>
                  <AnimatedCounter to={88} duration={1.5} />
                </div>
                <div className="skill-bar-bg">
                  <motion.div className="skill-bar-fill" style={{ width: bar3W }} />
                </div>
              </div>
              
              <div className="strategic-skill-item">
                <div className="skill-label">
                  <span>ENDURANCE</span>
                  <AnimatedCounter to={85} duration={1.5} />
                </div>
                <div className="skill-bar-bg">
                  <motion.div className="skill-bar-fill" style={{ width: bar4W }} />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── MEET THE MASTER COACH ── */}
      <section className="about-coaches-section" id="coaches" ref={coachRef} style={{ position: 'relative' }}>
        
        {/* --- THE BLAST ANIMATION (Now relative to entire section) --- */}
        {/* The Energy Beam (Vertical Dropping Line) */}
        <motion.div 
          style={{
            position: 'absolute',
            top: '0px',
            left: '50%',
            x: '-50%', // perfectly center horizontally
            width: '4px',
            height: dropLineHeight,
            background: 'linear-gradient(to bottom, transparent 0%, var(--color-primary) 100%)', 
            boxShadow: '0 0 15px var(--color-primary)',
            opacity: lineOpacity,
            zIndex: 10,
            borderRadius: '4px'
          }}
        />
        
        {/* The Glowing Tip of the Beam */}
        <motion.div 
          style={{
            position: 'absolute',
            top: dropLineHeight,
            left: '50%',
            width: '10px',
            height: '10px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 20px 8px var(--color-primary)',
            x: "-50%",
            y: "-50%",
            opacity: lineOpacity,
            zIndex: 11
          }}
        />
        
        {/* The Shockwave Blast Ring at 50% height */}
        <motion.div 
          style={{
            position: 'absolute',
            top: '50%', 
            left: '50%', 
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            borderStyle: 'solid',
            borderColor: 'var(--color-primary)',
            borderWidth: blastBorderWidth,
            x: "-50%",
            y: "-50%",
            scale: blastScale,
            opacity: blastOpacity,
            zIndex: 11,
            pointerEvents: 'none'
          }}
        />
        {/* --------------------------- */}

        <div className="single-coach-container">
          <motion.div
            className="single-coach-image-wrap"
            style={{ 
              scale: coachImgScale, 
              opacity: coachImgOpacity,
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden'
            }}
          >
            <Image
              src={masterCoach.image}
              alt={masterCoach.name}
              fill
              style={{ objectFit: "cover", borderRadius: "24px" }}
              priority
            />
            {/* White overlay slide reveal animation */}
            <motion.div 
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: imgOverlayHeight,
                backgroundColor: '#ffffff',
                zIndex: 10
              }}
            />
          </motion.div>
          
          <div className="single-coach-info" style={{ position: 'relative' }}>
            <motion.div style={{ y: coachSubY, opacity: coachSubOpacity, position: 'relative', zIndex: 10 }}>
              <span className="about-section-subtitle">HEAD COACH</span>
            </motion.div>
            
            <motion.div style={{ y: coachTitleY, opacity: coachTitleOpacity, position: 'relative', zIndex: 10 }}>
              <ScrollHeading as="h2" className="about-section-title" once={false} duration={0.8}>
                {masterCoach.name}
              </ScrollHeading>
            </motion.div>
            
            <motion.div style={{ y: coachRoleY, opacity: coachRoleOpacity, position: 'relative', zIndex: 10 }} className="single-coach-role">
              {masterCoach.role}
            </motion.div>
            
            <motion.p style={{ y: coachBioY, opacity: coachBioOpacity, position: 'relative', zIndex: 10 }} className="single-coach-bio">
              {masterCoach.bio}
            </motion.p>
            
            <motion.div style={{ y: coachBtnY, opacity: coachBtnOpacity, position: 'relative', zIndex: 10 }}>
              <Link href="/#contact" className="about-btn-yellow" style={{ marginTop: "2rem" }}>
                <span>Train with Marcus</span>
                <span className="about-btn-icon-circle">
                  <ArrowUpRight size={16} strokeWidth={3} />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE SECTION (Replacing CTA) ── */}
      <section className="about-showcase-section" ref={showcaseRef}>
        <div className="about-showcase-container">
          
          {/* Left Side: Massive Graphic */}
          <div className="about-showcase-graphic">
            <div className="showcase-graphic-top">
              <span className="showcase-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"></path>
                  <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7"></path>
                  <path d="M10 10.5V5a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"></path>
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                </svg>
              </span>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <motion.div className="showcase-line" style={{ maxWidth: lineWidth }} />
                <motion.div className="showcase-dot-0" style={{ scale: dot0Scale }} />
                <motion.div className="showcase-dot-1" style={{ scale: dot1Scale }} />
                <motion.div className="showcase-dot-2" style={{ scale: dot2Scale }} />
              </div>
            </div>
            <motion.div 
              className="showcase-massive-letter"
              style={{ y: wY, opacity: wOpacity, scale: wScale }}
            >
              W
            </motion.div>
          </div>

          {/* Right Side: Typography */}
          <div className="about-showcase-content">
            <motion.div className="showcase-section-no" style={{ y: text1Y, opacity: text1Opacity }}>
              Section No.
            </motion.div>
            
            <motion.div className="showcase-huge-number" style={{ y: numY, opacity: numOpacity }}>
              1
            </motion.div>
            
            <motion.h2 className="showcase-title" style={{ y: titleY, opacity: titleOpacity }}>
              JOIN THE ELITE<br/>AND STRONG
            </motion.h2>
            
            <motion.p className="showcase-desc" style={{ y: descY, opacity: descOpacity }}>
              With our brand we wanted to achieve a bold, dark and high-performance look & feel. We use core fitness principles, expert coaching, and a driven community to push your limits. The whole experience is built especially around your growth.
            </motion.p>
          </div>

        </div>
      </section>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
