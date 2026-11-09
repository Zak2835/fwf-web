import type { MetadataRoute } from "next";

const BASE_URL = "https://fwfclub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/classes", "/events", "/shop", "/contact"];
  const locales = ["en", "ar"] as const;
  const now = new Date();

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${route}`,
          ar: `${BASE_URL}/ar${route}`,
        },
      },
    })),
  );
}
