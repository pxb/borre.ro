"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import "@/components/demo/portal.css";
import { demoClient } from "@/content/demo-prospecting";
import { askQuestions as ASKS } from "@/content/demo-showcases";

// The longest question, answer and source list, laid invisibly under the one
// showing so the card is as tall as the tallest pick and never jumps. One
// copy each, not all four, to keep the homepage's HTML small (it sits just
// under the first network round trip).
const longest = (xs: string[]) => xs.reduce((a, b) => (b.length > a.length ? b : a));
const LONG_Q = longest(ASKS.map((o) => o.q));
const LONG_A = longest(ASKS.map((o) => o.a));
const LONG_S = ASKS.reduce((a, b) => (b.sources.join("").length > a.sources.join("").length ? b : a)).sources;

// The Context Engine answering a question, typed out when the Method slide
// arrives; the visitor can then pick any of four questions (2026-10-08, #622),
// in the card's top bar so the card is no taller on the slide.
// Server and no-JS render the first exchange finished; the typing is a client
// enhancement, and under reduced motion a pick shows its answer at once.
// Companies are invented and checked against the Companies House register (no
// match). In the portal's own design, like the Context Engine demo on /work
// (Pedro, 2026-09-30), so it reads as the product.
export function AskDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [mounted, setMounted] = useState(false);
  const [pick, setPick] = useState(0);
  const [qn, setQ] = useState(0);
  const [an, setA] = useState(0);
  const [sn, setSrc] = useState(0);
  const run = useRef(0);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const animate = mounted && !reduce;
  const x = ASKS[pick];
  // Until the client takes over, show the finished exchange.
  const q = animate ? qn : x.q.length;
  const a = animate ? an : x.a.length;
  const src = animate ? sn : x.sources.length;

  function play(i: number) {
    const id = ++run.current;
    const alive = () => id === run.current;
    const t = ASKS[i];
    setPick(i);
    setQ(0);
    setA(0);
    setSrc(0);
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      for (let k = 1; k <= t.q.length; k++) {
        if (!alive()) return;
        setQ(k);
        await wait(22);
      }
      await wait(320);
      for (let k = 2; k <= t.a.length + 1; k += 2) {
        if (!alive()) return;
        setA(Math.min(k, t.a.length));
        await wait(14);
      }
      for (let k = 1; k <= t.sources.length; k++) {
        await wait(160);
        if (!alive()) return;
        setSrc(k);
      }
    })();
  }

  // The first question plays once, the first time the card is in view.
  useEffect(() => {
    if (!animate || !inView) return;
    const t = setTimeout(() => play(0), 0);
    const r = run;
    return () => {
      clearTimeout(t);
      r.current++; // stops a run in progress
    };
  }, [animate, inView]);

  return (
    <div ref={ref} className="portal mini" aria-label="Ask the Context Engine: an example">
      <div className="p-top">
        <span className="p-brand">{demoClient.short}</span>
        <div className="mini-qs" role="group" aria-label="Ask another question">
          {ASKS.map((o, i) => (
            <button
              key={o.id}
              type="button"
              className={`mini-q${i === pick ? " on" : ""}`}
              aria-pressed={i === pick}
              onClick={() => (animate ? play(i) : setPick(i))}
              data-track="demo-ask-question"
              data-track-question={o.id}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      {/* Screen readers get the whole exchange in one live line, not the typing. */}
      <p className="sr-only" aria-live="polite">
        {x.q} {x.a}
      </p>
      <div className="mini-chat" aria-hidden="true">
        <p className="ask grid">
          <span className="invisible col-start-1 row-start-1">{LONG_Q}</span>
          <span className="col-start-1 row-start-1">{x.q.slice(0, q)}</span>
        </p>
        <div className="ans">
          <p className="by">Context Engine · {x.sources.length} sources</p>
          <p className="grid">
            <span className="invisible col-start-1 row-start-1">{LONG_A}</span>
            <span className="col-start-1 row-start-1">{x.a.slice(0, a)}</span>
          </p>
          <div className="grid">
            <ul className="ce-cites invisible col-start-1 row-start-1">
              {LONG_S.map((s) => (
                <li key={s} className="chip dot t-ver">
                  {s}
                </li>
              ))}
            </ul>
            <ul className="ce-cites col-start-1 row-start-1">
              {x.sources.map((s, i) => (
                <li
                  key={s}
                  className={`chip dot t-ver transition-opacity duration-300 ${i < src ? "opacity-100" : "opacity-0"}`}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
