"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

// Icons
import {
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaLightbulb,
  FaInfoCircle,
} from "react-icons/fa";

// Styles
import styles from "./WelcomeSection.module.css";

export default function WelcomeSection({ user }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [currentTime]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className={styles.welcomeSection}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonText}></div>
          <div className={styles.skeletonText}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.welcomeSection}>
      <div className={styles.welcomeContent}>
        <div className={styles.userInfo}>
          <div className={styles.avatarContainer}>
            <Image
              src={user.avatar || "/images/dashboard/avatar.svg"}
              alt={`${user.firstName} ${user.lastName}`}
              width={64}
              height={64}
              className={styles.avatar}
            />
            <div className={styles.statusIndicator}></div>
          </div>

          <div className={styles.userDetails}>
            <h1 className={styles.greeting}>
              {greeting}, {user.firstName}! 👋
            </h1>
            <p className={styles.subtitle}>
              Ready to optimize your wellness journey today?
            </p>
          </div>
        </div>

        <div className={styles.timeInfo}>
          <div className={styles.dateTime}>
            <p className={styles.date}>{formatDate(currentTime)}</p>
            <p className={styles.time}>{formatTime(currentTime)}</p>
          </div>

          <div className={styles.quickActions}>
            <button className={styles.actionBtn} title="Calendar">
              <FaCalendarAlt />
            </button>
            <button className={styles.actionBtn} title="Notifications">
              <FaBell />
              <span className={styles.notificationBadge}>3</span>
            </button>
            <button className={styles.actionBtn} title="Settings">
              <FaCog />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.weatherWidget}>
        <div className={styles.weatherInfo}>
          <div className={styles.weatherIcon}>☀️</div>
          <div className={styles.weatherDetails}>
            <span className={styles.temperature}>24°C</span>
            <span className={styles.condition}>Sunny</span>
          </div>
        </div>
        <div className={styles.recommendationsWidget}>
          <div className={styles.recommendationHeader}>
            <FaLightbulb className={styles.recommendationIcon} />
            <span
              className={styles.recommendationLabel}
            >{` Wellness Tip`}</span>
          </div>
          <div className={styles.recommendationContent}>
            <p className={styles.recommendationMessage}>
              {user?.recommendedMsg}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
