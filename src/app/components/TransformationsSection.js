"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import "./transformations.css";

const allImages = [
  { id: 1, src: "/images/transformations/media_1787406769402.png", title: "Incredible Weight Loss", desc: "A journey of dedication and renewed confidence." },
  { id: 2, src: "/images/transformations/media_1787406794865.jpg", title: "Core Definition", desc: "Unbelievable core definition and fat loss." },
  { id: 3, src: "/images/transformations/media_1787406805013.jpg", title: "Glute Toning", desc: "Lower body transformation and incredible toning." },
  { id: 4, src: "/images/transformations/media_1787406813162.jpg", title: "Massive Arms", desc: "Building serious muscle mass and arm definition." },
  { id: 5, src: "/images/transformations/media_1787406820698.jpg", title: "Absolute Athlete", desc: "From average to absolute athlete with shredded abs." },
  { id: 6, src: "/images/transformations/media_1787406870628.jpg", title: "Upper Body Sculpt", desc: "Packing on massive size and sculpting the chest." },
  { id: 7, src: "/images/transformations/media_1787406877153.jpg", title: "Focused Routine", desc: "Discipline, training, and a dedicated daily routine." },
  { id: 8, src: "/images/transformations/media_1787406884034.jpg", title: "Serious Size", desc: "Gaining incredible muscle mass and width." },
  { id: 9, src: "/images/transformations/media_1787406891092.jpg", title: "Shredded Definition", desc: "Cutting down body fat to reveal pure muscle." },
  { id: 10, src: "/images/transformations/media_1787406902184.jpg", title: "Unreal Progress", desc: "A superhero transformation that defies limits." },
  { id: 11, src: "/images/transformations/media_1787406928664.jpg", title: "Total Recomp", desc: "Dramatic total body recomposition and strength." },
  { id: 12, src: "/images/transformations/media_1787406820698.jpg", title: "Complete Lifestyle", desc: "A complete lifestyle change yielding stunning results." }
];

const WordReveal = ({ text, className, delay = 0, as = "div" }) => {
  const words = text.split(" ");
  const MotionTag = as === "h1" ? motion.h1 : as === "p" ? motion.p : motion.div;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay }
    }
  };

  const child = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <MotionTag
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} style={{ display: "inline-block", marginRight: "0.25em" }}>
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
};

export default function TransformationsSection() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  // Scroll Parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const scrollTranslateY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <div className="transformations-page-wrapper" ref={containerRef}>

      {/* SECTION 1: 3D CURVED CAROUSEL HERO */}
      <section className="curve-hero-section" ref={heroRef}>
        <div className="curve-hero-content">
          <WordReveal
            text="Real Results. Real Transformations."
            className="curve-title"
            as="h1"
          />
          <WordReveal
            text="Don't just take our word for it. See how World Fitness Zone has helped everyday people achieve extraordinary results through personalized coaching."
            className="curve-subtitle"
            delay={0.2}
            as="p"
          />
          <motion.button
            className="curve-btn"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "0px" }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          >
            Claim Your FREE Training Session &rarr;
          </motion.button>
        </div>

        {/* 3D Auto-Spin & Floating Gallery */}
        <div className="curve-gallery-3d-stage">
          <motion.div
            className="curve-gallery-image-wrapper"
            style={{
              y: scrollTranslateY
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              x: ["-2%", "2%", "-2%"]
            }}
            transition={{
              opacity: { duration: 0.8, ease: "easeOut" },
              y: { duration: 0.8, ease: "easeOut" },
              x: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Image
              src="/images/transformations/curved_3d_gallery_perfect_1787478538387-Photoroom.png"
              alt="Fitness Transformations 3D Curved Gallery"
              width={2600}
              height={1300}
              priority
              unoptimized
              className="curve-gallery-img pan-animation"
            />
          </motion.div>
        </div>


      </section>

      {/* SECTION 2: AGENCY GRID */}
      <section className="agency-grid-section">
        {/* Header row */}
        <div className="agency-header-row">
          <motion.p
            className="agency-subtext-left"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            We build real strength <br className="arch-desktop-br" />and discipline. <br className="arch-desktop-br" />No excuses.
          </motion.p>
          <motion.h1
            className="agency-big-title"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Real Results <br className="arch-desktop-br" /><span>/ No Excuses</span>
          </motion.h1>
          <motion.p
            className="agency-subtext-right"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            London Based <br className="arch-desktop-br" />Training
          </motion.p>
        </div>

        {/* Grid container */}
        <div className="agency-masonry-container">
          {/* Left Column */}
          <div className="agency-col agency-col-left">
            <motion.div
              className="agency-img-wrapper img-1"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Image src={allImages[0].src} fill alt="Fat Loss Transformation" className="agency-img" />
            </motion.div>

            <WordReveal
              className="agency-floating-text-left"
              text="Whether you are hitting the gym for the first time or stuck on a plateau, we provide the exact training and nutrition protocols you need to grow. No generic advice, just The Blueprints."
              delay={0}
            />

            <motion.div
              className="agency-img-wrapper img-3"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <Image src={allImages[1].src} fill alt="Muscle Gain" className="agency-img" />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="agency-col agency-col-right">
            <motion.div
              className="agency-img-wrapper img-2"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Image src={allImages[2].src} fill alt="Body Recomposition" className="agency-img" />
            </motion.div>

            <motion.div
              className="agency-floating-list-right"
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="list-item"><span>Fat Loss</span> <sup>01</sup></div>
              <div className="list-item active"><span>&rarr; Hypertrophy</span> <sup>02</sup></div>
              <div className="list-item"><span>Recomposition</span> <sup>03</sup></div>
            </motion.div>

            <motion.div
              className="agency-img-wrapper img-4"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <Image src={allImages[3].src} fill alt="Strength" className="agency-img" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPERTISE */}
      <section className="agency-expertise-section">
        <motion.h2
          className="expertise-big-title"
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Elite Expertise
        </motion.h2>
        <div className="expertise-content-row">
          <motion.div
            className="expertise-img-wrapper"
            initial={{ opacity: 0, y: 120, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image src={allImages[4].src} fill alt="Expertise" className="expertise-img" style={{ objectPosition: "right center" }} />
          </motion.div>

          <motion.div
            className="expertise-text-wrapper"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <WordReveal
              text="A physique is built on consistency. We strip away the guesswork with direct coaching, heavy lifting, and nutrition plans that actually work for your daily routine."
            />
            <div className="vertical-line"></div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: AGENCY GRID 2 (Images 5-8) */}
      <section className="agency-grid-section">
        {/* Header row */}
        <div className="agency-header-row">
          <motion.p
            className="agency-subtext-left"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Strength, performance, <br className="arch-desktop-br" />and dedicated <br className="arch-desktop-br" />training.
          </motion.p>
          <motion.h1
            className="agency-big-title"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Uncompromising <br className="arch-desktop-br" /><span>/ Standards</span>
          </motion.h1>
          <motion.p
            className="agency-subtext-right"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            London Based <br className="arch-desktop-br" />Coaching
          </motion.p>
        </div>

        {/* Grid container */}
        <div className="agency-masonry-container">
          {/* Left Column */}
          <div className="agency-col agency-col-left">
            <motion.div
              className="agency-img-wrapper img-1"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Image src={allImages[5].src} fill alt="Transformation" className="agency-img" />
            </motion.div>

            <WordReveal
              className="agency-floating-text-left"
              text="We don't do cookie-cutter workouts. If you want serious size and definition, you need a plan that forces you to adapt and progress every single session."
              delay={0}
            />

            <motion.div
              className="agency-img-wrapper img-3"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <Image src={allImages[6].src} fill alt="Transformation" className="agency-img" />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="agency-col agency-col-right">
            <motion.div
              className="agency-img-wrapper img-2"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Image src={allImages[7].src} fill alt="Transformation" className="agency-img" />
            </motion.div>

            <motion.div
              className="agency-floating-list-right"
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="list-item"><span>Strength</span> <sup>04</sup></div>
              <div className="list-item active"><span>&rarr; Nutrition</span> <sup>05</sup></div>
              <div className="list-item"><span>Mindset</span> <sup>06</sup></div>
            </motion.div>

            <motion.div
              className="agency-img-wrapper img-4"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <Image src={allImages[8].src} fill alt="Transformation" className="agency-img" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: EXPERTISE 2 (Image 9) */}
      <section className="agency-expertise-section" style={{ paddingTop: "0" }}>
        <motion.h2
          className="expertise-big-title"
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Absolute <br className="arch-desktop-br" />Discipline
        </motion.h2>
        <div className="expertise-content-row expertise-row-reverse">
          <motion.div
            className="expertise-img-wrapper"
            initial={{ opacity: 0, y: 120, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image src={allImages[9].src} fill alt="Standards" className="expertise-img" style={{ objectPosition: "right center" }} />
          </motion.div>

          <motion.div
            className="expertise-text-wrapper"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <WordReveal
              text="Real transformations require more than just showing up. We demand focus, proper fueling, and the willingness to push past your mental limits."
            />
            <div className="vertical-line"></div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: AGENCY GRID 3 (Images 10-11) */}
      <section className="agency-grid-section">
        {/* Header row */}
        <div className="agency-header-row">
          <motion.p
            className="agency-subtext-left"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            A physique built <br className="arch-desktop-br" />to last.
          </motion.p>
          <motion.h1
            className="agency-big-title"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Proven <br className="arch-desktop-br" /><span>/ Results</span>
          </motion.h1>
          <motion.p
            className="agency-subtext-right"
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Total <br className="arch-desktop-br" />Recomposition
          </motion.p>
        </div>

        {/* Grid container */}
        <div className="agency-masonry-container">
          {/* Left Column */}
          <div className="agency-col agency-col-left">
            <motion.div
              className="agency-img-wrapper img-3"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Image src={allImages[10].src} fill alt="Transformation" className="agency-img" />
            </motion.div>

            <WordReveal
              className="agency-floating-text-left"
              text="Fitness isn't a temporary fix. We build resilient habits so you stay in peak condition long after the initial transformation is over."
              delay={0}
            />
          </div>

          {/* Right Column */}
          <div className="agency-col agency-col-right">
            <motion.div
              className="agency-img-wrapper img-2"
              initial={{ opacity: 0, y: 250, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Image 
                src={allImages[11].src} 
                fill 
                alt="Transformation" 
                className="agency-img" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CLIENT TESTIMONIAL SHOWCASE */}
      <section className="testimonial-section">
        <div className="testimonial-container">
          <motion.div
            className="testimonial-image-wrapper"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/images/transformations/media_1787406935260.png"
              alt="Fat Loss Transformation"
              width={1024}
              height={655}
              className="testimonial-img"
            />
          </motion.div>

          <motion.div
            className="testimonial-content"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <p className="testimonial-goal">12-Week Fat Loss & Conditioning</p>
            <h2 className="testimonial-result">Lost 15 lbs and gained incredible core strength.</h2>
            <blockquote className="testimonial-quote">
              "Andy's training sessions completely changed my approach to fitness. The free advice and guided sessions pushed me past my limits safely!"
            </blockquote>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
