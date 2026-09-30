"use client";

import { useEffect, useState } from "react";

/* Cycles a word in place.
   Every word sits invisibly in the same grid cell, so the slot is as wide as
   the widest word and the rest of the line never moves as the word changes
   (2026-09-30, iPhone feedback: "AI" jumped about). The coloured word is
   painted in the same cell. Holds on the first word under reduced motion, and
   that word is what the server renders. */
export function CyclingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);

  const word = words[index];

  return (
    <span className="inline-grid whitespace-nowrap">
      {words.map((w) => (
        <span key={w} aria-hidden="true" className="invisible col-start-1 row-start-1">
          {w}
        </span>
      ))}
      <span key={word} className="cycling-word col-start-1 row-start-1 text-action">
        {word}
      </span>
    </span>
  );
}
