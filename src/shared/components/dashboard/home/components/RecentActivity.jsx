"use client";
import { useState } from "react";
import Image from "next/image";

// Icons
import {
  FaCheck,
  FaPlus,
  FaTrophy,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
} from "react-icons/fa";

// Styles
import styles from "./RecentActivity.module.css";

export default function RecentActivity({ activities = [] }) {
  const [filter, setFilter] = useState("all");

  const getActivityIcon = (type) => {
    const icons = {
      task_completed: FaCheck,
      task_created: FaPlus,
      goal_achieved: FaTrophy,
      task_updated: FaEdit,
      task_deleted: FaTrash,
    };
    return icons[type] || FaCheck;
  };

  const getActivityColor = (type) => {
    const colors = {
      task_completed: "#10b981",
      task_created: "#3b82f6",
      goal_achieved: "#f59e0b",
      task_updated: "#8b5cf6",
      task_deleted: "#ef4444",
    };
    return colors[type] || "#6b7280";
  };

  const getPlatformIcon = (platform) => {
    const platformIcons = {
      jira: "/images/dashboard/platforms/jira.png",
      outlook: "/images/dashboard/platforms/outlook.webp",
      github: "/images/dashboard/platforms/github.png",
      wellness: "/images/dashboard/no-data-showcase.svg",
    };
    return platformIcons[platform] || "/images/dashboard/no-data-showcase.svg";
  };

  const formatActivityType = (type) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true;
    return activity.type === filter;
  });

  const filters = [
    { key: "all", label: "All" },
    { key: "task_completed", label: "Completed" },
    { key: "task_created", label: "Created" },
    { key: "goal_achieved", label: "Goals" },
  ];

  if (!activities || activities.length === 0) {
    return (
      <div className={styles.recentActivity}>
        <div className={styles.header}>
          <h2 className={styles.title}>Recent Activity</h2>
        </div>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h3 className={styles.emptyTitle}>No recent activity</h3>
          <p className={styles.emptyDescription}>
            Your recent activities will appear here as you interact with the
            platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.recentActivity}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Activity</h2>
        <div className={styles.filterTabs}>
          {filters.map((filterOption) => (
            <button
              key={filterOption.key}
              className={`${styles.filterTab} ${
                filter === filterOption.key ? styles.active : ""
              }`}
              onClick={() => setFilter(filterOption.key)}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.activitiesList}>
        {filteredActivities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          const activityColor = getActivityColor(activity.type);

          return (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <div
                  className={styles.iconContainer}
                  style={{
                    backgroundColor: `${activityColor}20`,
                    color: activityColor,
                  }}
                >
                  <IconComponent className={styles.icon} />
                </div>
              </div>

              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <h3 className={styles.activityTitle}>{activity.title}</h3>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>

                <div className={styles.activityMeta}>
                  <span className={styles.activityType}>
                    {formatActivityType(activity.type)}
                  </span>

                  <div className={styles.platform}>
                    <Image
                      src={getPlatformIcon(activity.platform)}
                      alt={activity.platform}
                      width={16}
                      height={16}
                      className={styles.platformIcon}
                    />
                    <span className={styles.platformName}>
                      {activity.platform.charAt(0).toUpperCase() +
                        activity.platform.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.activityActions}>
                <button className={styles.actionBtn} title="View details">
                  <FaExternalLinkAlt />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && filter !== "all" && (
        <div className={styles.noResults}>
          <p>No {filter.replace("_", " ")} activities found.</p>
          <button
            className={styles.clearFilterBtn}
            onClick={() => setFilter("all")}
          >
            Show all activities
          </button>
        </div>
      )}

      <div className={styles.footer}>
        <button className={styles.viewAllBtn}>View Activity History</button>
      </div>
    </div>
  );
}
