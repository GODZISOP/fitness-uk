"use client";
import React, { useState } from 'react';

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Thank you! Your message has been sent successfully. We will get back to you shortly.");
        e.target.reset(); // Clear the form
      } else {
        alert("Failed to send message. Please try again or contact us directly.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        
        {/* Top Header Area */}
        <div className="contact-header" data-aos="fade-up">
          <div className="contact-info-left">
            <span className="contact-label">READY?</span>
            <p className="contact-subtext">Take the first step. No commitments.</p>
          </div>
          <div className="contact-info-right">
            <span className="contact-label">CONTACT US</span>
            <p className="contact-subtext">worldfitnesszone@consultant.com</p>
            <p className="contact-subtext">WhatsApp: 07984498444</p>
          </div>
        </div>

        {/* Massive Title Area */}
        <div className="contact-title-area" data-aos="fade-up" data-aos-delay="200">
          <h2 className="contact-title">CONTACT US</h2>
          <svg className="contact-arrow" width="80" height="120" viewBox="0 0 100 150" fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10,80 Q50,0 90,80 T50,140 M50,140 L30,120 M50,140 L70,120" />
          </svg>
        </div>

        {/* Bottom Content Area */}
        <div className="contact-content">
          
          {/* Left Column */}
          <div className="contact-left" data-aos="fade-right" data-aos-delay="400">
            <h3 className="contact-subtitle">SEND US A MESSAGE</h3>
            <div className="contact-text">
              <p>Want to partner on your next big fitness journey? Looking to apply a fresh coat of paint to your workout routine?</p>
              <br/>
              <p>Send us a message and let's see if it's a good fit. We're always looking for dedicated individuals ready to put in the work.</p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="contact-right" data-aos="fade-left" data-aos-delay="600">
            <form className="contact-form" onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label htmlFor="name">Name <span>(required)</span></label>
                <input type="text" id="name" name="name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email <span>(required)</span></label>
                <input type="email" id="email" name="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message <span>(required)</span></label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send me a message"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
