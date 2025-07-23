"use client";

import { useState } from "react";
import Link from "next/link";
import { AUTH_ROUTES } from "@/shared/utils/paths";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "@/shared/components/landing/LandingPage.module.css";
import Image from "next/image";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="Logo"
            className={styles.logoIcon}
            width={40}
            height={40}
          />
          <span className={styles.logoText}>Personalized Wellness Planner</span>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Reviews</a>
          <a href="#about">About</a>
          <Link href={AUTH_ROUTES.login} className={styles.loginBtn}>
            Sign In
          </Link>
          <Link href={AUTH_ROUTES.register} className={styles.ctaBtn}>
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className={styles.mobileNavOverlay} onClick={closeMobileMenu} />
        )}

        {/* Mobile Navigation */}
        <div
          className={`${styles.mobileNav} ${
            isMobileMenuOpen ? styles.mobileNavOpen : ""
          }`}
        >
          <div className={styles.mobileNavHeader}>
            <div className={styles.logo}>
              <Image
                src="/images/logo.png"
                alt="Logo"
                className={styles.logoIcon}
                width={40}
                height={40}
              />
              <span className={styles.logoText}>
                Personalized Wellness Planner
              </span>
            </div>
            <button
              className={styles.mobileCloseBtn}
              onClick={closeMobileMenu}
              aria-label="Close mobile menu"
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles.mobileNavContent}>
            <a href="#features" onClick={closeMobileMenu}>
              Features
            </a>
            <a href="#how-it-works" onClick={closeMobileMenu}>
              How It Works
            </a>
            <a href="#testimonials" onClick={closeMobileMenu}>
              Reviews
            </a>
            <a href="#about" onClick={closeMobileMenu}>
              About
            </a>
            <div className={styles.mobileAuthButtons}>
              <Link
                href={AUTH_ROUTES.login}
                className={styles.mobileLoginBtn}
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <Link
                href={AUTH_ROUTES.register}
                className={styles.mobileCtaBtn}
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
