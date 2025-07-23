import { DASHBOARD_ROUTES } from "@/shared/utils/paths";

export const SIDEBAR_LINKS = {
  dashboard: {
    id: 1,
    title: "Home",
    path: DASHBOARD_ROUTES.home,
    icon: "/images/dashboard/home.svg",
    allowed: [],
  },
  Calendar: {
    id: 2,
    title: "Calendar",
    path: DASHBOARD_ROUTES.calendar,
    icon: "/images/dashboard/calander.svg",
    allowed: [],
  },
  accounts: {
    id: 3,
    title: "Accounts",
    path: DASHBOARD_ROUTES.accounts,
    icon: "/images/dashboard/user.svg",
    allowed: [],
  },
  Tasks: {
    id: 4,
    title: "Tasks",
    path: DASHBOARD_ROUTES.tasks,
    icon: "/images/dashboard/calander.svg",
    allowed: [],
  },
  profile: {
    id: 5,
    title: "Profile",
    path: DASHBOARD_ROUTES.profile,
    icon: "/images/dashboard/profile.svg",
    allowed: [],
  },
};
