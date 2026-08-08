"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import HeroSection from "./components/HeroSection";
import GallerySection from "./components/GallerySection";
import ProgramsSection from "./components/ProgramsSection";
import EventsSection from "./components/EventsSection";
import ProcessSection from "./components/ProcessSection";
import DumbbellAnimation from "./components/DumbbellAnimation";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: false, // Ensure animations trigger every time you scroll up and down
      mirror: true, // Whether elements should animate out while scrolling past them
      offset: 100,
    });

    // Force a recalculation of positions after a short delay (crucial for React)
    setTimeout(() => {
      AOS.refresh();
    }, 500);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <Navbar isScrolled={isScrolled} />
    <div id="home"><HeroSection /></div>
    <DumbbellAnimation />
    <div id="services"><EventsSection /></div>
    <div id="about"><AboutSection /></div>
    <div id="gallery"><GallerySection /></div>
    <div id="process"><ProcessSection /></div>
    <div id="programs"><ProgramsSection /></div>
    <div id="contact"><ContactSection /></div>
    <Footer />
    </>
  );
}
