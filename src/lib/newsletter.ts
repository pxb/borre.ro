import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

// Articles and monthly roundups for /newsletter (#606), written as markdown in
// src/content/newsletter/<slug>.md with a small front matter block:
//   ---
//   title: The case for boring automation
//   description: One or two sentences for the index, search and share cards.
//   date: 2026-10-06
//   type: article            (or: roundup)
//   checked: 2026-09-30      (the day every source was last read; shown on the post)
//   skill: workflow-or-agent (optional: a companion Agent Skill)
//   skill_note: One plain line for readers on what the skill does.
//   draft: true              (optional)
//   ---
// Rendered to HTML at build time, so no markdown code ships to the browser.
// Drafts show everywhere except the live site (Vercel production), so Pedro
// can read them on a preview before they publish.
//
// Freshness (Pedro, 2026-09-30: the AI world moves very quickly): every post
// says when its sources were last checked, and a post published more than 30
// days after that date fails the build, so nothing goes out on stale checks.
//
// Companion skills (Pedro, 2026-09-30: "add value with every post"): a post can
// name a skill in src/content/newsletter/skills/<name>/, a folder in the open
// Agent Skills format (agentskills.io: SKILL.md with name and description front
// matter, optional references/ and assets/). The site serves it as a ZIP for the
// Claude and ChatGPT apps and as a raw SKILL.md for coding agents.

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: "article" | "roundup";
  draft: boolean;
  checked: string; // YYYY-MM-DD
  skill?: Skill;
  skillNote?: string;
  minutes: number;
  html: string;
};

export type Skill = {
  name: string;
  description: string;
  files: { path: string; content: string }[]; // paths relative to the skill folder
};

const DIR = join(process.cwd(), "src", "content", "newsletter");
const SKILLS = join(DIR, "skills");
const LIVE = process.env.VERCEL_ENV === "production";
const STALE_DAYS = 30;

function frontMatter(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) throw new Error("A newsletter file needs a front matter block");
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: raw.slice(m[0].length) };
}

function walk(dir: string, prefix = ""): string[] {
  return readdirSync(dir).flatMap((f) =>
    statSync(join(dir, f)).isDirectory() ? walk(join(dir, f), `${prefix}${f}/`) : [`${prefix}${f}`],
  );
}

// Checked against the Agent Skills specification: the name is 1-64 lowercase
// letters, digits and single hyphens and matches its folder; the description
// is 1-1024 characters.
export function skill(name: string): Skill {
  const dir = join(SKILLS, name);
  const files = walk(dir).map((path) => ({ path, content: readFileSync(join(dir, path), "utf-8") }));
  const main = files.find((f) => f.path === "SKILL.md");
  if (!main) throw new Error(`skill ${name}: no SKILL.md`);
  const { data } = frontMatter(main.content);
  if (data.name !== name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    throw new Error(`skill ${name}: name must match its folder and the spec`);
  }
  if (!data.description || data.description.length > 1024) throw new Error(`skill ${name}: bad description`);
  return { name, description: data.description, files };
}

function load(file: string): Post {
  const { data, body } = frontMatter(readFileSync(join(DIR, file), "utf-8"));
  const slug = file.replace(/\.md$/, "");
  for (const k of ["title", "description", "date", "checked"]) {
    if (!data[k]) throw new Error(`${file}: missing "${k}" in front matter`);
  }
  const draft = data.draft === "true";
  const age = (Date.parse(data.date) - Date.parse(data.checked)) / 86_400_000;
  if (!draft && age > STALE_DAYS) {
    throw new Error(`${file}: sources checked ${data.checked}, over ${STALE_DAYS} days before ${data.date}. Re-check them.`);
  }
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    type: data.type === "roundup" ? "roundup" : "article",
    draft,
    checked: data.checked,
    skill: data.skill ? skill(data.skill) : undefined,
    skillNote: data.skill_note,
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

// The skills of the posts on this deploy (a draft's skill stays off the live site).
export const skills = () => posts().flatMap((p) => (p.skill ? [{ ...p.skill, post: p }] : []));

export const longDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
