import { about, site, solutions, work } from "@/content/site";

/* Machine-readable summary, for agents and LLM crawlers.
   Generated from the same content as the pages, so it cannot drift. */
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.summary}`,
    "",
    `Site: ${site.url}`,
    `Contact: ${site.email}`,
    `LinkedIn: ${site.linkedin}`,
    "",
    "## About",
    "",
    about.lead,
    ...about.body.map((p) => `\n${p}`),
    "",
    "## Work",
    "",
    ...work.map(
      (c) =>
        `- [${c.title}](${site.url}/work/${c.slug}): ${c.tagline} ` +
        `Results: ${c.metrics.map((m) => `${m.value} ${m.label}`).join("; ")}.`,
    ),
    "",
    "## Solutions",
    "",
    ...solutions.map((s) => `- ${s.name}: ${s.what} Cost: ${s.price}`),
    "",
    "## Notes for agents",
    "",
    "Figures are real measurements from live systems, rounded. Clients are not named.",
    "Companies appearing in demonstrations are invented and do not correspond to real businesses.",
    `A structured version of this content is available at ${site.url}/api/mcp (MCP over HTTP).`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
