"use client";

import { useEffect, useRef, useState } from "react";
import { demoReach, demoLeads, signalsByBatch } from "@/content/demo-prospecting";

// One week of the prospecting loop, played on the case study (2026-10-08,
// #622): the week's stops on a track, filled in place one after another with
// their counts rolling, stopping at the rep's approval until the visitor gives
// it. DESIGN.md's track (2px ink, 16px stops, the picked stop in the accent),
// not a new visual. The counts are the demo's own, the same as the board under
// it. Server, no-JS and reduced motion show the finished week with every line.

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

export function LoopRun({
  label,
  stops,
  lines,
  run: runLabel,
  again,
  approve,
}: {
  label: string;
  stops: string[];
  lines: string[];
  run: string;
  again: string;
  approve: string;
}) {
  const n = stops.length;
  // `at` is the stop reached; n - 1 is the finished week, which is also what
  // the server renders. `run` counts plays so each one rolls the counts again.
  const [at, setAt] = useState(n - 1);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<"done" | "running" | "waiting">("done");
  const token = useRef(0);
  const approveRef = useRef<HTMLButtonElement>(null);

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
      requestAnimationFrame(() => approveRef.current?.focus());
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
  const fill = (i: number) =>
    i === at ? "border-accent bg-accent" : reached(i) ? "border-ink bg-ink" : "border-rule bg-paper";

  return (
    <div className="border-t-2 border-ink">
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
        <p className="text-sm font-medium text-ink-soft">{label}</p>
        {/* One button that becomes the rep's approval, so focus stays on it. */}
        <button
          ref={approveRef}
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
          {phase === "waiting" ? approve : run ? again : runLabel}
        </button>
      </div>

      {/* Wide screens: the stops across one track, the reached stop's line
          under it. Every line sits in one cell, so the slot never jumps. */}
      <div className="hidden pt-8 lg:block">
        <ol className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {stops.map((s, i) => (
            <li key={s} className="relative flex flex-col items-center text-center">
              <span
                className={`font-mono text-2xl tabular-nums tracking-[-0.02em] transition-colors duration-300 motion-reduce:transition-none ${
                  reached(i) ? (i === n - 1 ? "text-accent" : "text-ink") : "text-rule"
                }`}
                style={{ fontStretch: "88%" }}
              >
                {COUNTS[i] === null ? <span aria-hidden="true">&nbsp;</span> : <Count value={COUNTS[i]!} run={reached(i) ? run : 0} />}
              </span>
              <span className="relative mt-3 flex h-4 w-full items-center justify-center">
                {i < n - 1 ? (
                  <span aria-hidden="true" className="absolute top-1/2 left-1/2 h-0.5 w-full -translate-y-1/2 bg-rule">
                    <span
                      className={`absolute inset-0 origin-left bg-ink transition-transform duration-700 ease-out motion-reduce:transition-none ${
                        i < at ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                ) : null}
                <span
                  aria-hidden="true"
                  className={`relative size-4 rounded-full border-2 transition-colors duration-300 motion-reduce:transition-none ${fill(i)}`}
                />
              </span>
              <span className={`mt-3 font-medium leading-snug transition-colors duration-300 ${reached(i) ? "text-ink" : "text-ink-soft"}`}>{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 grid text-lg leading-relaxed text-ink-soft" aria-live="polite">
          {lines.map((l, i) => (
            <span key={l} aria-hidden={i !== at} className={`col-start-1 row-start-1 ${i === at ? "" : "invisible"}`}>
              {l}
            </span>
          ))}
        </p>
      </div>

      {/* Phones and tablets: the same stops down a track, every line shown. */}
      <ol className="relative mt-6 ml-[7px] lg:hidden">
        {stops.map((s, i) => (
          <li key={s} className="relative pb-6 pl-7 last:pb-0">
            {i < n - 1 ? (
              <span aria-hidden="true" className="absolute top-2 bottom-0 -left-0.5 w-0.5 bg-rule">
                <span
                  className={`absolute inset-0 origin-top bg-ink transition-transform duration-700 ease-out motion-reduce:transition-none ${
                    i < at ? "scale-y-100" : "scale-y-0"
                  }`}
                />
              </span>
            ) : null}
            <span aria-hidden="true" className={`absolute top-0.5 -left-[9px] size-4 rounded-full border-2 transition-colors duration-300 ${fill(i)}`} />
            <span className="flex items-baseline gap-3">
              {COUNTS[i] !== null ? (
                <span
                  className={`font-mono text-xl tabular-nums ${reached(i) ? (i === n - 1 ? "text-accent" : "text-ink") : "text-rule"}`}
                  style={{ fontStretch: "88%" }}
                >
                  <Count value={COUNTS[i]!} run={reached(i) ? run : 0} />
                </span>
              ) : null}
              <span className={`font-medium leading-snug ${reached(i) ? "text-ink" : "text-ink-soft"}`}>{s}</span>
            </span>
            <span className="mt-1 block leading-snug text-ink-soft">{lines[i]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
