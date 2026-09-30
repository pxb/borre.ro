import { skills } from "@/lib/newsletter";
import { zip } from "@/lib/zip";

// /newsletter/skills/<name>.zip: a post's companion skill as the ZIP the Claude
// and ChatGPT apps upload (one folder named after the skill, SKILL.md inside).
export const dynamicParams = false;

export function generateStaticParams() {
  return skills().map((s) => ({ name: `${s.name}.zip` }));
}

export async function GET(_: Request, { params }: RouteContext<"/newsletter/skills/[name]">) {
  const { name } = await params;
  const s = skills().find((k) => `${k.name}.zip` === name);
  if (!s) return new Response("Not found", { status: 404 });
  const body = zip(s.files.map((f) => ({ path: `${s.name}/${f.path}`, content: f.content })));
  return new Response(body.buffer as ArrayBuffer, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${s.name}.zip"`,
    },
  });
}
