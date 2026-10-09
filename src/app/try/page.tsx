import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Page } from "@/components/section";
import { ReadinessReview } from "@/components/readiness-review";
import { ui } from "@/content/site";
import { words } from "@/content/copy";
import copyTry from "@/content/copy.gen/try";

// The words: src/content/copy/try.md (#622).
const w = words(copyTry);

export const metadata: Metadata = pageMeta({
  title: w.t("meta.title"),
  description: w.t("lead"),
  path: "/try",
});

// The free AI readiness review (Pedro, 2026-10-09): paste a website, get the
// checks and two or three places AI could help, each with similar work.
// Linked from the hero, the menus and the footer.
export default function TryPage() {
  return (
    <Page title={w.t("meta.title")} lead={w.t("lead")} crumbs={[{ href: "/", label: ui.t("crumb.home") }]}>
      <section className="max-w-3xl py-12 sm:py-16">
        <ReadinessReview />
        <noscript>
          <p className="mt-6 text-ink-soft">{w.t("no-js")}</p>
        </noscript>
      </section>
    </Page>
  );
}
