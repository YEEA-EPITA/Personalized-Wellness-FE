"use client";
import { useState, useEffect } from "react";

// Styles
import styles from "./styles.module.css";

// Components
import WelcomeSection from "./components/WelcomeSection";
import StatsOverview from "./components/StatsOverview";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";
import UpcomingTasks from "./components/UpcomingTasks";
import WellnessInsights from "./components/WellnessInsights";
import ProductivityChart from "./components/ProductivityChart";

// Zustand Store
import useUserStore from "@/shared/zustand/stores/useUserStore";
import useDashboardStore from "@/shared/zustand/stores/useDashboardStore";

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    burnoutScore: 0,
    lackOfBreak: 0,
    todayWorkLoad: 0,
    wellnessScore: 0,
  });

  const { fetchUserProfile } = useUserStore();
  const { fetchDailyStats, fetchGoogleCalendarEvents } = useDashboardStore();

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    // Fetch user data and dashboard metrics
    fetchDashboardData();
  }, []);

  const calculateWellnessScore = (data) => {
    const baseScore = 100;
    const penalties =
      (data?.extendedWorkSessions +
        data?.frequentContextSwitching +
        data?.lackOfBreaks +
        data?.nightWork +
        data?.todayWorkload) *
      5; // each factor deducts 5 points
    const wellnessScore = Math.max(0, baseScore - penalties);
    return wellnessScore || 0; // Ensure score is non-negative
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const userProfile = await fetchUserProfile();
      const dailyStats = await fetchDailyStats();
      const googleCalendarEvents = await fetchGoogleCalendarEvents();

      setUser({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        avatar: "/images/dashboard/avatar.svg",
        joinDate: userProfile.createdAt,
        recommendedMsg:
          dailyStats.recommendationMessage || "Keep up the great work!",
      });

      setStats({
        burnoutScore: dailyStats.burnoutScore || 0,
        lackOfBreak: dailyStats.lackOfBreak || 0,
        todayWorkLoad: dailyStats.todayWorkLoad || 0,
        wellnessScore: calculateWellnessScore(dailyStats),
      });

      const formattedEvents = googleCalendarEvents.map((event) => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        dueDate: event.end.dateTime,
        priority: new Date(event.start.dateTime) >= new Date() ? "high" : "low",
        platform: "google",
      }));

      setRecentActivities([
        {
          id: 1,
          type: "task_completed",
          title: "Daily standup meeting",
          time: "2 hours ago",
          platform: "jira",
        },
        {
          id: 2,
          type: "goal_achieved",
          title: "Weekly exercise goal",
          time: "4 hours ago",
          platform: "wellness",
        },
        {
          id: 3,
          type: "task_created",
          title: "Review design mockups",
          time: "6 hours ago",
          platform: "outlook",
        },
      ]);

      setUpcomingTasks(formattedEvents);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className={styles.dashboardHome}>
      <div className={styles.container}>
        {/* Welcome Section */}
        <WelcomeSection user={user} />

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Main Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <QuickActions />
            <UpcomingTasks tasks={upcomingTasks} />
            {/* <RecentActivity activities={recentActivities} /> */}
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <ProductivityChart />
            {/* <WellnessInsights score={stats.wellnessScore} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
