import { brief, Busy, companyNumber, line, lineOn, search, type Brief } from "@/lib/lookup";
import { words } from "@/content/copy";
import copySignals from "@/content/copy.gen/signal-check";

/* The company lookup (/try, #622). One POST route, so one firewall rule covers
   it: { q } searches the register, { number } builds the brief, { number,
   line: true } writes the optional AI opening line from that brief. Nothing
   in the request is logged or stored. Only this site's pages may call it. */

const w = words(copySignals);
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function sameSite(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") === "same-origin";
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

// The facts the AI line is written from: the brief's own words, nothing else.
function facts(b: Brief) {
  const out = [`Company: ${b.name}`];
  if (b.sector) out.push(`What it does: ${b.sector}`);
  out.push(`Size: ${w.t(`size.${b.size}`)}`);
  if (b.town) out.push(`Registered office: ${b.town}`);
  if (b.incorporated) out.push(`Incorporated: ${b.incorporated.slice(0, 4)}`);
  for (const s of b.signals) out.push(`Filed ${s.date}: ${w.t(`signal.${s.kind}`)}`);
  return out.join("\n");
}

export async function POST(request: Request) {
  if (!sameSite(request)) return json({ error: "forbidden" }, 403);
  let body: { q?: unknown; number?: unknown; line?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad" }, 400);
  }
  try {
    if (typeof body.number === "string") {
      const n = companyNumber(body.number);
      if (!n) return json({ error: "bad" }, 400);
      const b = await brief(n);
      if (!b) return json({ error: "none" }, 404);
      if (body.line === true) return json({ line: b.status === "active" ? await line(b, facts(b)) : null });
      return json({ brief: b, line: lineOn() && b.status === "active" });
    }
    if (typeof body.q === "string") {
      const q = body.q.trim().replace(/\s+/g, " ");
      if (q.length < 2 || q.length > 80) return json({ error: "bad" }, 400);
      // A company number goes straight to its brief's search entry.
      const n = companyNumber(q);
      if (n) {
        const b = await brief(n);
        return json({ matches: b ? [{ number: b.number, name: b.name, status: b.status, town: b.town, year: b.incorporated?.slice(0, 4) ?? null }] : [] });
      }
      return json({ matches: await search(q) });
    }
    return json({ error: "bad" }, 400);
  } catch (error) {
    return json({ error: error instanceof Busy ? "busy" : "unavailable" }, error instanceof Busy ? 429 : 503);
  }
}
