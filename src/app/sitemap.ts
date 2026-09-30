import type { MetadataRoute } from "next";
import { serviceCategories, site, work } from "@/content/site";
import { posts } from "@/lib/newsletter";

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
  const newsletter = [
    { url: `${site.url}/newsletter`, lastModified: now },
    ...posts().map((p) => ({ url: `${site.url}/newsletter/${p.slug}`, lastModified: new Date(p.date) })),
  ];
  return [...fixed, ...studies, ...services, ...newsletter];
}
