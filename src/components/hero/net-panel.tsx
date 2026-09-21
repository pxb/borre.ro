"use client";

import { useEffect, useRef, useState } from "react";

type VantaEffect = { destroy: () => void; resize?: () => void };

/**
 * Vanta NET, bounded inside a framed panel.
 *
 * Bounded on purpose. Every previous attempt at a full-bleed animated backdrop
 * failed the same way: turn it up and the copy is unreadable, turn it down and
 * the page reads grey, and every edge needs a mask that leaves a seam. Inside a
 * frame the edge is deliberate, nothing has to be read through it, and the
 * effect can be as lively as it likes.
 *
 * NET over the other effects because it argues the headline: a mesh of points
 * finding each other is the thing the site says it builds.
 */
export function NetPanel({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const effect = useRef<VantaEffect | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Honour reduced motion with a real variant: the static frame, no animation.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !host.current) return;

    let cancelled = false;

    (async () => {
      const [THREE, mod] = await Promise.all([
        import("three"),
        import("vanta/dist/vanta.net.min"),
      ]);
      if (cancelled || !host.current) return;

      const NET = (mod as { default: (opts: Record<string, unknown>) => VantaEffect }).default;
      effect.current = NET({
        el: host.current,
        THREE,
        mouseControls: true,
        // Touch drag would fight the page scroll on a phone.
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0xe6dfd2, // cream-deep lines
        backgroundColor: 0x1f1c19, // ink panel
        // Density and contrast trade against each other. Dark-on-cream needed a
        // dense mesh to register at all and still read as noise; light-on-ink
        // registers immediately, so it wants FEWER connections or it becomes
        // scribble and steals attention from the call to action.
        points: 9,
        maxDistance: 20,
        spacing: 18,
        showDots: true,
      });
      setReady(true);
    })();

    return () => {
      cancelled = true;
      effect.current?.destroy();
      effect.current = null;
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden="true"
      data-ready={ready}
      className={`relative overflow-hidden border-2 border-ink bg-cream ${className}`}
    />
  );
}
