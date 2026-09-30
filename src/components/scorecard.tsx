"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Figure } from "@/components/figure";
import { questions, result, SCORECARD_KEY, SHARE, type Answers } from "@/content/scorecard";
import { servicePages } from "@/content/service-pages";
import { ctaFor, serviceFor } from "@/content/site";

const pct = (n: number) => `${Math.round(n * 100)}%`;

// Native radios, so the questions read and work without JavaScript; the
// result needs it. A picked answer fills its circle in the accent, like the
// picked stop on the call track (DESIGN.md).
export function Scorecard() {
  const [a, setA] = useState<Answers>({});
  const answered = questions.filter((q) => a[q.id] != null).length;
  const done = answered === questions.length;
  const r = done ? result(a) : null;
  const s = r ? serviceFor(r.service) : undefined;
  const cta = r ? ctaFor(`/services/${r.service}`) : null;

  // Log each finished set of answers once, anonymously (/api/scorecard), after
  // a pause so a reader changing answers sends only where they settle.
  const sent = useRef(new Set<string>());
  const key = done ? questions.map((q) => a[q.id]).join("") : "";
  useEffect(() => {
    if (!key || sent.current.has(key)) return;
    const t = setTimeout(() => {
      sent.current.add(key);
      fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: a }),
        keepalive: true,
      }).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [key, a]);

  // Carry the result into the booking notes when they click through.
  const remember = () => {
    if (!r || !s) return;
    try {
      sessionStorage.setItem(SCORECARD_KEY, `Scorecard: ${r.band.name}, about ${r.low} to ${r.high} hours a week back`);
    } catch {}
  };

  return (
    <>
      <ol className="divide-y divide-rule border-y border-rule">
        {questions.map((q, i) => (
          <li key={q.id} className="grid gap-5 py-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
            <span className="font-mono text-sm tabular-nums text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
            <fieldset className="min-w-0">
              <legend className="max-w-2xl text-lg leading-snug text-ink">{q.q}</legend>
              <div className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                {q.options.map((o, j) => (
                  <label key={o.t} className="flex min-h-11 cursor-pointer items-center gap-3 text-ink">
                    <input
                      type="radio"
                      name={q.id}
                      checked={a[q.id] === j}
                      onChange={() => setA((p) => ({ ...p, [q.id]: j }))}
                      className="size-4 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-ink transition-colors checked:border-accent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    />
                    <span>{o.t}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <section aria-live="polite" className="grid gap-6 py-12 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
        <h2 className="label">Your result</h2>
        {r && s && cta ? (
          <div className="min-w-0">
            <p className="text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-tight tracking-[-0.02em] text-ink">{r.band.name}</p>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{r.band.line}</p>

            <div className="mt-10 max-w-md">
              <Figure value={`${r.low} to ${r.high}`}>
                <span className="block text-sm text-ink-soft">
                  hours a week back, estimated. About {Math.round(r.weekly)} hours of repeated admin a week, assuming{" "}
                  {pct(SHARE.low)} to {pct(SHARE.high)} of it moves to software. McKinsey puts what current AI and
                  other technology could automate at{" "}
                  <a href={SHARE.source} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                    60 to 70% of work time
                  </a>
                  .
                </span>
              </Figure>
            </div>

            <p className="label mt-12">Where to start</p>
            <p className="mt-3 text-xl font-medium tracking-[-0.01em] text-ink">
              <Link
                href={`/services/${s.slug}`}
                className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {s.name}
              </Link>
            </p>
            <p className="mt-2 max-w-xl leading-relaxed text-ink-soft">{servicePages[s.slug]?.line}</p>
            <Link
              href={cta.href}
              onClick={remember}
              data-track="cta"
              data-track-where="scorecard"
              data-track-service={s.slug}
              className="btn-orange mt-8 inline-block px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              {cta.label}
            </Link>
          </div>
        ) : (
          <p className="text-ink-soft">
            {answered} of {questions.length} answered.
          </p>
        )}
      </section>
    </>
  );
}
