import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";
import { supabase } from "@/app/utils/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/quizzes`, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${SITE_URL}/leaderboard`,
      changeFrequency: "hourly",
      priority: 0.5,
    },
    { url: `${SITE_URL}/docs`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const { data } = await supabase
    .from("quizzes")
    .select("id, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);

  const quizRoutes: MetadataRoute.Sitemap = (data ?? []).map((quiz) => ({
    url: `${SITE_URL}/quizzes/${quiz.id}`,
    lastModified: new Date(quiz.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...quizRoutes];
}
