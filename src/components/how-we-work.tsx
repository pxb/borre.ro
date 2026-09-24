"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { scrollToId } from "@/lib/scroll";
import { Reveal } from "@/components/motion-bits";
import { Example } from "@/components/story-forms";
import { site } from "@/content/site";

// One story, six steps: Problem, Review, Method, Engagement, Results, Support. Two modes:
// a horizontal pinned scroll on the desktop, and a vertical stack as the
// fallback for narrow screens and reduced motion.
type Step = { id: string; n: string; label: string; title: string; lead?: string; body: string };

const STEPS: Step[] = [
  {
    id: "problem",
    n: "01",
    label: "Problem",
    title: "The work still gets done by hand.",
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
    title: "Context, agents and evals, working as one system.",
    body: "What your business knows, the software that does the repeatable work and the measurement that proves it, all running on accounts in your name.",
  },
  {
    id: "engagement",
    n: "04",
    label: "Engagement",
    title: "Start where it makes sense.",
    body: "From a one-off audit to a full build, every engagement has a fixed price agreed before we start.",
  },
  {
    id: "results",
    n: "05",
    label: "Results",
    title: "Measured against the job it was built for.",
    body: "Some of what they've done for clients so far.",
  },
  {
    id: "support",
    n: "06",
    label: "Support",
    title: "We keep it running.",
    body: "Once it's live, we look after it for you.",
  },
];

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
  // 0 at the first step, 1 at the last, in either mode; drives the step tracks.
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start 120px", "end end"] });
  // Move the story to a step: by anchor when stacked, by scroll position when pinned.
  const go = (id: string) => {
    if (!horizontal) return scrollToId(id);
    const y = slideY(STEPS.findIndex((s) => s.id === id));
    if (y != null) scrollToY(y);
  };

  // The wrapper scopes the sticky step bar: it lets go when the story ends
  // instead of riding down over the footer.
  return (
    <div ref={wrap}>
      <StepBar active={active} go={go} progress={scrollYProgress} />
      {horizontal ? (
        <Horizontal onActive={setActive} go={go} />
      ) : (
        <Vertical onActive={setActive} go={go} />
      )}
    </div>
  );
}

// Scroll position at which slide i sits fully in view. The pinned section's
// scroll range is its height minus one viewport (useScroll "start start" to
// "end end"), shared by the step bar and the snap so they agree.
function slideY(i: number) {
  const outer = document.getElementById("story");
  if (!outer) return null;
  const top = outer.getBoundingClientRect().top + window.scrollY;
  const range = outer.offsetHeight - window.innerHeight;
  return Math.round(top + (i / (STEPS.length - 1)) * range);
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
}: {
  active: string;
  go: (id: string) => void;
  progress: MotionValue<number>;
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
  onClick,
}: {
  step: Step;
  index: number;
  on: boolean;
  progress: MotionValue<number>;
  onClick: () => void;
}) {
  // Step i's track fills across its share of the story.
  const fill = useTransform(progress, (p) =>
    Math.min(1, Math.max(0, p * (STEPS.length - 1) - index + 1)),
  );
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
function Horizontal({ onActive, go }: { onActive: (id: string) => void; go: (id: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(STEPS.length - 1) * 100}vw`]);

  useEffect(() => {
    return scrollYProgress.on("change", (p) => {
      const i = Math.min(STEPS.length - 1, Math.max(0, Math.round(p * (STEPS.length - 1))));
      onActive(STEPS[i].id);
    });
  }, [scrollYProgress, onActive]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      const first = slideY(0);
      const last = slideY(STEPS.length - 1);
      if (first == null || last == null) return;
      const y = window.scrollY;
      // Only inside the pinned range; entering and leaving scroll freely.
      if (y <= first + 2 || y >= last - 2) return;
      const i = Math.round(((y - first) / (last - first)) * (STEPS.length - 1));
      const target = slideY(i);
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
      style={{ height: `${STEPS.length * 70}vh` }}
      className="relative"
    >
      <div className="sticky top-[7.5rem] flex h-[calc(100vh-7.5rem)] flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-hidden">
          <motion.div style={{ x }} className="flex h-full">
            {STEPS.map((s) => (
              <div key={s.id} className="h-full w-screen shrink-0 pt-[clamp(2rem,7vh,4.5rem)]">
                <div className="mx-auto grid w-full max-w-6xl items-start gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                  <StepText step={s} large />
                  <div>
                    <Example id={s.id} go={go} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Vertical fallback: the same panels stacked and revealed on scroll.
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
          <Reveal>
            <StepText step={s} />
          </Reveal>
          <Reveal delay={0.08}>
            <Example id={s.id} go={go} />
          </Reveal>
        </section>
      ))}
    </div>
  );
}

function StepText({ step, large = false }: { step: Step; large?: boolean }) {
  // No kicker label: the step bar carries the sequence. The heading leads.
  return (
    <div>
      <h2
        className={`font-medium leading-[1.06] tracking-[-0.025em] text-ink ${
          large ? "text-[clamp(2rem,min(5vw,6.4vh),5.25rem)]" : "text-[clamp(2rem,3.8vw,3.4rem)]"
        }`}
      >
        {step.title}
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
