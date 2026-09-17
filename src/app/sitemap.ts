import type { MetadataRoute } from "next";
import { site, work } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed = ["", "/work", "/solutions", "/about", "/contact"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
  }));
  const studies = work.map((c) => ({
    url: `${site.url}/work/${c.slug}`,
    lastModified: now,
  }));
  return [...fixed, ...studies];
}
