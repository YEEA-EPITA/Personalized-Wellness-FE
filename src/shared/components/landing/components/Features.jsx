"use client";

import { useState } from "react";
import {
  FaCalendarAlt,
  FaBell,
  FaUsers,
  FaTasks,
  FaWater,
} from "react-icons/fa";
import styles from "@/shared/components/landing/LandingPage.module.css";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FaCalendarAlt />,
      title: "Google Calendar & Outlook Sync",
      description:
        "Seamlessly integrate with your existing calendars to automatically detect workload patterns and schedule wellness breaks.",
      details:
        "Never miss a meeting while staying on top of your wellness goals. Our smart sync technology learns your patterns and suggests optimal break times.",
    },
    {
      icon: <FaTasks />,
      title: "Jira & Trello Task Management",
      description:
        "Unified task management with full CRUD operations across Jira projects and Trello boards in a wellness-focused Kanban interface.",
      details:
        "Create, update, and manage tasks from multiple platforms in one place. Track project progress while maintaining work-life balance with intelligent workload distribution.",
    },
    {
      icon: <FaBell />,
      title: "Burnout Prevention Alerts",
      description:
        "AI-powered early warning system that analyzes your task load across Jira and Trello to detect signs of burnout before they become critical.",
      details:
        "Advanced algorithms analyze your work patterns across all connected platforms, stress levels, and productivity metrics to provide timely interventions.",
    },
    {
      icon: <FaWater />,
      title: "Smart Wellness Nudges",
      description:
        "Intelligent reminders for hydration, stretching, and micro-breaks tailored to your task schedule and project deadlines.",
      details:
        "Personalized timing based on your Jira sprints and Trello deadlines ensures reminders come at the perfect moments without disrupting your flow.",
    },
    {
      icon: <FaUsers />,
      title: "Community & Team Wellness",
      description:
        "Connect with like-minded professionals in a supportive community with built-in video meetings and team wellness challenges.",
      details:
        "Join wellness challenges, share experiences, and attend expert-led sessions on work-life balance. Collaborate on wellness goals with your team.",
    },
  ];

  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2>Powerful Features for Modern Remote Workers</h2>
          <p>
            Everything you need to maintain peak performance while prioritizing
            your well-being
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featuresList}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${styles.featureItem} ${
                  activeFeature === index ? styles.active : ""
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <div className={styles.featureContent}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.featureDemo}>
            <div className={styles.demoCard}>
              <div className={styles.demoIcon}>
                {features[activeFeature].icon}
              </div>
              <h3>{features[activeFeature].title}</h3>
              <p>{features[activeFeature].details}</p>
              <div className={styles.demoVisual}>
                <div className={styles.demoPlaceholder}>
                  Interactive Demo Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
