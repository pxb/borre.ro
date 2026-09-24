"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { scrollToId } from "@/lib/scroll";
import { ConnectedSystem } from "@/components/connected-system";
import { CountUp, Reveal } from "@/components/motion-bits";
import { evidence, site, work } from "@/content/site";

// One story, six steps: Problem, Plan, Idea, Execution, Results, Support. Two modes:
// a horizontal pinned scroll on the desktop, and a vertical stack as the
// fallback for narrow screens and reduced motion.
type Step = { id: string; n: string; label: string; title: string; lead?: string; body: string };

const STEPS: Step[] = [
  {
    id: "problem",
    n: "01",
    label: "Problem",
    title: "The work still gets done by hand.",
    lead: site.recognition,
    body: "Each tool holds its own piece of the picture, so someone on your team ends up copying things from one to another.",
  },
  {
    id: "plan",
    n: "02",
    label: "Plan",
    title: "First, we find what's worth doing.",
    body: "We look at how your business runs and find the jobs worth handing to software. We only build once we both agree it's worth it.",
  },
  {
    id: "idea",
    n: "03",
    label: "Idea",
    title: "One system that knows your business.",
    body: "We put what your business knows in one place and connect your tools to it, so the software and your team work from the same facts.",
  },
  {
    id: "execution",
    n: "04",
    label: "Execution",
    title: "Built on what you already own.",
    body: "Every build has three parts: what the business knows, the agents that do the work and the evals that prove it worked. It all runs on accounts in your name, using the tools you already pay for.",
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

  // The wrapper scopes the sticky step bar: it lets go when the story ends
  // instead of riding down over the footer.
  return (
    <div ref={wrap}>
      <StepBar active={active} horizontal={horizontal} progress={scrollYProgress} />
      {horizontal ? (
        <Horizontal onActive={setActive} />
      ) : (
        <Vertical onActive={setActive} />
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
  horizontal,
  progress,
}: {
  active: string;
  horizontal: boolean;
  progress: MotionValue<number>;
}) {
  const jump = (id: string, i: number) => {
    if (!horizontal) return scrollToId(id);
    const y = slideY(i);
    if (y != null) scrollToY(y);
  };
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
              onClick={() => jump(s.id, i)}
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
function Horizontal({ onActive }: { onActive: (id: string) => void }) {
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
              <div key={s.id} className="flex h-full w-screen shrink-0 items-center py-8">
                <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
                  <StepText step={s} large />
                  <div>
                    <Example id={s.id} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <Offer />
      </div>
    </section>
  );
}

// Vertical fallback: the same panels stacked and revealed on scroll.
function Vertical({ onActive }: { onActive: (id: string) => void }) {
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
            <Example id={s.id} />
          </Reveal>
        </section>
      ))}
      <Offer />
    </div>
  );
}

function StepText({ step, large = false }: { step: Step; large?: boolean }) {
  // No kicker label: the step bar carries the sequence. The heading leads.
  return (
    <div>
      <h2
        className={`font-medium leading-[1.06] tracking-[-0.025em] text-ink ${
          large ? "text-[clamp(2rem,min(5vw,7vh),5.25rem)]" : "text-[clamp(2rem,3.8vw,3.4rem)]"
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

// An example at each step. Figures count up; the Idea step is interactive.
function Example({ id }: { id: string }) {
  if (id === "problem") {
    return (
      <dl className="grid gap-8 sm:grid-cols-2">
        {evidence.map((e) => (
          <div key={e.stat} className="flex gap-4">
            <dt>
              <CountUp
                value={e.stat}
                className="font-mono text-4xl tabular-nums leading-none text-action"
              />
            </dt>
            <dd className="max-w-xs text-sm leading-snug text-ink-soft">
              {e.claim}.{" "}
              <a
                href={e.href}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {e.source}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  if (id === "plan") {
    return (
      <div className="border border-rule bg-paper p-6">
        <p className="leading-relaxed text-ink">
          It starts with a free 30-minute call. You&apos;ll leave knowing what we&apos;d do first
          and roughly what it would cost.
        </p>
      </div>
    );
  }
  if (id === "idea") {
    return <ConnectedSystem />;
  }
  if (id === "execution") {
    // AI cubed: the method behind every build. The plain line leads; the term
    // is the small label, so it reads as a method, not a second brand.
    return (
      <div>
        <p className="font-mono text-sm text-ink-soft">
          AI<sup>3</sup> · Context × Agents × Evals
        </p>
        <ol className="mt-4 grid gap-px overflow-hidden border border-rule bg-rule">
          {AI3.map((part) => (
            <li key={part.term} className="bg-paper">
              <Link
                href={part.href}
                className="group grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-4 p-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              >
                <span className="text-lg font-medium text-ink transition-colors group-hover:text-accent">{part.term}</span>
                <span className="text-sm leading-snug text-ink-soft">{part.plain}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  if (id === "support") {
    return (
      <div className="border border-rule bg-paper p-6">
        <ul className="space-y-3">
          {SUPPORT.map((i) => (
            <li key={i} className="flex gap-3 leading-relaxed text-ink">
              <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
              <span>{i}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-rule pt-4 text-sm text-ink-soft">From £1,000 a month</p>
      </div>
    );
  }
  // results: figures roll up
  return (
    <div>
      <dl className="grid gap-6 sm:grid-cols-2">
        {work.filter((w) => w.resultsProven !== false).map((w) => (
          <div key={w.slug} className="border-l-2 border-rule pl-4">
            <dt>
              <CountUp value={w.metrics[0].value} className="text-2xl font-medium text-ink" />
            </dt>
            <dd className="mt-1 text-sm leading-snug text-ink-soft">
              {w.metrics[0].label}.{" "}
              <Link
                href={`/work/${w.slug}`}
                className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {w.title}
              </Link>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// The three parts of every build, each linked to the case study that shows it.
const AI3 = [
  { term: "Context", plain: "What your business knows, in one place your team and its AI tools can ask.", href: "/work/context-engine" },
  { term: "Agents", plain: "Software that does the repeatable work, with a human in the loop before anything goes out.", href: "/work/lead-research" },
  { term: "Evals", plain: "Proof it worked: each system measured against the job it was built to do.", href: "/work/prospecting-loop" },
];

const SUPPORT = [
  "Watching it and fixing what breaks",
  "Changes as your business changes",
  "New workflows as you find more to hand over",
  "A monthly report in your numbers",
];

// The offer. Pinned at the foot of the horizontal story so it is always one
// click away, and placed after the last step in the vertical one. The footer
// band is off on the home page, so this is the only offer there.
function Offer() {
  return (
    <div className="border-t border-rule bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="text-xl font-medium tracking-[-0.01em] text-ink">{site.ctaLine}</p>
          <p className="mt-1 text-sm text-ink-soft">{site.ctaNote}</p>
        </div>
        <Link
          href="/contact"
          className="btn-orange shrink-0 self-start px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:self-auto"
        >
          {site.cta}
        </Link>
      </div>
    </div>
  );
}
