import usePlatformsStore from "@/shared/zustand/stores/usePlatformsStore";

const {
  generateGoogleAuthUrl,
  generateJiraAuthUrl,
  generateOutlookAuthUrl,
  generateTrelloAuthUrl,
} = usePlatformsStore.getState();

import { FaGoogle, FaTrello } from "react-icons/fa";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { SiJira } from "react-icons/si";

export const PLATFORMS = {
  google: {
    name: "Google",
    value: "GOOGLE",
    icon: "/images/dashboard/platforms/google.png",
    width: 50,
    height: 50,
    geneateAuthUrl: () => generateGoogleAuthUrl(),
  },
  outlook: {
    name: "Outlook",
    value: "OUTLOOK",
    icon: "/images/dashboard/platforms/outlook.webp",
    width: 50,
    height: 50,
    geneateAuthUrl: () => generateOutlookAuthUrl(),
  },
  jira: {
    name: "Jira",
    value: "JIRA",
    icon: "/images/dashboard/platforms/jira.webp",
    height: 50,
    width: 50,
    geneateAuthUrl: () => generateJiraAuthUrl(),
  },
  trello: {
    name: "Trello",
    value: "TRELLO",
    icon: "/images/dashboard/platforms/trello.png",
    width: 45,
    height: 45,
    geneateAuthUrl: () => generateTrelloAuthUrl(),
  },
};

export const PLATFORM_THEMES = {
  GOOGLE: {
    label: "Google Account",
    icon: FaGoogle,
    color: "#4285F4",
    bg: "#e8f0fe",
  },
  TRELLO: {
    label: "Trello Workspace",
    icon: FaTrello,
    color: "#0079bf",
    bg: "#e5f3fc",
  },
  OUTLOOK: {
    label: "Outlook Mail",
    icon: PiMicrosoftOutlookLogoFill,
    color: "#0072c6",
    bg: "#e1f0ff",
  },
  JIRA: {
    label: "Jira Workspace",
    icon: SiJira,
    color: "#0052cc",
    bg: "#eaf2ff",
  },
};
