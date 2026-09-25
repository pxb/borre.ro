"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { scrollToId } from "@/lib/scroll";
import { Example, itemCount } from "@/components/story-forms";
import { site } from "@/content/site";

// One story, six steps: Problem, Review, Method, Engagement, Value, Support. Two modes:
// a horizontal pinned scroll on the desktop, and a vertical stack as the
// fallback for narrow screens and reduced motion.
// A title may be several short headlines, each on its own line (slide 01).
type Step = { id: string; n: string; label: string; title: string | string[]; lead?: string; body: string };

const STEPS: Step[] = [
  {
    id: "problem",
    n: "01",
    label: "Problem",
    title: ["The work still gets done by hand.", "AI spend grows, productivity doesn't."],
    body: `${site.recognition} Each holds its own piece of the picture, so someone on your team ends up copying between them.`,
  },
  {
    id: "review",
    n: "02",
    label: "Review",
    title: "It starts with a free 30-minute call.",
    body: "We look at how your business runs and where AI would pay first. You leave with a clear recommendation, whether or not it involves us.",
  },
  {
    id: "method",
    n: "03",
    label: "Method",
    title: "AI that knows your business, and proves it works.",
    body: "What your business knows, the software that does the repeatable work and the measurement that proves it, all running on accounts in your name.",
  },
  {
    id: "engagement",
    n: "04",
    label: "Engagement",
    title: "Sized to your business.",
    body: "From a half-day workshop to a full build, each engagement is scoped to what you need and priced before we start.",
  },
  {
    id: "value",
    n: "05",
    label: "Value",
    title: "Done properly, AI pulls you ahead.",
    body: "The companies connecting AI to their own data and work are already pulling ahead. We get you there on the tools you already pay for, without hiring an AI team.",
  },
  {
    id: "support",
    n: "06",
    label: "Support",
    title: "We keep it running.",
    body: "Once it's live, we look after it for you. It keeps working as your tools and team change, and each month we go through the numbers with you and agree what comes next.",
  },
];

// The pinned story's timeline, in units of 64vh of scroll. Each slide holds
// still while the scroll walks its items (half a unit per item, so the story
// does not rush), then one unit carries it to the next slide. A slide's first
// stop is where it arrives, its last is where it leaves.
const UNIT_VH = 64;
const MOVE = 1;
const PAUSE = 0.5;
type Stop = { slide: number; item: number; u: number };
const STOPS: Stop[] = [];
const FIRST: number[] = [];
const LAST: number[] = [];
{
  let u = 0;
  STEPS.forEach((s, i) => {
    if (i > 0) u += MOVE;
    FIRST[i] = u;
    for (let k = 0; k < itemCount(s.id); k++) {
      if (k > 0) u += PAUSE;
      STOPS.push({ slide: i, item: k, u });
    }
    LAST[i] = u;
  });
}
const TOTAL = LAST[LAST.length - 1];

// The stop nearest a point on the timeline, so each item owns the scroll
// halfway to its neighbours.
function nearestStop(u: number) {
  let best = 0;
  for (let k = 1; k < STOPS.length; k++) if (Math.abs(STOPS[k].u - u) < Math.abs(STOPS[best].u - u)) best = k;
  return best;
}

function useDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setD(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}

export function HowWeWork() {
  const reduce = useReducedMotion();
  const desktop = useDesktop();
  const [active, setActive] = useState(STEPS[0].id);
  // Horizontal only where it behaves: a wide viewport with motion allowed.
  const horizontal = desktop && !reduce;
  const wrap = useRef<HTMLDivElement>(null);
  // Stacked: 0 at the first step, 1 at the last; drives the step tracks.
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start 120px", "end end"] });
  // Pinned: where the story is on its timeline, set by the pinned section.
  const u = useMotionValue(0);
  // Move the story to a step: by anchor when stacked, to the slide's first
  // stop when pinned.
  const go = (id: string) => {
    if (!horizontal) return scrollToId(id);
    const y = timelineY(FIRST[STEPS.findIndex((s) => s.id === id)]);
    if (y != null) scrollToY(y);
  };

  // The wrapper scopes the sticky step bar: it lets go when the story ends
  // instead of riding down over the footer.
  return (
    <div ref={wrap}>
      <StepBar active={active} go={go} progress={scrollYProgress} u={u} horizontal={horizontal} />
      {horizontal ? (
        <Horizontal onActive={setActive} go={go} u={u} />
      ) : (
        <Vertical onActive={setActive} go={go} />
      )}
    </div>
  );
}

// Scroll position of a point on the timeline. The pinned section's scroll
// range is its height minus one viewport (useScroll "start start" to
// "end end"), shared by the step bar and the snap so they agree.
function timelineY(t: number) {
  const outer = document.getElementById("story");
  if (!outer) return null;
  const top = outer.getBoundingClientRect().top + window.scrollY;
  const range = outer.offsetHeight - window.innerHeight;
  return Math.round(top + (t / TOTAL) * range);
}

function scrollToY(y: number) {
  const l = window.__lenis;
  if (l) l.scrollTo(y, { duration: 0.7 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

// The step bar. Deliberately unlike the header nav: numbered, left-aligned to
// the page edge, and each step carries a track that fills as the story moves
// through it. In vertical mode it jumps by anchor; in horizontal mode it
// drives the pinned section's scroll position.
function StepBar({
  active,
  go,
  progress,
  u,
  horizontal,
}: {
  active: string;
  go: (id: string) => void;
  progress: MotionValue<number>;
  u: MotionValue<number>;
  horizontal: boolean;
}) {
  return (
    <div className="sticky top-20 z-30 border-b border-rule bg-paper">
      <nav aria-label="Story steps" className="mx-auto max-w-6xl px-6 sm:px-10">
        <ol className="flex gap-4 overflow-x-auto sm:gap-6">
          {STEPS.map((s, i) => (
            <StepItem
              key={s.id}
              step={s}
              index={i}
              on={s.id === active}
              progress={progress}
              u={u}
              horizontal={horizontal}
              onClick={() => go(s.id)}
            />
          ))}
        </ol>
      </nav>
    </div>
  );
}

function StepItem({
  step,
  index,
  on,
  progress,
  u,
  horizontal,
  onClick,
}: {
  step: Step;
  index: number;
  on: boolean;
  progress: MotionValue<number>;
  u: MotionValue<number>;
  horizontal: boolean;
  onClick: () => void;
}) {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  // Stacked: step i's track fills across its share of the story.
  const stacked = useTransform(progress, (p) => clamp(p * (STEPS.length - 1) - index + 1));
  // Pinned: it fills from the move into slide i to the slide's last item, so
  // the bar keeps moving while a slide walks its items.
  const pinned = useTransform(u, (t) => clamp((t - FIRST[index] + MOVE) / (LAST[index] - FIRST[index] + MOVE)));
  const fill = horizontal ? pinned : stacked;
  return (
    <li className="min-w-[6.5rem] flex-1">
      <button
        onClick={onClick}
        aria-current={on ? "step" : undefined}
        className={`flex min-h-11 w-full items-baseline gap-2 pt-3 pb-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          on ? "text-ink" : "text-ink-soft hover:text-ink"
        }`}
      >
        <span className={`font-mono text-xs tabular-nums ${on ? "text-accent" : "text-ink-soft"}`}>
          {step.n}
        </span>
        {step.label}
      </button>
      <div aria-hidden="true" className="h-0.5 bg-rule">
        <motion.div style={{ scaleX: fill }} className="h-full origin-left bg-ink" />
      </div>
    </li>
  );
}

// Horizontal: a tall section whose sticky inner frame stays put while the
// panels translate sideways with vertical scroll. When scrolling settles inside
// the section it snaps to the nearest slide, so a panel is never left half-way.
// The frame's foot carries the offer for the whole story, and the panels are
// centred in what is left, so a tall screen does not leave one big gap.
// Each slide holds still across its own stops (x is flat from its first to
// its last), while the scroll picks its items in order: the call's stops, the
// three terms, the ladder's treads. Scrolling back walks them in reverse.
const X_IN: number[] = [];
const X_OUT: string[] = [];
STEPS.forEach((_, i) => {
  for (const t of FIRST[i] === LAST[i] ? [FIRST[i]] : [FIRST[i], LAST[i]]) {
    X_IN.push(t / TOTAL);
    X_OUT.push(`-${i * 100}vw`);
  }
});

function Horizontal({
  onActive,
  go,
  u,
}: {
  onActive: (id: string) => void;
  go: (id: string) => void;
  u: MotionValue<number>;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, X_IN, X_OUT);
  // The stop the scroll has reached. It changes only at another stop, so the
  // slides re-render per step, not per frame.
  const [stop, setStop] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (p) => {
      u.set(p * TOTAL);
      const k = nearestStop(p * TOTAL);
      setStop(k);
      onActive(STEPS[STOPS[k].slide].id);
    });
  }, [scrollYProgress, onActive, u]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Where the story last came to rest. A settle goes on to the next stop in
    // the direction of travel, so one notch of a mouse wheel is one step; a
    // nearest-stop snap pulled small nudges back and could hold a reader in place.
    let rest = 0;
    const settle = () => {
      const first = timelineY(0);
      const last = timelineY(TOTAL);
      if (first == null || last == null) return;
      const y = window.scrollY;
      // Only inside the pinned range; entering and leaving scroll freely.
      if (y <= first + 2) return void (rest = 0);
      if (y >= last - 2) return void (rest = TOTAL);
      const t = ((y - first) / (last - first)) * TOTAL;
      const d = t - rest;
      const k =
        Math.abs(d) < 0.02
          ? nearestStop(t)
          : d > 0
            ? STOPS.findIndex((s) => s.u >= t - 0.001)
            : STOPS.findLastIndex((s) => s.u <= t + 0.001);
      rest = STOPS[k].u;
      const target = timelineY(rest);
      if (target != null && Math.abs(target - y) > 2) scrollToY(target);
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(settle, 160);
    };
    const lenis = window.__lenis;
    if (lenis) lenis.on("scroll", onScroll);
    else window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      if (lenis) lenis.off("scroll", onScroll);
      else window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      id="story"
      ref={ref}
      aria-label="How it works"
      style={{ height: `${TOTAL * UNIT_VH + 100}vh` }}
      className="relative"
    >
      <div className="sticky top-[7.5rem] flex h-[calc(100vh-7.5rem)] flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-hidden">
          <motion.div style={{ x }} className="flex h-full">
            {STEPS.map((s, i) => {
              // The item this slide shows: the reached one while it is the
              // current slide, its last once passed, its first before.
              const here = STOPS[stop];
              const at = here.slide === i ? here.item : here.slide > i ? itemCount(s.id) - 1 : 0;
              return (
                <div key={s.id} className="h-full w-screen shrink-0 pt-[clamp(2rem,7vh,4.5rem)]">
                  <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                    <StepText step={s} large />
                    <div>
                      <Example id={s.id} go={go} at={at} />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Vertical fallback: the same panels stacked.
function Vertical({ onActive, go }: { onActive: (id: string) => void; go: (id: string) => void }) {
  useEffect(() => {
    const els = STEPS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el != null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (!vis.length) return;
        vis.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        onActive(vis[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onActive]);

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      {STEPS.map((s) => (
        <section
          key={s.id}
          id={s.id}
          aria-label={s.label}
          className="grid scroll-mt-[7.5rem] gap-8 border-b border-rule py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:py-20"
        >
          <StepText step={s} />
          <Example id={s.id} go={go} />
        </section>
      ))}
    </div>
  );
}

function StepText({ step, large = false }: { step: Step; large?: boolean }) {
  // No kicker label: the step bar carries the sequence. The heading leads, but
  // stays below the hero headline at every width (hero h1 > slide title > figure).
  return (
    <div>
      <h2
        className={`font-medium leading-[1.06] tracking-[-0.025em] text-ink ${
          large ? "text-[clamp(1.875rem,min(2.9vw,4.6vh),2.75rem)]" : "text-[clamp(1.75rem,3.4vw,2.75rem)]"
        }`}
      >
        {Array.isArray(step.title)
          ? step.title.map((t) => (
              <span key={t} className="block text-pretty">
                {t}
              </span>
            ))
          : step.title}
      </h2>
      {step.lead ? (
        <p
          className={`mt-6 max-w-lg leading-snug text-ink ${
            large ? "text-[clamp(1.25rem,min(1.6vw,2.8vh),1.625rem)]" : "text-xl"
          }`}
        >
          {step.lead}
        </p>
      ) : null}
      <p
        className={`mt-6 leading-relaxed text-ink-soft ${
          large ? "max-w-lg text-[clamp(1.125rem,min(1.6vw,2.4vh),1.5rem)]" : "max-w-md text-lg"
        }`}
      >
        {step.body}
      </p>
    </div>
  );
}
