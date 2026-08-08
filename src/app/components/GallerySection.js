"use client";

import { useRef } from "react";
import Image from "next/image";
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
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
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

      // Entrance animations
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

      const t2 = gsap.fromTo(".gallery-card", {
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

    // Cleanup: kill timeout + all triggers BEFORE React unmounts DOM
    return () => {
      clearTimeout(timeoutId);
      triggers.forEach(t => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === containerRef.current) st.kill();
      });
    };
  }, { scope: containerRef });

  const cards = [
    { id: "01", title: "Strength", src: img1 },
    { id: "02", title: "Condition", src: img2 },
    { id: "03", title: "Power", src: img3 },
    { id: "04", title: "Agility", src: img4 },
  ];

  return (
    <>
    <GalleryIntro />
    <section className="gallery-section" ref={containerRef}>
      <div className="gallery-layout">
        
        {/* Fixed Left Section */}
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

        {/* Scrolling Right Section */}
        <div className="gallery-right">
          <div className="gallery-track" ref={trackRef}>
            {cards.map((card, index) => (
              <div 
                className="gallery-card" 
                key={card.id}
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
            
            {/* The End Text */}
            <div className="gallery-end">
              End
            </div>
          </div>
        </div>

      </div>
    </section>

    {/* Dumbbell animation is now separate in page.js */}
    </>
  );
}
