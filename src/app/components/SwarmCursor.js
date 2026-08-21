"use client";

import React, { useRef, useEffect, useState } from "react";

export default function SwarmCursor({
  children,
  color = "#ffffff",
  accentColor = "#ffffff",
  count = 8,
  size = 5,
  speed = 2.5,
  spread = 100,
  wander = 0.25,
  trail = 0.75,
  scatterOnClick = true,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth > 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return; // Completely disable canvas loop on mobile

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const container = containerRef.current;
    
    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    let isClicking = false;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };

    const onMouseDown = () => { isClicking = true; };
    const onMouseUp = () => { isClicking = false; };

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    container.addEventListener("mousemove", onMouseMove);
    if (scatterOnClick) {
      container.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
    }
    window.addEventListener("resize", onResize);

    const particles = Array.from({ length: count }, () => ({
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      targetOffsetX: (Math.random() - 0.5) * spread,
      targetOffsetY: (Math.random() - 0.5) * spread,
      history: []
    }));

    let animationFrameId;

    const render = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.1;
      mouse.y += (mouse.ty - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.targetOffsetX += (Math.random() - 0.5) * wander * 10;
        p.targetOffsetY += (Math.random() - 0.5) * wander * 10;
        
        if (p.targetOffsetX > spread) p.targetOffsetX = spread;
        if (p.targetOffsetX < -spread) p.targetOffsetX = -spread;
        if (p.targetOffsetY > spread) p.targetOffsetY = spread;
        if (p.targetOffsetY < -spread) p.targetOffsetY = -spread;

        let tx = mouse.x + p.targetOffsetX;
        let ty = mouse.y + p.targetOffsetY;
        
        if (isClicking && scatterOnClick) {
          tx = mouse.x + p.targetOffsetX * 3;
          ty = mouse.y + p.targetOffsetY * 3;
        }

        const dx = tx - p.x;
        const dy = ty - p.y;
        
        p.vx += dx * 0.01 * speed;
        p.vy += dy * 0.01 * speed;
        
        p.vx *= 0.85;
        p.vy *= 0.85;
        
        p.x += p.vx;
        p.y += p.vy;

        p.history.push({ x: p.x, y: p.y });
        const maxHistory = Math.max(1, Math.floor(trail * 20));
        if (p.history.length > maxHistory) {
          p.history.shift();
        }

        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let j = 1; j < p.history.length; j++) {
            ctx.lineTo(p.history[j].x, p.history[j].y);
          }
          ctx.strokeStyle = i % 2 === 0 ? color : accentColor;
          ctx.lineWidth = size * 0.8;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.globalAlpha = 0.3;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? color : accentColor;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", onMouseMove);
      if (scatterOnClick) {
        container.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
      }
      window.removeEventListener("resize", onResize);
    };
  }, [color, accentColor, count, size, speed, spread, wander, trail, scatterOnClick, isDesktop]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      {isDesktop && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 50,
          }}
        />
      )}
      {children}
    </div>
  );
}
