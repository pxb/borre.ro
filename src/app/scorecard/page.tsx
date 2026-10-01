import type { Metadata } from "next";
import { navLabel, ui } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { Page } from "@/components/section";
import { Scorecard } from "@/components/scorecard";

export const metadata: Metadata = pageMeta({
  title: "AI readiness scorecard",
  description:
    "Eight questions about how your business works today. You get a readiness score, an estimate of the hours AI could give back each week, and where to start.",
  path: "/scorecard",
});

export default function ScorecardPage() {
  return (
    <Page
      title="AI readiness scorecard"
      lead="Eight questions about how your business works today. You get a readiness score, an estimate of the hours AI could give back each week, and where to start."
      crumbs={[{ href: "/", label: ui.t("crumb.home") }, { href: "/services", label: navLabel("/services") }]}
    >
      <Scorecard />
    </Page>
  );
}
