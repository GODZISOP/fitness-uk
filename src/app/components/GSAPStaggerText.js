"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export default function GSAPStaggerText({ 
  children, 
  divideBy = 'word', 
  delay = 0, 
  className = '', 
  style = {} 
}) {
  const textRef = useRef(null);
  const text = typeof children === 'string' ? children : '';
  if (!text) return children;

  const words = text.split(' ');

  useGSAP(() => {
    if (!textRef.current) return;

    const units = textRef.current.querySelectorAll('.gsap-text-unit');
    if (!units || units.length === 0) return;

    gsap.fromTo(units,
      { 
        opacity: 0, 
        y: 20, 
        rotateX: 25,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.6,
        stagger: divideBy === 'letter' ? 0.02 : 0.04,
        delay: delay,
        ease: 'power3.out',
        force3D: true,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 98%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        }
      }
    );
  }, { scope: textRef });

  return (
    <span
      ref={textRef}
      className={`gsap-text-wrapper ${className}`}
      style={{ display: 'inline', perspective: '1000px', ...style }}
    >
      {words.map((word, wIdx) => (
        <span
          key={wIdx}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {divideBy === 'letter' ? (
            word.split('').map((char, cIdx) => (
              <span
                key={cIdx}
                className="gsap-text-unit"
                style={{ display: 'inline-block', willChange: 'transform, opacity' }}
              >
                {char}
              </span>
            ))
          ) : (
            <span
              className="gsap-text-unit"
              style={{ display: 'inline-block', willChange: 'transform, opacity' }}
            >
              {word}
            </span>
          )}
          {wIdx < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  );
}
