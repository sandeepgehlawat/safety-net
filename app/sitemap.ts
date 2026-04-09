import type { MetadataRoute } from "next";

const SITE = "https://safetynet.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];
}
