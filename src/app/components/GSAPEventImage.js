"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GSAPEventImage({ 
  src, 
  alt, 
  badgeText, 
  badgeClass,
  isLeft = false,
  className = "large"
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current || !imageRef.current) return;

    // Timeline for 60FPS GPU Hardware Accelerated Entrance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });

    // 1. Container Reveal
    tl.fromTo(containerRef.current, 
      { 
        y: 40,
        opacity: 0
      },
      { 
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        force3D: true,
      }
    );

    // 2. Parallax Zoom-out reveal inside image
    tl.fromTo(imageRef.current,
      { scale: 1.12, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.out', force3D: true },
      '<0.05'
    );

    // 3. Staggered Badge Entrance
    if (badgeRef.current) {
      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.5'
      );
    }
  }, { scope: containerRef });

  // Lightweight 60FPS GSAP Micro Hover
  const handleMouseEnter = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      scale: 1.05,
      y: -6,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  return (
    <div
      ref={containerRef}
      className={`split-image-wrapper ${className} gsap-image-container relative overflow-hidden rounded-2xl`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '520px',
        willChange: 'transform, clip-path, opacity',
        transform: 'translateZ(0)',
      }}
    >
      <div 
        ref={imageRef} 
        style={{ width: '100%', height: '100%', minHeight: '520px', position: 'relative', willChange: 'transform' }}
      >
        <Image 
          src={src} 
          alt={alt} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="split-image" 
          priority 
        />
      </div>

      {badgeText && (
        <div 
          ref={badgeRef} 
          className={`events-badge ${badgeClass}`}
        >
          {badgeText}
        </div>
      )}
    </div>
  );
}
