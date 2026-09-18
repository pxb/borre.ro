import Link from "next/link";
import { HeroMark } from "@/components/hero/mark";
import { CyclingWord } from "@/components/cycling-word";
import { RevOps } from "@/components/revops";
import { HeroGradient } from "@/components/hero/gradient-panel";
import { evidence, fears, paradigm, site } from "@/content/site";

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden text-ink">
        <HeroGradient />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
              <RevOps />, built and run
            </p>
            <h1 className="mt-6 max-w-2xl text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.03em] text-ink">
              {site.headlineBefore} <CyclingWord words={site.headlineCounts} />{" "}
              {site.headlineAfter}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">{site.summary}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-orange px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                Book a free 30-minute review
              </Link>
              <Link
                href="/work"
                className="border-2 border-ink bg-cream px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                Case studies
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroMark />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <section className="border-b border-rule py-16">
          <dl className="grid gap-10 sm:grid-cols-2">
            {evidence.map((e) => (
              <div key={e.stat} className="flex gap-6">
                <dt className="font-mono text-4xl tabular-nums leading-none text-action">
                  {e.stat}
                </dt>
                <dd className="max-w-xs">
                  <p className="leading-snug text-ink">{e.claim}</p>
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-ink-faint underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-action"
                  >
                    {e.source}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-b border-rule py-20">
          <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">{fears.title}</h2>
          <div className="mt-12 divide-y divide-rule border-y border-rule">
            {fears.items.map((f) => (
              <div
                key={f.fear}
                className="grid gap-4 py-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16"
              >
                <p className="text-lg leading-snug text-ink">&ldquo;{f.fear}&rdquo;</p>
                <div>
                  <p className="leading-relaxed text-ink-soft">{f.answer}</p>
                  <p className="mt-3 text-xs text-ink-faint">
                    {f.stat ? <span className="font-mono text-action">{f.stat} </span> : null}
                    {f.href ? (
                      <a
                        href={f.href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-action"
                      >
                        {f.note}
                      </a>
                    ) : (
                      f.note
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-rule py-20">
          <h2 className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="text-4xl font-medium tracking-[-0.02em] text-ink">
              {paradigm.title}
            </span>
            <span className="font-mono text-sm text-action">{paradigm.subtitle}</span>
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{paradigm.lead}</p>
          <div className="mt-12 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">
            {paradigm.parts.map((part) => (
              <div key={part.term} className="bg-paper p-8">
                <h3 className="text-lg font-medium text-ink">{part.term}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-action">
                  {part.plain}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{part.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">
              Four systems, built and running.
            </h2>
            <Link
              href="/work"
              className="text-sm text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-action"
            >
              Case studies
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
