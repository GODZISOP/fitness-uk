"use client";
export default function ProgramsSection() {
  const plans = [
    {
      title: "Strength Core",
      price: "$49",
      period: "/month",
      description: "Perfect for beginners looking to master the fundamentals of strength.",
      features: ["3 Days/Week Program", "Basic Nutrition Guide", "Video Tutorials", "Monthly Check-in"],
      isPopular: false,
      delay: 0,
    },
    {
      title: "Elite Conditioning",
      price: "$99",
      period: "/month",
      description: "Our most comprehensive program designed for serious athletes.",
      features: ["5 Days/Week Program", "Custom Meal Plan", "1-on-1 Coaching Calls", "Weekly Form Review", "24/7 Priority Support"],
      isPopular: true,
      delay: 200,
    },
    {
      title: "Complete Transformation",
      price: "$149",
      period: "/month",
      description: "A total overhaul of your lifestyle, nutrition, and training.",
      features: ["6 Days/Week Program", "Private Chef Integration", "Daily Accountability", "Supplement Protocol"],
      isPopular: false,
      delay: 400,
    }
  ];

  return (
    <section className="programs-section">
      <div className="programs-container">
        <div className="programs-header" data-aos="fade-up">
          <h2 className="programs-title">Elevate Your Routine</h2>
          <p className="programs-subtitle">Choose the perfect program designed to push your limits and guarantee results.</p>
        </div>

        <div className="programs-grid">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`program-card ${plan.isPopular ? 'program-card-popular' : ''}`}
              data-aos="fade-up"
              data-aos-delay={plan.delay}
            >
              {plan.isPopular && <div className="popular-badge">Most Popular</div>}
              
              <div className="program-card-header">
                <h3 className="plan-title">{plan.title}</h3>
                <p className="plan-desc">{plan.description}</p>
                <div className="program-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
              </div>
              
              <ul className="program-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className={`program-btn ${plan.isPopular ? 'btn-popular' : ''}`}>
                Join Now
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
