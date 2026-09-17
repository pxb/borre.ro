"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { work } from "@/content/site";
import { Funnel } from "@/components/funnel";

export function Showcase() {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const current = work[active];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
      <div role="tablist" aria-label="Selected work" className="flex flex-col">
        {work.map((c, i) => {
          const isActive = i === active;
          return (
            <button
              key={c.slug}
              role="tab"
              id={`${panelId}-tab-${i}`}
              aria-selected={isActive}
              aria-controls={`${panelId}-panel`}
              onClick={() => setActive(i)}
              className="group border-t border-rule py-5 text-left last:border-b focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="flex items-baseline gap-4">
                <span
                  className={`font-mono text-xs tabular-nums transition-colors ${
                    isActive ? "text-accent" : "text-ink-faint"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-lg leading-snug transition-colors ${
                    isActive ? "text-ink" : "text-ink-faint group-hover:text-ink-soft"
                  }`}
                >
                  {c.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${panelId}-panel`}
        aria-labelledby={`${panelId}-tab-${active}`}
        className="min-w-0"
      >
        {current.slug === "prospecting-loop" ? (
          <Funnel />
        ) : (
          <div className="border-t border-rule pt-6">
            <p className="max-w-xl text-xl leading-relaxed text-ink">{current.tagline}</p>
            <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">{current.problem[0]}</p>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
              {current.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="font-mono text-2xl tabular-nums text-ink">{m.value}</dt>
                  <dd className="mt-1 text-sm leading-snug text-ink-faint">{m.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-8">
          <Link
            href={`/work/${current.slug}`}
            className="inline-flex items-center gap-2 text-sm text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Read the detail
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
