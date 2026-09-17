"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logoImage from "../logo.png";
import { ChevronDown } from "lucide-react";

export default function Navbar({ isScrolled, theme = "default" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAboutPage = pathname === "/about";

  const navLinks = [
    { name: "Home", href: "/", isRoute: true, hash: "#home" },
    { name: "Services", href: "/#services", isRoute: false, hash: "#services" },
    { name: "About Us", href: "/about", isRoute: true, hash: null },
    { name: "Meal Plans", href: "/meal-plans", isRoute: true, hash: null },
    { 
      name: "Transformations", 
      href: "/transformations", 
      isRoute: true, 
      hash: null,
      dropdown: [
        { name: "Client Transformations", href: "/transformations" },
        { name: "Coach's 20 Year Journey", href: "/transformations/20-year-journey" }
      ]
    },
    { name: "Programs", href: "/#programs", isRoute: false, hash: "#programs" },
    { name: "Contact Us", href: "/#contact", isRoute: false, hash: "#contact" },
  ];

  const handleLinkClick = (e, link) => {
    // If it has a dropdown and we are on desktop, clicking the top link shouldn't do anything special or maybe it goes to the main page.
    // In this design, clicking the top link "Transformations" could take them to the client transformations.
    if (!link.dropdown) {
      setIsOpen(false);
    }

    if (link.name === "Home") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // For hash links that belong to the home page
    if (link.hash && pathname === "/") {
      const targetEl = document.querySelector(link.hash);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleContactClick = (e) => {
    setIsOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      const targetEl = document.querySelector("#contact");
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push("/#contact");
  };

  const isDark = theme === "dark";

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .nav-dropdown-container {
          position: relative;
          display: inline-block;
        }
        .nav-dropdown-container:hover .nav-dropdown-menu {
          display: block;
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: #ffffff;
          min-width: 240px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 0.5rem 0;
          display: none;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 100;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .nav-dropdown-item {
          display: block;
          padding: 0.8rem 1.5rem;
          color: var(--color-deep-navy, #0a1128);
          font-family: var(--font-secondary);
          font-size: 0.95rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        .nav-dropdown-item:hover {
          background: rgba(255, 201, 40, 0.1);
          color: var(--color-action-yellow, #ffc928);
          padding-left: 2rem;
        }
        .mobile-dropdown-menu {
          display: flex;
          flex-direction: column;
          background: rgba(0,0,0,0.03);
          border-radius: 8px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        .mobile-dropdown-item {
          padding: 1rem 1.5rem;
          font-size: 1.1rem;
          color: var(--color-deep-navy);
          text-decoration: none;
          border-left: 3px solid transparent;
        }
        .mobile-dropdown-item:hover {
          background: rgba(255, 201, 40, 0.1);
          border-left: 3px solid var(--color-action-yellow);
        }
      `}} />

      <motion.nav
        className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${isDark ? "navbar-dark-theme" : ""}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-brand">
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src={logoImage}
              alt="World Fitness Zone"
              height={50}
              width={160}
              style={{ objectFit: "contain", height: "48px", width: "auto" }}
              priority
            />
          </Link>
        </div>

        <div className="nav-links">
          {navLinks.map((link, idx) => {
            let isActive = false;
            if (link.href === "/") {
              isActive = pathname === "/";
            } else if (link.isRoute) {
              isActive = pathname.startsWith(link.href);
            }

            if (link.dropdown) {
              return (
                <div key={idx} className="nav-dropdown-container">
                  <div className={`nav-link ${isActive ? "nav-link-active" : ""}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {link.name} <ChevronDown size={14} />
                  </div>
                  <div className="nav-dropdown-menu">
                    {link.dropdown.map((dropLink, dIdx) => (
                      <Link 
                        key={dIdx} 
                        href={dropLink.href} 
                        className="nav-dropdown-item"
                      >
                        {dropLink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={idx}
                href={link.href}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <button
          className="nav-cta"
          onClick={handleContactClick}
        >
          Contact Us &rarr;
        </button>

        <button
          className="hamburger"
          aria-label="Toggle Menu"
          onClick={() => setIsOpen(!isOpen)}
          style={{ opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? "none" : "auto" }}
        >
          ☰
        </button>
      </motion.nav>

      {/* Mobile Menu Dropdown Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="mobile-nav-header" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
              <button 
                className="mobile-close-btn" 
                onClick={() => setIsOpen(false)}
                style={{ background: "none", border: "none", fontSize: "2rem", cursor: "pointer", color: "var(--color-deep-navy)" }}
                aria-label="Close Menu"
              >
                ✕
              </button>
            </div>
            <div className="mobile-nav-links">
              {navLinks.map((link, idx) => {
                if (link.dropdown) {
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <div 
                        className="mobile-nav-link" 
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                      >
                        {link.name}
                        <ChevronDown 
                          size={20} 
                          style={{ 
                            transform: isMobileDropdownOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.3s'
                          }} 
                        />
                      </div>
                      <AnimatePresence>
                        {isMobileDropdownOpen && (
                          <motion.div 
                            className="mobile-dropdown-menu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            {link.dropdown.map((dropLink, dIdx) => (
                              <Link 
                                key={dIdx} 
                                href={dropLink.href} 
                                className="mobile-dropdown-item"
                                onClick={() => setIsOpen(false)}
                              >
                                {dropLink.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={idx}
                    href={link.href}
                    className="mobile-nav-link"
                    onClick={(e) => handleLinkClick(e, link)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <button
                className="mobile-nav-cta"
                onClick={handleContactClick}
              >
                Get Started Now &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
