"use client";

import { useEffect, useRef, useState } from "react";

type VantaEffect = { destroy: () => void; resize?: () => void };

/**
 * Vanta NET, full bleed behind the hero.
 *
 * Parameters are Pedro's, from the vantajs.com customiser, with only the two
 * colours moved onto the site palette. Do not substitute your own.
 *
 * There is deliberately NO mask and NO border. The net paints its own
 * background in the page's cream, so the canvas has no visible edge to fade
 * out, and the whole class of seam artifacts that plagued the old wash simply
 * does not arise. That is what makes a full bleed safe here.
 *
 * Text over this is fine. The containment rule in AGENTS.md was learned on a
 * saturated colour wash, where there was no setting that kept copy readable.
 * Fine linework on a light ground is a different problem: the lines cover a
 * tiny fraction of the area and never sit as a block behind a letterform.
 *
 * NET over the other effects because it argues the headline. The site says the
 * tools do not talk to each other; a mesh finding its connections is the thing
 * being sold.
 *
 * No `pointer-events-none`: mouseControls needs the element to receive
 * mousemove. It sits at -z-10, so the copy and buttons stack above it and
 * still take their own clicks.
 */
export function NetBackdrop() {
  const host = useRef<HTMLDivElement>(null);
  const effect = useRef<VantaEffect | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Reduced motion gets a real variant: plain cream, no WebGL context at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!host.current) return;

    let cancelled = false;

    (async () => {
      const [THREE, mod] = await Promise.all([
        import("three"),
        import("vanta/dist/vanta.net.min"),
      ]);
      if (cancelled || !host.current) return;

      const NET = (mod as { default: (o: Record<string, unknown>) => VantaEffect }).default;
      effect.current = NET({
        el: host.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xd8452a, // vermillion, the site's accent
        backgroundColor: 0xf2ede4, // cream, identical to the page
        points: 13.0,
        maxDistance: 16.0,
        spacing: 15.0,
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
      className="absolute inset-0 -z-10"
    />
  );
}
