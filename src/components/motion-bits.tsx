"use client";

import { type ReactNode, useEffect, useRef } from "react";

// Small motion pieces, written on the browser's own IntersectionObserver and
// requestAnimationFrame so the text pages don't load an animation library for
// a fade and a count. Both render the finished state on the server, without
// JavaScript and under reduced motion; the motion is a client enhancement only.

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// CountUp: rolls a figure up from zero when it enters view, so the eye lands on
// the number. Only animates a clean "prefix + integer + suffix" (35%, ~£900k,
// 17); anything else (ranges, words) renders as-is.
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const m = /^(\D*)(\d[\d,]*)(\D*)$/.exec(value);
    if (!el || !m || reduced()) return;
    const target = parseInt(m[2].replace(/,/g, ""), 10);
    const show = (n: number) => {
      el.textContent = `${m[1]}${n.toLocaleString("en-GB")}${m[3]}`;
    };
    show(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1100);
          show(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

// Reveal: content rises and fades in as it enters view. Anything already on
// screen when the page loads stays as it is, so nothing blinks out and back.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) return;
    el.classList.add("reveal");
    el.style.transitionDelay = `${delay}s`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("revealed");
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
