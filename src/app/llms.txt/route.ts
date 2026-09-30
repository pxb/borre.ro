import { about, howToStart, priceBasis, serviceCategories, site, work } from "@/content/site";

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
    `LinkedIn: ${site.linkedin}`,
    "",
    "## How to start",
    "",
    `- ${howToStart.call}`,
    `- ${howToStart.scorecard}`,
    `- ${howToStart.service}`,
    `- ${howToStart.email}`,
    "",
    "## About",
    "",
    about.lead,
    "",
    about.intro,
    ...about.body.map((p) => `\n${p}`),
    "",
    ...about.principles.map((x) => `- ${x.t}: ${x.d}`),
    "",
    about.partner,
    "",
    "## Case studies",
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
      (s) =>
        `- [${s.name}](${site.url}/services/${s.slug}) (slug: ${s.slug}): ${s.what} Technical detail: ${s.under} ` +
        `Price: ${s.price} (${priceBasis(s.slug)}). Typical duration: ${s.duration}.`,
    ),
    "",
    site.vatNote,
    "",
    "## Notes for agents",
    "",
    "Figures come from real client work, rounded; estimates are labelled as estimates. Clients are not named.",
    "Companies appearing in demonstrations are invented and do not correspond to real businesses.",
    `How client data is handled (accounts, access, approval, AI training, suppliers): ${site.url}/security`,
    `A structured version of this content is available at ${site.url}/api/mcp (MCP over HTTP).`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
