/* "Email me this review" (#624, Pedro 2026-10-10). POST { id, email }: the
   review's id from the done line and the address the visitor typed. The email
   was written when the review ran and is stored with it; n8n ("borre.ro: email
   a readiness review") finds it and sends it, with a copy to Pedro, three a
   day per address and fifty a day in all. Same-site only, behind the
   firewall's per-IP rule, and off unless REVIEW_EMAIL=on. The address is never
   logged here. */

const SEND = "https://n8n.borre.ro/webhook/borre-review-email-1defbd0e28a4";

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
  if (process.env.REVIEW_EMAIL !== "on") return Response.json({ ok: false, code: "off" });
  let id = "";
  let email = "";
  try {
    const body = (await request.json()) as { id?: unknown; email?: unknown };
    id = typeof body.id === "string" ? body.id : "";
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {}
  if (!/^[a-f0-9]{32}$/.test(id) || email.length > 254 || !/^[^\s@<>,;"]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(email)) {
    return Response.json({ ok: false, code: "bad" }, { status: 400 });
  }
  const env = process.env.VERCEL_ENV ?? "development";
  try {
    const res = await fetch(SEND, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_id: id, email, env }),
      signal: AbortSignal.timeout(20_000),
    });
    const d = (await res.json().catch(() => null)) as { ok?: boolean; code?: string } | null;
    if (res.ok && d?.ok) return Response.json({ ok: true });
    console.warn(JSON.stringify({ event: "review-email-not-sent", status: res.status, code: d?.code }));
    return Response.json({ ok: false, code: d?.code === "limit" ? "limit" : "failed" });
  } catch (e) {
    console.warn(JSON.stringify({ event: "review-email-failed", error: e instanceof Error ? e.name : "unknown" }));
    return Response.json({ ok: false, code: "failed" });
  }
}
