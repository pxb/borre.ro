import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import { Page } from "@/components/section";
import { CompanyLookup } from "@/components/company-lookup";
import { navLabel, site, ui } from "@/content/site";
import { words } from "@/content/copy";
import copyTry from "@/content/copy.gen/try";

// The words: src/content/copy/try.md (#622).
const w = words(copyTry);

export const metadata: Metadata = pageMeta({
  title: w.t("meta.title"),
  description: w.t("lead"),
  path: "/try",
});

// The company lookup: what the prospecting system reads from the register
// about the visitor's own company (2026-10-08, #622). Linked from the hero, the
// footer and the prospecting case study, and sendable on its own in outreach.
export default function TryPage() {
  return (
    <Page
      title={w.t("meta.title")}
      lead={w.t("lead")}
      crumbs={[{ href: "/", label: ui.t("crumb.home") }, { href: "/work", label: navLabel("/work") }]}
    >
      <section className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <CompanyLookup />
          <noscript>
            <p className="mt-6 text-ink-soft">{w.t("no-js")}</p>
          </noscript>
        </div>
        <div className="border-t-2 border-ink pt-3 lg:self-start">
          <h2 className="label">{w.t("next.title")}</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{w.t("next.body")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/contact" data-track="cta" data-track-where="try"
              className="btn-orange px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              {site.cta}
            </Link>
            <Link
              href="/work/prospecting-loop"
              className="inline-flex min-h-11 items-center text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-0"
            >
              {w.t("next.case-study")}
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
