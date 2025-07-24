"use client";
import { useState, useEffect } from "react";

// Icons
import { FaChartLine, FaHeart, FaTrophy, FaFire } from "react-icons/fa";

// Styles
import styles from "./StatsOverview.module.css";

export default function StatsOverview({ stats }) {
  const [animatedStats, setAnimatedStats] = useState(stats || {});

  useEffect(() => {
    if (stats) {
      const duration = 1000;
      const steps = 60;
      const interval = duration / steps;

      const animate = (key, targetValue) => {
        let currentValue = 0;
        const increment = targetValue / steps;

        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
          }
          setAnimatedStats((prev) => ({
            ...prev,
            [key]: Math.floor(currentValue),
          }));
        }, interval);
      };

      Object.entries(stats).forEach(([key, value]) => {
        animate(key, value);
      });
    }
  }, [stats]);

  const getProgressColor = (value, type) => {
    // For wellness score - higher is better
    if (type === "wellnessScore") {
      if (value >= 80) return "#10b981";
      if (value >= 60) return "#f59e0b";
      return "#ef4444"; // Red
    }

    // Burnout Score: 0-40 Normal, 41-70 Caution, 71-100 High
    if (type === "burnoutScore") {
      if (value <= 40) return "#10b981"; // Green (Normal)
      if (value <= 70) return "#f59e0b"; // Yellow (Caution)
      return "#ef4444"; // Red (High)
    }

    // Lack of Break: 0 Good, 10 Caution, 20 High
    if (type === "lackOfBreak") {
      if (value < 10) return "#10b981"; // Green (Good)
      if (value < 20) return "#f59e0b"; // Yellow (Caution)
      return "#ef4444"; // Red (High)
    }

    // Workload: 0 Good, 10 Mean, 20 High/Bad
    if (type === "todayWorkLoad") {
      if (value < 10) return "#10b981"; // Green (Good)
      if (value < 20) return "#f59e0b"; // Yellow (Mean)
      return "#ef4444"; // Red (High/Bad)
    }

    // Default for other metrics
    if (type === "productivity") {
      if (value >= 80) return "#10b981"; // Green
      if (value >= 60) return "#f59e0b"; // Yellow
      return "#ef4444"; // Red
    }

    return "var(--primary-color)";
  };

  const statsConfig = [
    {
      key: "burnoutScore",
      title: "Burnout Risk",
      subtitle: "Current level",
      icon: FaFire,
      color: "#ef4444",
      suffix: "%",
      showProgress: true,
    },
    {
      key: "todayWorkLoad",
      title: "Today's Workload",
      subtitle: "Current intensity",
      icon: FaChartLine,
      color: "#f59e0b",
      suffix: "%",
      showProgress: true,
    },
    {
      key: "lackOfBreak",
      title: "Break Deficit",
      subtitle: "Missing breaks",
      icon: FaHeart,
      color: "#ec4899",
      suffix: "%",
      showProgress: true,
    },
    {
      key: "wellnessScore",
      title: "Wellness Score",
      subtitle: "Overall health",
      icon: FaTrophy,
      color: "#10b981",
      suffix: "%",
      showProgress: true,
    },
  ];

  if (!stats) {
    return (
      <div className={styles.statsOverview}>
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.skeleton}>
              <div className={styles.skeletonIcon}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.statsOverview}>
      {statsConfig.map((config) => {
        const IconComponent = config.icon;
        const value = animatedStats[config.key];
        const progressValue = config.showProgress ? value : 100;

        return (
          <div key={config.key} className={styles.statCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.iconContainer}
                style={{
                  backgroundColor: `${config.color}20`,
                  color: config.color,
                }}
              >
                <IconComponent className={styles.icon} />
              </div>

              <div className={styles.statValue}>
                <span className={styles.number}>
                  {value}
                  {config.suffix}
                </span>
                {config.key === "burnoutScore" && value <= 40 && (
                  <div className={styles.badge}>
                    <FaTrophy className={styles.trophyIcon} />
                    <span>Great balance!</span>
                  </div>
                )}
                {config.key === "wellnessScore" && value >= 80 && (
                  <div className={styles.badge}>
                    <FaFire className={styles.fireIcon} />
                    <span>Excellent!</span>
                  </div>
                )}
                {config.key === "lackOfBreak" && value < 10 && (
                  <div className={styles.badge}>
                    <FaHeart className={styles.trophyIcon} />
                    <span>Good breaks!</span>
                  </div>
                )}
                {config.key === "todayWorkLoad" && value < 10 && (
                  <div className={styles.badge}>
                    <FaTrophy className={styles.trophyIcon} />
                    <span>Light workload!</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.statInfo}>
              <h3 className={styles.statTitle}>{config.title}</h3>
              <p className={styles.statSubtitle}>{config.subtitle}</p>
            </div>

            {config.showProgress && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${progressValue}%`,
                      backgroundColor: getProgressColor(value, config.key),
                    }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {(() => {
                    if (config.key === "wellnessScore") {
                      return value >= 80
                        ? "Excellent"
                        : value >= 60
                        ? "Good"
                        : "Needs Improvement";
                    }
                    if (config.key === "burnoutScore") {
                      return value <= 40
                        ? "Normal"
                        : value <= 70
                        ? "Caution"
                        : "High Risk";
                    }
                    if (config.key === "lackOfBreak") {
                      return value < 10
                        ? "Good"
                        : value < 20
                        ? "Caution"
                        : "High";
                    }
                    if (config.key === "todayWorkLoad") {
                      return value < 10
                        ? "Good"
                        : value < 20
                        ? "Moderate"
                        : "High";
                    }
                    return value >= 80
                      ? "Excellent"
                      : value >= 60
                      ? "Good"
                      : "Needs Improvement";
                  })()}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
