import type { Metadata } from "next";
import Link from "next/link";
import { Page, Row } from "@/components/section";
import { costNotes, solutions } from "@/content/site";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "What I build: audits, process mapping, a place for what the company knows, workflows, prospecting, training, and running it afterwards.",
};

export default function Solutions() {
  return (
    <Page
      title="Services."
      lead="Most of this starts with the same question. Where would this make or save money, and where would it not."
      crumbs={[{ href: "/", label: "Home" }]}
    >
      <div>
        {solutions.map((s) => (
          <Row key={s.slug} label={s.name}>
            <p className="max-w-2xl leading-relaxed text-ink">{s.what}</p>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-faint">Best for</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{s.forWho}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-faint">Cost</dt>
                <dd className="mt-1 font-mono text-sm text-ink">{s.price}</dd>
              </div>
            </dl>
          </Row>
        ))}
      </div>

      <section className="py-16">
        <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">How the money works</h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {costNotes.map((c) => (
            <div key={c.title}>
              <h3 className="text-base text-ink">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-12">
          <Link
            href="/contact"
            className="text-sm text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent"
          >
            Talk about which of these applies
          </Link>
        </p>
      </section>
    </Page>
  );
}
