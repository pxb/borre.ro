import { BadUrl, Blocked, findCompany, normalise, readSite } from "@/lib/review";
import { advise } from "@/lib/review-advice";
import { Busy } from "@/lib/lookup";
import { serviceFor, work } from "@/content/site";

/* The AI readiness review (/try, 2026-10-09). POST { url } and the answer
   streams back one JSON line per stage as it finishes: the site and its
   checks, the company, the suggestions, then done. Same-site requests only;
   the firewall's per-IP rule covers /api/. A site's review is kept for an
   hour in memory, so a second look costs nothing. Nothing is logged but the
   model's cost. */

export const maxDuration = 60;

type Event = Record<string, unknown>;
const HOUR = 60 * 60_000;
const cache = new Map<string, { at: number; events: Event[] }>();

function sameSite(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") === "same-origin";
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameSite(request)) return new Response(null, { status: 403 });
  let start: string;
  try {
    const body = (await request.json()) as { url?: unknown };
    if (typeof body.url !== "string") throw new BadUrl();
    start = normalise(body.url);
  } catch {
    return Response.json({ t: "error", code: "bad" }, { status: 400 });
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const events: Event[] = [];
      const send = (e: Event) => {
        events.push(e);
        controller.enqueue(enc.encode(JSON.stringify(e) + "\n"));
      };
      const hit = cache.get(start);
      if (hit && Date.now() - hit.at < HOUR) {
        for (const e of hit.events) controller.enqueue(enc.encode(JSON.stringify(e) + "\n"));
        controller.close();
        return;
      }
      try {
        const site = await readSite(start);
        send({ t: "site", host: site.host, name: site.name, words: site.words, checks: site.checks });

        const co = await findCompany(site).catch((e) => {
          if (e instanceof Busy) return { status: "none" as const };
          throw e;
        });
        send(
          co.status === "none"
            ? { t: "company", status: "none" }
            : {
                t: "company",
                status: co.status,
                name: co.name,
                number: co.number,
                facts: { sector: co.brief.sector, size: co.brief.size, incorporated: co.brief.incorporated, town: co.brief.town },
              },
        );

        const a = await advise(site, co);
        send(
          a
            ? {
                t: "advice",
                summary: a.summary,
                picks: a.picks.map((p) => {
                  const s = serviceFor(p.service)!;
                  const c = work.find((w) => w.slug === p.case_study);
                  return {
                    service: s.slug,
                    name: s.name,
                    automation: p.automation,
                    why: p.why,
                    ...(c ? { case: { slug: c.slug, title: c.title } } : {}),
                  };
                }),
              }
            : { t: "advice", off: true },
        );
        send({ t: "done", date: new Date().toISOString().slice(0, 10) });
        // Keep only complete reviews with suggestions, so a failed AI step is retried next time.
        if (a) {
          if (cache.size > 200) cache.delete(cache.keys().next().value as string);
          cache.set(start, { at: Date.now(), events });
        }
      } catch (e) {
        send({ t: "error", code: e instanceof BadUrl ? "bad" : e instanceof Blocked ? "blocked" : e instanceof Busy ? "busy" : "unreachable" });
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
