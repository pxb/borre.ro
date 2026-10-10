import { words } from "@/content/copy";
import copyTry from "@/content/copy.gen/try";
import { site as brand } from "@/content/site";
import type { Company, SiteRead } from "@/lib/review";
import type { Advice } from "@/lib/review-advice";

/* The email version of a readiness review (#624, Pedro 2026-10-10: "Email me
   this review"). Written when the review runs, in the same words as the page
   (copy/try.md), and stored with the run; n8n only sends it if the visitor
   asks. Everything from their site or the model is escaped. Plain, inline
   styles, readable in any mail app. */

const w = words(copyTry);
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MUTED = "color:#6b665c";
const H = "font-size:16px;margin:28px 0 8px";
const KINDS = ["site", "crm", "email", "booking", "chat", "shop", "reviews", "analytics", "hiring", "support"];

type Pick = { service: string; name: string; automation: string; why: string; case?: { slug: string; title: string } };

export function reviewEmail(site: SiteRead, co: Company, a: Advice | null, picks: Pick[], date: string) {
  const url = brand.url.replace(/\/$/, "");
  const link = (path: string, text: string) => `<a href="${url}${path}" style="color:#1d1b16">${esc(text)}</a>`;
  const out: string[] = [];
  out.push(`<p>${esc(w.t("email.intro"))}</p>`);
  out.push(`<h2 style="font-size:20px;margin:24px 0 2px">${esc(site.name)}</h2><p style="margin:0;${MUTED}">${esc(site.host)}</p>`);

  if (co.status === "verified") {
    const size = ["micro", "small", "medium"].includes(co.brief.size) ? w.t(`size.${co.brief.size}`) : "";
    const facts = [size, co.brief.sector, co.brief.incorporated ? `since ${co.brief.incorporated.slice(0, 4)}` : "", co.brief.town].filter(Boolean).join(" · ");
    out.push(`<p>${esc(fill(w.t("company.verified"), { name: co.name, number: co.number }))}<br><span style="${MUTED}">${esc(facts)}</span></p>`);
  } else {
    const key = co.why.startsWith("ch-") ? "company.unreachable" : co.why === "not-matched" ? "company.unmatched" : "company.none";
    out.push(`<p>${esc(w.t(key))}</p>`);
  }

  if (a?.questions.length) {
    out.push(`<h3 style="${H}">${esc(fill(w.t("group.chat"), { name: site.name }))}</h3>`);
    for (const q of a.questions) out.push(`<p style="margin:0 0 12px"><b>${esc(q.q)}</b><br>${esc(q.answer || w.t("chat.gap"))}</p>`);
  }

  if (picks.length) {
    out.push(`<h3 style="${H}">${esc(w.t("group.picks"))}</h3>`);
    for (const p of picks) {
      const flow =
        a?.agent && a.agent.service === p.service
          ? `<p style="margin:8px 0 4px;${MUTED}">${esc(w.t("agent.title"))}</p><ol style="margin:0 0 0 18px;padding:0">` +
            [`${w.t("agent.starts")}: ${a.agent.trigger}`, ...a.agent.steps, a.agent.approve ? `${w.t("agent.checks")}: ${a.agent.approve}` : "", a.agent.result ? `${w.t("agent.ends")}: ${a.agent.result}` : ""]
              .filter(Boolean)
              .map((x) => `<li>${esc(x)}</li>`)
              .join("") +
            "</ol>"
          : "";
      const similar = p.case ? `<br><span style="${MUTED}">${esc(w.t("pick.similar"))}: ${link(`/work/${p.case.slug}`, p.case.title)}</span>` : "";
      out.push(`<p style="margin:0 0 16px"><b>${link(`/services/${p.service}`, p.name)}</b><br>${esc(p.automation)}<br><span style="${MUTED}">${esc(p.why)}</span>${similar}</p>${flow}`);
    }
  }

  if (site.tools.length) {
    out.push(`<h3 style="${H}">${esc(w.t("group.tools"))}</h3><p>`);
    out.push(
      KINDS.map((k) => ({ k, names: site.tools.filter((t) => t.kind === k).map((t) => t.name) }))
        .filter((g) => g.names.length)
        .map((g) => `${esc(w.t(`tool.${g.k}`))}: ${esc(g.names.join(", "))}`)
        .join("<br>") + "</p>",
    );
  }

  const all = [...site.checks.ai, ...site.checks.customers];
  out.push(`<h3 style="${H}">${esc(fill(w.t("checks.summary"), { ok: all.filter((c) => c.ok).length, total: all.length }))}</h3><ul style="margin:0 0 0 18px;padding:0">`);
  for (const c of all) out.push(`<li>${c.ok ? "✓" : "!"} ${esc(fill(w.t(`check.${c.id}.${c.ok ? "ok" : "no"}`), c.vars ?? {}))}</li>`);
  out.push("</ul>");

  out.push(`<p style="margin-top:28px">${esc(w.t("email.outro"))} ${link("/contact", `${url.replace(/^https?:\/\//, "")}/contact`)}</p>`);
  out.push(`<p>${esc(w.t("email.sign"))}</p>`);
  out.push(`<p style="font-size:12px;${MUTED}">${esc(fill(w.t("source"), { host: site.host, date }))}<br>${esc(w.t("email.footer"))}</p>`);

  return {
    subject: fill(w.t("email.subject"), { host: site.host }).slice(0, 200),
    html: `<div style="font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;max-width:600px;color:#1d1b16;font-size:15px;line-height:1.5">${out.join("")}</div>`.slice(0, 60_000),
  };
}
