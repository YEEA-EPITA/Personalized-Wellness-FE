"use client";
import { useState, useEffect } from "react";

// Icons
import {
  FaChartLine,
  FaCalendarWeek,
  FaFilter,
  FaDownload,
} from "react-icons/fa";

// Styles
import styles from "./ProductivityChart.module.css";

export default function ProductivityChart() {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("tasks");

  useEffect(() => {
    // Generate mock chart data
    const generateChartData = () => {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map((day, index) => ({
        day,
        tasks: Math.floor(Math.random() * 15) + 5,
        focus: Math.floor(Math.random() * 8) + 2,
        wellness: Math.floor(Math.random() * 10) + 3,
        meetings: Math.floor(Math.random() * 6) + 1,
      }));
    };

    setChartData(generateChartData());
  }, [timeRange]);

  const getMaxValue = () => {
    if (!chartData.length) return 0;
    return Math.max(...chartData.map((item) => item[selectedMetric]));
  };

  const getBarHeight = (value) => {
    const maxValue = getMaxValue();
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  const getMetricColor = (metric) => {
    const colors = {
      tasks: "#3b82f6",
      focus: "#10b981",
      wellness: "#ec4899",
      meetings: "#f59e0b",
    };
    return colors[metric] || "#6b7280";
  };

  const getMetricLabel = (metric) => {
    const labels = {
      tasks: "Tasks Completed",
      focus: "Focus Hours",
      wellness: "Wellness Activities",
      meetings: "Meetings Attended",
    };
    return labels[metric] || metric;
  };

  const metrics = [
    { key: "tasks", label: "Tasks", icon: "✅" },
    { key: "focus", label: "Focus", icon: "🎯" },
    { key: "wellness", label: "Wellness", icon: "💚" },
    // { key: "meetings", label: "Meetings", icon: "👥" },
  ];

  const timeRanges = [
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "This Quarter" },
  ];

  const totalValue = chartData.reduce(
    (sum, item) => sum + item[selectedMetric],
    0
  );
  const averageValue =
    chartData.length > 0 ? (totalValue / chartData.length).toFixed(1) : 0;

  return (
    <div className={styles.productivityChart}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <FaChartLine className={styles.headerIcon} />
          <div>
            <h2 className={styles.title}>Productivity Analytics</h2>
            <p className={styles.subtitle}>
              Track your daily performance metrics
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <select
            className={styles.timeSelect}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {timeRanges.map((range) => (
              <option key={range.key} value={range.key}>
                {range.label}
              </option>
            ))}
          </select>

          <button className={styles.downloadBtn} title="Download Chart">
            <FaDownload />
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className={styles.metricSelector}>
        {metrics.map((metric) => (
          <button
            key={metric.key}
            className={`${styles.metricBtn} ${
              selectedMetric === metric.key ? styles.active : ""
            }`}
            onClick={() => setSelectedMetric(metric.key)}
          >
            <span className={styles.metricIcon}>{metric.icon}</span>
            <span className={styles.metricLabel}>{metric.label}</span>
          </button>
        ))}
      </div>

      {/* Chart Stats */}
      <div className={styles.chartStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total</span>
          <span className={styles.statValue}>{totalValue}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Average</span>
          <span className={styles.statValue}>{averageValue}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Best Day</span>
          <span className={styles.statValue}>
            {chartData.length > 0
              ? chartData.reduce((max, item) =>
                  item[selectedMetric] > max[selectedMetric] ? item : max
                ).day
              : "-"}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          {chartData.map((item, index) => (
            <div key={index} className={styles.chartColumn}>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${getBarHeight(item[selectedMetric])}%`,
                    backgroundColor: getMetricColor(selectedMetric),
                  }}
                >
                  <div className={styles.barValue}>{item[selectedMetric]}</div>
                </div>
              </div>
              <div className={styles.dayLabel}>{item.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className={styles.insights}>
        <h3 className={styles.insightsTitle}>Quick Insights</h3>
        <div className={styles.insightsList}>
          <div className={styles.insightItem}>
            <span className={styles.insightIcon}>📈</span>
            <span className={styles.insightText}>
              Your {getMetricLabel(selectedMetric).toLowerCase()} peaked on{" "}
              {chartData.length > 0
                ? chartData.reduce((max, item) =>
                    item[selectedMetric] > max[selectedMetric] ? item : max
                  ).day
                : "this week"}
            </span>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightIcon}>🎯</span>
            <span className={styles.insightText}>
              You're {averageValue > 5 ? "exceeding" : "approaching"} your daily
              goals
            </span>
          </div>
          <div className={styles.insightItem}>
            <span className={styles.insightIcon}>🔥</span>
            <span className={styles.insightText}>
              {totalValue > 50 ? "Great" : "Good"} week overall! Keep up the
              momentum
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
