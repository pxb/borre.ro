"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Progressive enhancement only: the page is fully readable and scrollable
// without this. Under reduced motion we never start Lenis at all, so native
// scrolling (and the browser's own reduced-motion behaviour) is untouched.
// The instance lives on window so the stepper can drive it reliably.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // autoRaf lets Lenis own its animation frame, tied to the instance lifecycle,
    // so a dev double-mount can't leave a hand-rolled loop driving a dead copy.
    const lenis = new Lenis({ autoRaf: true, duration: 1.05, smoothWheel: true });
    window.__lenis = lenis;

    return () => {
      window.__lenis = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
