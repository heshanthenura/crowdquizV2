import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/profile", "/auth/", "/quizzes/create"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
