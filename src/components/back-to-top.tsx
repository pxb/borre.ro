"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/scroll";

// Appears once the reader is well past the first screen. Uses Lenis when it
// is running so the trip up is smooth; jumps under reduced motion.
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const on = () => setShow(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`fixed right-5 bottom-24 z-40 sm:bottom-20 flex size-11 items-center justify-center border-2 border-ink bg-paper text-ink transition-[opacity,transform,background-color,color] duration-300 motion-reduce:transition-[background-color,color] hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp aria-hidden="true" className="size-5" strokeWidth={1.75} />
    </button>
  );
}
