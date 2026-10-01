import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Page, Row } from "@/components/section";
import { ui } from "@/content/site";
import { words } from "@/content/copy";
import copySecurity from "@/content/copy.gen/security";

export const metadata: Metadata = pageMeta({
  title: words(copySecurity).t("meta.title"),
  description: words(copySecurity).t("meta.description"),
  path: "/security",
});

// Trust and security (#580). Every line is true of how we build today (the
// live client build, checked 2026-09-30): client-owned Supabase, n8n and AI
// accounts; access tiers enforced by Postgres row-level security, mirroring
// what each person can see at source; draft by default with human approval;
// sourced answers and a run log; business APIs. The live client database is
// in the EU (eu-central-1), so the page says UK or EU, never UK only. Not
// claimed until true: a signed data processing agreement (#249), ICO
// registration (deferred), backup schedules and uptime figures. Positive
// wording only (Pedro): say what we do.

// The words: src/content/copy/security.md (#561).
const w = words(copySecurity);
const ROWS: { label: string; body: string[] }[] = [1, 2, 3, 4, 5, 6].map((i) => ({
  label: w.t(`row.${i}.label`),
  body: w.ps(`row.${i}.text`),
}));

export default function Security() {
  return (
    <Page title={w.t("meta.title")} crumbs={[{ href: "/", label: ui.t("crumb.home") }]}>
      {ROWS.map((r) => (
        <Row key={r.label} label={r.label}>
          <div className="max-w-2xl space-y-4 leading-relaxed text-ink">
            {r.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Row>
      ))}
    </Page>
  );
}
