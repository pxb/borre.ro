import type { Metadata } from "next";
import { isFigure } from "@/lib/is-figure";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Page, Row } from "@/components/section";
import { ProspectingDemo } from "@/components/demo/prospecting-demo";
import { ContextEngineDemo } from "@/components/demo/context-engine-demo";
import { WorkflowDemo } from "@/components/demo/workflow-demo";
import { leadEnrichmentRun, postCallRun } from "@/content/demo-showcases";

// The interactive piece for each case study, shown full width under Solution.
const SHOWCASE: Record<string, () => React.ReactNode> = {
  "context-engine": () => <ContextEngineDemo />,
  "prospecting-loop": () => <ProspectingDemo />,
  "lead-research": () => <WorkflowDemo run={leadEnrichmentRun} title="Inbound lead enrichment" />,
  "post-call": () => <WorkflowDemo run={postCallRun} title="Post-call follow-up" />,
};
import { serviceFor, work } from "@/content/site";

export function generateStaticParams() {
  return work.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = work.find((w) => w.slug === slug);
  if (!c) return {};
  return { title: c.title, description: c.tagline };
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3 leading-relaxed text-ink-soft">
          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-action" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = work.find((w) => w.slug === slug);
  if (!c) notFound();
  const services = c.services.map(serviceFor).filter((s) => s != null);

  return (
    <Page
      title={c.title}
      lead={c.tagline}
      crumbs={[{ href: "/", label: "Home" }, { href: "/work", label: "Case studies" }]}
    >
      <Row label="Challenge">
        <div className="max-w-2xl space-y-4">
          {c.problem.map((p) => (
            <p key={p.slice(0, 24)} className="leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>
      </Row>

      <Row label="Solution">
        <div className="max-w-2xl space-y-6">
          <List items={c.does} />
          {[...(c.journey ?? []), ...c.involved].map((p) => (
            <p key={p.slice(0, 24)} className="leading-relaxed text-ink">
              {p}
            </p>
          ))}
          <div>
            <h3 className="label">Connected systems</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {c.stack.map((s) => (
                <li key={s} className="border border-rule px-2.5 py-1 text-sm text-ink">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="label">Technology</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {c.tech.map((t) => (
                <li key={t} className="border border-dashed border-rule px-2.5 py-1 text-sm text-ink-soft">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services#${service.slug}`}
                className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {service.name}, {service.price.charAt(0).toLowerCase() + service.price.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </Row>

      {/* The demo is part of the solution, full width so the product has room. */}
      {SHOWCASE[c.slug] ? (
        <section className="border-b border-rule pt-2 pb-12">{SHOWCASE[c.slug]()}</section>
      ) : null}

      <Row label="Results">
        <dl className="flex flex-wrap gap-x-12 gap-y-6">
          {c.metrics.map((m) => (
            <div key={m.label}>
              <dt
                className={`text-3xl text-ink ${
                  isFigure(m.value) ? "font-mono tabular-nums" : "font-medium"
                }`}
              >
                {m.value}
              </dt>
              <dd className="mt-1 max-w-[16rem] text-sm leading-snug text-ink-soft">{m.label}</dd>
            </div>
          ))}
        </dl>
      </Row>

      {/* Only real, attributable quotes. None yet: Insight's waits on #562. */}
      {c.testimonial ? (
        <Row label="Testimonial">
          <figure className="max-w-2xl">
            <blockquote className="text-xl leading-snug text-ink">{c.testimonial.quote}</blockquote>
            <figcaption className="mt-3 text-sm text-ink-soft">
              {c.testimonial.name}, {c.testimonial.role}
            </figcaption>
          </figure>
        </Row>
      ) : null}
    </Page>
  );
}
