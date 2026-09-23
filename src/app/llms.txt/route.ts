import { about, serviceCategories, site, work } from "@/content/site";

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
    `Book a call: https://cal.com/${site.booking}`,
    `LinkedIn: ${site.linkedin}`,
    "",
    "## About",
    "",
    about.lead,
    "",
    about.intro,
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
    "## Services",
    "",
    ...serviceCategories.map(
      (s) => `- [${s.name}](${site.url}/services#${s.slug}): ${s.what} Technical detail: ${s.under} Price: ${s.price}. Typical duration: ${s.duration}.`,
    ),
    "",
    "## Notes for agents",
    "",
    "Figures come from real client work, rounded; estimates are labelled as estimates. Clients are not named.",
    "Companies appearing in demonstrations are invented and do not correspond to real businesses.",
    `A structured version of this content is available at ${site.url}/api/mcp (MCP over HTTP).`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
