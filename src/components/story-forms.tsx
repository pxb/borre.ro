"use client";

import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Repeat } from "lucide-react";
import { AskDemo } from "@/components/ask-demo";
import { CountUp } from "@/components/motion-bits";
import { evidence, work } from "@/content/site";

// The right-hand side of each story slide (#584). One frame, a heading over a
// 2px ink rule, and inside it a shape that matches what the slide says:
// proportions, a timeline, a formula, a ladder, a figure wall and a loop.
// Where a slide has several items, only the picked one shows its description,
// so the slide carries one sentence at a time instead of four.

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const EASE = [0.22, 1, 0.36, 1] as const;
// Figures stay below the hero headline and the slide titles at every width, so
// they support the story instead of outranking it and the CTA.
const FIGURE = "font-mono text-[clamp(1.5rem,min(2.6vw,4vh),2.25rem)] leading-none tabular-nums text-action";

function useMounted() {
  const [m, setM] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setM(true), []);
  return m;
}

// A small tab set: hover, focus, tap or the arrow keys pick an item. Before
// the client takes over (SSR, no-JS) `js` is false and every form renders all
// of its descriptions inline, so nothing is lost without JavaScript.
function usePick(n: number, label: string) {
  const [on, setOn] = useState(0);
  const js = useMounted();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
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
    onMouseEnter: () => setOn(i),
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
  return { on, js, list, tab, panel };
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

function Frame({ heading, children, foot }: { heading: ReactNode; children: ReactNode; foot?: ReactNode }) {
  return (
    <div className="border-t-2 border-ink">
      <p className="pt-3 text-sm font-medium text-ink-soft">{heading}</p>
      <div className="pt-6">{children}</div>
      {foot ? <p className="mt-7 border-t border-rule pt-3 text-sm text-ink-soft">{foot}</p> : null}
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

export function Example({ id, go }: { id: string; go: (id: string) => void }) {
  if (id === "problem") return <Gap />;
  if (id === "review") return <Timeline />;
  if (id === "method") return <Formula />;
  if (id === "engagement") return <Ladder go={go} />;
  if (id === "results") return <Figures />;
  return <Loop />;
}

// 01 Problem: each figure over a bar filled to its share.
function Gap() {
  return (
    <Frame heading="The gap">
      <ul className="grid gap-10">
        {evidence.map((e) => (
          <li key={e.stat}>
            <CountUp
              value={e.stat}
              className={`block ${FIGURE}`}
            />
            <Share pct={parseFloat(e.stat)} />
            <p className="mt-4 text-lg leading-snug text-ink">
              {e.claim.charAt(0).toUpperCase() + e.claim.slice(1)}
            </p>
            <a
              href={e.href}
              target="_blank"
              rel="noreferrer"
              className={`mt-2 inline-block text-sm text-ink-soft underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink ${FOCUS}`}
            >
              {e.source}
            </a>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

// The bar fills when it comes into view. SSR, no-JS and reduced motion draw it full.
function Share({ pct }: { pct: number }) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const full = !mounted || !!reduce || inView;
  return (
    <div ref={ref} aria-hidden="true" className="mt-4 h-2 bg-rule">
      <motion.div
        className="h-full origin-left bg-ink"
        style={{ width: `${pct}%` }}
        initial={false}
        animate={{ scaleX: full ? 1 : 0 }}
        transition={full ? { duration: 1.1, ease: EASE } : { duration: 0 }}
      />
    </div>
  );
}

// 02 Review: the call as a 0 to 30 minute track with four stops. Vertical on phones.
// Also on /contact, above the calendar.
export function Timeline() {
  const p = usePick(CALL.length, "In the 30 minutes");
  return (
    <Frame heading="In the 30 minutes">
      <div
        aria-hidden="true"
        className="mb-3 hidden justify-between font-mono text-xs tabular-nums text-ink-soft sm:flex"
      >
        <span>0</span>
        <span>30 min</span>
      </div>
      <div {...p.list} className="relative grid sm:grid-cols-4 sm:gap-x-5">
        <span aria-hidden="true" className="absolute top-[7px] right-0 left-0 hidden h-0.5 bg-ink sm:block" />
        <span aria-hidden="true" className="absolute top-3 bottom-8 left-[7px] w-0.5 bg-ink sm:hidden" />
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
                className={`relative mt-0.5 size-4 shrink-0 rounded-full border-2 border-ink transition-colors sm:mt-0 ${
                  on ? "bg-ink" : "bg-paper"
                }`}
              />
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

// 03 Method: the three parts as the formula they multiply into, the demo beneath.
function Formula() {
  const p = usePick(AI3.length, "Context, agents and evals");
  return (
    <Frame
      heading={
        <span className="font-mono">
          AI<sup>3</sup>
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
                className={`min-h-11 text-left text-[clamp(1.5rem,min(2.4vw,4.4vh),2.25rem)] font-medium leading-tight tracking-[-0.02em] underline decoration-2 underline-offset-[10px] transition-colors ${
                  on ? "text-ink decoration-ink" : "text-ink-soft decoration-transparent hover:text-ink"
                } ${FOCUS}`}
              >
                {a.term}
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

// 04 Engagement: the ways in as a ladder, smallest first. The staircase is
// drawn above and every label sits on one baseline under it, so the text
// never steps down with the treads. The top step runs on into the managed
// service, because the work does not stop at the build.
const RISE = 28;
const STAIR = RISE * 3 + 4;

function Ladder({ go }: { go: (id: string) => void }) {
  const p = usePick(STARTS.length, "Ways to start");
  const n = STARTS.length;
  return (
    <Frame
      heading="Ways to start"
      foot={
        <>
          Builds take 1 to 8 weeks.{" "}
          <Link
            href="/services"
            className={`text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink ${FOCUS}`}
          >
            Services and prices
          </Link>
        </>
      }
    >
      <div className="flex flex-col sm:flex-row">
        <div {...p.list} className="grid gap-2 sm:flex-1 sm:grid-cols-4 sm:gap-0">
          {STARTS.map((s, i) => {
            const on = p.on === i;
            const lift = (n - 1 - i) * RISE;
            return (
              <button
                key={s.t}
                {...p.tab(i)}
                style={{ "--indent": `${i * 14}px` } as React.CSSProperties}
                className={`group ml-[var(--indent)] flex min-h-11 flex-col justify-start border-t-2 border-ink pt-3 text-left sm:ml-0 sm:border-t-0 sm:pt-0 ${FOCUS}`}
              >
                <span aria-hidden="true" className="relative hidden sm:block" style={{ height: STAIR }}>
                  <span
                    className={`absolute inset-x-0 bg-ink transition-[height] ${on ? "h-1" : "h-0.5"}`}
                    style={{ top: lift }}
                  />
                  {i > 0 ? <span className="absolute left-0 w-0.5 bg-ink" style={{ top: lift, height: RISE }} /> : null}
                </span>
                <span className="block pr-3 sm:pt-4">
                  <span
                    className={`block text-[0.95rem] font-medium leading-snug transition-colors sm:min-h-[2lh] ${
                      on ? "text-ink" : "text-ink-soft group-hover:text-ink"
                    }`}
                  >
                    {s.t}
                  </span>
                  <span className="mt-1 block font-mono text-xs tabular-nums text-balance text-ink-soft">{s.meta}</span>
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
            <span className="absolute inset-x-0 top-0 border-t-2 border-dashed border-ink" />
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

// 05 Results: the figures lead, the case study underneath.
function Figures() {
  const items = work.filter((w) => w.resultsProven !== false);
  return (
    <Frame heading="For clients so far">
      <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
        {items.map((w, i) => (
          <li key={w.slug} className={items.length % 2 && i === items.length - 1 ? "sm:col-span-2" : ""}>
            <Link href={`/work/${w.slug}`} className={`group block ${FOCUS}`}>
              <CountUp
                value={w.metrics[0].value}
                className={`block whitespace-nowrap ${FIGURE}`}
              />
              <span className="mt-3 block max-w-md text-sm leading-snug text-ink-soft">{w.metrics[0].label}</span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-rule underline-offset-4 transition-colors group-hover:decoration-ink">
                {w.title}
                <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

// 06 Support: the service as a monthly loop around its price.
const LABEL_POS = [
  "top-0 left-1/2 w-60 -translate-x-1/2 text-center",
  "top-1/2 left-[calc(50%+124px)] w-[calc(50%-124px)] -translate-y-1/2",
  "bottom-0 left-1/2 w-60 -translate-x-1/2 text-center",
  "top-1/2 right-[calc(50%+124px)] w-[calc(50%-124px)] -translate-y-1/2 text-right",
];

function Price() {
  return (
    <p className="text-center">
      <span className="block text-sm text-ink-soft">From</span>
      <span className={`block ${FIGURE}`}>£1,000</span>
      <span className="block text-sm text-ink-soft">a month</span>
    </p>
  );
}

function Loop() {
  return (
    <Frame
      heading="Managed service"
      foot={
        <>
          Month to month.{" "}
          <Link
            href="/services#support"
            className={`text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink ${FOCUS}`}
          >
            What&apos;s included
          </Link>
        </>
      }
    >
      <LoopShape />
    </Frame>
  );
}

// The loop without its frame, for the managed service on /services.
export function LoopShape() {
  const reduce = useReducedMotion();
  const mounted = useMounted();
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
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--ink)" strokeWidth="2" />
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
          {mounted && !reduce ? (
            <circle r="4" fill="var(--ink)">
              <animateMotion dur="16s" repeatCount="indefinite" path="M100 10 A90 90 0 0 1 100 190 A90 90 0 0 1 100 10" />
            </circle>
          ) : null}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Price />
        </div>
        <ol>
          {SUPPORT.map((t, i) => (
            <li key={t} className={`absolute font-medium leading-snug text-ink ${LABEL_POS[i]}`}>
              {t}
            </li>
          ))}
        </ol>
      </div>
      <div className="sm:hidden">
        <div className="flex justify-start">
          <Price />
        </div>
        <ol className="relative mt-6 ml-2 border-l-2 border-ink">
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

type Row = { t: string; d: string; meta?: string; href: string };

const CALL: Omit<Row, "href">[] = [
  { t: "How the work flows today", d: "From first enquiry to invoice: who does what, and where the time goes." },
  { t: "What you already pay for", d: "The AI tools, CRM and data you have, and how much of it the team uses." },
  { t: "Where AI would pay first", d: "The one or two jobs worth doing first, and roughly what they would take." },
  { t: "What to do next", d: "A clear recommendation: an audit, training, a build, or nothing yet." },
];

// The entry points, in the industry's terms. None assumes a build.
const STARTS: Row[] = [
  { t: "AI readiness audit", d: "Your workflows, data and tools reviewed, ending in a prioritised roadmap with ROI estimates.", meta: "From £450", href: "/services#audit" },
  { t: "Leadership workshop", d: "Use cases, risks and priorities agreed in one session.", meta: "From £950", href: "/services#workshop" },
  { t: "Training and enablement", d: "Your AI tools set up properly and your team trained on real work.", meta: "From £950 a day", href: "/services#training" },
  { t: "Pilot build", d: "One high-value use case built at a fixed price and running in production.", meta: "From £1,500", href: "/services#agentic-workflows" },
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
