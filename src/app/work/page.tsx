import type { Metadata } from "next";
import Link from "next/link";
import { isFigure } from "@/lib/is-figure";
import { Page } from "@/components/section";
import { Reveal } from "@/components/motion-bits";
import { CasePreview } from "@/components/demo/previews";
import { work } from "@/content/site";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "Four AI systems built from real client work: a Context Engine with RAG over the CRM, outbound prospecting, inbound lead enrichment and post-call follow-up.",
};

// Each case study as it appears inside: its business-value results, the
// systems it connects and a still preview of its interactive demo, so the
// index reads like the pages it leads to.
export default function Work() {
  return (
    <Page
      title="Built from real client work."
      lead="Each one started as a job someone was doing by hand."
      crumbs={[{ href: "/", label: "Home" }]}
    >
      <div>
        {work.map((c, i) => (
          <Reveal key={c.slug}>
            <article className="grid gap-10 border-b border-rule py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
              <div className="min-w-0">
                <p className="font-mono text-xs tabular-nums text-ink-soft">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] font-medium tracking-[-0.015em] text-ink">
                  <Link
                    href={`/work/${c.slug}`}
                    className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {c.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{c.tagline}</p>

                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  {c.metrics.slice(0, 2).map((m) => (
                    <div key={m.label} className="border-l-2 border-rule pl-4">
                      <dt className={`text-2xl text-ink ${isFigure(m.value) ? "font-mono tabular-nums" : "font-medium"}`}>
                        {m.value}
                      </dt>
                      <dd className="mt-1 text-sm leading-snug text-ink-soft">{m.label}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-8 flex flex-wrap gap-2">
                  {c.stack.map((s) => (
                    <li key={s} className="border border-rule px-2.5 py-0.5 text-xs text-ink-soft">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/work/${c.slug}`}
                aria-label={`${c.title} case study`}
                className="block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
              >
                <CasePreview slug={c.slug} />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="pt-10 text-xs text-ink-soft">
        Figures are rounded. Client names are kept private, and the demos use an invented company.
      </p>
    </Page>
  );
}
