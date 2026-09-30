import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Page, Row } from "@/components/section";
import { Figure } from "@/components/figure";
import { CasePreview, PlatformPreview } from "@/components/demo/previews";
import { ctaFor, proofFor, serviceCategories, serviceFor, site } from "@/content/site";
import { servicePages } from "@/content/service-pages";
import { words } from "@/content/copy";
import copyServices from "@/content/copy.gen/services";

// One page per service, in the order a buyer decides (#602): the outcome in
// the lead, their problem, what they get, how it runs, a case study, the price,
// the questions they ask. Each thing said once. The button names the service at the top; the footer
// band closes on the same button.
// Labels shared by every service page: src/content/copy/services.md (#561).
const w = words(copyServices);

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
  const next = serviceFor(page.next);

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
      <Row label={w.t("label.problem")}>
        <p className="max-w-2xl text-lg leading-relaxed text-ink">{page.problem}</p>
      </Row>

      <Row label={w.t("label.includes")}>
        <div className="max-w-2xl">
          <List items={s.includes} />
        </div>
      </Row>

      <Row label={w.t("label.steps")}>
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
        <Row label={more.length ? w.t("label.case-studies") : w.t("label.case-study")}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">
                <Link href={`/work/${lead.slug}`} className="-my-2 inline-block py-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
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
              {more.length ? (
                <p className="mt-6 text-sm text-ink-soft">
                  {w.t("label.also")}{" "}
                  {more.map((w, i) => (
                    <span key={w.slug}>
                      {i ? " · " : ""}
                      <Link href={`/work/${w.slug}`} className={`whitespace-nowrap ${LINK}`}>
                        {w.title}
                        <ArrowRight aria-hidden className="ml-1 inline size-3.5 align-[-2px]" />
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
            <Link
              href={`/work/${lead.slug}`}
              aria-label={w.t("preview-case").replace("{name}", lead.title)}
              className="block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
            >
              <CasePreview slug={lead.slug} />
            </Link>
          </div>
        </Row>
      ) : null}

      {/* A service with no case study yet shows the product it makes. */}
      {!lead && slug === "agentic-platform" ? (
        <Row label={w.t("label.example")}>
          <div className="max-w-xl">
            <PlatformPreview />
          </div>
        </Row>
      ) : null}

      <Row label={w.t("label.price")}>
        <p className="font-medium text-ink">
          {s.price} <span className="font-normal text-ink-soft">· {s.duration}</span>
        </p>
        {page.priceNote ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink">{page.priceNote}</p> : null}
        <p className="mt-3 text-sm text-ink-soft">{site.vatNote}</p>
      </Row>

      <Row label={w.t("label.questions")}>
        <dl className="max-w-2xl space-y-6">
          {page.faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-medium text-ink">{f.q}</dt>
              <dd className="mt-2 leading-relaxed text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Row>

      {/* The technical detail, for search and for a technical buyer, kept
          below the questions so an owner reads the value first (2026-09-30:
          a reviewer found the page leaned technical where it sat under
          "What you get"). */}
      <Row label={w.t("label.built-with")}>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">{s.under}</p>
      </Row>

      {/* Where buyers usually go next, one line (#583). */}
      {next ? (
        <Row label={w.t("label.next")}>
          <p className="text-lg text-ink">
            <Link href={`/services/${next.slug}`} className={`font-medium ${LINK}`}>
              {next.name}
              <ArrowRight aria-hidden className="ml-1 inline size-4 align-[-2px]" />
            </Link>
          </p>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">{servicePages[next.slug]?.line}</p>
        </Row>
      ) : null}
    </Page>
  );
}
