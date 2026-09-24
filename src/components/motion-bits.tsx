"use client";

import { useEffect, useRef } from "react";

// CountUp, on the browser's own IntersectionObserver and requestAnimationFrame
// so the text pages don't load an animation library for a count. It renders
// the finished figure on the server, without JavaScript and under reduced
// motion. (A scroll fade on every section was removed in the #585 polish:
// one identical entrance everywhere is decoration, not an authored moment.)

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
