"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Define the meal tiers
const mealTiers = [
  {
    title: "Beginner",
    subtitle: "Foundation & Habits",
    description: "Perfect for those just starting out. Learn the basics of macronutrients, portion control, and build sustainable eating habits without feeling overwhelmed.",
    features: [
      "Simple, easy-to-prep recipes",
      "Basic macronutrient breakdown",
      "Hydration & portion guides",
      "Flexible cheat meal rules"
    ],
    color: "#22c55e", // Green
    delay: 0.2
  },
  {
    title: "Amateur",
    subtitle: "Performance & Growth",
    description: "For intermediate lifters ready to take their nutrition seriously. Focused on nutrient timing, lean muscle growth, and optimizing recovery.",
    features: [
      "Custom calorie & macro targets",
      "Pre/post-workout nutrition",
      "Supplementation protocols",
      "Weekly check-in adjustments"
    ],
    color: "#FFC928", // Brand Yellow
    delay: 0.4,
    recommended: true
  },
  {
    title: "Advanced",
    subtitle: "Elite Conditioning",
    description: "Strict, aggressive protocols for contest prep, photoshoots, or maximum fat loss. No excuses, just pure discipline and extreme results.",
    features: [
      "Aggressive carb-cycling",
      "Peak week water manipulation",
      "Precision micronutrient tracking",
      "Daily check-ins & adjustments"
    ],
    color: "#ef4444", // Red
    delay: 0.6
  }
];

export default function MealPlansPage() {
  return (
    <>
      <Navbar />
      
      <main className="meal-plans-page" style={{ minHeight: "100vh", backgroundColor: "var(--color-deep-navy)", color: "#fff", paddingTop: "120px", paddingBottom: "80px", fontFamily: "var(--font-secondary)" }}>
        <div className="meal-plans-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          
          {/* Header Section */}
          <motion.div 
            className="meal-plans-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <span style={{ color: "var(--color-action-yellow)", fontSize: "1rem", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
              Fuel Your Transformation
            </span>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontFamily: "var(--font-primary)", fontWeight: "800", lineHeight: "1.1", marginBottom: "1.5rem", textTransform: "uppercase" }}>
              Nutrition <span style={{ WebkitTextStroke: "1px #fff", color: "transparent" }}>Protocols</span>
            </h1>
            <p style={{ maxWidth: "600px", margin: "0 auto", color: "rgba(255,255,255,0.7)", fontSize: "1.125rem", lineHeight: "1.6" }}>
              You can't out-train a bad diet. Choose the nutrition protocol that matches your current experience level and transformation goals.
            </p>
          </motion.div>

          {/* Tiers Grid */}
          <div className="tiers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "5rem" }}>
            {mealTiers.map((tier, index) => (
              <motion.div 
                key={index}
                className="tier-card"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: tier.delay, ease: "easeOut" }}
                style={{ 
                  backgroundColor: "rgba(255,255,255,0.03)", 
                  border: `1px solid ${tier.recommended ? 'var(--color-action-yellow)' : 'rgba(255,255,255,0.1)'}`, 
                  borderRadius: "16px", 
                  padding: "2.5rem 2rem",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden"
                }}
              >
                {/* Highlight line at top */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", backgroundColor: tier.color }} />
                
                {tier.recommended && (
                  <div style={{ position: "absolute", top: "1rem", right: "1rem", backgroundColor: "var(--color-action-yellow)", color: "#000", fontSize: "0.75rem", fontWeight: "700", padding: "0.25rem 0.75rem", borderRadius: "50px", textTransform: "uppercase" }}>
                    Most Popular
                  </div>
                )}

                <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-primary)", fontWeight: "800", marginBottom: "0.5rem", color: tier.color, textTransform: "uppercase" }}>
                  {tier.title}
                </h2>
                <h3 style={{ fontSize: "1.125rem", color: "#fff", fontWeight: "600", marginBottom: "1rem" }}>
                  {tier.subtitle}
                </h3>
                
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2rem", flexGrow: 1 }}>
                  {tier.description}
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "2.5rem" }}>
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem", fontSize: "0.95rem", color: "rgba(255,255,255,0.8)" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={tier.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="meal-plans-cta"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ 
              textAlign: "center", 
              backgroundColor: "rgba(255, 201, 40, 0.05)", 
              border: "1px solid rgba(255, 201, 40, 0.2)",
              borderRadius: "24px",
              padding: "4rem 2rem"
            }}
          >
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontFamily: "var(--font-primary)", fontWeight: "800", marginBottom: "1rem", textTransform: "uppercase" }}>
              Ready to <span style={{ color: "var(--color-action-yellow)" }}>Commit?</span>
            </h2>
            <p style={{ maxWidth: "600px", margin: "0 auto 2.5rem auto", color: "rgba(255,255,255,0.7)", fontSize: "1.125rem", lineHeight: "1.6" }}>
              Select your meal plan and pair it with our elite training programs to guarantee your 13-week transformation.
            </p>
            <Link 
              href="/#programs" 
              style={{ 
                display: "inline-flex", 
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--color-action-yellow)", 
                color: "#000", 
                fontWeight: "700", 
                padding: "1rem 2.5rem", 
                borderRadius: "50px", 
                textDecoration: "none",
                fontSize: "1.125rem",
                transition: "transform 0.3s ease",
                boxShadow: "0 10px 20px rgba(255, 201, 40, 0.2)"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              GET PERSONALISED ACCESS &rarr;
            </Link>
          </motion.div>

        </div>
      </main>
      
      <Footer />
    </>
  );
}
