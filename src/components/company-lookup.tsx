"use client";

import "@/components/demo/portal.css";
import "@/components/lookup.css";
import { useRef, useState, type FormEvent } from "react";
import { words } from "@/content/copy";
import copyTry from "@/content/copy.gen/try";
import type { Brief, Match } from "@/lib/lookup";

// The company lookup (/try, #622), in the portal's product design like the
// prospecting brief it borrows from: search the register, pick the company,
// read what the prospecting system would. The words are in copy/try.md.
const w = words(copyTry);
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

type State =
  | { at: "idle" }
  | { at: "searching" }
  | { at: "matches"; matches: Match[] }
  | { at: "reading" }
  | { at: "brief"; brief: Brief; line: "off" | "writing" | string | null }
  | { at: "error"; msg: string };

async function post(body: object) {
  const r = await fetch("/api/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error === "none" ? "none" : r.status === 429 || data.error === "busy" ? "busy" : "error");
  return data;
}

export function CompanyLookup() {
  const [q, setQ] = useState("");
  const [s, setS] = useState<State>({ at: "idle" });
  const input = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const run = useRef(0);

  const fail = (e: unknown) => {
    const m = e instanceof Error ? e.message : "error";
    setS({ at: "error", msg: w.t(m === "none" ? "none" : m === "busy" ? "busy" : "error") });
  };

  async function open(number: string) {
    const id = ++run.current;
    setS({ at: "reading" });
    try {
      const { brief, line } = (await post({ number })) as { brief: Brief; line: boolean };
      if (id !== run.current) return;
      setS({ at: "brief", brief, line: line ? "writing" : "off" });
      requestAnimationFrame(() => heading.current?.focus());
      if (!line) return;
      const r = (await post({ number, line: true }).catch(() => ({ line: null }))) as { line: string | null };
      if (id !== run.current) return;
      setS({ at: "brief", brief, line: r.line });
    } catch (e) {
      if (id === run.current) fail(e);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (v.length < 2) return;
    const id = ++run.current;
    setS({ at: "searching" });
    try {
      const { matches } = (await post({ q: v })) as { matches: Match[] };
      if (id !== run.current) return;
      if (!matches.length) return setS({ at: "error", msg: w.t("none") });
      if (matches.length === 1) return open(matches[0].number);
      setS({ at: "matches", matches });
    } catch (e) {
      if (id === run.current) fail(e);
    }
  }

  function reset() {
    run.current++;
    setS({ at: "idle" });
    setQ("");
    requestAnimationFrame(() => input.current?.focus());
  }

  const busy = s.at === "searching" || s.at === "reading";
  const status = s.at === "searching" ? w.t("searching") : s.at === "reading" ? w.t("reading") : s.at === "error" ? s.msg : "";

  return (
    <div className="portal lk">
      <div className="p-top">
        <span className="p-brand">{w.t("brand")}</span>
      </div>
      <div className="p-wrap">
        {s.at !== "brief" ? (
          <form onSubmit={submit} className="lk-form" role="search">
            <label htmlFor="lk-q" className="lk-label">
              {w.t("label")}
            </label>
            <div className="lk-row">
              <input
                id="lk-q"
                ref={input}
                className="p-search lk-input"
                type="search"
                name="q"
                autoComplete="off"
                spellCheck={false}
                minLength={2}
                maxLength={80}
                required
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button type="submit" className="p-btn on lk-go" disabled={busy}>
                {w.t("search")}
              </button>
            </div>
            <p className="lk-status" role="status" aria-live="polite">
              {status}
              {busy ? <span className="lk-dots" aria-hidden="true" /> : null}
            </p>
          </form>
        ) : null}

        {s.at === "matches" ? (
          <div>
            <p className="p-panel-title">{w.t("pick")}</p>
            <ul className="lk-matches">
              {s.matches.map((m) => (
                <li key={m.number}>
                  <button type="button" onClick={() => open(m.number)} data-track="try-pick">
                    <span className="lname">{m.name}</span>
                    <span className="p-sub">{[m.number, m.town, m.year].filter(Boolean).join(" · ")}</span>
                    {m.status !== "active" ? <span className="chip">{m.status.replace(/-/g, " ")}</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {s.at === "brief" ? <BriefView b={s.brief} line={s.line} heading={heading} onReset={reset} /> : null}
      </div>
    </div>
  );
}

function BriefView({
  b,
  line,
  heading,
  onReset,
}: {
  b: Brief;
  line: "off" | "writing" | string | null;
  heading: React.RefObject<HTMLHeadingElement | null>;
  onReset: () => void;
}) {
  const active = b.status === "active";
  // Whole years to the day the register was read.
  const years = b.incorporated ? Math.floor((Date.parse(b.asOf) - Date.parse(b.incorporated)) / (365.25 * 864e5)) : null;
  const owners =
    b.owners && "parent" in b.owners
      ? fill(w.t("owners.parent"), { parent: b.owners.parent })
      : b.owners
        ? b.owners.people === 1
          ? w.t("owners.person")
          : fill(w.t("owners.people"), { n: b.owners.people })
        : null;
  const facts: [string, string][] = [
    ...(b.sector ? ([[w.t("fact.sector"), b.sector]] as [string, string][]) : []),
    [w.t("fact.size"), w.t(`size.${b.size}`)],
    ...(b.incorporated
      ? ([[w.t("fact.incorporated"), `${b.incorporated.slice(0, 4)}${years ? `, ${fill(w.t("years"), { n: years })}` : ""}`]] as [string, string][])
      : []),
    ...(b.town ? ([[w.t("fact.based"), b.town]] as [string, string][]) : []),
    ...(owners ? ([[w.t("fact.owners"), owners]] as [string, string][]) : []),
  ];

  return (
    <div className="lk-brief">
      <button type="button" className="p-back" onClick={onReset}>
        &lsaquo; {w.t("again")}
      </button>
      <h2 ref={heading} tabIndex={-1} className="p-h1 lk-name">
        {b.name}
      </h2>
      <p className="p-sub">
        <a href={`https://find-and-update.company-information.service.gov.uk/company/${b.number}`} target="_blank" rel="noreferrer">
          {b.number}
        </a>
      </p>

      <table className="p-fw" style={{ marginTop: 16 }}>
        <tbody>
          {facts.map(([k, v]) => (
            <tr key={k}>
              <th scope="row">{k}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!active ? (
        <p className="p-offer" style={{ marginTop: 20 }}>
          {fill(w.t("inactive"), { status: b.status.replace(/-/g, " ") })}
        </p>
      ) : (
        <>
          <h3 className="lk-h">{w.t("signals.title")}</h3>
          {b.signals.length ? (
            <ul className="lk-signals">
              {b.signals.map((x) => (
                <li key={x.kind}>
                  <span className="lk-what">
                    <span className="lk-label-s">{w.t(`signal.${x.kind}`)}</span>
                    <span>{w.t(`signal.${x.kind}.why`)}</span>
                  </span>
                  <span className="lk-when">
                    {day(x.date)}
                    {x.count > 1 ? <span className="lk-more">{fill(w.t("signals.more"), { n: x.count })}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lk-none">{w.t("signals.none")}</p>
          )}

          {line !== "off" ? (
            line === null ? null : (
              <div className="lk-line" aria-live="polite">
                <h3 className="lk-h">{w.t("line.title")}</h3>
                {line === "writing" ? (
                  <p className="lk-status">
                    {w.t("line.writing")}
                    <span className="lk-dots" aria-hidden="true" />
                  </p>
                ) : (
                  <>
                    <p className="p-offer">{line}</p>
                    <p className="lk-note">{w.t("line.note")}</p>
                  </>
                )}
              </div>
            )
          ) : null}
        </>
      )}

      <p className="lk-note" style={{ marginTop: 20 }}>
        {fill(w.t("source"), { date: day(b.asOf) })}
      </p>
    </div>
  );
}
