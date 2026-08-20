"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import "./about.css";

// Project assets
import runnerCharacterImg from "../image copy 10.png";
import showcaseAthleteImg from "../zjBzVg-Photoroom.png";
import coachImg1 from "../image copy.png";
import coachImg2 from "../image copy 2.png";
import coachImg3 from "../image copy 4.png";
import newCoachStrength from "../coach_strength.jpg";
import newCoachMobility from "../coach_mobility.jpg";
import newCoachPortrait from "../coach_portrait.jpg";

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

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

      {/* Floating Back Navigation */}
      <div className="about-top-bar">
        <Link href="/" className="about-back-btn" aria-label="Back to home">
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>Home</span>
        </Link>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="about-hero-section">
        {/* Hero Top Content Row: Left Typography & Right Character */}
        <div className="about-hero-content-row">
          {/* Hero Title & Actions */}
          <motion.div
            className="about-hero-main"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="about-hero-tag"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <span className="about-hero-tag-dot" />
              <span>World Fitness Zone Philosophy</span>
            </motion.div>

            <ScrollHeading
              as="h1"
              className="about-hero-title"
              once={false}
              duration={0.95}
              stagger={0.22}
            >
              {[
                <span key="h1" className="title-line">Be healthier.</span>,
                <span key="h2" className="title-line">Be stronger.</span>,
                <span key="h3" className="title-line highlight-line">Be confident.</span>
              ]}
            </ScrollHeading>

            <motion.div
              className="about-hero-actions"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
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
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
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
                    <span
                      key={i}
                      style={{
                        width: i === quoteIndex ? "16px" : "6px",
                        height: "4px",
                        backgroundColor: i === quoteIndex ? "var(--color-action-yellow)" : "rgba(255,255,255,0.3)",
                        borderRadius: "4px",
                        transition: "all 0.3s ease"
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
              <ScrollHeading as="h3" className="bento-yellow-title" once={false} duration={0.7}>
                Get 14 days for free
              </ScrollHeading>
              <p className="bento-yellow-desc">Just give us a call or message us in the chat</p>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* ── STRATEGIC IMPACT LAYOUT (Replacing Pushing the Limits) ── */}
      <section className="strategic-impact-section" id="story">
        <div className="strategic-container">
          
          {/* Top Row: 3 Highlight Cards */}
          <div className="strategic-cards-row">
            {/* Card 1 */}
            <motion.div className="strategic-card" initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:false, amount:0.2}}>
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
            <motion.div className="strategic-card" initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:false, amount:0.2}} transition={{delay: 0.1}}>
              <div className="strategic-card-image">
                <Image src={newCoachMobility} alt="Elite Mobility" fill style={{objectFit:"cover"}} />
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
            <motion.div className="strategic-card" initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:false, amount:0.2}} transition={{delay: 0.2}}>
              <div className="strategic-card-image">
                <Image src={newCoachPortrait} alt="Nutrition Lab" fill style={{objectFit:"cover"}} />
                <div className="strategic-yellow-block"></div>
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
            <motion.div className="strategic-col-services" initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}} viewport={{once:false, amount:0.2}}>
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
            <motion.div className="strategic-col-center" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:false, amount:0.2}} transition={{delay: 0.1}}>
              <ScrollHeading as="h2" className="strategic-main-title" once={false} duration={0.8}>
                SCIENCE-BACKED COACHING.<br/>
                <span className="text-yellow-highlight">MEASURABLE RESULTS.</span>
              </ScrollHeading>
              <p className="strategic-desc">
                We design elite training programs that combine explosive strength training with tailored nutrition. We don&apos;t just build muscle; we build resilient athletes and drive peak human performance.
              </p>
            </motion.div>

            {/* Col 3: Skills / Metrics */}
            <motion.div className="strategic-col-skills" initial={{opacity:0, x:20}} whileInView={{opacity:1, x:0}} viewport={{once:false, amount:0.2}} transition={{delay: 0.2}}>
              <h4 className="strategic-col-title">CORE METRICS</h4>
              
              <div className="strategic-skill-item">
                <div className="skill-label">
                  <span>STRENGTH GAINS</span>
                  <span>95%</span>
                </div>
                <div className="skill-bar-bg">
                  <motion.div 
                    className="skill-bar-fill" 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "95%" }} 
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  />
                </div>
              </div>
              
              <div className="strategic-skill-item">
                <div className="skill-label">
                  <span>FAT LOSS</span>
                  <span>90%</span>
                </div>
                <div className="skill-bar-bg">
                  <motion.div 
                    className="skill-bar-fill" 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "90%" }} 
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                  />
                </div>
              </div>
              
              <div className="strategic-skill-item">
                <div className="skill-label">
                  <span>MOBILITY</span>
                  <span>88%</span>
                </div>
                <div className="skill-bar-bg">
                  <motion.div 
                    className="skill-bar-fill" 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "88%" }} 
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="strategic-skill-item">
                <div className="skill-label">
                  <span>ENDURANCE</span>
                  <span>85%</span>
                </div>
                <div className="skill-bar-bg">
                  <motion.div 
                    className="skill-bar-fill" 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "85%" }} 
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── MEET THE MASTER COACH ── */}
      <section className="about-coaches-section" id="coaches">
        <div className="single-coach-container">
          <motion.div
            className="single-coach-image-wrap"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={masterCoach.image}
              alt={masterCoach.name}
              fill
              style={{ objectFit: "cover", borderRadius: "24px" }}
              priority
            />
          </motion.div>
          
          <motion.div
            className="single-coach-info"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            <span className="about-section-subtitle">HEAD COACH</span>
            <ScrollHeading as="h2" className="about-section-title" once={false} duration={0.8}>
              {masterCoach.name}
            </ScrollHeading>
            <div className="single-coach-role">{masterCoach.role}</div>
            <p className="single-coach-bio">{masterCoach.bio}</p>
            
            <Link href="/#contact" className="about-btn-yellow" style={{ marginTop: "2rem" }}>
              <span>Train with Marcus</span>
              <span className="about-btn-icon-circle">
                <ArrowUpRight size={16} strokeWidth={3} />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── HIGH-CONVERTING CTA BANNER ── */}
      <section className="about-cta-section">
        <motion.div
          className="about-cta-banner"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="about-cta-content">
            <ScrollHeading as="h2" className="about-cta-heading" once={false} duration={0.95} stagger={0.22}>
              {[
                <span key="c1">Ready to build the</span>,
                <span key="c2"><span>strongest version</span> of yourself?</span>
              ]}
            </ScrollHeading>
            <motion.p
              className="about-cta-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join World Fitness Zone today with no lock-in contract. Experience our high-performance facility and coaching risk-free with a complimentary 14-day pass.
            </motion.p>
          </div>

          <div className="about-cta-buttons">
            <Link href="/#contact" className="about-btn-yellow" style={{ textAlign: "center", justifyContent: "center" }}>
              <span>Claim 14 Days Free</span>
              <span className="about-btn-icon-circle">
                <ArrowUpRight size={16} strokeWidth={3} />
              </span>
            </Link>
            <Link href="/#programs" className="about-btn-soft" style={{ textAlign: "center", justifyContent: "center" }}>
              <span>View Programs</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
