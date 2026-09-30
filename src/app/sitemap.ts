import type { MetadataRoute } from "next";
import { serviceCategories, site, work } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed = ["", "/work", "/demo/prospecting", "/services", "/about", "/contact", "/privacy", "/scorecard", "/security", "/llms.txt"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
  }));
  const studies = work.map((c) => ({
    url: `${site.url}/work/${c.slug}`,
    lastModified: now,
  }));
  const services = serviceCategories.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: now,
  }));
  return [...fixed, ...studies, ...services];
}
