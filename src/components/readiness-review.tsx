"use client";

import "@/components/demo/portal.css";
import "@/components/lookup.css";
import "./review.css";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { words } from "@/content/copy";
import copyTry from "@/content/copy.gen/try";
import { REVIEW_KEY, site as brand, work } from "@/content/site";

// The AI readiness review (/try, Pedro 2026-10-09), in the portal's product
// design. It leads with the business (#624, 2026-10-10): the company, their
// site as a chat, where we'd start with the first job drawn as a workflow, and
// the tools we can see they use; the website checks come last, folded into one
// line. The answer streams in by stage; while the AI works, the progress list
// holds the place the chat will take. Words: copy/try.md.
const w = words(copyTry);
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

type Check = { id: string; ok: boolean; vars?: Record<string, string | number> };
type Tool = { name: string; kind: string };
type SiteE = { host: string; name: string; words: number; checks: { ai: Check[]; customers: Check[] }; tools?: Tool[]; pages?: string[] };
type CompanyE = {
  status: "verified" | "none";
  why?: string;
  name?: string;
  number?: string;
  facts?: { sector: string | null; size?: string; incorporated: string | null; town: string | null };
};
type AgentE = { service: string; trigger: string; steps: string[]; approve: string; result: string };
type PickE = { service: string; name: string; automation: string; why: string; case?: { slug: string; title: string } };
type QAE = { q: string; answer: string; page: string };
type AdviceE = { off?: boolean; summary?: string; questions?: QAE[]; picks?: PickE[]; agent?: AgentE | null };
type State = { stage: 0 | 1 | 2 | 3; site?: SiteE; company?: CompanyE; advice?: AdviceE; date?: string; id?: string; error?: string };

const STAGES = ["stage.site", "stage.company", "stage.advice"];

export function ReadinessReview() {
  const [url, setUrl] = useState("");
  const [s, setS] = useState<State | null>(null);
  // Arriving from a case study's "What would this do for my business?":
  // the suggestions start from that kind of work.
  const [from, setFrom] = useState("");
  const run = useRef(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("from") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (work.some((c) => c.slug === slug)) setFrom(slug);
  }, []);
  const fromTitle = work.find((c) => c.slug === from)?.title ?? "";

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
      const res = await fetch("/api/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: v, ...(from ? { from } : {}) }) });
      // Our own refusals (the firewall's rate limit, a server error) aren't
      // about their site, so they never say we couldn't open it.
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => null);
        return set({ error: err?.code ?? (res.status === 429 ? "busy" : "server") });
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
            set({ date: ev.date, id: ev.id });
            try {
              sessionStorage.setItem(REVIEW_KEY, fill(w.t("notes"), { host: state.site?.host ?? "" }));
            } catch {}
          } else if (ev.t === "error") set({ error: ev.code });
        }
      }
      // A stream that stops without finishing was cut off on our side.
      if (!state.date && !state.error) set({ error: "server" });
    } catch {
      set({ error: "server" });
    }
  }

  function reset() {
    run.current++;
    setS(null);
    setUrl("");
    requestAnimationFrame(() => input.current?.focus());
  }

  const busy = !!s && !s.error && !s.date;
  const error = s?.error ? w.t(`error.${["bad", "busy", "blocked", "slow", "server"].includes(s.error) ? s.error : "unreachable"}`) : "";

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
            {fromTitle ? <p className="lk-note">{fill(w.t("from"), { title: fromTitle })}</p> : null}
            <p className="lk-status" role="status" aria-live="polite">
              {error}
            </p>
          </form>
        ) : null}

        {/* Before the site arrives the steps sit under the box; after, they
            hold the place in the result where the chat will appear. */}
        {busy && !s?.site ? <Stages stage={s!.stage} /> : null}

        {s?.site ? <Result s={s} onReset={reset} error={error} /> : null}
      </div>
    </div>
  );
}

function Stages({ stage }: { stage: number }) {
  return (
    <ol className="rv-stages" aria-label="Progress">
      {STAGES.map((k, i) => {
        const st = stage > i ? "done" : stage === i ? "now" : "todo";
        return (
          <li key={k} className={st}>
            <span className="rv-tick" aria-hidden="true" />
            {w.t(k)}
            {st === "now" ? <span className="lk-dots" aria-hidden="true" /> : null}
          </li>
        );
      })}
    </ol>
  );
}

// The website checks, last and folded (#624): one line with the score, the
// two lists inside.
function Fold({ checks }: { checks: { ai: Check[]; customers: Check[] } }) {
  const all = [...checks.ai, ...checks.customers];
  return (
    <details className="rv-fold">
      <summary>{fill(w.t("checks.summary"), { ok: all.filter((c) => c.ok).length, total: all.length })}</summary>
      <Checks title={w.t("group.ai")} list={checks.ai} />
      <Checks title={w.t("group.customers")} list={checks.customers} />
    </details>
  );
}

// The software their pages' code shows they run, grouped by what it does.
const KINDS = ["site", "crm", "email", "booking", "chat", "shop", "reviews", "analytics", "hiring", "support"];
function Tools({ tools }: { tools: Tool[] }) {
  const groups = KINDS.map((k) => ({ k, names: tools.filter((t) => t.kind === k).map((t) => t.name) })).filter((g) => g.names.length);
  return (
    <>
      <h3 className="lk-h">{w.t("group.tools")}</h3>
      <dl className="rv-tools">
        {groups.map((g) => (
          <div key={g.k}>
            <dt>{w.t(`tool.${g.k}`)}</dt>
            <dd>
              {g.names.map((n) => (
                <span key={n} className="chip">
                  {n}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <p className="lk-note">{w.t("tools.note")}</p>
    </>
  );
}

// The first suggestion as a workflow: what starts it, what it does, where a
// person checks it, where it ends up.
function Agent({ a }: { a: AgentE }) {
  return (
    <div className="rv-flow">
      <p className="rv-flow-h">{w.t("agent.title")}</p>
      <ol>
        <li className="start">
          <span className="rv-flow-k">{w.t("agent.starts")}</span>
          {a.trigger}
        </li>
        {a.steps.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
        {a.approve ? (
          <li className="person">
            <span className="rv-flow-k">{w.t("agent.checks")}</span>
            {a.approve}
          </li>
        ) : null}
        {a.result ? (
          <li className="end">
            <span className="rv-flow-k">{w.t("agent.ends")}</span>
            {a.result}
          </li>
        ) : null}
      </ol>
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

// The visitor's own site as a chat (Pedro, 2026-10-09): the questions their
// customers would most likely ask, answered only from the pages we read, with
// the page each answer came from. A question the pages don't answer shows as
// a gap. The answer types out like the Ask demo on the homepage, at once
// under reduced motion; the longest question and answer sit invisibly
// underneath so the card doesn't jump between picks.
const longest = (xs: string[]) => xs.reduce((a, b) => (b.length > a.length ? b : a), "");
const pathOf = (u: string) => {
  try {
    const p = new URL(u).pathname.replace(/\/$/, "");
    return p || w.t("chat.home");
  } catch {
    return u;
  }
};
const say = (x: QAE) => x.answer || w.t("chat.gap");

function SiteChat({ name, qs, pages }: { name: string; qs: QAE[]; pages: string[] }) {
  const [pick, setPick] = useState(0);
  const [n, setN] = useState(Number.MAX_SAFE_INTEGER);
  const run = useRef(0);

  const play = useCallback(
    (i: number) => {
      const id = ++run.current;
      setPick(i);
      const text = say(qs[i]);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setN(Number.MAX_SAFE_INTEGER);
      setN(0);
      let k = 0;
      const step = () => {
        if (id !== run.current) return;
        k += 3;
        setN(k);
        if (k < text.length) setTimeout(step, 16);
      };
      setTimeout(step, 250);
    },
    [qs],
  );

  // The first question plays once, when the chat arrives.
  useEffect(() => {
    const t = setTimeout(() => play(0), 0);
    const r = run;
    return () => {
      clearTimeout(t);
      r.current++;
    };
  }, [play]);

  const x = qs[pick];
  const gaps = qs.filter((q) => !q.answer).length;
  const note = [
    gaps === 1 ? w.t("chat.gaps.one") : gaps > 1 ? fill(w.t("chat.gaps.many"), { n: gaps, total: qs.length }) : "",
    fill(w.t("chat.note"), { pages: pages.map(pathOf).join(", ") }),
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      <h3 className="lk-h">{fill(w.t("group.chat"), { name })}</h3>
      <div className="rv-chat">
        <div className="rv-qs" role="group" aria-label={w.t("chat.pick")}>
          {qs.map((q, i) => (
            <button
              key={i}
              type="button"
              className={`mini-q${i === pick ? " on" : ""}${q.answer ? "" : " gap"}`}
              aria-pressed={i === pick}
              onClick={() => play(i)}
              data-track="review-chat-question"
            >
              {q.q}
            </button>
          ))}
        </div>
        {/* Screen readers get the whole exchange in one live line, not the typing. */}
        <p className="sr-only" aria-live="polite">
          {x.q} {say(x)} {x.page ? pathOf(x.page) : ""}
        </p>
        {/* Two layers in one cell: the longest exchange, invisible, holds the
            height; the one showing sits on top with bubbles fitted to its text. */}
        <div className="mini-chat rv-layers" aria-hidden="true">
          <div className="rv-layer invisible">
            <p className="ask">{longest(qs.map((q) => q.q))}</p>
            <div className="ans">
              <p className="by">{name}</p>
              <p>{longest(qs.map(say))}</p>
              {qs.some((q) => q.page) ? (
                <ul className="ce-cites">
                  <li className="chip dot">{longest(qs.map((q) => (q.page ? pathOf(q.page) : "")))}</li>
                </ul>
              ) : null}
            </div>
          </div>
          <div className="rv-layer">
            <p className="ask">{x.q}</p>
            <div className={`ans${x.answer ? "" : " gap"}`}>
              <p className="by">{name}</p>
              <p>{say(x).slice(0, n)}</p>
              {x.page ? (
                <ul className="ce-cites">
                  <li className={`chip dot t-ver transition-opacity duration-300 ${n >= say(x).length ? "opacity-100" : "opacity-0"}`}>
                    {pathOf(x.page)}
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        </div>
        <p className="lk-note rv-chat-note">{note}</p>
      </div>
    </>
  );
}

function Result({ s, onReset, error }: { s: State; onReset: () => void; error: string }) {
  // Focus moves to the review's heading once it is on the page.
  const heading = useCallback((el: HTMLHeadingElement | null) => el?.focus(), []);
  const site = s.site!;
  const co = s.company;
  const size = co?.facts?.size && ["micro", "small", "medium"].includes(co.facts.size) ? w.t(`size.${co.facts.size}`) : "";
  const facts = co?.facts ? [size, co.facts.sector, co.facts.incorporated ? `since ${co.facts.incorporated.slice(0, 4)}` : "", co.facts.town].filter(Boolean).join(" · ") : "";
  // No company: no number on the pages, numbers that aren't theirs, or
  // Companies House out of reach (then the number may well be there).
  const none = co?.why?.startsWith("ch-") ? "company.unreachable" : co?.why === "not-matched" ? "company.unmatched" : "company.none";
  const busy = !s.error && !s.date;
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
          {co.status === "none" ? w.t(none) : fill(w.t(`company.${co.status}`), { name: co.name ?? "", number: co.number ?? "" })}
          {facts ? <span className="p-sub"> {facts}</span> : null}
        </p>
      ) : null}

      {busy && !s.advice ? <Stages stage={s.stage} /> : null}

      {s.advice?.questions?.length ? <SiteChat name={site.name} qs={s.advice.questions} pages={site.pages ?? []} /> : null}

      {s.advice ? (
        s.advice.off || (!s.advice.picks?.length && !s.advice.questions?.length) ? (
          <p className="lk-none" style={{ marginTop: 20 }}>
            {w.t("advice.off")}
          </p>
        ) : !s.advice.picks?.length ? null : (
          <>
            <h3 className="lk-h">{w.t("group.picks")}</h3>
            <ol className="rv-picks">
              {s.advice.picks.map((p) => (
                <li key={p.service}>
                  <Link href={`/services/${p.service}`} className="rv-service">
                    {p.name}
                  </Link>
                  <p className="rv-what">{p.automation}</p>
                  <p className="rv-why">{p.why}</p>
                  {s.advice?.agent?.service === p.service ? <Agent a={s.advice.agent} /> : null}
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

      {site.tools?.length ? <Tools tools={site.tools} /> : null}

      <Fold checks={site.checks} />

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
