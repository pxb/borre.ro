"use client";

import { useEffect, useState } from "react";

/* Cycles a word in place.
   An invisible copy of the active word sits in normal flow and sets the
   slot's width and height; the coloured word is painted over it. That
   keeps the word on its own line, sized to itself, with only ever one
   word visible. Holds on the first word under reduced motion, and that
   word is what the server renders. */
export function CyclingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);

  const word = words[index];

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span aria-hidden="true" className="invisible">
        {word}
      </span>
      <span key={word} className="cycling-word absolute inset-0 text-brick">
        {word}
      </span>
    </span>
  );
}
