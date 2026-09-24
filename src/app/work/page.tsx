import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/section";
import { Figure } from "@/components/figure";
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
    <Page title="Case studies" bare>
      <div>
        {work.map((c, i) => (
          <article key={c.slug} className="grid gap-10 border-b border-rule py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
              {/* Previews alternate sides so the index doesn't read as one repeated row. */}
              <div className={`min-w-0 ${i % 2 ? "lg:order-2" : ""}`}>
                <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] font-medium tracking-[-0.015em] text-ink">
                  <Link
                    href={`/work/${c.slug}`}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {c.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{c.tagline}</p>

                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  {c.metrics.slice(0, 2).map((m) => (
                    <Figure key={m.label} value={m.value} dl>
                      <span className="text-sm text-ink-soft">{m.label}</span>
                    </Figure>
                  ))}
                </dl>

                <p className="mt-8 text-sm leading-relaxed text-ink-soft">{c.stack.join(" · ")}</p>
              </div>

              <Link
                href={`/work/${c.slug}`}
                aria-label={`${c.title} case study`}
                className="block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
              >
                <CasePreview slug={c.slug} />
              </Link>
          </article>
        ))}
      </div>
    </Page>
  );
}
