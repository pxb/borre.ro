import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Page, Row } from "@/components/section";
import { site } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description: "What borre.ro collects, why, who handles it, how long we keep it and your rights.",
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
  return (
    <Page title="Privacy" crumbs={[{ href: "/", label: "Home" }]}>
      <Row label="Who we are">
        <div className="max-w-2xl space-y-4 leading-relaxed text-ink">
          <p>
            borre.ro is a trading name of Pedro Borrero, who is the controller of your personal data under the UK GDPR.
            Contact: <Email />
          </p>
          <p className="text-sm text-ink-soft">Last updated {UPDATED}</p>
        </div>
      </Row>

      <Row label="What we collect and why">
        <div className="max-w-2xl">
          <List
            items={[
              "When you book a call: your name, email address and anything you add, to arrange and hold the call. Lawful basis: steps you ask us to take before entering into a contract.",
              "When you email us: your email address and message, to reply. Lawful basis: our legitimate interests in answering enquiries.",
              "When you visit: page views counted without cookies, and server logs including your IP address, to run and secure the site. Lawful basis: our legitimate interests.",
            ]}
          />
          <p className="mt-6 leading-relaxed text-ink-soft">
            We don&apos;t use tracking or advertising cookies. The booking calendar may set the cookies it needs to take a
            booking.
          </p>
        </div>
      </Row>

      <Row label="Who handles it">
        <p className="max-w-2xl leading-relaxed text-ink-soft">
          The providers that host the site, run the booking calendar and run our email. Some are in the United States;
          transfers rely on UK adequacy regulations or standard contractual clauses. We don&apos;t sell your data.
        </p>
      </Row>

      <Row label="How long we keep it">
        <div className="max-w-2xl">
          <List
            items={[
              "Bookings and emails: up to two years after our last contact.",
              "Site statistics: one month.",
              "Server logs: the short period our host keeps them.",
            ]}
          />
        </div>
      </Row>

      <Row label="Your rights">
        <p className="max-w-2xl leading-relaxed text-ink-soft">
          You can ask to see, correct or delete your data, restrict or object to how we use it, or take a copy. Email{" "}
          <Email /> and we&apos;ll reply within one month. You can also complain to the Information Commissioner&apos;s
          Office at{" "}
          <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer" className={LINK}>
            ico.org.uk
          </a>
          .
        </p>
      </Row>
    </Page>
  );
}
