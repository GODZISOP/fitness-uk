"use client";
import React from 'react';
import Image from 'next/image';
import logoImage from '../logo.png';

export default function Footer() {
  return (
    <footer className="apex-footer">
      <div className="footer-container">
        
        <div className="footer-top">
          <div className="footer-brand" data-aos="fade-up">
            <Image 
              src={logoImage} 
              alt="World Fitness Zone" 
              height={55} 
              width={180} 
              style={{ objectFit: "contain", height: "55px", width: "auto", marginBottom: "1rem" }} 
            />
            <p>Forging unbreakable strength and resilience since 2012. Join the elite.</p>
          </div>
          
          <div className="footer-links-grid">
            <div className="footer-col" data-aos="fade-up" data-aos-delay="100">
              <h4>TRAINING</h4>
              <ul>
                <li><a href="#">Strength</a></li>
                <li><a href="#">Conditioning</a></li>
                <li><a href="#">Hypertrophy</a></li>
              </ul>
            </div>
            
            <div className="footer-col" data-aos="fade-up" data-aos-delay="200">
              <h4>COMPANY</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Coaches</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            
            <div className="footer-column" data-aos="fade-up" data-aos-delay="300">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Twitter">TW</a>
            <a href="#" aria-label="YouTube">YT</a>
          </div>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} World Fitness Zone. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
