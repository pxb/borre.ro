import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

// Articles and monthly roundups for /writing (#606), written as markdown in
// src/content/writing/<slug>.md with a small front matter block:
//   ---
//   title: The case for boring automation
//   description: One or two sentences for the index, search and share cards.
//   date: 2026-10-06
//   type: article            (or: roundup)
//   draft: true              (optional)
//   ---
// Rendered to HTML at build time, so no markdown code ships to the browser.
// Drafts show everywhere except the live site (Vercel production), so Pedro
// can read them on a preview before they publish.

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: "article" | "roundup";
  draft: boolean;
  minutes: number;
  html: string;
};

const DIR = join(process.cwd(), "src", "content", "writing");
const LIVE = process.env.VERCEL_ENV === "production";

function frontMatter(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new Error("A writing file needs a front matter block");
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: raw.slice(m[0].length) };
}

function load(file: string): Post {
  const { data, body } = frontMatter(readFileSync(join(DIR, file), "utf-8"));
  const slug = file.replace(/\.md$/, "");
  for (const k of ["title", "description", "date"]) {
    if (!data[k]) throw new Error(`${file}: missing "${k}" in front matter`);
  }
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    type: data.type === "roundup" ? "roundup" : "article",
    draft: data.draft === "true",
    minutes: Math.max(1, Math.round(words / 220)),
    html: marked.parse(body, { async: false }) as string,
  };
}

// Newest first; drafts left out of the live site.
export function posts(): Post[] {
  let files: string[] = [];
  try {
    files = readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  } catch {
    return [];
  }
  return files
    .map(load)
    .filter((p) => !(LIVE && p.draft))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const post = (slug: string) => posts().find((p) => p.slug === slug);

export const longDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
