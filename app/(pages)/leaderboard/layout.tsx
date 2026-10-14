import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See the top CrowdQuiz players ranked by XP and find out where you stand.",
  alternates: { canonical: "/leaderboard" },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
