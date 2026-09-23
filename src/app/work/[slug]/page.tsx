import type { Metadata } from "next";
import { isFigure } from "@/lib/is-figure";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Page, Row } from "@/components/section";
import { Funnel } from "@/components/funnel";
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
      <Row label="Problem">
        <div className="max-w-2xl space-y-4">
          {c.problem.map((p) => (
            <p key={p.slice(0, 24)} className="leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>
      </Row>

      <Row label="Sources">
        <div className="max-w-2xl">
          <List items={c.drawsOn} />
        </div>
      </Row>

      <Row label="How it works">
        <div className="max-w-2xl">
          <List items={c.does} />
        </div>
      </Row>

      {c.slug === "prospecting-loop" ? (
        <Row label="One week">
          <Funnel />
        </Row>
      ) : null}

      <Row label="Your team's role">
        <div className="max-w-2xl">
          <List items={c.involved} />
        </div>
      </Row>

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

      <Row label="Runs on">
        <ul className="flex flex-wrap gap-2">
          {c.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
            >
              {s}
            </li>
          ))}
        </ul>
      </Row>

      {services.length ? (
        <Row label={services.length > 1 ? "Services" : "Service"}>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service.slug} className="leading-relaxed text-ink">
                <Link
                  href={`/services#${service.slug}`}
                  className="underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {service.name}
                </Link>
                <span className="text-ink-soft">
                  , {service.price.charAt(0).toLowerCase() + service.price.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </Row>
      ) : null}

    </Page>
  );
}
