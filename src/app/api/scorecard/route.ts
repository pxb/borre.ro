import { questions, result, type Answers } from "@/content/scorecard";
import { serviceFor } from "@/content/site";

/* Logs one anonymous scorecard result (#581, option A, Pedro 2026-09-30).
   The browser sends only option numbers; the result is worked out here, from
   the same code the page uses, and forwarded to an n8n data table with the
   answers as text. No name, email or IP goes on: n8n sees Vercel, not the
   reader, and keeps no run data for successful runs. The n8n side drops
   anything malformed, since this URL is in a public repo. */
const SINK = "https://n8n.borre.ro/webhook/borre-scorecard-00ed6ffd2009";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const raw = (body as { answers?: Record<string, unknown> } | null)?.answers;
  const a: Answers = {};
  for (const q of questions) {
    const v = raw?.[q.id];
    if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v >= q.options.length) {
      return new Response(null, { status: 400 });
    }
    a[q.id] = v;
  }
  const r = result(a);
  const text = (id: string) => questions.find((q) => q.id === id)!.options[a[id]].t;
  try {
    await fetch(SINK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        band: r.band.name,
        score: r.score,
        recommended: serviceFor(r.service)?.name ?? r.service,
        hours_low: r.low,
        hours_high: r.high,
        people: text("people"),
        hours: text("hours"),
        ai_use: text("use"),
        customer_data: text("data"),
        clear_job: text("job"),
        leadership: text("agreed"),
        data_rules: text("rules"),
        wants: text("want"),
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Logging is best effort: the reader's result never depends on it.
  }
  return new Response(null, { status: 204 });
}
