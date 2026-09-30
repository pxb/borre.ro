import { skills } from "@/lib/newsletter";

// /newsletter/skills/<name>/SKILL.md: the skill's instructions as plain text,
// for coding agents (Claude Code, Codex and others) to fetch or save directly.
export const dynamicParams = false;

export function generateStaticParams() {
  return skills().map((s) => ({ name: s.name }));
}

export async function GET(_: Request, { params }: RouteContext<"/newsletter/skills/[name]/SKILL.md">) {
  const { name } = await params;
  const s = skills().find((k) => k.name === name);
  const main = s?.files.find((f) => f.path === "SKILL.md");
  if (!main) return new Response("Not found", { status: 404 });
  return new Response(main.content, { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
