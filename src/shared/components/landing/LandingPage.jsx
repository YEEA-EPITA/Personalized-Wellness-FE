"use client";

import { useState } from "react";
import styles from "./LandingPage.module.css";

import { FaArrowUp } from "react-icons/fa";

// Import components
import {
  Header,
  Hero,
  Features,
  HowItWorks,
  Reviews,
  About,
  CTA,
  Footer,
} from "@/shared/components/landing/components";

const LandingPage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll for back-to-top button
  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add scroll listener
  useState(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className={styles.landingPage}>
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Reviews />

      {/* About Us Section */}
      <About />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          className={styles.backToTop}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
