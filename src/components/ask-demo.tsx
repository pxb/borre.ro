"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

// The Context Engine answering one question, typed out when the Idea slide
// arrives. Server and no-JS render the finished exchange; the typing is a
// client enhancement. The company is invented and checked against the
// Companies House register (no match).
const Q = "Which customers have gone quiet this quarter?";
const A =
  "Three. The biggest is Fenwick Holt, who asked for a revised quote on 12 March and haven't replied since.";
const SOURCES = ["Call notes, 12 March", "CRM record, Fenwick Holt", "Quote, version 2"];

export function AskDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [mounted, setMounted] = useState(false);
  const [qn, setQ] = useState(0);
  const [an, setA] = useState(0);
  const [sn, setSrc] = useState(0);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const animate = mounted && !reduce;
  // Until the client takes over, show the finished exchange.
  const q = animate ? qn : Q.length;
  const a = animate ? an : A.length;
  const src = animate ? sn : SOURCES.length;

  useEffect(() => {
    if (!animate || !inView) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      for (let i = 1; i <= Q.length; i++) {
        if (cancelled) return;
        setQ(i);
        await wait(26);
      }
      await wait(350);
      for (let i = 2; i <= A.length + 1; i += 2) {
        if (cancelled) return;
        setA(Math.min(i, A.length));
        await wait(16);
      }
      for (let i = 1; i <= SOURCES.length; i++) {
        await wait(180);
        if (cancelled) return;
        setSrc(i);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [animate, inView]);

  return (
    <div ref={ref} className="border border-rule bg-paper p-5">
      <p className="label">Ask the Context Engine</p>
      {/* Each line reserves its full height with an invisible copy, so the
          card does not grow while it types. */}
      <p className="mt-3 grid font-medium text-ink">
        <span aria-hidden="true" className="invisible col-start-1 row-start-1">
          {Q}
        </span>
        <span className="col-start-1 row-start-1">{Q.slice(0, q)}</span>
      </p>
      <p className="mt-2 grid text-sm leading-relaxed text-ink-soft">
        <span aria-hidden="true" className="invisible col-start-1 row-start-1">
          {A}
        </span>
        <span className="col-start-1 row-start-1">{A.slice(0, a)}</span>
      </p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Sources">
        {SOURCES.map((s, i) => (
          <li
            key={s}
            className={`border border-rule px-2 py-0.5 text-xs text-ink-soft transition-opacity duration-300 ${
              i < src ? "opacity-100" : "opacity-0"
            }`}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
