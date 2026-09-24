import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/section";
import { Reveal } from "@/components/motion-bits";
import { costNotes, proofFor, serviceCategories } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI services for small and medium-sized UK businesses, with prices: an AI readiness audit, a leadership workshop, training and setup, a Context Engine, agentic workflows, custom apps and dashboards, and a full agentic platform.",
};

export default function Services() {
  return (
    <Page
      title="Seven ways we can help."
      lead="Not sure where to start? Book a call and we'll suggest one."
      crumbs={[{ href: "/", label: "Home" }]}
    >
      <div className="border-t border-rule">
        {serviceCategories.map((s) => (
          <Reveal key={s.slug}>
            <section
              id={s.slug}
              className="grid scroll-mt-28 gap-x-12 gap-y-4 border-b border-rule py-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] lg:items-baseline">
              <h2 className="text-xl font-medium tracking-[-0.01em] text-ink">{s.name}</h2>
              <div className="max-w-xl">
                <p className="leading-relaxed text-ink-soft">{s.what}</p>
                <ul className="mt-5 space-y-2">
                  {s.includes.map((i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 max-w-md text-xs leading-relaxed text-ink-soft">
                  {s.under}
                </p>
                {proofFor(s.slug).length ? (
                  <p className="mt-3 text-sm text-ink-soft">
                    {proofFor(s.slug).map((w, i) => (
                      <span key={w.slug}>
                        {i ? " · " : ""}
                        <Link
                          href={`/work/${w.slug}`}
                          className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        >
                          {w.title} &rarr;
                        </Link>
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
              <div className="lg:text-right">
                <p className="whitespace-nowrap text-sm font-medium text-ink">{s.price}</p>
                <p className="mt-1 max-w-[14rem] text-sm text-ink-soft lg:ml-auto">{s.duration}</p>
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      <section className="py-16">
        <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">Pricing</h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {costNotes.map((c) => (
            <div key={c.title}>
              <h3 className="text-base font-medium text-ink">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
