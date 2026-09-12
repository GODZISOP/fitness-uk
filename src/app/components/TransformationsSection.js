"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Calendar, Utensils, Award, Sparkles, CheckCircle2, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import "./transformations.css";

const allImages = [
  { 
    id: 1, 
    src: "/images/transformations/media_1787406769402.png", 
    timeframe: "16 WEEKS", 
    tag: "Total Body Rebuild", 
    title: "16 Weeks: Extreme Fat Loss", 
    desc: "Lost 55+ lbs and 4 dress sizes through structured whole-food nutrition." 
  },
  { 
    id: 2, 
    src: "/images/transformations/media_1787406794865.jpg", 
    timeframe: "30 DAYS", 
    tag: "Meal Plan Shred", 
    title: "30 Days: Chiseled Six-Pack", 
    desc: "Precision meal plan stripped lower belly fat revealing deep 6-pack cuts." 
  },
  { 
    id: 3, 
    src: "/images/transformations/media_1787406805013.jpg", 
    timeframe: "6 WEEKS", 
    tag: "Glute & Lower Body", 
    title: "6 Weeks: Glute Sculpt & Tone", 
    desc: "Eliminated stubborn cellulite, lifting and firming glutes in just 6 weeks." 
  },
  { 
    id: 4, 
    src: "/images/transformations/media_1787406813162.jpg", 
    timeframe: "12 WEEKS", 
    tag: "Discipline & Hypertrophy", 
    title: "12 Weeks: Boulder Delts & Arms", 
    desc: "Added 2 inches to arms and packed on dense muscle with zero fluff." 
  },
  { 
    id: 5, 
    src: "/images/transformations/media_1787406820698.jpg", 
    timeframe: "14 WEEKS", 
    tag: "Total Recomposition", 
    title: "14 Weeks: Extreme Recomp", 
    desc: "Dropped 28 lbs of visceral fat while carving competition-level vascularity." 
  },
  { 
    id: 6, 
    src: "/images/transformations/media_1787406870628.jpg", 
    timeframe: "12 WEEKS", 
    tag: "Mass & Shoulder Density", 
    title: "12 Weeks: Narrow to Broad", 
    desc: "Overcame fast metabolism with structured surplus to build a wide frame." 
  },
  { 
    id: 7, 
    src: "/images/transformations/media_1787406877153.jpg", 
    timeframe: "365 DAYS", 
    tag: "Coaching Discipline", 
    title: "Form Mastery & Execution", 
    desc: "Every rep calibrated for maximal fiber recruitment and injury prevention." 
  },
  { 
    id: 8, 
    src: "/images/transformations/media_1787406884034.jpg", 
    timeframe: "30 DAYS", 
    tag: "Rapid Meal Cut", 
    title: "30 Days: Razor Oblique Shred", 
    desc: "Sub-9% body fat reached in 30 days of custom nutrition with zero hunger." 
  },
  { 
    id: 9, 
    src: "/images/transformations/media_1787406891092.jpg", 
    timeframe: "8 WEEKS", 
    tag: "Phase Progression", 
    title: "8 Weeks: Bulk to V-Taper Cut", 
    desc: "Phased periodization transitioning mass into razor-sharp dry cuts." 
  },
  { 
    id: 10, 
    src: "/images/transformations/media_1787406902184.jpg", 
    timeframe: "10 WEEKS", 
    tag: "Superhero Conditioning", 
    title: "10 Weeks: Sub-7% Wolverine Cut", 
    desc: "Extreme athletic conditioning and vascularity pushed to peak limits." 
  },
  { 
    id: 11, 
    src: "/images/transformations/media_1787406928664.jpg", 
    timeframe: "8 WEEKS", 
    tag: "Female Recomposition", 
    title: "8 Weeks: Waist Cinch & Toning", 
    desc: "Lost 16 lbs, toned quads, and gained explosive daily energy." 
  },
  { 
    id: 12, 
    src: "/images/transformations/media_1787406820698.jpg", 
    timeframe: "12 WEEKS", 
    tag: "Lifestyle Mastery", 
    title: "12 Weeks: Permanent Condition", 
    desc: "Discipline turned into an effortless, year-round athletic standard." 
  }
];

const clientTestimonials = [
  {
    id: "marcus",
    name: "Marcus T.",
    tag: "Lost 18 lbs • Six-Pack",
    src: "/images/transformations/media_1787406935260.png",
    goal: "12 WEEKS OF DISCIPLINE & 30-DAY MEAL PLAN",
    result: (
      <>
        <span className="hl-yellow">Lost 18 lbs</span>, carved <span className="hl-blue">rock-solid abs</span>, and never felt hungry.
      </>
    ),
    quote: (
      <>
        &ldquo;Coach James told me: &apos;You want change, you&apos;re gonna have to make sacrifices... <span className="hl-quote">12 weeks of discipline, 12 weeks of eating healthy</span>. And you&apos;ll see results like this. By the way, if you follow my meal plan, <span className="hl-quote">you&apos;ll never be hungry!</span>&apos; Every single word came true!&rdquo;
      </>
    ),
    clientInfo: "Marcus T. • Verified Client • London, UK"
  },
  {
    id: "sarah",
    name: "Sarah M.",
    tag: "Lost 55+ lbs • Rebuild",
    src: "/images/transformations/media_1787406769402.png",
    goal: "16 WEEKS OF WHOLE-FOOD NUTRITION & DISCIPLINE",
    result: (
      <>
        <span className="hl-yellow">Lost 55+ lbs</span>, dropped <span className="hl-blue">4 dress sizes</span>, and never felt starved.
      </>
    ),
    quote: (
      <>
        &ldquo;I spent years trapped in crash diets and frustration. Coach James showed me that whole foods fuel real fat loss: <span className="hl-quote">16 weeks of discipline and nutrition</span>, and 55 lbs melted away. I never once went to sleep hungry!&rdquo;
      </>
    ),
    clientInfo: "Sarah M. • Verified Client • London, UK"
  },
  {
    id: "liam",
    name: "Liam K.",
    tag: "30-Day Shred • Obliques",
    src: "/images/transformations/media_1787406794865.jpg",
    goal: "30-DAY MEAL PLAN & LOWER BELLY CUT",
    result: (
      <>
        Stripped <span className="hl-yellow">stubborn belly fat</span>, chiseled <span className="hl-blue">deep 6-pack cuts</span> in 30 days.
      </>
    ),
    quote: (
      <>
        &ldquo;I had trained for 3 years without ever seeing lower abdominal definition. Coach James put me on his <span className="hl-quote">custom 30-day nutrition protocol</span>. In four weeks, stubborn fat melted and razor-sharp cuts came through!&rdquo;
      </>
    ),
    clientInfo: "Liam K. • Verified Client • London, UK"
  },
  {
    id: "jessica",
    name: "Jessica R.",
    tag: "6-Week Tone • Glute Lift",
    src: "/images/transformations/media_1787406805013.jpg",
    goal: "6 WEEKS OF GLUTE SCULPTING & LEAN TONING",
    result: (
      <>
        Eliminated <span className="hl-yellow">stubborn cellulite</span>, sculpted <span className="hl-blue">tight lifted glutes</span> in 6 weeks.
      </>
    ),
    quote: (
      <>
        &ldquo;Coach James taught me how to lift heavy weights with perfect form instead of endless cardio. <span className="hl-quote">In just 6 weeks of dedicated discipline</span>, my lower body tightened, cellulite vanished, and my energy doubled!&rdquo;
      </>
    ),
    clientInfo: "Jessica R. • Verified Client • London, UK"
  },
  {
    id: "daniel",
    name: "Daniel B.",
    tag: "+2\" Arms • Hypertrophy",
    src: "/images/transformations/media_1787406813162.jpg",
    goal: "12 WEEKS OF PROGRESSIVE HYPERTROPHY",
    result: (
      <>
        Added <span className="hl-yellow">2 inches to arms</span>, built <span className="hl-blue">dense boulder shoulders</span> with zero fluff.
      </>
    ),
    quote: (
      <>
        &ldquo;Stuck at a plateau for 18 months until Coach James took over my programming. <span className="hl-quote">12 weeks of eating healthy and heavy overload</span> put thick, dense muscle on my delts and arms without gaining fat!&rdquo;
      </>
    ),
    clientInfo: "Daniel B. • Verified Client • London, UK"
  },
  {
    id: "alex",
    name: "Alex V.",
    tag: "Down 28 lbs • Visceral Cut",
    src: "/images/transformations/media_1787406820698.jpg",
    goal: "14 WEEKS OF TOTAL RECOMPOSITION",
    result: (
      <>
        <span className="hl-yellow">Dropped 28 lbs of visceral fat</span>, unlocked <span className="hl-blue">competition vascularity</span>.
      </>
    ),
    quote: (
      <>
        &ldquo;Coach James held me to the highest standard every week. <span className="hl-quote">14 weeks of strict nutrition and heavy compound lifting</span> took me from soft and bloated to deeply shredded, vascular, and stronger than ever!&rdquo;
      </>
    ),
    clientInfo: "Alex V. • Verified Client • London, UK"
  },
  {
    id: "david",
    name: "David H.",
    tag: "+4\" Shoulders • V-Taper",
    src: "/images/transformations/media_1787406870628.jpg",
    goal: "12 WEEKS OF STRUCTURAL SURPLUS & WIDTH",
    result: (
      <>
        Widened <span className="hl-yellow">shoulders by 4 inches</span>, built <span className="hl-blue">commanding V-taper frame</span>.
      </>
    ),
    quote: (
      <>
        &ldquo;As a lifelong hardgainer, I thought I was stuck being narrow. Coach James engineered a clean surplus nutrition plan: <span className="hl-quote">12 weeks of discipline completely widened my back</span> and delts!&rdquo;
      </>
    ),
    clientInfo: "David H. • Verified Client • London, UK"
  },
  {
    id: "jack",
    name: "Jack W.",
    tag: "Sub-7% • Wolverine Cut",
    src: "/images/transformations/media_1787406902184.jpg",
    goal: "10 WEEKS OF SUPERHERO CONDITIONING",
    result: (
      <>
        Hit <span className="hl-yellow">sub-7% body fat</span>, locked in <span className="hl-blue">stage-ready Wolverine cuts</span>.
      </>
    ),
    quote: (
      <>
        &ldquo;Coach James doesn&apos;t do generic routines. <span className="hl-quote">10 weeks of clean whole foods and high-intensity resistance</span> got me into the leanest, most conditioned shape of my life. Best coaching experience in London!&rdquo;
      </>
    ),
    clientInfo: "Jack W. • Verified Client • London, UK"
  },
  {
    id: "elena",
    name: "Elena P.",
    tag: "Lost 16 lbs • Waist Cinch",
    src: "/images/transformations/media_1787406928664.jpg",
    goal: "8 WEEKS OF FEMALE RECOMPOSITION",
    result: (
      <>
        <span className="hl-yellow">Lost 16 lbs</span>, cinched <span className="hl-blue">3 inches off waist</span>, doubled daily stamina.
      </>
    ),
    quote: (
      <>
        &ldquo;No crash diets, no gimmick workouts. Coach James gave me a delicious, sustainable meal plan and proper strength training. <span className="hl-quote">Lost 16 lbs in 8 weeks</span> and feel unstoppable in everything I wear!&rdquo;
      </>
    ),
    clientInfo: "Elena P. • Verified Client • London, UK"
  }
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
  const [activeModalImage, setActiveModalImage] = useState(null);
  const [activeClientIndex, setActiveClientIndex] = useState(0);

  const activeClient = clientTestimonials[activeClientIndex];

  const handlePrevClient = () => {
    setActiveClientIndex((prev) => (prev === 0 ? clientTestimonials.length - 1 : prev - 1));
  };

  const handleNextClient = () => {
    setActiveClientIndex((prev) => (prev === clientTestimonials.length - 1 ? 0 : prev + 1));
  };

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

      {/* SECTION: COACH MASTERY & PROGRESSION (Right after 3D Gallery Circle) */}
      <section className="mindset-mastery-section">
        {/* Section Header */}
        <div className="mindset-header-box">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mindset-pill-tag"
          >
            <Sparkles size={14} className="mindset-tag-icon" />
            <span>GET HEALTHY &bull; 12 WEEKS OF DISCIPLINE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mindset-main-title"
          >
            &ldquo;YOU WANT CHANGE, <br />
            <span>YOU&apos;RE GONNA HAVE TO MAKE SACRIFICES...&rdquo;</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mindset-lead-desc"
          >
            &ldquo;<strong>12 Weeks Of Discipline. 12 Weeks Of Eating Healthy.</strong> And you&apos;ll see results like this. By the way, <em>if you follow my meal plan you&apos;ll never be hungry!</em>&rdquo; &mdash; <strong>GET HEALTHY. 12 WEEKS OF DISCIPLINE.</strong>
          </motion.p>

          {/* Quick Key Pillars Strip */}
          <motion.div
            className="mindset-pillars-strip"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mindset-pillar-item">
              <div className="pillar-icon-box"><Calendar size={20} /></div>
              <div className="pillar-text">
                <strong>12 Weeks Discipline</strong>
                <span>12 Weeks Of Eating Healthy</span>
              </div>
            </div>

            <div className="mindset-pillar-item">
              <div className="pillar-icon-box"><Utensils size={20} /></div>
              <div className="pillar-text">
                <strong>30-Day Meal Plan</strong>
                <span>Follow It &amp; Never Be Hungry</span>
              </div>
            </div>

            <div className="mindset-pillar-item">
              <div className="pillar-icon-box"><Award size={20} /></div>
              <div className="pillar-text">
                <strong>Get Healthy</strong>
                <span>6+ Years Sustained Proof</span>
              </div>
            </div>

            <div className="mindset-pillar-item">
              <div className="pillar-icon-box"><CheckCircle2 size={20} /></div>
              <div className="pillar-text">
                <strong>Mindset Standard</strong>
                <span>Make Sacrifices &bull; See Results</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2 Featured Showcase Cards */}
        <div className="mindset-cards-grid">
          {/* Card 1: 2014 vs 2020 */}
          <motion.div
            className="mindset-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div 
              className="mindset-card-img-wrapper"
              onClick={() => setActiveModalImage({
                src: "/images/transformations/transformation_2014_2020.jpg",
                title: "2014 vs 2020: 12 Weeks Of Discipline & Sustained Longevity",
                caption: "12 Weeks Of Discipline. 12 Weeks Of Eating Healthy. And You'll See Results Like This. Follow the meal plan and you'll never be hungry!"
              })}
            >
              <Image
                src="/images/transformations/transformation_2014_2020.jpg"
                alt="2014 vs 2020 Long-term Transformation"
                width={800}
                height={800}
                className="mindset-card-img"
              />
              <div className="mindset-img-overlay">
                <span className="mindset-zoom-badge">
                  <Maximize2 size={16} /> Click to Expand Photo
                </span>
              </div>
              <div className="mindset-card-badge">2014 ➔ 2020 PROVEN LONGEVITY</div>
            </div>

            <div className="mindset-card-content">
              <div className="mindset-card-meta">
                <span className="meta-tag">12 Weeks Of Discipline</span>
                <span className="meta-highlight">Permanent Muscle Retention</span>
              </div>

              <h3 className="mindset-card-title">
                2014 vs 2020: 12 Weeks Of Discipline &amp; Eating Healthy
              </h3>

              <p className="mindset-card-text">
                &ldquo;You want change, you&apos;re gonna have to make sacrifices... 12 weeks of discipline, 12 weeks of eating healthy, and you&apos;ll see results like this.&rdquo; Look at the side-by-side: from the 2014 athletic foundation to the 2020 deeply chiseled six-pack, razor obliques, and mature density maintained year-round.
              </p>

              <div className="mindset-card-points">
                <div className="point-item">
                  <CheckCircle2 size={16} className="point-icon" />
                  <div>
                    <strong>12 Weeks Of Discipline:</strong> Progressive overload, heavy compound lifting, and zero excuses.
                  </div>
                </div>
                <div className="point-item">
                  <CheckCircle2 size={16} className="point-icon" />
                  <div>
                    <strong>Follow My Meal Plan, Never Be Hungry:</strong> Nutrient-dense whole foods designed to melt body fat while fueling heavy workouts.
                  </div>
                </div>
                <div className="point-item">
                  <CheckCircle2 size={16} className="point-icon" />
                  <div>
                    <strong>Get Healthy For Life:</strong> A 6-year proven standard of permanent condition with zero yo-yo dieting.
                  </div>
                </div>
              </div>

              <div className="mindset-card-footer">
                <span className="footer-label">Result:</span>
                <span className="footer-value">Chiseled Midsection &bull; Dense Upper Body &bull; 6+ Yrs Maintained</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: 3-Stage Progression (Anything is Possible) */}
          <motion.div
            className="mindset-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <div 
              className="mindset-card-img-wrapper"
              onClick={() => setActiveModalImage({
                src: "/images/transformations/transformation_mindset_possible.jpg",
                title: "Anything Is Possible When You Put Your Mind To It",
                caption: "You Want Change You're Gonna Have To Make Sacrifices. 3 Stages: Mass Foundation, Extreme Shred, and Peak Athletic Condition."
              })}
            >
              <Image
                src="/images/transformations/transformation_mindset_possible.jpg"
                alt="Anything Is Possible When You Put Your Mind To It Transformation"
                width={800}
                height={800}
                className="mindset-card-img"
              />
              <div className="mindset-img-overlay">
                <span className="mindset-zoom-badge">
                  <Maximize2 size={16} /> Click to Expand Photo
                </span>
              </div>
              <div className="mindset-card-badge badge-gold">ANYTHING IS POSSIBLE</div>
            </div>

            <div className="mindset-card-content">
              <div className="mindset-card-meta">
                <span className="meta-tag">3-Stage Blueprint</span>
                <span className="meta-highlight">Make Sacrifices &bull; See Results</span>
              </div>

              <h3 className="mindset-card-title">
                The Complete 3-Phase Transformation Roadmap
              </h3>

              <p className="mindset-card-text">
                &ldquo;Anything is possible when you put your mind to it.&rdquo; This 3-stage progression demonstrates how 12 weeks of discipline and a tailored 30-day meal plan take you from mass bulk to shredded conditioning, and finally into the sustainable athletic peak.
              </p>

              <div className="mindset-card-points">
                <div className="point-item">
                  <CheckCircle2 size={16} className="point-icon" />
                  <div>
                    <strong>Phase 1 (Bulk &amp; Structural Mass):</strong> Imposing muscle foundation built with structured surplus and heavy lifting.
                  </div>
                </div>
                <div className="point-item">
                  <CheckCircle2 size={16} className="point-icon" />
                  <div>
                    <strong>Phase 2 (The 30-Day Shred &amp; Cut):</strong> Precision meal plan cutting visceral fat with zero starvation, revealing dry obliques.
                  </div>
                </div>
                <div className="point-item">
                  <CheckCircle2 size={16} className="point-icon" />
                  <div>
                    <strong>Phase 3 (12 Weeks Of Discipline Standard):</strong> Peak athletic symmetry, functional strength, and 365-day condition.
                  </div>
                </div>
              </div>

              <div className="mindset-card-footer">
                <span className="footer-label">Result:</span>
                <span className="footer-value">Total Physical Mastery &bull; 100% Guaranteed Transformation</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Lightbox Modal */}
        <AnimatePresence>
          {activeModalImage && (
            <motion.div
              className="mindset-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalImage(null)}
            >
              <motion.div
                className="mindset-modal-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="mindset-modal-close"
                  onClick={() => setActiveModalImage(null)}
                  aria-label="Close image modal"
                >
                  <X size={24} />
                </button>

                <div className="mindset-modal-image-box">
                  <Image
                    src={activeModalImage.src}
                    alt={activeModalImage.title}
                    width={1000}
                    height={1000}
                    className="mindset-modal-img"
                  />
                </div>

                <div className="mindset-modal-info">
                  <h4>{activeModalImage.title}</h4>
                  <p>{activeModalImage.caption}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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

            <div className="agency-client-story">
              <p className="story-goal">16 WEEKS OF WHOLE-FOOD NUTRITION &amp; DISCIPLINE</p>
              <h3 className="story-result">
                <span className="hl-yellow">Lost 55+ lbs</span>, dropped <span className="hl-blue">4 dress sizes</span>, and never felt starved.
              </h3>
              <blockquote className="story-quote">
                &ldquo;I spent years trapped in crash diets. Coach James showed me real food fuels fat loss: <span className="hl-quote">16 weeks of discipline and whole foods</span>, and 55 lbs melted away with zero hunger!&rdquo;
              </blockquote>
              <div className="story-client-byline">
                <CheckCircle2 size={15} /> Sarah M. &bull; Verified Client Transformation
              </div>
            </div>

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
              <div className="list-item"><span>30-Day Meal Plan</span> <sup>01</sup></div>
              <div className="list-item active"><span>&rarr; 12 Weeks Discipline</span> <sup>02</sup></div>
              <div className="list-item"><span>Get Healthy & Recomp</span> <sup>03</sup></div>
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
            <div className="agency-client-story">
              <p className="story-goal">14 WEEKS OF TOTAL RECOMPOSITION</p>
              <h3 className="story-result">
                <span className="hl-yellow">Dropped 28 lbs of visceral fat</span>, unlocked <span className="hl-blue">competition vascularity</span>.
              </h3>
              <blockquote className="story-quote">
                &ldquo;Coach James held me accountable every week. <span className="hl-quote">14 weeks of strict nutrition and heavy compound lifting</span> took me from bloated to shredded and deeply vascular!&rdquo;
              </blockquote>
              <div className="story-client-byline">
                <CheckCircle2 size={15} /> Alex V. &bull; Verified Client Transformation
              </div>
            </div>
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

            <div className="agency-client-story">
              <p className="story-goal">12 WEEKS OF STRUCTURAL SURPLUS &amp; WIDTH</p>
              <h3 className="story-result">
                Widened <span className="hl-yellow">shoulders by 4 inches</span>, built <span className="hl-blue">commanding V-taper frame</span>.
              </h3>
              <blockquote className="story-quote">
                &ldquo;As a lifelong hardgainer, I thought I was stuck. Coach James engineered a clean surplus nutrition plan: <span className="hl-quote">12 weeks of discipline completely widened my back</span> and delts!&rdquo;
              </blockquote>
              <div className="story-client-byline">
                <CheckCircle2 size={15} /> David H. &bull; Verified Client Transformation
              </div>
            </div>

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
              <div className="list-item"><span>30-Day Shred</span> <sup>04</sup></div>
              <div className="list-item active"><span>&rarr; 12-Week Strength</span> <sup>05</sup></div>
              <div className="list-item"><span>Discipline & Mindset</span> <sup>06</sup></div>
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
            <div className="agency-client-story">
              <p className="story-goal">10 WEEKS OF SUPERHERO CONDITIONING</p>
              <h3 className="story-result">
                Hit <span className="hl-yellow">sub-7% body fat</span>, locked in <span className="hl-blue">stage-ready Wolverine cuts</span>.
              </h3>
              <blockquote className="story-quote">
                &ldquo;Coach James&apos;s standard is pure excellence. <span className="hl-quote">10 weeks of clean whole foods and high-intensity resistance</span> got me into the leanest, most conditioned shape of my life!&rdquo;
              </blockquote>
              <div className="story-client-byline">
                <CheckCircle2 size={15} /> Jack W. &bull; Verified Client Transformation
              </div>
            </div>
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

            <div className="agency-client-story">
              <p className="story-goal">8 WEEKS OF FEMALE RECOMPOSITION</p>
              <h3 className="story-result">
                <span className="hl-yellow">Lost 16 lbs</span>, cinched <span className="hl-blue">3 inches off waist</span>, doubled daily stamina.
              </h3>
              <blockquote className="story-quote">
                &ldquo;No crash diets, no gimmick workouts. Coach James gave me a delicious, sustainable meal plan and proper strength training. <span className="hl-quote">Lost 16 lbs in 8 weeks</span> and feel unstoppable!&rdquo;
              </blockquote>
              <div className="story-client-byline">
                <CheckCircle2 size={15} /> Elena P. &bull; Verified Client Transformation
              </div>
            </div>
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
        {/* Navigation / Client Switcher Header */}
        <div className="testimonial-header-bar">
          <div className="testimonial-top-row">
            <div className="testimonial-section-tag">
              <Sparkles size={14} />
              <span>REAL CLIENT TRANSFORMATIONS &bull; VERIFIED REVIEWS</span>
            </div>

            <div className="testimonial-nav-arrows">
              <button 
                className="testimonial-nav-btn"
                onClick={handlePrevClient}
                aria-label="Previous client testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="testimonial-count">
                {String(activeClientIndex + 1).padStart(2, "0")} / {String(clientTestimonials.length).padStart(2, "0")}
              </span>
              <button 
                className="testimonial-nav-btn"
                onClick={handleNextClient}
                aria-label="Next client testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Client Selection Tabs */}
          <div className="testimonial-tabs-scroll">
            {clientTestimonials.map((item, idx) => (
              <button
                key={item.id}
                className={`testimonial-tab-pill ${idx === activeClientIndex ? "active" : ""}`}
                onClick={() => setActiveClientIndex(idx)}
              >
                <span>{item.name}</span>
                <span className="tab-pill-badge">{item.tag.split("•")[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Client Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeClient.id}
            className="testimonial-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="testimonial-image-wrapper">
              <Image
                src={activeClient.src}
                alt={`${activeClient.name} Transformation`}
                width={1024}
                height={655}
                className="testimonial-img"
                priority
              />
            </div>

            <div className="testimonial-content">
              <p className="testimonial-goal">{activeClient.goal}</p>
              <h2 className="testimonial-result">{activeClient.result}</h2>
              <blockquote className="testimonial-quote">
                {activeClient.quote}
              </blockquote>
              <div className="testimonial-byline">
                <CheckCircle2 size={16} />
                <span>{activeClient.clientInfo}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

    </div>
  );
}
