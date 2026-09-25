import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Page } from "@/components/section";
import { LoopShape } from "@/components/story-forms";
import { CasePreview } from "@/components/demo/previews";
import { costNotes, proofFor, serviceFor, type ServiceCategory } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: "Services",
  description:
    "AI services for small and medium-sized UK businesses, with prices: an AI readiness audit, a leadership workshop, training and setup, a Context Engine, agentic workflows, custom apps and dashboards, a full agentic platform, and a managed service to keep it running.",
  path: "/services",
});

// Three groups, each with its own shape (#585), so the page is not eight
// identical rows: the ways to start side by side, the builds beside the product
// they make, and the managed service as its monthly loop. Prices sit small under
// each name: the name and what it does lead, not the cost.
const START = ["audit", "workshop", "training"];
const BUILD = ["context-engine", "agentic-workflows", "apps-dashboards", "agentic-platform"];
// The case study whose product still stands in for each build.
const STILL: Record<string, string> = {
  "context-engine": "context-engine",
  "agentic-workflows": "lead-research",
  "apps-dashboards": "prospecting-loop",
};

const LINK =
  "text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const pick = (slugs: string[]) => slugs.map(serviceFor).filter((s): s is ServiceCategory => s != null);

function Includes({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

function Under({ s }: { s: ServiceCategory }) {
  const proof = proofFor(s.slug);
  return (
    <>
      <p className="mt-4 max-w-md text-xs leading-relaxed text-ink-soft">{s.under}</p>
      {proof.length ? (
        <p className="mt-3 text-sm text-ink-soft">
          {proof.map((w, i) => (
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
                <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">{s.name}</h3>
                <Price s={s} />
                <p className="mt-4 leading-relaxed text-ink-soft">{s.what}</p>
                <Includes items={s.includes} />
                <Under s={s} />
            </article>
          ))}
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
                  <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">{s.name}</h3>
                  <Price s={s} />
                  <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">{s.what}</p>
                  {still ? (
                    <>
                      <Includes items={s.includes} />
                      <Under s={s} />
                    </>
                  ) : null}
                </div>
                {still ? (
                  <Link
                    href={`/work/${still}`}
                    aria-label={`${s.name}: see the case study`}
                    className="block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
                  >
                    <CasePreview slug={still} />
                  </Link>
                ) : (
                  <div className="min-w-0">
                    <Includes items={s.includes} />
                    <Under s={s} />
                  </div>
                )}
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
              <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">{s.name}</h3>
              <Price s={s} />
              <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">{s.what}</p>
              <Includes items={s.includes} />
              <Under s={s} />
            </div>
            <div className="min-w-0">
              <LoopShape />
            </div>
          </article>
        ))}
      </section>

      <section className="border-t border-rule py-16">
        <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">Pricing</h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
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
