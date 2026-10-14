import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Quizzes",
  description:
    "Browse and search community-made quizzes by topic. Pick a quiz, beat the clock and earn XP.",
  alternates: { canonical: "/quizzes" },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
