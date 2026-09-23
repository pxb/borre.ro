"use client";

import "./portal.css";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ceAsker, ceBonnet, ceQuestions, ceSources, type SourceId } from "@/content/demo-showcases";
import { demoClient } from "@/content/demo-prospecting";

// The Context Engine answering real sales questions, in the portal's product
// design (#573). Pick a question: the access check runs, the sources it reads
// light up in turn, then the answer types out with its citations. The server
// renders the first question fully answered, so it reads without JavaScript.

type Phase = "idle" | "access" | "reading" | "answering" | "done";

export function ContextEngineDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<Phase>("done");
  const [reading, setReading] = useState<SourceId | null>(null);
  const [read, setRead] = useState<SourceId[]>(ceQuestions[0].uses);
  const [typed, setTyped] = useState(ceQuestions[0].answer.length);
  const run = useRef(0);

  const q = ceQuestions[qi];

  function ask(i: number) {
    const id = ++run.current;
    const target = ceQuestions[i];
    setQi(i);
    if (reduce) {
      setRead(target.uses);
      setReading(null);
      setTyped(target.answer.length);
      setPhase("done");
      return;
    }
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const alive = () => id === run.current;
    (async () => {
      setRead([]);
      setReading(null);
      setTyped(0);
      setPhase("access");
      await wait(650);
      if (!alive()) return;
      setPhase("reading");
      for (const s of target.uses) {
        setReading(s);
        await wait(520);
        if (!alive()) return;
        setRead((r) => [...r, s]);
      }
      setReading(null);
      setPhase("answering");
      for (let n = 2; n <= target.answer.length + 1; n += 3) {
        if (!alive()) return;
        setTyped(Math.min(n, target.answer.length));
        await wait(14);
      }
      setPhase("done");
    })();
  }

  // First time it scrolls into view, run the first question once for the wow.
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(() => ask(0), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const srcState = (id: SourceId, restricted?: boolean) => {
    if (restricted) return "locked";
    if (reading === id) return "reading";
    if (read.includes(id)) return "used";
    if (phase === "done" || phase === "answering") return "skip";
    return "";
  };

  return (
    <div ref={ref} className="portal scroll-mt-28">
      <div className="p-top">
        <span className="p-brand">{demoClient.short}</span>
        <nav className="p-nav">
          <button className="on">Context Engine</button>
        </nav>
      </div>
      <div className="p-wrap">
        <h3 className="p-h1">Ask the Context Engine</h3>
        <p className="p-sub">
          Asked by {ceAsker.name}, {ceAsker.role} · {ceAsker.tier} access
        </p>

        <div className="ce-qs" style={{ marginTop: 16 }} role="group" aria-label="Questions">
          {ceQuestions.map((c, i) => (
            <button key={c.id} className={`ce-q${i === qi ? " on" : ""}`} aria-pressed={i === qi} onClick={() => ask(i)}>
              <span className="k">{c.kind}</span>
              {c.q}
            </button>
          ))}
        </div>

        <div className="ce-grid">
          <div className="p-panel">
            <p className="p-panel-title">
              {phase === "access" ? "Checking access…" : phase === "reading" ? "Reading sources…" : "Sources"}
            </p>
            <ul style={{ display: "grid", gap: 4 }}>
              {ceSources.map((s) => (
                <li key={s.id} className={`ce-src ${srcState(s.id, s.restricted)}`}>
                  <span className="ic" aria-hidden="true" />
                  <span>{s.name}</span>
                  <span className="from">{s.restricted ? "Finance only" : s.from}</span>
                </li>
              ))}
            </ul>
            <div className="ce-access">
              <strong style={{ color: "var(--p-ink)" }}>{ceAsker.tier} access.</strong> {ceAsker.canSee}.{" "}
              {ceAsker.hidden}.
            </div>
          </div>

          <div className="p-panel" aria-live="polite">
            <p className="p-panel-title">{q.q}</p>
            <p className="ce-answer">
              {q.answer.slice(0, typed)}
              {phase === "answering" ? <span className="ce-caret" aria-hidden="true" /> : null}
            </p>
            <div className="ce-cites">
              {q.citations.map((c) => (
                <span key={c} className="chip dot t-ver" style={{ opacity: phase === "done" ? 1 : 0 }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <details className="ce-bonnet">
          <summary>Under the bonnet</summary>
          <dl>
            {ceBonnet.map(([t, d]) => (
              <div key={t}>
                <dt>{t}</dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </div>
  );
}
