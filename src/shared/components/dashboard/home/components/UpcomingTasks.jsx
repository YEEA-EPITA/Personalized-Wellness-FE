"use client";
import { useState } from "react";
import Image from "next/image";

// Icons
import {
  FaClock,
  FaFlag,
  FaCheck,
  FaEllipsisV,
  FaCalendarAlt,
} from "react-icons/fa";

// Components
import AddMeetingDialog from "./AddMeetingDialog";

// Styles
import styles from "./UpcomingTasks.module.css";

export default function UpcomingTasks({ tasks = [] }) {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskComplete = (taskId) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleMeetingCreated = () => {
    // You can add any refresh logic here if needed
    // For example, refresh the tasks list or show a success message
    console.log("Meeting created successfully!");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getPlatformIcon = (platform) => {
    const platformIcons = {
      jira: "/images/dashboard/platforms/jira.png",
      outlook: "/images/dashboard/platforms/outlook.webp",
      github: "/images/dashboard/platforms/github.png",
      wellness: "/images/dashboard/no-data-showcase.svg",
      google: "/images/dashboard/platforms/google.png",
    };
    return platformIcons[platform] || "/images/dashboard/no-data-showcase.svg";
  };

  const formatDueDate = (dueDate) => {
    // Simple formatting - in real app, use proper date library
    const now = new Date();
    if (dueDate > now) {
      return { text: dueDate, isToday: true, isOverdue: false };
    } else if (dueDate < now) {
      return { text: dueDate, isToday: false, isOverdue: true };
    } else {
      return { text: dueDate, isToday: false, isOverdue: false };
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className={styles.upcomingTasks}>
        <div className={styles.header}>
          <h2 className={styles.title}>Upcoming Meetings</h2>
          <FaCalendarAlt className={styles.headerIcon} />
        </div>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✅</div>
          <h3 className={styles.emptyTitle}>All caught up!</h3>
          <p className={styles.emptyDescription}>
            No upcoming meetings at the moment. Great job staying on top of your
            wellness goals!
          </p>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.addTaskBtn}
            onClick={() => setIsDialogOpen(true)}
          >
            <span className={styles.plusIcon}>+</span>
            Add New Meeting
          </button>
        </div>

        <AddMeetingDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleMeetingCreated}
        />
      </div>
    );
  }

  return (
    <div className={styles.upcomingTasks}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Upcoming Meetings</h2>
          <span className={styles.taskCount}>{tasks.length} meetings</span>
        </div>
        <button className={styles.viewAllBtn}>View All</button>
      </div>

      <div className={styles.tasksList}>
        {tasks.map((task) => {
          const isCompleted = completedTasks.has(task.id);
          const dueDateInfo = formatDueDate(task.dueDate);

          return (
            <div
              key={task.id}
              className={`${styles.taskCard} ${
                isCompleted ? styles.completed : ""
              }`}
            >
              <div className={styles.taskHeader}>
                <button
                  className={styles.checkboxBtn}
                  onClick={() => handleTaskComplete(task.id)}
                >
                  <FaCheck
                    className={`${styles.checkIcon} ${
                      isCompleted ? styles.checked : ""
                    }`}
                  />
                </button>

                <div className={styles.taskContent}>
                  <h3 className={styles.taskTitle}>{task.title}</h3>
                  <div className={styles.taskMeta}>
                    <div className={styles.dueDate}>
                      <FaClock className={styles.clockIcon} />
                      <span className={dueDateInfo.isToday ? styles.today : ""}>
                        {dueDateInfo.text}
                      </span>
                    </div>

                    <div className={styles.priority}>
                      <FaFlag
                        style={{ color: getPriorityColor(task.priority) }}
                        className={styles.priorityIcon}
                      />
                      <span className={styles.priorityText}>
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.taskActions}>
                  <div className={styles.platform}>
                    <Image
                      src={getPlatformIcon(task.platform)}
                      alt={task.platform}
                      width={24}
                      height={24}
                      className={styles.platformIcon}
                    />
                  </div>

                  <button className={styles.moreBtn}>
                    <FaEllipsisV />
                  </button>
                </div>
              </div>

              {isCompleted && (
                <div className={styles.completedBadge}>✨ Task completed!</div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.addTaskBtn}
          onClick={() => setIsDialogOpen(true)}
        >
          <span className={styles.plusIcon}>+</span>
          Add New Meeting
        </button>
      </div>

      <AddMeetingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleMeetingCreated}
      />
    </div>
  );
}
