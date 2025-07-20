"use client";

import Link from "next/link";
import { AUTH_ROUTES } from "@/shared/utils/paths";
import {
  FaArrowRight,
  FaPlay,
  FaChartLine,
  FaBell,
  FaCalendarAlt,
} from "react-icons/fa";
import styles from "@/shared/components/landing/LandingPage.module.css";

const Hero = () => {
  const stats = [
    { number: "85%", label: "Reduction in Burnout" },
    { number: "40%", label: "Productivity Increase" },
    { number: "92%", label: "User Satisfaction" },
    { number: "50K+", label: "Active Users" },
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Prevent Burnout.
            <br />
            <span className={styles.gradient}>Boost Productivity.</span>
            <br />
            Thrive with Wellness.
          </h1>
          <p className={styles.heroSubtitle}>
            The intelligent wellness platform designed specifically for remote
            workers and entrepreneurs. Integrate Jira & Trello tasks, sync your
            calendar, get personalized wellness insights, and join a supportive
            community.
          </p>
          <div className={styles.heroButtons}>
            <Link href={AUTH_ROUTES.register} className={styles.primaryBtn}>
              Start Your Wellness Journey
              <FaArrowRight />
            </Link>
            <button className={styles.secondaryBtn}>
              <FaPlay />
              Watch Demo
            </button>
          </div>
          <div className={styles.heroStats}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.dashboardPreview}>
            <div className={styles.previewHeader}>
              <div className={styles.previewDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.previewTitle}>Wellness Dashboard</span>
            </div>
            <div className={styles.previewContent}>
              <div className={styles.previewCard}>
                <FaChartLine className={styles.previewIcon} />
                <span>Productivity Score: 92%</span>
              </div>
              <div className={styles.previewCard}>
                <FaBell className={styles.previewIcon} />
                <span>Wellness Alert: Take a break</span>
              </div>
              <div className={styles.previewCard}>
                <FaCalendarAlt className={styles.previewIcon} />
                <span>Next meeting in 30 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
