import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const languages = { uk: base, en: `${base}/en` };
  const lastModified = new Date();

  return [
    { url: base, lastModified, alternates: { languages } },
    { url: `${base}/en`, lastModified, alternates: { languages } },
  ];
}
