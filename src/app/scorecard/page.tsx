import type { Metadata } from "next";
import { navLabel, ui } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { scorecardWords } from "@/content/scorecard";
import { Page } from "@/components/section";
import { Scorecard } from "@/components/scorecard";

export const metadata: Metadata = pageMeta({
  title: scorecardWords.t("title"),
  description: scorecardWords.t("lead"),
  path: "/scorecard",
});

export default function ScorecardPage() {
  return (
    <Page
      title={scorecardWords.t("title")}
      lead={scorecardWords.t("lead")}
      crumbs={[{ href: "/", label: ui.t("crumb.home") }, { href: "/services", label: navLabel("/services") }]}
    >
      <Scorecard />
    </Page>
  );
}
