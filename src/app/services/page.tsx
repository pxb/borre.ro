import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Page } from "@/components/section";
import { LoopShape } from "@/components/story-forms";
import { CasePreview, PlatformPreview } from "@/components/demo/previews";
import { costNotes, ctaFor, serviceFor, serviceGroups, site, startWhy, type ServiceCategory } from "@/content/site";
import { Figure } from "@/components/figure";
import { servicePages } from "@/content/service-pages";

export const metadata: Metadata = pageMeta({
  title: "Services",
  description:
    "AI services for small and medium-sized UK businesses, with prices: an AI readiness audit, a leadership workshop, training and setup, a Context Engine, workflow automation, custom apps and dashboards, a company AI platform, and a managed service to keep it running.",
  path: "/services",
});

// Three groups, each with its own shape (#585), so the page is not eight
// identical rows: the ways to start side by side, the builds beside the product
// they make, and the managed service as its monthly loop. Prices sit small under
// each name: the name and what it does lead, not the cost.
const [START, BUILD] = serviceGroups.map((g) => g.slugs);
// The case study whose product still stands in for each build.
const STILL: Record<string, string> = {
  "context-engine": "context-engine",
  "agentic-workflows": "lead-research",
  "apps-dashboards": "prospecting-loop",
};

const LINK =
  "text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const pick = (slugs: string[]) => slugs.map(serviceFor).filter((s): s is ServiceCategory => s != null);

// Each service in short (#602): its name linking to its own page, the price,
// one line of value, and its own button. The detail lives on the page, one click
// from the name.
function Summary({ s }: { s: ServiceCategory }) {
  const page = servicePages[s.slug];
  const cta = ctaFor(`/services/${s.slug}`);
  return (
    <>
      <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">
        <Link
          href={`/services/${s.slug}`}
          className="-my-2 inline-block py-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {s.name}
        </Link>
      </h3>
      <Price s={s} />
      <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{page?.line ?? s.what}</p>
      <p className="mt-5 text-sm">
        <Link href={cta.href} data-track="cta" data-track-where="services" data-track-service={s.slug} className={`inline-flex min-h-11 items-center font-medium sm:min-h-0 ${LINK}`}>
          {cta.label}
          <ArrowRight aria-hidden className="ml-1 inline size-3.5" />
        </Link>
      </p>
    </>
  );
}

// One price line everywhere on the page, under the name.
function Price({ s }: { s: ServiceCategory }) {
  return (
    <p className="mt-2 text-sm font-medium text-ink">
      {s.price} <span className="font-normal text-ink-soft">· {s.duration}</span>
    </p>
  );
}

function GroupHead({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-28 border-t-2 border-ink pt-3 text-sm font-medium text-ink-soft">
      {children}
    </h2>
  );
}

export default function Services() {
  return (
    <Page title="Services" bare>
      {/* Start: side by side. */}
      <section aria-labelledby="start" className="pt-12 pb-20 sm:pt-16">
        <GroupHead id="start">Start</GroupHead>
        <div className="mt-6 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
          {pick(START).map((s) => (
            <article key={s.slug} id={s.slug} className="scroll-mt-28">
                {/* The page's accent: the three ways in. */}
                <span aria-hidden="true" className="mb-5 block h-1 w-10 bg-accent" />
                <Summary s={s} />
            </article>
          ))}
        </div>
        {/* Why the ways in come first: market data under the Start group, in
            the problem form (figure in ink, our answer after the arrow), so the
            short accent bars stay the page's only accent. */}
        <div className="mt-14 max-w-2xl">
          <Figure value={startWhy.stat} beside tone="ink">
            <p className="text-ink-soft">
              {startWhy.claim.charAt(0).toUpperCase() + startWhy.claim.slice(1)}.{" "}
              <a href={startWhy.href} target="_blank" rel="noreferrer" className="text-sm text-ink-soft underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                {startWhy.source}
              </a>
            </p>
            <p className="mt-1.5 flex items-start gap-1.5 font-medium text-pretty text-ink">
              <ArrowRight aria-hidden className="mt-[0.3em] size-4 shrink-0 text-accent" />
              {startWhy.answer}
            </p>
          </Figure>
        </div>
      </section>

      {/* Build: each beside the product it makes. */}
      <section aria-labelledby="build" className="pb-8">
        <GroupHead id="build">Build</GroupHead>
        {pick(BUILD).map((s, i) => {
          const still = STILL[s.slug];
          return (
              <article
                key={s.slug}
                id={s.slug}
                className={`grid scroll-mt-28 gap-10 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 ${i ? "pt-14" : "pt-6"} ${i < BUILD.length - 1 ? "border-b border-rule" : ""}`}
              >
                <div className="min-w-0">
                  <Summary s={s} />
                </div>
                {still ? (
                  <Link
                    href={`/work/${still}`}
                    aria-label={`${s.name}: see the case study`}
                    className="block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
                  >
                    <CasePreview slug={still} />
                  </Link>
                ) : s.slug === "agentic-platform" ? (
                  // No case study yet: the workspace it makes, linked to its page.
                  <Link
                    href={`/services/${s.slug}`}
                    aria-label={`${s.name}: see the service`}
                    className="block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
                  >
                    <PlatformPreview />
                  </Link>
                ) : null}
              </article>
          );
        })}
      </section>

      {/* Run: the managed service as the loop it is. */}
      <section aria-labelledby="run" className="pt-12 pb-16">
        <GroupHead id="run">Run</GroupHead>
        {pick(["support"]).map((s) => (
          <article
            key={s.slug}
            id={s.slug}
            className="grid scroll-mt-28 gap-12 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16"
          >
            <div className="min-w-0">
              <Summary s={s} />
            </div>
            <div className="min-w-0">
              <LoopShape />
            </div>
          </article>
        ))}
      </section>

      {/* For the reader who can't yet say which of the eight they need. */}
      <p className="border-t border-rule py-10 text-lg text-ink">
        Not sure where to start?{" "}
        <Link href="/scorecard" className={LINK}>
          Take the readiness scorecard
        </Link>
      </p>

      <section id="pricing" className="scroll-mt-28 border-t border-rule py-16">
        <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">Pricing</h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {costNotes.map((c) => (
            <div key={c.title}>
              <h3 className="text-base font-medium text-ink">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-ink-soft">
          {site.vatNote}{" "}
          <Link href="/security" className={LINK}>
            How we look after your data
          </Link>
        </p>
      </section>
    </Page>
  );
}
