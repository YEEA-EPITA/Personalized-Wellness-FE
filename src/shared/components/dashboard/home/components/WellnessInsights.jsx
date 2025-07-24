"use client";
import { useState, useEffect } from "react";

// Icons
import {
  FaHeart,
  FaBrain,
  FaDumbbell,
  FaBed,
  FaLeaf,
  FaChartLine,
} from "react-icons/fa";

// Styles
import styles from "./WellnessInsights.module.css";

export default function WellnessInsights({ score = 0 }) {
  const [insights, setInsights] = useState([]);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    const increment = score / steps;
    let currentScore = 0;

    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= score) {
        currentScore = score;
        clearInterval(timer);
      }
      setAnimatedScore(Math.floor(currentScore));
    }, interval);

    return () => clearInterval(timer);
  }, [score]);

  useEffect(() => {
    // Generate insights based on score
    const generateInsights = (wellnessScore) => {
      const baseInsights = [
        {
          id: 1,
          category: "Physical Health",
          icon: FaDumbbell,
          color: "#10b981",
          score: Math.min(wellnessScore + Math.random() * 10 - 5, 100),
          trend: "up",
          message: "Your exercise routine is paying off!",
        },
        {
          id: 2,
          category: "Mental Health",
          icon: FaBrain,
          color: "#8b5cf6",
          score: Math.min(wellnessScore + Math.random() * 15 - 7, 100),
          trend: "stable",
          message: "Meditation practice showing results.",
        },
        {
          id: 3,
          category: "Sleep Quality",
          icon: FaBed,
          color: "#3b82f6",
          score: Math.min(wellnessScore + Math.random() * 20 - 10, 100),
          trend: "down",
          message: "Consider improving sleep schedule.",
        },
        {
          id: 4,
          category: "Stress Level",
          icon: FaLeaf,
          color: "#f59e0b",
          score: Math.min(wellnessScore + Math.random() * 12 - 6, 100),
          trend: "up",
          message: "Stress management techniques working.",
        },
      ];

      return baseInsights.map((insight) => ({
        ...insight,
        score: Math.max(0, Math.min(100, insight.score)),
      }));
    };

    setInsights(generateInsights(score));
  }, [score]);

  const getScoreColor = (scoreValue) => {
    if (scoreValue >= 80) return "#10b981";
    if (scoreValue >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (scoreValue) => {
    if (scoreValue >= 80) return "Excellent";
    if (scoreValue >= 60) return "Good";
    if (scoreValue >= 40) return "Fair";
    return "Needs Attention";
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      case "stable":
        return "➡️";
      default:
        return "➡️";
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "#10b981";
      case "down":
        return "#ef4444";
      case "stable":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className={styles.wellnessInsights}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <FaHeart className={styles.headerIcon} />
          <div>
            <h2 className={styles.title}>Wellness Insights</h2>
            <p className={styles.subtitle}>Your health metrics overview</p>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className={styles.overallScore}>
        <div className={styles.scoreCircle}>
          <div
            className={styles.scoreProgress}
            style={{
              background: `conic-gradient(${getScoreColor(animatedScore)} ${
                animatedScore * 3.6
              }deg, #e2e8f0 0deg)`,
            }}
          >
            <div className={styles.scoreInner}>
              <span className={styles.scoreNumber}>{animatedScore}</span>
              <span className={styles.scoreUnit}>%</span>
            </div>
          </div>
        </div>

        <div className={styles.scoreInfo}>
          <h3 className={styles.scoreLabel}>{getScoreLabel(animatedScore)}</h3>
          <p className={styles.scoreDescription}>
            Overall wellness score based on your daily activities and health
            metrics.
          </p>
        </div>
      </div>

      {/* Individual Insights */}
      <div className={styles.insightsList}>
        {insights.map((insight) => {
          const IconComponent = insight.icon;

          return (
            <div key={insight.id} className={styles.insightItem}>
              <div className={styles.insightHeader}>
                <div
                  className={styles.insightIcon}
                  style={{
                    backgroundColor: `${insight.color}20`,
                    color: insight.color,
                  }}
                >
                  <IconComponent />
                </div>

                <div className={styles.insightContent}>
                  <div className={styles.insightTop}>
                    <span className={styles.insightCategory}>
                      {insight.category}
                    </span>
                    <div className={styles.insightTrend}>
                      <span
                        className={styles.trendIcon}
                        style={{ color: getTrendColor(insight.trend) }}
                      >
                        {getTrendIcon(insight.trend)}
                      </span>
                      <span className={styles.insightScore}>
                        {Math.floor(insight.score)}%
                      </span>
                    </div>
                  </div>

                  <div className={styles.insightProgress}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${insight.score}%`,
                          backgroundColor: insight.color,
                        }}
                      ></div>
                    </div>
                  </div>

                  <p className={styles.insightMessage}>{insight.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.detailsBtn}>
          <FaChartLine className={styles.chartIcon} />
          View Detailed Report
        </button>

        <button className={styles.tipsBtn}>Get Wellness Tips</button>
      </div>
    </div>
  );
}
