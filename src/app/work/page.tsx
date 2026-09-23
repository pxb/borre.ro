import type { Metadata } from "next";
import { isFigure } from "@/lib/is-figure";
import Link from "next/link";
import { Page } from "@/components/section";
import { work } from "@/content/site";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Four AI systems built from real client work: what each one draws on, what it does and what it delivered.",
};

export default function Work() {
  return (
    <Page
      title="Built from real client work."
      lead="Each one started as a job someone was doing by hand."
      crumbs={[{ href: "/", label: "Home" }]}
    >
      <div>
        {work.map((c, i) => (
          <Link
            key={c.slug}
            href={`/work/${c.slug}`}
            className="group grid gap-6 border-b border-rule py-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
          >
            <span className="font-mono text-xs tabular-nums text-ink-soft">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                {c.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{c.tagline}</p>
              <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                {c.metrics.map((m) => (
                  <div key={m.label}>
                    <dt
                      className={`text-lg text-ink ${
                        isFigure(m.value) ? "font-mono tabular-nums" : "font-medium"
                      }`}
                    >
                      {m.value}
                    </dt>
                    <dd className="text-xs text-ink-soft">{m.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Link>
        ))}
      </div>
      <p className="pt-10 text-xs text-ink-soft">
        Figures are rounded. Client names are kept private and demo companies are invented.
      </p>
    </Page>
  );
}
