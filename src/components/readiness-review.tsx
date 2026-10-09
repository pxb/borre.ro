"use client";

import "@/components/demo/portal.css";
import "@/components/lookup.css";
import "./review.css";
import { useCallback, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { words } from "@/content/copy";
import copyTry from "@/content/copy.gen/try";
import { REVIEW_KEY, site as brand } from "@/content/site";

// The AI readiness review (/try, Pedro 2026-10-09), in the portal's product
// design. The answer streams in by stage, so each part appears as it's ready:
// the site's checks, the company, then the suggestions. Words: copy/try.md.
const w = words(copyTry);
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

type Check = { id: string; ok: boolean; vars?: Record<string, string | number> };
type SiteE = { host: string; name: string; words: number; checks: { ai: Check[]; customers: Check[] } };
type CompanyE = { status: "verified" | "none"; name?: string; number?: string; facts?: { sector: string | null; incorporated: string | null; town: string | null } };
type PickE = { service: string; name: string; automation: string; why: string; case?: { slug: string; title: string } };
type AdviceE = { off?: boolean; summary?: string; picks?: PickE[] };
type State = { stage: 0 | 1 | 2 | 3; site?: SiteE; company?: CompanyE; advice?: AdviceE; date?: string; error?: string };

const STAGES = ["stage.site", "stage.company", "stage.advice"];

export function ReadinessReview() {
  const [url, setUrl] = useState("");
  const [s, setS] = useState<State | null>(null);
  const run = useRef(0);
  const input = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = url.trim();
    if (!v) return;
    const id = ++run.current;
    let state: State = { stage: 0 };
    setS(state);
    const set = (next: Partial<State>) => {
      state = { ...state, ...next };
      if (id === run.current) setS(state);
    };
    try {
      const res = await fetch("/api/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: v }) });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ code: "unreachable" }));
        return set({ error: err.code ?? "unreachable" });
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          const ev = JSON.parse(line);
          if (ev.t === "site") set({ stage: 1, site: ev });
          else if (ev.t === "company") set({ stage: 2, company: ev });
          else if (ev.t === "advice") set({ stage: 3, advice: ev });
          else if (ev.t === "done") {
            set({ date: ev.date });
            try {
              sessionStorage.setItem(REVIEW_KEY, fill(w.t("notes"), { host: state.site?.host ?? "" }));
            } catch {}
          } else if (ev.t === "error") set({ error: ev.code });
        }
      }
    } catch {
      set({ error: "unreachable" });
    }
  }

  function reset() {
    run.current++;
    setS(null);
    setUrl("");
    requestAnimationFrame(() => input.current?.focus());
  }

  const busy = !!s && !s.error && !s.date;
  const error = s?.error ? w.t(`error.${["bad", "busy", "blocked"].includes(s.error) ? s.error : "unreachable"}`) : "";

  return (
    <div className="portal lk rv">
      <div className="p-top">
        <span className="p-brand">{w.t("brand")}</span>
      </div>
      <div className="p-wrap">
        {!s?.site ? (
          <form onSubmit={submit} className="lk-form">
            <label htmlFor="rv-url" className="lk-label">
              {w.t("label")}
            </label>
            <div className="lk-row">
              <input
                id="rv-url"
                ref={input}
                className="p-search lk-input"
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder={w.t("placeholder")}
                maxLength={200}
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button type="submit" className="p-btn on lk-go" disabled={busy}>
                {w.t("go")}
              </button>
            </div>
            <p className="lk-status" role="status" aria-live="polite">
              {error}
            </p>
          </form>
        ) : null}

        {/* The steps show while it works, and go once the review is done. */}
        {busy ? (
          <ol className="rv-stages" aria-label="Progress">
            {STAGES.map((k, i) => {
              const st = s!.stage > i ? "done" : s!.stage === i && !s!.error ? "now" : "todo";
              return (
                <li key={k} className={st}>
                  <span className="rv-tick" aria-hidden="true" />
                  {w.t(k)}
                  {st === "now" ? <span className="lk-dots" aria-hidden="true" /> : null}
                </li>
              );
            })}
          </ol>
        ) : null}

        {s?.site ? <Result s={s} onReset={reset} error={error} /> : null}
      </div>
    </div>
  );
}

function Checks({ title, list }: { title: string; list: Check[] }) {
  return (
    <>
      <h3 className="lk-h">{title}</h3>
      <ul className="rv-checks">
        {list.map((c) => (
          <li key={c.id} className={c.ok ? "ok" : "no"}>
            <span className="rv-mark" aria-hidden="true">
              {c.ok ? "✓" : "!"}
            </span>
            <span>{fill(w.t(`check.${c.id}.${c.ok ? "ok" : "no"}`), c.vars ?? {})}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Result({ s, onReset, error }: { s: State; onReset: () => void; error: string }) {
  // Focus moves to the review's heading once it is on the page.
  const heading = useCallback((el: HTMLHeadingElement | null) => el?.focus(), []);
  const site = s.site!;
  const co = s.company;
  const facts = co?.facts ? [co.facts.sector, co.facts.incorporated ? `since ${co.facts.incorporated.slice(0, 4)}` : "", co.facts.town].filter(Boolean).join(" · ") : "";
  return (
    <div className="lk-brief" aria-live="polite">
      <button type="button" className="p-back" onClick={onReset}>
        &lsaquo; {w.t("again")}
      </button>
      <h2 ref={heading} tabIndex={-1} className="p-h1 lk-name">
        {site.name}
      </h2>
      <p className="p-sub">{site.host}</p>
      {co ? (
        <p className={`rv-company ${co.status}`}>
          {co.status === "none" ? w.t("company.none") : fill(w.t(`company.${co.status}`), { name: co.name ?? "", number: co.number ?? "" })}
          {facts ? <span className="p-sub"> {facts}</span> : null}
        </p>
      ) : null}

      <Checks title={w.t("group.ai")} list={site.checks.ai} />
      <Checks title={w.t("group.customers")} list={site.checks.customers} />

      {s.advice ? (
        s.advice.off || !s.advice.picks?.length ? (
          <p className="lk-none" style={{ marginTop: 20 }}>
            {w.t("advice.off")}
          </p>
        ) : (
          <>
            <h3 className="lk-h">{w.t("group.picks")}</h3>
            {s.advice.summary ? <p className="rv-summary">{s.advice.summary}</p> : null}
            <ol className="rv-picks">
              {s.advice.picks.map((p) => (
                <li key={p.service}>
                  <Link href={`/services/${p.service}`} className="rv-service">
                    {p.name}
                  </Link>
                  <p className="rv-what">{p.automation}</p>
                  <p className="rv-why">{p.why}</p>
                  {p.case ? (
                    <p className="rv-case">
                      {w.t("pick.similar")}: <Link href={`/work/${p.case.slug}`}>{p.case.title}</Link>
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </>
        )
      ) : null}

      {error ? <p className="lk-status">{error}</p> : null}

      {s.date ? (
        <>
          <div className="rv-next">
            <h3 className="lk-h">{w.t("next.title")}</h3>
            <p>{w.t("next.body")}</p>
            <div className="rv-actions">
              <Link href="/contact" className="p-btn on" data-track="cta" data-track-where="review">
                {brand.cta}
              </Link>
              <Link href="/scorecard" className="rv-link">
                {w.t("next.scorecard")}
              </Link>
            </div>
          </div>
          <p className="lk-note" style={{ marginTop: 18 }}>
            {fill(w.t("source"), { host: site.host, date: day(s.date) })}
          </p>
        </>
      ) : null}
    </div>
  );
}
