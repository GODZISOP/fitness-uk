"use client";
import React from 'react';

export default function ProgramsSection() {
  const plans = [
    {
      title: "13-WEEK TRANSFORMATION",
      price: "Enquire",
      period: " Now",
      subtitle: "The Ultimate Results-Driven Program",
      features: [
        "13 Weeks of Intensive, Structured Training",
        "Customized Nutrition & Meal Plans",
        "Direct 1-on-1 Support & Accountability",
        "Weekly Form & Progress Reviews",
        "Learn Sustainable Habits to Move Forward"
      ],
      cardClass: "program-card-yellow",
      btnClass: "btn-navy",
      isPopular: true,
      delay: 0,
    }
  ];

  return (
    <section className="programs-section" id="programs">
      <div className="programs-container">
        <div className="programs-header" data-aos="fade-up">
          <h2 className="programs-title">Your 13-Week Journey</h2>
          <p className="programs-subtitle">Discover our comprehensive program designed for those serious about achieving real, lasting results without being tied down forever.</p>
        </div>

        <div className="programs-grid" style={{ display: 'flex', justifyContent: 'center', margin: '0 auto', maxWidth: '600px' }}>
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`program-card ${plan.cardClass}`}
              data-aos="fade-up"
              style={{ width: '100%' }}
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
