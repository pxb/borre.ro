import { randomUUID } from "node:crypto";
import { BadUrl, Blocked, Slow, Unreachable, findCompany, normalise, readSite, type Company } from "@/lib/review";
import { advise, type Advice } from "@/lib/review-advice";
import { reviewEmail } from "@/lib/review-email";
import { Busy } from "@/lib/lookup";
import { serviceFor, work } from "@/content/site";

/* The AI readiness review (/try, 2026-10-09). POST { url } and the answer
   streams back one JSON line per stage as it finishes: the site, its checks,
   its tools and the pages read; the company; the chat, the suggestions and
   the first one as a workflow; then done, with the review's id (for "Email
   me this review"). Same-site requests only; the firewall's per-IP rule
   covers /api/. A site's review is kept for an hour in memory, so a second
   look costs nothing.

   Each run sends one line to an n8n table (Pedro, 2026-10-10: Vercel's own
   logs last an hour; "log the website": yes, /privacy says so): outcome,
   website, matched company, whether the chat and suggestions came back and
   why not, time, cost, where the visitor came from, environment, and the
   review itself so it can be emailed. Nothing about the visitor. */

export const maxDuration = 60;
// The AI step gets what's left of this, so the whole review ends in time.
const BUDGET = 55_000;
const SINK = "https://n8n.borre.ro/webhook/borre-review-a5e851656e47";

type Run = {
  review_id: string;
  site: string;
  company_number: string;
  company_name: string;
  ch_status: string;
  ai_status: string;
  company_found: boolean;
  chat: boolean;
  suggestions: boolean;
  gaps: number;
  cost_usd: number;
  model: string;
  review_json: string;
  email_subject: string;
  email_html: string;
};
const NONE: Run = {
  review_id: "",
  site: "",
  company_number: "",
  company_name: "",
  ch_status: "",
  ai_status: "",
  company_found: false,
  chat: false,
  suggestions: false,
  gaps: 0,
  cost_usd: 0,
  model: "",
  review_json: "",
  email_subject: "",
  email_html: "",
};

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

// The review as the email will show it: what the visitor saw, nothing more.
function record(site: { host: string; name: string; checks: unknown; tools: unknown }, co: Company, a: Advice | null, picks: unknown[]) {
  return JSON.stringify({
    host: site.host,
    name: site.name,
    company: co.status === "verified" ? { name: co.name, number: co.number } : null,
    checks: site.checks,
    tools: site.tools,
    questions: a?.questions ?? [],
    picks,
    agent: a?.agent ?? null,
  }).slice(0, 20_000);
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
        // A repeat look: counted, but the stored review stays with the first run.
        await count("done", { ...hit.run, review_id: "", review_json: "", email_subject: "", email_html: "", cost_usd: 0 }, source, t0);
        controller.close();
        return;
      }
      let run: Run = { ...NONE, site: new URL(start).hostname.replace(/^www\./, "") };
      try {
        const site = await readSite(start);
        run.site = site.host;
        send({ t: "site", host: site.host, name: site.name, words: site.words, checks: site.checks, tools: site.tools, pages: site.pages.map((p) => p.url) });

        const co: Company = await findCompany(site).catch((e) => {
          if (e instanceof Busy) return { status: "none", why: "ch-busy" } as const;
          throw e;
        });
        send(
          co.status === "none"
            ? { t: "company", status: "none", why: co.why }
            : {
                t: "company",
                status: co.status,
                name: co.name,
                number: co.number,
                facts: { sector: co.brief.sector, size: co.brief.size, incorporated: co.brief.incorporated, town: co.brief.town },
              },
        );
        run = {
          ...run,
          ch_status: co.status === "verified" ? "ok" : co.why,
          company_found: co.status === "verified",
          company_number: co.status === "verified" ? co.number : "",
          company_name: co.status === "verified" ? co.name : "",
        };

        let { advice: a, status } = await advise(site, co, until - Date.now() - 1_000, from);
        // An empty or broken answer, or a provider error, gets one more go if there's time.
        if (!a && /^(empty|unparsed|http-5)/.test(status) && until - Date.now() > 20_000) {
          ({ advice: a, status } = await advise(site, co, until - Date.now() - 1_000, from));
        }
        const picks = (a?.picks ?? []).map((p) => {
          const s = serviceFor(p.service)!;
          const c = work.find((w) => w.slug === p.case_study);
          return {
            service: s.slug,
            name: s.name,
            automation: p.automation,
            why: p.why,
            ...(c ? { case: { slug: c.slug, title: c.title } } : {}),
          };
        });
        send(a ? { t: "advice", summary: a.summary, questions: a.questions, picks, agent: a.agent } : { t: "advice", off: true });
        const id = randomUUID().replace(/-/g, "");
        const date = new Date().toISOString().slice(0, 10);
        // "Email me this review" shows once the sending is switched on (REVIEW_EMAIL=on).
        send({ t: "done", date, id, email: process.env.REVIEW_EMAIL === "on" });
        const mail = reviewEmail(site, co, a, picks, new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
        run = {
          ...run,
          review_id: id,
          ai_status: status,
          chat: !!a?.questions.length,
          suggestions: !!a?.picks.length,
          gaps: a?.questions.filter((q) => !q.answer).length ?? 0,
          cost_usd: a?.cost ?? 0,
          model: a?.model ?? "",
          review_json: record(site, co, a, picks),
          email_subject: mail.subject,
          email_html: mail.html,
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
