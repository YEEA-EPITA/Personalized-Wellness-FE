"use client";
import { useRouter } from "next/navigation";

// Icons
import {
  FaPlus,
  FaCalendarPlus,
  FaFileAlt,
  FaUsers,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

// Styles
import styles from "./QuickActions.module.css";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      id: 1,
      title: "Create Task",
      description: "Add a new task or goal",
      icon: FaPlus,
      color: "#10b981",
      route: "/dashboard/tasks?action=create",
    },
    {
      id: 2,
      title: "Schedule Meeting",
      description: "Book a new appointment",
      icon: FaCalendarPlus,
      color: "#3b82f6",
      route: "/dashboard/calendar?action=create",
    },
    {
      id: 3,
      title: "View Goals",
      description: "Create wellness report",
      icon: FaFileAlt,
      color: "#8b5cf6",
      route: "/dashboard/calendar",
    },
    {
      id: 4,
      title: "Settings",
      description: "Manage preferences",
      icon: FaCog,
      color: "#6b7280",
      route: "/dashboard/settings",
    },
  ];

  const handleActionClick = (route) => {
    router.push(route);
  };

  return (
    <div className={styles.quickActions}>
      <div className={styles.header}>
        <h2 className={styles.title}>Quick Actions</h2>
        <p className={styles.subtitle}>
          Streamline your wellness workflow with these shortcuts
        </p>
      </div>

      <div className={styles.actionsGrid}>
        {actions.map((action) => {
          const IconComponent = action.icon;

          return (
            <button
              key={action.id}
              className={styles.actionCard}
              onClick={() => handleActionClick(action.route)}
              title={action.description}
            >
              <div
                className={styles.iconContainer}
                style={{
                  backgroundColor: `${action.color}20`,
                  color: action.color,
                }}
              >
                <IconComponent className={styles.icon} />
              </div>

              <div className={styles.actionContent}>
                <h3 className={styles.actionTitle}>{action.title}</h3>
                <p className={styles.actionDescription}>{action.description}</p>
              </div>

              <div className={styles.actionArrow}>→</div>
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>
        <button className={styles.viewAllBtn}>
          More features will come soon!
        </button>
      </div>
    </div>
  );
}
