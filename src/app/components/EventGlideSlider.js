"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Glide, { Controls, Autoplay, Images as GlideImages } from '@glidejs/glide/dist/glide.modular.esm';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

export default function EventGlideSlider({ images, badgeText, badgeClass }) {
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const glide = new Glide(sliderRef.current, {
      type: 'carousel',
      autoplay: 3200,
      hoverpause: true,
      perView: 1,
      animationDuration: 750,
      animationTimingFunc: 'cubic-bezier(0.16, 1, 0.3, 1)',
    });

    glide.mount({ Controls, Autoplay, Images: GlideImages });

    return () => {
      try {
        glide.destroy();
      } catch (e) {
        // ignore safely
      }
    };
  }, []);

  return (
    <div className="event-glide-wrapper relative w-full overflow-visible">
      <div className="glide" ref={sliderRef}>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {images.map((imgSrc, index) => (
              <li key={index} className="glide__slide relative flex justify-center items-center" style={{ minHeight: '520px', height: '100%' }}>
                <Image
                  src={imgSrc}
                  alt={`Event slide ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="split-image"
                  priority={index === 0}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Custom Nav Arrows */}
        <div className="glide__arrows" data-glide-el="controls">
          <button className="glide__arrow glide__arrow--left event-glide-arrow left-arrow" data-glide-dir="<" aria-label="Previous Slide">
            &#8249;
          </button>
          <button className="glide__arrow glide__arrow--right event-glide-arrow right-arrow" data-glide-dir=">" aria-label="Next Slide">
            &#8250;
          </button>
        </div>

        {/* Custom Bullet Dots */}
        <div className="glide__bullets event-glide-bullets" data-glide-el="controls[nav]">
          {images.map((_, index) => (
            <button
              key={index}
              className="glide__bullet event-glide-dot"
              data-glide-dir={`=${index}`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {badgeText && (
        <div className={`events-badge ${badgeClass}`}>
          {badgeText}
        </div>
      )}
    </div>
  );
}
