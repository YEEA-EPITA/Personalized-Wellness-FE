import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

import { Providers } from "@/shared/redux/provider";
import { Toaster } from "react-hot-toast";
import { AuthGuard } from "@/shared/components/AuthGuard";

export const metadata = {
  title: "Personalized Wellness Planner - Prevent Burnout, Boost Productivity",
  description:
    "The ultimate wellness platform for remote workers and entrepreneurs. Sync your calendar, get burnout alerts, wellness nudges, and connect with a supportive community.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
        <Toaster
          position={"top-right"}
          toastOptions={{ className: "react-hot-toast" }}
        />
      </body>
    </html>
  );
}
