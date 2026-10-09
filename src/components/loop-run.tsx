"use client";

import { useEffect, useRef, useState } from "react";
import { demoReach, demoLeads, signalsByBatch } from "@/content/demo-prospecting";
import { words } from "@/content/copy";
import copyProspectingLoop from "@/content/copy.gen/case-prospecting-loop";
import "./loop-run.css";

// One week of the prospecting loop, played on the case study (2026-10-08,
// #622): the week's stops on a track, filled in place one after another with
// their counts rolling, stopping at the rep's approval until the visitor gives
// it. DESIGN.md's track (2px ink, 16px stops, the picked stop in the accent),
// not a new visual. The counts are the demo's own, the same as the board under
// it. Server, no-JS and reduced motion show the finished week.
//
// One list in the HTML: down the page with every stop's line on phones and
// tablets, across one track from 1024px with the reached stop's line under it.
// The words are read here rather than passed in, so they aren't sent twice
// (the case study's HTML sits near the first network round trip).

const w = words(copyProspectingLoop);
const STOPS = w.li("loop.stops");
const LINES = w.li("loop.lines");

const W38 = demoLeads.filter((l) => l.batch === "W38");
const ORDER = ["new", "sent", "reply", "meeting"];
const atLeast = (s: string) => W38.filter((l) => ORDER.indexOf(l.status) >= ORDER.indexOf(s)).length;
const COUNTS: (string | null)[] = [
  demoReach.TAM,
  demoReach["ICP match"],
  String(signalsByBatch.W38),
  String(W38.length),
  null, // the rep's approval
  String(atLeast("sent")),
  String(atLeast("reply")),
];
const GATE = COUNTS.indexOf(null);
const STEP = 850;

// Rolls "18.4k" or "34" up from zero; anything else shows as it is.
function Count({ value, run }: { value: string; run: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const m = /^(\D*)(\d+(?:\.\d+)?)(\D*)$/.exec(value);
    if (!el || !m || !run || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = parseFloat(m[2]);
    const dp = m[2].includes(".") ? m[2].split(".")[1].length : 0;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 600);
      el.textContent = `${m[1]}${(target * (1 - Math.pow(1 - p, 3))).toFixed(dp)}${m[3]}`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value, run]);
  return <span ref={ref}>{value}</span>;
}

export function LoopRun() {
  const n = STOPS.length;
  // `at` is the stop reached; n - 1 is the finished week, which is also what
  // the server renders. `run` counts plays so each one rolls the counts again.
  const [at, setAt] = useState(n - 1);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<"done" | "running" | "waiting">("done");
  const token = useRef(0);
  const button = useRef<HTMLButtonElement>(null);

  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function walk(from: number, to: number, id: number) {
    for (let i = from; i <= to; i++) {
      if (id !== token.current) return false;
      setAt(i);
      if (i < to) await wait(STEP);
    }
    return id === token.current;
  }

  async function start() {
    const id = ++token.current;
    setRun((r) => r + 1);
    if (reduce()) {
      setAt(GATE);
      setPhase("waiting");
      return;
    }
    setPhase("running");
    setAt(0);
    await wait(STEP);
    if (await walk(1, GATE, id)) {
      setPhase("waiting");
      requestAnimationFrame(() => button.current?.focus());
    }
  }

  async function approved() {
    const id = ++token.current;
    if (reduce()) {
      setAt(n - 1);
      setPhase("done");
      return;
    }
    setPhase("running");
    await wait(300);
    if (await walk(GATE + 1, n - 1, id)) setPhase("done");
  }

  useEffect(() => () => void token.current++, []);

  const reached = (i: number) => i <= at;

  return (
    <div className="border-t-2 border-ink">
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
        <p className="text-sm font-medium text-ink-soft">{w.t("loop.label")}</p>
        {/* One button that becomes the rep's approval, so focus stays on it. */}
        <button
          ref={button}
          type="button"
          onClick={phase === "waiting" ? approved : phase === "running" ? undefined : start}
          // aria-disabled, not disabled: a disabled button drops keyboard focus.
          aria-disabled={phase === "running"}
          data-track={phase === "waiting" ? "demo-loop-approve" : "demo-loop-run"}
          className={`min-h-11 px-5 text-sm font-medium transition-colors aria-disabled:cursor-default aria-disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 ${
            phase === "waiting"
              ? "btn-orange border-2 border-transparent focus-visible:outline-ink"
              : "border-2 border-ink text-ink hover:bg-ink hover:text-cream aria-disabled:hover:bg-transparent aria-disabled:hover:text-ink focus-visible:outline-accent"
          }`}
        >
          {phase === "waiting" ? w.t("loop.approve") : run ? w.t("loop.again") : w.t("loop.run")}
        </button>
      </div>

      <ol className="lp-stops">
        {STOPS.map((s, i) => (
          <li key={s} className={`lp-stop${reached(i) ? " on" : ""}${i === at ? " at" : ""}${i < at ? " past" : ""}${i === n - 1 ? " good" : ""}`}>
            {i < n - 1 ? <span aria-hidden="true" className="lp-seg" /> : null}
            <span aria-hidden="true" className="lp-dot" />
            {COUNTS[i] !== null ? (
              <span className="lp-fig">
                <Count value={COUNTS[i]!} run={reached(i) ? run : 0} />
              </span>
            ) : (
              <span aria-hidden="true" className="lp-fig lp-blank" />
            )}
            <span className="lp-name">{s}</span>
            <span className="lp-line">{LINES[i]}</span>
          </li>
        ))}
      </ol>
      <p className="lp-now" aria-live="polite">
        {LINES[at]}
      </p>
    </div>
  );
}
