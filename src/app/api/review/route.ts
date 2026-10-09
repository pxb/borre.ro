import { BadUrl, Blocked, Slow, Unreachable, findCompany, normalise, readSite } from "@/lib/review";
import { advise } from "@/lib/review-advice";
import { Busy } from "@/lib/lookup";
import { serviceFor, work } from "@/content/site";

/* The AI readiness review (/try, 2026-10-09). POST { url } and the answer
   streams back one JSON line per stage as it finishes: the site, its checks
   and the pages read, the company, the chat and the suggestions, then done.
   Same-site requests only; the firewall's per-IP rule covers /api/. A site's
   review is kept for an hour in memory, so a second look costs nothing.
   Nothing is logged but the model's cost. Each run also sends one anonymous
   line to an n8n table (Pedro, 2026-10-10: Vercel's own logs last an hour):
   outcome, whether the company, chat and suggestions came back, gaps, time,
   cost, where the visitor came from, environment. Never the address. */

export const maxDuration = 60;
// The AI step gets what's left of this, so the whole review ends in time.
const BUDGET = 55_000;
const SINK = "https://n8n.borre.ro/webhook/borre-review-a5e851656e47";
type Run = { company_found: boolean; chat: boolean; suggestions: boolean; gaps: number; cost_usd: number; model: string };
const NONE: Run = { company_found: false, chat: false, suggestions: false, gaps: 0, cost_usd: 0, model: "" };

// Only from a deployment (or locally with REVIEW_LOG=1), and never holding up the visitor for long.
async function count(outcome: string, run: Run, source: string, t0: number) {
  const env = process.env.VERCEL_ENV ?? (process.env.REVIEW_LOG === "1" ? "development" : "");
  if (!env) return;
  const seconds = Math.min(120, Math.round((Date.now() - t0) / 100) / 10);
  await fetch(SINK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outcome, ...run, seconds, source, env }),
    signal: AbortSignal.timeout(3000),
  }).catch(() => {});
}

type Event = Record<string, unknown>;
const HOUR = 60 * 60_000;
const cache = new Map<string, { at: number; events: Event[]; run: Run }>();

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
  // A case study's "What would this do for my business?" sends its slug.
  let from = "";
  try {
    const body = (await request.json()) as { url?: unknown; from?: unknown };
    if (typeof body.url !== "string") throw new BadUrl();
    start = normalise(body.url);
    if (typeof body.from === "string" && work.some((w) => w.slug === body.from)) from = body.from;
  } catch {
    return Response.json({ t: "error", code: "bad" }, { status: 400 });
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const t0 = Date.now();
      const until = t0 + BUDGET;
      const source = from || "try";
      const key = from ? `${start}|${from}` : start;
      const events: Event[] = [];
      const send = (e: Event) => {
        events.push(e);
        controller.enqueue(enc.encode(JSON.stringify(e) + "\n"));
      };
      const hit = cache.get(key);
      if (hit && Date.now() - hit.at < HOUR) {
        for (const e of hit.events) controller.enqueue(enc.encode(JSON.stringify(e) + "\n"));
        await count("done", { ...hit.run, cost_usd: 0 }, source, t0);
        controller.close();
        return;
      }
      let run = NONE;
      try {
        const site = await readSite(start);
        send({ t: "site", host: site.host, name: site.name, words: site.words, checks: site.checks, pages: site.pages.map((p) => p.url) });

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

        const a = await advise(site, co, until - Date.now() - 1_000, from);
        send(
          a
            ? {
                t: "advice",
                summary: a.summary,
                questions: a.questions,
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
        run = {
          company_found: co.status === "verified",
          chat: !!a?.questions.length,
          suggestions: !!a?.picks.length,
          gaps: a?.questions.filter((q) => !q.answer).length ?? 0,
          cost_usd: a?.cost ?? 0,
          model: a?.model ?? "",
        };
        await count("done", run, source, t0);
        // Keep only complete reviews with suggestions, so a failed AI step is retried next time.
        if (a) {
          if (cache.size > 200) cache.delete(cache.keys().next().value as string);
          cache.set(key, { at: Date.now(), events, run });
        }
      } catch (e) {
        const code = e instanceof BadUrl ? "bad" : e instanceof Blocked ? "blocked" : e instanceof Slow ? "slow" : e instanceof Busy ? "busy" : e instanceof Unreachable ? "unreachable" : "server";
        // Why it failed, never which site.
        console.warn(JSON.stringify({ event: "review-failed", code, reason: e instanceof Unreachable ? e.message : e instanceof Error && code === "server" ? e.name : undefined }));
        send({ t: "error", code });
        await count(code, run, source, t0);
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
