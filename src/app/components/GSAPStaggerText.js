"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
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

  const items = divideBy === 'letter' ? text.split('') : text.split(' ');

  useGSAP(() => {
    if (!textRef.current) return;

    const spanElements = textRef.current.querySelectorAll('.gsap-text-unit');
    if (!spanElements || spanElements.length === 0) return;

    gsap.fromTo(spanElements,
      { 
        opacity: 0, 
        y: 35, 
        rotateX: 40,
        scale: 0.92,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.75,
        stagger: divideBy === 'letter' ? 0.03 : 0.06,
        delay: delay,
        ease: 'power3.out',
        force3D: true,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, { scope: textRef });

  return (
    <span
      ref={textRef}
      className={`gsap-text-wrapper ${className}`}
      style={{ display: 'inline-flex', flexWrap: 'wrap', perspective: '1000px', ...style }}
    >
      {items.map((item, index) => (
        <span
          key={index}
          className="gsap-text-unit"
          style={{ display: 'inline-block', whiteSpace: 'pre', willChange: 'transform, opacity' }}
        >
          {item}{divideBy === 'word' && index < items.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
