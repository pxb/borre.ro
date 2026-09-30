import { posts } from "@/lib/newsletter";
import { site } from "@/content/site";

// RSS for /newsletter (#606), built with the site.
export const dynamic = "force-static";

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = posts()
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site.url}/newsletter/${p.slug}</link>
      <guid>${site.url}/newsletter/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(`${site.newsletter.name} from ${site.name}`)}</title>
    <link>${site.url}/newsletter</link>
    <description>${esc(`${site.newsletter.name}: ${site.newsletter.strap}`)}</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
