import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Page, Row } from "@/components/section";
import { Figure } from "@/components/figure";
import { CasePreview } from "@/components/demo/previews";
import { ctaFor, proofFor, serviceCategories, serviceFor, site } from "@/content/site";
import { servicePages } from "@/content/service-pages";

// One page per service, in the order a buyer decides (#602): who it's for,
// what changes, what you get, how it works, proof, price and timing, the
// questions they ask. The button names the service at the top; the footer
// band closes on the same button.
export function generateStaticParams() {
  return serviceCategories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceFor(slug);
  const page = servicePages[slug];
  if (!s || !page) return {};
  const path = `/services/${s.slug}`;
  return pageMeta({ title: s.name, description: `${page.line} ${s.what}`, path, image: { url: `${path}/opengraph-image`, alt: s.name } });
}

const LINK =
  "text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3 leading-relaxed text-ink">
          <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function Service({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceFor(slug);
  const page = servicePages[slug];
  if (!s || !page) notFound();
  const cta = ctaFor(`/services/${slug}`);
  const proof = proofFor(slug);
  const [lead, ...more] = proof;

  return (
    <Page
      title={s.name}
      lead={page.line}
      crumbs={[{ href: "/", label: "Home" }, { href: "/services", label: "Services" }]}
      action={
        <Link
          href={cta.href}
          data-track="cta"
          data-track-where="service-page"
          data-track-service={slug}
          className="btn-orange inline-block px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          {cta.label}
        </Link>
      }
    >
      <Row label="Who it's for">
        <div className="max-w-2xl space-y-4">
          <p className="text-lg leading-relaxed text-ink">{page.forWho}</p>
          <p className="leading-relaxed text-ink-soft">{s.what}</p>
        </div>
      </Row>

      <Row label="What changes">
        {/* The upside, so each outcome carries the accent mark (DESIGN.md). */}
        <ul className="grid gap-8 sm:grid-cols-3">
          {page.changes.map((c) => (
            <li key={c} className="leading-snug text-ink">
              <span aria-hidden="true" className="mb-4 block h-1 w-10 bg-accent" />
              {c}
            </li>
          ))}
        </ul>
      </Row>

      <Row label="What you get">
        <div className="max-w-2xl">
          <List items={s.includes} />
          <p className="mt-6 text-xs leading-relaxed text-ink-soft">{s.under}</p>
        </div>
      </Row>

      <Row label="How it works">
        <ol className={`grid gap-8 sm:grid-cols-2 ${page.steps.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {page.steps.map((step, i) => (
            <li key={step.t}>
              <span className="font-mono text-sm tabular-nums text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-medium text-ink">{step.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.d}</p>
            </li>
          ))}
        </ol>
      </Row>

      {lead ? (
        <Row label="In practice">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">
                <Link href={`/work/${lead.slug}`} className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                  {lead.title}
                </Link>
              </h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{lead.tagline}</p>
              {lead.resultsProven !== false && lead.metrics[0] ? (
                <div className="mt-6">
                  <Figure value={lead.metrics[0].value}>
                    <span className="block max-w-[16rem] text-sm text-ink-soft">{lead.metrics[0].label}</span>
                  </Figure>
                </div>
              ) : null}
              <p className="mt-6 text-sm text-ink-soft">
                {[lead, ...more].map((w, i) => (
                  <span key={w.slug}>
                    {i ? " · " : ""}
                    <Link href={`/work/${w.slug}`} className={`whitespace-nowrap ${LINK}`}>
                      {i ? w.title : "See the case study"}
                      <ArrowRight aria-hidden className="ml-1 inline size-3.5 align-[-2px]" />
                    </Link>
                  </span>
                ))}
              </p>
            </div>
            <Link
              href={`/work/${lead.slug}`}
              aria-label={`${lead.title}: see the case study`}
              className="block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
            >
              <CasePreview slug={lead.slug} />
            </Link>
          </div>
        </Row>
      ) : null}

      <Row label="Price and timing">
        <p className="font-medium text-ink">
          {s.price} <span className="font-normal text-ink-soft">· {s.duration}</span>
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          {site.vatNote}{" "}
          <Link href="/services#pricing" className={LINK}>
            How our pricing works
          </Link>
        </p>
      </Row>

      <Row label="Common questions">
        <dl className="max-w-2xl space-y-6">
          {page.faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-medium text-ink">{f.q}</dt>
              <dd className="mt-2 leading-relaxed text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Row>
    </Page>
  );
}
