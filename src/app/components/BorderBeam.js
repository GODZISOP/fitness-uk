"use client";
import React from "react";

/**
 * BorderBeam Component
 * Creates an animated glowing neon beam that sweeps along the border of any container.
 */
export default function BorderBeam({
  className = "",
  size = 200,
  duration = 8,
  borderWidth = 2,
  anchor = 90,
  colorFrom = "var(--color-primary, #155EEF)",
  colorTo = "var(--color-action-yellow, #FFC928)",
  delay = 0,
  style = {}
}) {
  return (
    <div
      style={{
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        overflow: "hidden",
        zIndex: 1,
        ...style
      }}
      className={`border-beam-wrapper ${className}`}
    >
      <div
        style={{
          position: "absolute",
          aspectRatio: "1/1",
          width: size,
          animation: `border-beam ${duration}s infinite linear`,
          animationDelay: `-${delay}s`,
          background: `conic-gradient(from ${anchor}deg at 50% 50%, transparent 0%, transparent 70%, ${colorFrom} 85%, ${colorTo} 100%)`,
          offsetPath: `rect(0 auto auto 0 round inherit)`,
          mask: `linear-gradient(transparent, transparent), linear-gradient(white, white)`,
          maskClip: `padding-box, border-box`,
          maskComposite: `intersect`,
          WebkitMaskClip: `padding-box, border-box`,
          WebkitMaskComposite: `destination-out`,
          padding: `${borderWidth}px`,
          inset: 0,
          margin: "auto",
        }}
        className="border-beam-glow"
      />
    </div>
  );
}
