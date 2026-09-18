import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/section";
import { work } from "@/content/site";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Four systems, built and running. What each one draws on, what it does and what it returned.",
};

export default function Work() {
  return (
    <Page
      title="Four systems, built and running."
      lead="Real figures from live runs, rounded. Clients are not named, and companies shown in demos are invented."
      crumbs={[{ href: "/", label: "Home" }]}
    >
      <div>
        {work.map((c, i) => (
          <Link
            key={c.slug}
            href={`/work/${c.slug}`}
            className="group grid gap-6 border-b border-rule py-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16"
          >
            <span className="font-mono text-xs tabular-nums text-ink-faint">
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
                    <dt className="font-mono text-lg tabular-nums text-ink">{m.value}</dt>
                    <dd className="text-xs text-ink-faint">{m.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Link>
        ))}
      </div>
    </Page>
  );
}
