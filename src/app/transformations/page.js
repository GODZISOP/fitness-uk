"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TransformationsSection from "../components/TransformationsSection";
import Loader from "../components/Loader";

export default function TransformationsPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Loader />
      <Navbar isScrolled={isScrolled} theme="default" />
      <div style={{ paddingTop: "80px" }}>
        <TransformationsSection />
      </div>
      <Footer />
    </>
  );
}
