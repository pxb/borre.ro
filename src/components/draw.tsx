"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

// The two motions DESIGN.md allows beyond the counts (#585, Pedro 2026-09-24):
// drawn lines that draw themselves once as they come into view, and one marker
// per picked set that glides from item to item. Both render finished and still
// on the server, without JavaScript and under reduced motion; the motion
// component only replaces the plain one after mount, so it starts from an
// already-visible default everywhere else.

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

export function useMotionOn() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return mounted && !reduce;
}

// A straight line (a track, a tread, a riser) that draws along its axis.
// Give it origin-left or origin-top in className so it grows from the start.
export function DrawLine({
  className,
  axis = "x",
  delay = 0,
  style,
}: {
  className: string;
  axis?: "x" | "y";
  delay?: number;
  style?: CSSProperties;
}) {
  const on = useMotionOn();
  if (!on) return <span aria-hidden="true" className={className} style={style} />;
  const k = axis === "x" ? "scaleX" : "scaleY";
  return (
    <motion.span
      aria-hidden="true"
      className={className}
      style={style}
      initial={{ [k]: 0 }}
      whileInView={{ [k]: 1 }}
      viewport={VIEW}
      transition={{ duration: 0.8, delay, ease: EASE }}
    />
  );
}

// Anything that should appear once its line has drawn (stops, arrowheads).
export function After({ children, delay = 0.6 }: { children: React.ReactNode; delay?: number }) {
  const on = useMotionOn();
  if (!on) return <>{children}</>;
  return (
    <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEW} transition={{ duration: 0.4, delay }}>
      {children}
    </motion.g>
  );
}

// An SVG ring that draws itself clockwise from the top.
export function DrawRing({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const on = useMotionOn();
  const common = { cx, cy, r, fill: "none", stroke: "var(--ink)", strokeWidth: 2 };
  if (!on) return <circle {...common} />;
  return (
    <motion.circle
      {...common}
      transform={`rotate(-90 ${cx} ${cy})`}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={VIEW}
      transition={{ duration: 1.2, ease: EASE }}
    />
  );
}

// A block of linework revealed left to right, for lines drawn with
// non-scaling strokes where a dash-based draw would mis-measure (the hub).
export function Wipe({ children, className }: { children: React.ReactNode; className?: string }) {
  const on = useMotionOn();
  if (!on) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={VIEW}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// The picked-item marker: one element per set, shared by layoutId, so picking
// another item slides the accent across instead of switching it off and on.
export function Marker({ id, className, style }: { id: string; className: string; style?: CSSProperties }) {
  const on = useMotionOn();
  if (!on) return <span aria-hidden="true" className={className} style={style} />;
  return (
    <motion.span
      aria-hidden="true"
      layoutId={id}
      className={className}
      style={style}
      transition={{ type: "spring", stiffness: 480, damping: 38 }}
    />
  );
}
