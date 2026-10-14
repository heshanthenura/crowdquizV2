export const SITE_NAME = "CrowdQuiz";
export const SITE_DESCRIPTION =
  "Challenge yourself with community-made quizzes, track your XP and climb the CrowdQuiz leaderboard.";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
