"use client";

import Link from "next/link";
import { Figure } from "@/components/figure";
import { words } from "@/content/copy";
import copyHome from "@/content/copy.gen/home";
import { work } from "@/content/site";

// What we've built, straight after the hero (#624, Pedro 2026-10-10: open with
// the work, not survey figures). Each case study with one figure of its own,
// never a target: post-call's timing is still a target, so it shows the four
// jobs it prepares instead. A client component with no props, so the page
// sends it once rather than twice (the homepage sits at the first round trip).
const w = words(copyHome);
const BUILT: [string, number][] = [
  ["context-engine", 1],
  ["prospecting-loop", 0],
  ["lead-research", 0],
  ["post-call", 1],
];

export function BuiltStrip() {
  return (
    <section aria-labelledby="built" className="mx-auto max-w-6xl px-6 pt-4 pb-14 sm:px-10 lg:pb-20">
      <h2 id="built" className="label">
        {w.t("built.label")}
      </h2>
      <ul className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {BUILT.map(([slug, i], n) => {
          const c = work.find((x) => x.slug === slug)!;
          return (
            <li key={slug}>
              <Link href={`/work/${slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                <Figure value={c.metrics[i].value}>
                  <span className="block text-sm text-ink-soft">{w.t(`built.${n + 1}`)}</span>
                </Figure>
                <p className="mt-4 font-medium text-ink underline decoration-rule underline-offset-4 group-hover:decoration-accent">{c.title}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
