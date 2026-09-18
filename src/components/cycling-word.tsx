"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Cycles a word in place. The container animates to the active word's
   measured width, so the headline neither reflows nor leaves a gap.
   Holds on the first word under reduced motion; that word is in the HTML. */
export function CyclingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const el = refs.current[index];
    if (el) setWidth(el.getBoundingClientRect().width);
  }, [index]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span
      className="relative inline-grid overflow-hidden align-baseline transition-[width] duration-500 ease-out"
      style={width ? { width } : undefined}
    >
      {words.map((w, i) => (
        <span
          key={w}
          ref={(el) => {
            refs.current[i] = el;
          }}
          aria-hidden={i === index ? undefined : true}
          className="col-start-1 row-start-1 whitespace-nowrap text-left text-orange transition-[opacity,transform] duration-500 ease-out"
          style={{
            opacity: i === index ? 1 : 0,
            transform: i === index ? "translateY(0)" : "translateY(-0.2em)",
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
