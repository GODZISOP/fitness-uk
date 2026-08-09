"use client";
import React from 'react';

export default function ProgramsSection() {
  const plans = [
    {
      title: "BASE PLAN",
      price: "$49",
      period: "/month",
      subtitle: "Start Your Journey",
      features: [
        "3 Days/Week Fitness Access",
        "Basic Nutrition Guide",
        "Video Workout Tutorials",
        "Monthly Progress Check-in"
      ],
      cardClass: "program-card-blue",
      btnClass: "btn-yellow",
      delay: 0,
    },
    {
      title: "PRO PLAN",
      price: "$99",
      period: "/month",
      subtitle: "Elevate Your Results",
      features: [
        "5 Days/Week Full Access",
        "Customized Macro & Meal Plan",
        "1-on-1 Certified Trainer Calls",
        "Weekly Form & Progress Review",
        "24/7 Priority VIP Support"
      ],
      cardClass: "program-card-yellow",
      btnClass: "btn-navy",
      isPopular: true,
      delay: 200,
    },
    {
      title: "ENTERPRISE PLAN",
      price: "$149",
      period: "/month",
      subtitle: "Complete Transformation",
      features: [
        "Unlimited 24/7 VIP Gym Access",
        "Private Nutritionist Integration",
        "Daily Accountability & Tracking",
        "Comprehensive Supplement Protocol"
      ],
      cardClass: "program-card-blue",
      btnClass: "btn-yellow",
      delay: 400,
    }
  ];

  return (
    <section className="programs-section" id="programs">
      <div className="programs-container">
        <div className="programs-header" data-aos="fade-up">
          <h2 className="programs-title">Choose Your Plan</h2>
          <p className="programs-subtitle">Explore our packages and see why top fitness enthusiasts choose World Fitness Zone for guaranteed quality.</p>
        </div>

        <div className="programs-grid">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`program-card ${plan.cardClass}`}
              data-aos="fade-up"
            >
              {plan.isPopular && <div className="popular-badge">MOST POPULAR</div>}
              
              <div className="program-card-header">
                <span className="plan-badge-tag">{plan.title}</span>
                <div className="program-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <p className="plan-subtitle">{plan.subtitle}</p>
              </div>
              
              <ul className="program-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <span className="feature-check-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className={`program-btn ${plan.btnClass}`}>
                Contact Us
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
