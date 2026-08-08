"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "STRENGTH TRAINING",
    description: "Build real strength with structured training designed around your body, goals, and performance.",
    tags: ["PROGRAM", "COACHING", "STRENGTH"],
  },
  {
    number: "02",
    title: "PERSONAL COACHING",
    description: "Get expert guidance, accountability, and a training system built specifically for your transformation.",
    tags: ["1-ON-1", "COACHING", "RESULTS"],
  },
  {
    number: "03",
    title: "NUTRITION",
    description: "Fuel your training with practical nutrition strategies that support performance and sustainable results.",
    tags: ["NUTRITION", "PERFORMANCE", "LIFESTYLE"],
  },
  {
    number: "04",
    title: "TOTAL TRANSFORMATION",
    description: "Combine training, nutrition, and accountability into one complete system built to change how you look and perform.",
    tags: ["FITNESS", "MINDSET", "RESULTS"],
  }
];

export default function WhatWeDoSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const bgTextRef = useRef(null);
  const whatRef = useRef(null);
  const weRef = useRef(null);
  const doRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Set initial card states (all offscreen at the bottom)
    cardsRef.current.forEach((card, index) => {
      gsap.set(card, {
        y: window.innerHeight, // Start way below the screen
        scale: 1,
        rotate: 0,
        zIndex: index + 1 // Cards coming later will overlap on top!
      });
    });

    // Set WE and DO to be invisible initially
    gsap.set([weRef.current, doRef.current], { opacity: 0, y: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=500%", // 500vh of scrolling for the whole sequence
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    // Extremely robust fix for Next.js layout shifts:
    // Watch the body for any height changes (like images loading late) and refresh GSAP
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    // 1. "WE" slides in
    tl.to(weRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    });

    // 2. "DO" slides in
    tl.to(doRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    });

    // Blur bg text as the first card comes up
    tl.to(bgTextRef.current, {
      filter: "blur(12px)",
      duration: 1,
      ease: "power2.out"
    }, "+=0.5");

    // 3. Card 1 comes up
    tl.to(cardsRef.current[0], {
      y: 0,
      duration: 1.5,
      ease: "power3.out"
    }, "<"); // starts slightly before or during blur

    // 4. Stacking subsequent cards
    const totalCards = cardsRef.current.length;
    for (let i = 1; i < totalCards; i++) {
      const currentCard = cardsRef.current[i];

      // Animate all previous cards to scale down and move up slightly to create depth
      for (let j = 0; j < i; j++) {
        const prevCard = cardsRef.current[j];
        tl.to(prevCard, {
          scale: 1 - ((i - j) * 0.04), // 0.96, 0.92, etc.
          y: -((i - j) * 30), // move up by 30px, 60px
          // REMOVED filter: brightness() as it causes massive layout/paint lag on scroll!
          duration: 1.5,
          ease: "power3.out"
        }, `card${i}`); // sync with current card entrance
      }

      // Animate the new card sliding in from the bottom
      tl.to(currentCard, {
        y: 0,
        rotate: (i % 2 === 0 ? 2 : -2), // Slight alternating rotation for realism
        duration: 1.5,
        ease: "power3.out"
      }, `card${i}`);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, { scope: sectionRef });

  return (
    <section className="wwd-section" ref={sectionRef}>
      <div className="wwd-bg-layer" ref={bgTextRef}>
        <div className="wwd-bg-top" ref={whatRef}>WHAT</div>
        <div className="wwd-bg-middle">
          <div className="wwd-bg-content">
            <p>Vision is nothing without execution. We build the training, nutrition, and systems that get real results made.</p>
            <button className="wwd-bg-btn">OUR SERVICES ↗</button>
          </div>
          <div className="wwd-bg-bottom">
            <span ref={weRef} style={{ display: 'inline-block', marginRight: '3rem' }}>WE</span>
            <span ref={doRef} style={{ display: 'inline-block' }}>DO</span>
          </div>
        </div>
      </div>

      <div className="wwd-stack">
        {services.map((service, index) => (
          <div
            className="wwd-card"
            key={index}
            ref={el => cardsRef.current[index] = el}
          >
            <div className="wwd-card-header">
              <span className="wwd-card-number">{service.number}</span>
              <div className="wwd-accent-line"></div>
            </div>

            <div className="wwd-card-body">
              <h3 className="wwd-card-title">
                {service.title.split(' ').map((word, i) => (
                  <span key={i} style={{ display: 'block' }}>{word}</span>
                ))}
              </h3>
              <p className="wwd-card-desc">{service.description}</p>
            </div>

            <div className="wwd-card-footer">
              <div className="wwd-tags">
                {service.tags.map(tag => (
                  <span className="wwd-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <span className="wwd-card-large-num">{service.number}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
