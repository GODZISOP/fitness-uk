"use client";
import React from 'react';

export default function ProgramsSection() {
  const plans = [
    {
      title: "13-WEEK TRANSFORMATION",
      price: "Enquire",
      period: " Now",
      subtitle: "Week 1 Preparation + 12 Weeks of Momentum & Discipline",
      features: [
        "Week 1: Preparation, Baseline Testing & Metabolic Reset",
        "Weeks 2–13: 12 Weeks of Momentum, Hard Work & Mental/Physical Discipline",
        "Customized Nutrition & Meal Plans",
        "Direct 1-on-1 Support & Accountability",
        "Weekly Form & Progress Reviews"
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
          <p className="programs-subtitle">13 weeks total: Week 1 is preparation, followed by 12 weeks of momentum, hard work, and mental and physical discipline—built for those serious about lasting results without being tied down forever.</p>
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
              
              <a
                href="https://wa.me/447984498444?text=Hi%20Coach%20James%2C%20I%27d%20like%20to%20enquire%20about%20the%2013-Week%20Transformation%20Program!"
                target="_blank"
                rel="noopener noreferrer"
                className={`program-btn ${plan.btnClass}`}
                style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
              >
                Contact Us
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
