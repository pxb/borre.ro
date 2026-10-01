import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Page, Row } from "@/components/section";
import { site, ui } from "@/content/site";
import { words } from "@/content/copy";
import copyPrivacy from "@/content/copy.gen/privacy";
import { fill } from "@/components/fill";

// The words: src/content/copy/privacy.md (#561). The date stays here: it moves
// only when the notice's facts do.
const w = words(copyPrivacy);

export const metadata: Metadata = pageMeta({
  title: words(copyPrivacy).t("meta.title"),
  description: words(copyPrivacy).t("meta.description"),
  path: "/privacy",
});

// UK GDPR privacy notice (#575), kept to what the ICO lists as required
// (Article 13): who we are, what and why with the lawful basis, recipients
// (categories are enough), transfers, retention, rights and the right to
// complain. Pedro, 2026-09-26: bare minimum, UK law, no over-explaining.
// Recipients in use: hosting and visit counts (Vercel), the booking calendar
// (Cal.com) and email (Google Workspace). Transfers: Vercel and Google say they
// are in the UK Extension to the EU-US Data Privacy Framework; Cal.com says
// standard contractual clauses or the Framework. Vercel's Hobby plan has no
// data processing addendum, so the page claims no contract with providers.
const UPDATED = "28 September 2026";

const LINK =
  "text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 leading-relaxed text-ink-soft">
          <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Email() {
  return (
    <a href={`mailto:${site.email}`} className={LINK}>
      {site.email}
    </a>
  );
}

export default function Privacy() {
  const links = {
    email: <Email />,
    ico: (
      <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer" className={LINK}>
        ico.org.uk
      </a>
    ),
  };
  return (
    <Page title={w.t("meta.title")} crumbs={[{ href: "/", label: ui.t("crumb.home") }]}>
      <Row label={w.t("label.who")}>
        <div className="max-w-2xl space-y-4 leading-relaxed text-ink">
          <p>{fill(w.t("who"), links)}</p>
          <p className="text-sm text-ink-soft">{w.t("updated").replace("{date}", UPDATED)}</p>
        </div>
      </Row>

      <Row label={w.t("label.collect")}>
        <div className="max-w-2xl">
          <List items={w.li("collect")} />
          <p className="mt-6 leading-relaxed text-ink-soft">{w.t("cookies")}</p>
        </div>
      </Row>

      <Row label={w.t("label.handles")}>
        <p className="max-w-2xl leading-relaxed text-ink-soft">{w.t("handles")}</p>
      </Row>

      <Row label={w.t("label.keep")}>
        <div className="max-w-2xl">
          <List items={w.li("keep")} />
        </div>
      </Row>

      <Row label={w.t("label.rights")}>
        <p className="max-w-2xl leading-relaxed text-ink-soft">{fill(w.t("rights"), links)}</p>
      </Row>
    </Page>
  );
}
