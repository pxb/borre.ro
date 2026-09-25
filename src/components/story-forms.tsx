"use client";

import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion, useAnimate } from "motion/react";
import Link from "next/link";
import { ArrowRight, Repeat } from "lucide-react";
import { AskDemo } from "@/components/ask-demo";
import { Figure } from "@/components/figure";
import { After, DrawLine, DrawRing, Marker, useMotionOn } from "@/components/draw";
import { evidence, value } from "@/content/site";

// The right-hand side of each story slide (#584). One frame, a heading over a
// 2px ink rule, and inside it a shape that matches what the slide says:
// proportions, a timeline, a formula, a ladder, a figure wall and a loop.
// Where a slide has several items, only the picked one shows its description,
// so the slide carries one sentence at a time instead of four.

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function useMounted() {
  const [m, setM] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setM(true), []);
  return m;
}

// A small tab set: hover, focus, tap or the arrow keys pick an item. Before
// the client takes over (SSR, no-JS) `js` is false and every form renders all
// of its descriptions inline, so nothing is lost without JavaScript.
// `at` is the item the pinned story's scroll has reached (null when the story
// is stacked). It picks only when it changes, so a hover or tap holds until
// the reader scrolls on, and it never moves the pick (or focus) while focus is
// inside the set, so keyboard and screen-reader users keep their place.
function usePick(n: number, label: string, at: number | null = null) {
  const [on, setOn] = useState(at ?? 0);
  const js = useMounted();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  useEffect(() => {
    if (at == null) return;
    if (refs.current.some((el) => el != null && el === document.activeElement)) return;
    setOn(at);
  }, [at]);
  const list = { role: "tablist" as const, "aria-label": label };
  const tab = (i: number) => ({
    ref: (el: HTMLButtonElement | null) => {
      refs.current[i] = el;
    },
    id: `${uid}t${i}`,
    type: "button" as const,
    role: "tab" as const,
    "aria-selected": on === i,
    "aria-controls": `${uid}p`,
    tabIndex: on === i ? 0 : -1,
    // Pointer movement, not entry: in the pinned story a slide moves in under a
    // resting pointer, and that must not pick whatever lands beneath it.
    onPointerMove: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" && on !== i) setOn(i);
    },
    onFocus: () => setOn(i),
    onClick: () => setOn(i),
    onKeyDown: (e: React.KeyboardEvent) => {
      const k = e.key;
      const j =
        k === "ArrowRight" || k === "ArrowDown"
          ? (i + 1) % n
          : k === "ArrowLeft" || k === "ArrowUp"
            ? (i - 1 + n) % n
            : k === "Home"
              ? 0
              : k === "End"
                ? n - 1
                : -1;
      if (j < 0) return;
      e.preventDefault();
      setOn(j);
      refs.current[j]?.focus();
    },
  });
  const panel = { id: `${uid}p`, role: "tabpanel" as const, "aria-labelledby": `${uid}t${on}` };
  return { on, js, list, tab, panel, uid };
}

type Pick = ReturnType<typeof usePick>;

// Every description sits in the same grid cell, so the slot is as tall as the
// longest one and picking another item never moves the layout.
function Detail({ pick, items, className = "" }: { pick: Pick; items: ReactNode[]; className?: string }) {
  if (!pick.js) return null;
  return (
    <div {...pick.panel} className={`grid ${className}`}>
      {items.map((it, i) => (
        <div
          key={i}
          aria-hidden={pick.on !== i}
          className={`[grid-area:1/1] transition-opacity duration-200 ${
            pick.on === i ? "opacity-100" : "invisible opacity-0"
          }`}
        >
          {it}
        </div>
      ))}
    </div>
  );
}

// Shown inline under each item only when the tabs are not running.
function Inline({ pick, children }: { pick: Pick; children: ReactNode }) {
  if (pick.js) return null;
  return <span className="mt-1 block text-sm font-normal leading-snug text-ink-soft">{children}</span>;
}

// A label only where it names something the slide title doesn't (AI3, the
// managed service); labels that repeat the title were cut as over-explaining.
function Frame({ heading, children }: { heading?: ReactNode; children: ReactNode }) {
  return (
    <div className="border-t-2 border-ink">
      {heading ? <p className="pt-3 text-sm font-medium text-ink-soft">{heading}</p> : null}
      <div className="pt-6">{children}</div>
    </div>
  );
}

function DetailLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`group inline text-lg leading-snug text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink ${FOCUS}`}
    >
      {children}
      <ArrowRight aria-hidden className="ml-1.5 inline size-4 align-[-2px] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

// How many items each slide walks through as the pinned story scrolls.
export function itemCount(id: string) {
  if (id === "review") return CALL.length;
  if (id === "method") return AI3.length;
  if (id === "engagement") return STARTS.length;
  return 1;
}

export function Example({ id, go, at = null }: { id: string; go: (id: string) => void; at?: number | null }) {
  if (id === "problem") return <Gap />;
  if (id === "review") return <Timeline at={at} />;
  if (id === "method") return <Formula at={at} />;
  if (id === "engagement") return <Ladder go={go} at={at} />;
  if (id === "value") return <Worth />;
  return <Loop />;
}

// 01 Problem: each barrier with our answer under it, so the slide turns from
// the fear to the fix. Figures in ink: these are problems, not results; the
// accent is the arrow that leads into each answer.
type Evidence = (typeof evidence)[number];

function Source({ e }: { e: { source: string; href: string } }) {
  return (
    <a
      href={e.href}
      target="_blank"
      rel="noreferrer"
      className={`text-sm text-ink-soft underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink ${FOCUS}`}
    >
      {e.source}
    </a>
  );
}

const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Gap() {
  return (
    <Frame>
      <ul className="grid gap-6">
        {evidence.map((e: Evidence) => (
          <li key={e.stat}>
            <Figure value={e.stat} beside tone="ink" count>
              <p className="text-ink-soft">
                {sentence(e.claim)}. <Source e={e} />
              </p>
              <p className="mt-1.5 flex items-start gap-1.5 font-medium text-pretty text-ink">
                <ArrowRight aria-hidden className="mt-[0.3em] size-4 shrink-0 text-accent" />
                {e.answer}
              </p>
            </Figure>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

// 02 Review: the call as a 0 to 30 minute track with four stops. Vertical on phones.
function Timeline({ at }: { at: number | null }) {
  const p = usePick(CALL.length, "In the 30 minutes", at);
  return (
    <Frame>
      <div
        aria-hidden="true"
        className="mb-3 hidden justify-between font-mono text-xs tabular-nums text-ink-soft sm:flex"
      >
        <span>0</span>
        <span>30 min</span>
      </div>
      <div {...p.list} className="relative grid sm:grid-cols-4 sm:gap-x-5">
        <DrawLine className="absolute top-[7px] right-0 left-0 hidden h-0.5 origin-left bg-ink sm:block" />
        <DrawLine axis="y" className="absolute top-3 bottom-8 left-[7px] w-0.5 origin-top bg-ink sm:hidden" />
        {CALL.map((r, i) => {
          const on = p.on === i;
          return (
            <button
              key={r.t}
              {...p.tab(i)}
              className={`group relative flex min-h-11 items-start gap-4 pb-3 text-left sm:flex-col sm:pb-0 ${FOCUS}`}
            >
              <span
                aria-hidden="true"
                className="relative mt-0.5 size-4 shrink-0 rounded-full border-2 border-ink bg-paper sm:mt-0"
              >
                {on ? <Marker id={`${p.uid}m`} className="absolute -inset-0.5 rounded-full bg-accent" /> : null}
              </span>
              <span
                className={`font-medium leading-snug transition-colors ${
                  on ? "text-ink" : "text-ink-soft group-hover:text-ink"
                }`}
              >
                {r.t}
                <Inline pick={p}>{r.d}</Inline>
              </span>
            </button>
          );
        })}
      </div>
      <Detail
        pick={p}
        className="mt-5 sm:mt-7"
        items={CALL.map((r) => (
          <p key={r.t} className="text-lg leading-snug text-ink">
            {r.d}
          </p>
        ))}
      />
    </Frame>
  );
}

// The same call as a static vertical track with every stop described, for the
// column beside the calendar on /contact.
export function CallTrack() {
  return (
    <Frame>
      <p aria-hidden="true" className="font-mono text-xs tabular-nums text-ink-soft">0</p>
      <ol className="relative mt-3 ml-[7px]">
        <DrawLine axis="y" className="absolute inset-y-0 -left-0.5 w-0.5 origin-top bg-ink" />
        {CALL.map((r, i) => (
          <li key={r.t} className="relative pb-7 pl-7 last:pb-0">
            {/* The first stop, where the call starts, in the accent. */}
            <span
              aria-hidden="true"
              className={`absolute top-0.5 -left-[9px] size-4 rounded-full border-2 ${
                i === 0 ? "border-accent bg-accent" : "border-ink bg-paper"
              }`}
            />
            <span className="block font-medium leading-snug text-ink">{r.t}</span>
            <span className="mt-1 block leading-snug text-ink-soft">{r.d}</span>
          </li>
        ))}
      </ol>
      <p aria-hidden="true" className="mt-3 font-mono text-xs tabular-nums text-ink-soft">30 min</p>
    </Frame>
  );
}

// AI cubed, drawn: each part adds a dimension. Context is a line, agents sweep
// it into a square, evals extrude it into a cube. The edges each pick adds draw
// themselves in the accent; the ones already there stay ink. Without JS the
// whole cube shows; under reduced motion edges appear without drawing.
const P = { a: [8, 26], b: [40, 26], c: [40, 58], d: [8, 58], a2: [24, 10], b2: [56, 10], c2: [56, 42] } as const;
const EDGES: { from: keyof typeof P; to: keyof typeof P; level: number }[] = [
  { from: "d", to: "c", level: 0 },
  { from: "d", to: "a", level: 1 },
  { from: "a", to: "b", level: 1 },
  { from: "b", to: "c", level: 1 },
  { from: "a", to: "a2", level: 2 },
  { from: "b", to: "b2", level: 2 },
  { from: "c", to: "c2", level: 2 },
  { from: "a2", to: "b2", level: 2 },
  { from: "b2", to: "c2", level: 2 },
];

function Cube({ level }: { level: number }) {
  const moving = useMotionOn();
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="size-12 shrink-0 overflow-visible sm:size-14">
      {EDGES.map((e, i) => {
        const shown = e.level <= level;
        const line = { x1: P[e.from][0], y1: P[e.from][1], x2: P[e.to][0], y2: P[e.to][1] };
        const stroke = e.level === level ? "var(--accent)" : "var(--ink)";
        if (!moving)
          return shown ? <line key={i} {...line} stroke={stroke} strokeWidth={2} strokeLinecap="square" /> : null;
        return (
          <motion.line
            key={i}
            {...line}
            strokeWidth={2}
            strokeLinecap="square"
            initial={false}
            animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0, stroke }}
            transition={{ duration: 0.45, delay: shown ? (i - EDGES.findIndex((x) => x.level === e.level)) * 0.12 : 0, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </svg>
  );
}

// 03 Method: the three parts as the formula they multiply into, the demo beneath.
function Formula({ at }: { at: number | null }) {
  const p = usePick(AI3.length, "Context, agents and evals", at);
  return (
    <Frame
      heading={
        <span className="flex items-end justify-between gap-6">
          <span>
            AI<sup>3</sup>
          </span>
          <Cube level={p.js ? p.on : AI3.length - 1} />
        </span>
      }
    >
      <div {...p.list} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {AI3.map((a, i) => {
          const on = p.on === i;
          return (
            <Fragment key={a.term}>
              {i > 0 ? (
                <span aria-hidden="true" className="font-mono text-2xl text-ink-soft">
                  ×
                </span>
              ) : null}
              <button
                {...p.tab(i)}
                className={`relative min-h-11 text-left text-[clamp(1.5rem,min(2.4vw,4.4vh),2.25rem)] font-medium leading-tight tracking-[-0.02em] transition-colors ${
                  on ? "text-ink" : "text-ink-soft hover:text-ink"
                } ${FOCUS}`}
              >
                {a.term}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0.5 h-0.5 bg-ink transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    on ? "origin-left scale-x-100" : "origin-right scale-x-0"
                  }`}
                />
              </button>
            </Fragment>
          );
        })}
      </div>
      {!p.js ? (
        <ul className="mt-4 grid gap-3">
          {AI3.map((a) => (
            <li key={a.term}>
              <span className="font-medium text-ink">{a.term}: </span>
              <DetailLink href={a.href}>{a.plain}</DetailLink>
            </li>
          ))}
        </ul>
      ) : null}
      <Detail
        pick={p}
        className="mt-4"
        items={AI3.map((a) => (
          <DetailLink key={a.term} href={a.href}>
            {a.plain}
          </DetailLink>
        ))}
      />
      <div className="mt-6 border-t border-rule pt-5">
        <AskDemo />
      </div>
    </Frame>
  );
}

// The picked way in, marked in the accent, climbs the staircase to the new pick:
// up each riser, then across the next tread (and across, then down, going
// back). One bar over the four columns, moved as x in column widths and y in
// pixels; a jump under reduced motion, still at the first tread without JS.
function Climber({ at, n }: { at: number; n: number }) {
  const moving = useMotionOn();
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const prev = useRef(at);
  const [start] = useState(at);
  const top = (i: number) => (n - 1 - i) * RISE - 1;

  useEffect(() => {
    const from = prev.current;
    prev.current = at;
    if (!scope.current || from === at) return;
    const xs: number[] = [from];
    const ys: number[] = [top(from)];
    for (let k = from; k < at; k++) {
      xs.push(k, k + 1);
      ys.push(top(k + 1), top(k + 1));
    }
    for (let k = from; k > at; k--) {
      xs.push(k - 1, k - 1);
      ys.push(top(k), top(k - 1));
    }
    const steps = Math.abs(at - from);
    animate(
      scope.current,
      { x: xs.map((v) => `${v * 100}%`), y: ys },
      moving ? { duration: 0.34 * steps, ease: "easeInOut" } : { duration: 0 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at]);

  return (
    <motion.span
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-10 hidden h-1 w-1/4 bg-accent sm:block"
      initial={false}
      style={{ x: `${start * 100}%`, y: top(start) }}
    />
  );
}

// 04 Engagement: the ways in as a ladder, smallest first. The staircase is
// drawn above and every label sits on one baseline under it, so the text
// never steps down with the treads. The top step runs on into the managed
// service, because the work does not stop at the build.
const RISE = 28;
const STAIR = RISE * 3 + 4;

function Ladder({ go, at }: { go: (id: string) => void; at: number | null }) {
  const p = usePick(STARTS.length, "Ways to start", at);
  const n = STARTS.length;
  return (
    <Frame>
      <div className="flex flex-col sm:flex-row">
        <div {...p.list} className="relative grid gap-2 sm:flex-1 sm:grid-cols-4 sm:gap-0">
          <Climber at={p.on} n={n} />
          {STARTS.map((s, i) => {
            const on = p.on === i;
            // The trail: treads climbed so far in ink, the ones still ahead in
            // the hairline, so the ladder shows there is more above. Complete
            // in ink before the client takes over.
            const ahead = p.js && i > p.on;
            const line = ahead ? "bg-rule" : "bg-ink";
            const lift = (n - 1 - i) * RISE;
            return (
              <button
                key={s.t}
                {...p.tab(i)}
                style={{ "--indent": `${i * 14}px` } as React.CSSProperties}
                className={`group ml-[var(--indent)] flex min-h-11 flex-col justify-start border-t-2 pt-3 text-left transition-colors sm:ml-0 sm:border-t-0 sm:pt-0 ${
                  on ? "border-accent" : ahead ? "border-rule" : "border-ink"
                } ${FOCUS}`}
              >
                <span aria-hidden="true" className="relative hidden sm:block" style={{ height: STAIR }}>
                  <DrawLine
                    className={`absolute inset-x-0 h-0.5 origin-left transition-colors duration-300 ${line}`}
                    style={{ top: lift }}
                    delay={i * 0.14}
                  />
                  {i > 0 ? (
                    <DrawLine
                      axis="y"
                      className={`absolute left-0 w-0.5 origin-bottom transition-colors duration-300 ${line}`}
                      style={{ top: lift, height: RISE }}
                      delay={i * 0.14 - 0.07}
                    />
                  ) : null}
                </span>
                <span className="block pr-3 sm:pt-4">
                  <span
                    className={`block text-[0.95rem] font-medium leading-snug transition-colors sm:min-h-[2lh] ${
                      on ? "text-ink" : "text-ink-soft group-hover:text-ink"
                    }`}
                  >
                    {s.t}
                  </span>
                  <Inline pick={p}>{s.d}</Inline>
                </span>
              </button>
            );
          })}
        </div>
        <a
          href="#support"
          onClick={(e) => {
            e.preventDefault();
            go("support");
          }}
          style={{ "--indent": `${n * 14}px` } as React.CSSProperties}
          className={`group mt-2 ml-[var(--indent)] block min-h-11 border-t-2 border-dashed border-ink pt-3 text-sm text-ink-soft transition-colors hover:text-ink sm:mt-0 sm:ml-0 sm:w-24 sm:border-t-0 sm:pt-0 ${FOCUS}`}
        >
          <span aria-hidden="true" className="relative hidden sm:block" style={{ height: STAIR }}>
            <DrawLine className="absolute inset-x-0 top-0 origin-left border-t-2 border-dashed border-ink" delay={n * 0.14} />
          </span>
          <span className="flex items-start gap-1.5 sm:pt-4">
            <Repeat aria-hidden className="mt-0.5 size-4 shrink-0 transition-transform group-hover:rotate-45" />
            <span>
              <span className="font-mono text-xs tabular-nums">06</span> Support
            </span>
          </span>
        </a>
      </div>
      <Detail
        pick={p}
        className="mt-6"
        items={STARTS.map((s) => (
          <DetailLink key={s.t} href={s.href}>
            {s.d}
          </DetailLink>
        ))}
      />
    </Frame>
  );
}

// 05 Value: what AI done properly is worth, in general. Results figures, so
// in the accent. Client results live on /work and each case study.
function Worth() {
  return (
    <Frame>
      <ul className="grid gap-6">
        {value.map((e) => (
          <li key={e.stat}>
            <Figure value={e.stat} beside count>
              <p className="text-ink">
                {sentence(e.claim)}. <Source e={e} />
              </p>
            </Figure>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

// 06 Support: the service as a monthly loop.
const LABEL_POS = [
  "top-0 left-1/2 w-60 -translate-x-1/2 text-center",
  "top-1/2 left-[calc(50%+124px)] w-[calc(50%-124px)] -translate-y-1/2",
  "bottom-0 left-1/2 w-60 -translate-x-1/2 text-center",
  "top-1/2 right-[calc(50%+124px)] w-[calc(50%-124px)] -translate-y-1/2 text-right",
];

function Loop() {
  return (
    <Frame heading="Managed service">
      <LoopShape />
    </Frame>
  );
}

// The loop without its frame, also used for the managed service on /services.
// No price in the centre: slides carry no prices (Pedro, 2026-09-24); they
// live on /services, under each service name.
export function LoopShape() {
  const moving = useMotionOn();
  return (
    <>
      <div className="relative mx-auto hidden h-[290px] max-w-[540px] sm:block">
        <svg
          aria-hidden="true"
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
        >
          <DrawRing cx={100} cy={100} r={90} />
          <After>
            {[45, 135, 225, 315].map((a) => {
              const r = (a * Math.PI) / 180;
              return (
                <path
                  key={a}
                  d="M-4 -5 L2 0 L-4 5"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform={`translate(${100 + 90 * Math.sin(r)} ${100 - 90 * Math.cos(r)}) rotate(${a})`}
                />
              );
            })}
            {[
              [100, 10],
              [190, 100],
              [100, 190],
              [10, 100],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
            ))}
          </After>
          {moving ? (
            <After delay={1.3}>
              <circle r="5" fill="var(--accent)">
                <animateMotion dur="16s" repeatCount="indefinite" path="M100 10 A90 90 0 0 1 100 190 A90 90 0 0 1 100 10" />
              </circle>
            </After>
          ) : null}
        </svg>
        <ol>
          {SUPPORT.map((t, i) => (
            <li key={t} className={`absolute font-medium leading-snug text-ink ${LABEL_POS[i]}`}>
              {t}
            </li>
          ))}
        </ol>
      </div>
      <div className="sm:hidden">
        <ol className="relative ml-2">
          <DrawLine axis="y" className="absolute inset-y-0 -left-0.5 w-0.5 origin-top bg-ink" />
          {SUPPORT.map((t) => (
            <li key={t} className="relative py-2.5 pl-6 font-medium leading-snug text-ink">
              <span
                aria-hidden="true"
                className="absolute top-[0.95rem] -left-[7px] size-3 rounded-full border-2 border-ink bg-paper"
              />
              {t}
            </li>
          ))}
        </ol>
        <Repeat aria-hidden className="mt-1 size-4 text-ink-soft" />
      </div>
    </>
  );
}

type Row = { t: string; d: string; href: string };

const CALL: Omit<Row, "href">[] = [
  { t: "How the work flows today", d: "From first enquiry to invoice: who does what, and where the time goes." },
  { t: "What you already pay for", d: "The AI tools, CRM and data you have, and how much of it the team uses." },
  { t: "Where AI would pay first", d: "The one or two jobs worth doing first, and roughly what they would take." },
  { t: "What to do next", d: "A clear recommendation: an audit, training, a build, or nothing yet." },
];

// The entry points, in the industry's terms. None assumes a build.
const STARTS: Row[] = [
  { t: "AI readiness audit", d: "Your workflows, data and tools reviewed, ending in a prioritised roadmap with ROI estimates.", href: "/services#audit" },
  { t: "Leadership workshop", d: "Use cases, risks and priorities agreed in one session.", href: "/services#workshop" },
  { t: "Training and enablement", d: "Your AI tools set up properly and your team trained on real work.", href: "/services#training" },
  { t: "Pilot build", d: "One high-value use case built at a fixed price and running in production.", href: "/services#agentic-workflows" },
];

// The three parts of every build, each linked to the case study that shows it.
const AI3 = [
  { term: "Context", plain: "What your business knows, in one place your team and its AI tools can ask.", href: "/work/context-engine" },
  { term: "Agents", plain: "Software that does the repeatable work, with a human in the loop before anything goes out.", href: "/work/lead-research" },
  { term: "Evals", plain: "Proof it worked: each system measured against the job it was built to do.", href: "/work/prospecting-loop" },
];

// Clockwise from the top. Headlines only; the full list is the managed
// service on /services.
const SUPPORT = ["Monitor and fix", "Adapt as you change", "Add new workflows", "Monthly KPI review"];
