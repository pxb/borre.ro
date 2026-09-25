import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Page, Row } from "@/components/section";
import { SystemsHub } from "@/components/systems-hub";
import { Figure } from "@/components/figure";
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
  const path = `/work/${c.slug}`;
  return pageMeta({ title: c.title, description: c.tagline, path, image: { url: `${path}/opengraph-image`, alt: c.title } });
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3 leading-relaxed text-ink-soft">
          <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
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
        </div>
      </Row>

      {/* The demo is part of the solution, full width so the product has room. */}
      {SHOWCASE[c.slug] ? (
        <section className="border-b border-rule pt-2 pb-12">{SHOWCASE[c.slug]()}</section>
      ) : null}

      <Row label="Results">
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.metrics.map((m) => (
            <Figure key={m.label} value={m.value} dl>
              <span className="block max-w-[16rem] text-sm text-ink-soft">{m.label}</span>
            </Figure>
          ))}
        </dl>
      </Row>

      {/* Client feedback: only real words from the client, with permission. */}
      {c.testimonial ? (
        <Row label="Client feedback">
          <figure className="max-w-2xl">
            <blockquote className="text-xl leading-snug text-ink">&ldquo;{c.testimonial.quote}&rdquo;</blockquote>
            <figcaption className="mt-3 text-sm text-ink-soft">
              {c.testimonial.name}, {c.testimonial.role}
            </figcaption>
          </figure>
        </Row>
      ) : null}

      {/* The details, last: what it connects, how it's built, what it costs. */}
      <section className="grid gap-12 py-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 className="label">Connected systems</h2>
          <SystemsHub systems={c.stack} name={c.title} />
        </div>
        <div className="grid content-start gap-10">
        <div>
          <h2 className="label">Technology</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.tech.join(" · ")}</p>
        </div>
        <div>
          <h2 className="label">{services.length > 1 ? "Services" : "Service"}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services#${service.slug}`}
                  className="inline-flex min-h-11 items-center text-ink underline sm:min-h-0 decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {service.name}
                </Link>
                <span className="block text-ink-soft">
                  {service.price} · {service.duration.charAt(0).toLowerCase() + service.duration.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </section>
    </Page>
  );
}
