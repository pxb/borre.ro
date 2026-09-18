"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Cycles a word in place.
   Hidden copies exist only to measure, so the slot can animate to the
   active word's width without the headline reflowing. Exactly one word
   is ever visible, so words never overlap mid-transition.
   Holds on the first word under reduced motion, and that word is in the HTML. */
export function CyclingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const sizers = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const el = sizers.current[index];
    if (el) setWidth(el.getBoundingClientRect().width);
  }, [index]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span
      className="relative inline-block align-baseline transition-[width] duration-500 ease-out"
      style={width ? { width } : undefined}
    >
      <span aria-hidden="true" className="invisible block h-0 overflow-hidden">
        {words.map((w, i) => (
          <span
            key={w}
            ref={(el) => {
              sizers.current[i] = el;
            }}
            className="whitespace-nowrap"
          >
            {w}
          </span>
        ))}
      </span>
      <span
        key={words[index]}
        className="cycling-word absolute left-0 top-0 whitespace-nowrap text-brick"
      >
        {words[index]}
      </span>
    </span>
  );
}
