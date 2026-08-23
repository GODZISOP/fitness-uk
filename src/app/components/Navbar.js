"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logoImage from "../logo.png";

export default function Navbar({ isScrolled, theme = "default" }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAboutPage = pathname === "/about";

  const navLinks = [
    { name: "Home", href: "/", isRoute: true, hash: "#home" },
    { name: "Services", href: "/#services", isRoute: false, hash: "#services" },
    { name: "About Us", href: "/about", isRoute: true, hash: "#about" },
    { name: "Transformations", href: "/transformations", isRoute: true, hash: null },
    { name: "Programs", href: "/#programs", isRoute: false, hash: "#programs" },
    { name: "Contact Us", href: "/#contact", isRoute: false, hash: "#contact" },
  ];

  const handleLinkClick = (e, link) => {
    setIsOpen(false);

    if (link.href === "/about") {
      if (isAboutPage) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (link.name === "Home") {
      if (!isAboutPage) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // For hash links
    if (!isAboutPage && link.hash) {
      e.preventDefault();
      const targetEl = document.querySelector(link.hash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleContactClick = (e) => {
    setIsOpen(false);
    if (!isAboutPage) {
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
              isActive = pathname === link.href;
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
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={(e) => handleLinkClick(e, link)}
                >
                  {link.name}
                </Link>
              ))}
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
