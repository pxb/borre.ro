"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// CountUp: rolls a figure up from zero when it enters view, so the eye lands on
// the number. Only animates a clean "prefix + integer + suffix" (35%, ~£900k,
// 17); anything else (ranges, words) renders as-is. Honours reduced motion.
export function CountUp({ value, className }: { value: string; className?: string }) {
  const reduce = useReducedMotion();
  const m = /^(\D*)(\d[\d,]*)(\D*)$/.exec(value);
  const animatable = !!m && !reduce;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [mounted, setMounted] = useState(false);
  // SSR and no-JS render the real figure; the roll-up is a client enhancement.
  const [display, setDisplay] = useState(value);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!animatable || !mounted) return;
    if (!inView) {
      setDisplay(`${m![1]}0${m![3]}`);
      return;
    }
    const target = parseInt(m![2].replace(/,/g, ""), 10);
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${m![1]}${Math.round(v).toLocaleString("en-GB")}${m![3]}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, inView, animatable, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

// Reveal: content rises and fades in as it enters view. Motion uses JS
// animation, so the global reduced-motion CSS does not cover it; we honour the
// preference explicitly and render static.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // SSR, no-JS and reduced motion all render the content visible; the reveal is
  // a client-only enhancement, so the story is never blank without JavaScript.
  if (reduce || !mounted) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// Parallax: drifts with scroll. This is the piece that actually reads the smooth
// scroll position (kept buttery by Lenis) rather than just fading on enter.
export function Parallax({
  children,
  className,
  amount = 28,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
