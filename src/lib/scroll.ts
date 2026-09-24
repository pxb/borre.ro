import type Lenis from "lenis";

// One true reference to the running Lenis instance, kept on window so a dev Fast
// Refresh module split can't leave the stepper pointing at a stale copy.
declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

// Clears the fixed header. Element-based scrollTo mis-resolves targets inside a
// sticky/grid layout, so compute the absolute position from the rect and pass a
// number, which is layout-agnostic.
// Clears the sticky header (80px) plus the sticky step bar beneath it.
const HEADER_OFFSET = 120;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(y);
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}

// Back to the top of the page: Lenis when it runs, a jump under reduced motion.
export function scrollToTop() {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
