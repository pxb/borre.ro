import type { Metadata } from "next";
import { Page, Row } from "@/components/section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What borre.ro collects, why, who handles it for us, how long we keep it and your rights.",
};

// UK GDPR privacy notice (#575). Plain English, practice voice. Every processor
// named here must be one the site actually uses at publish time: Vercel
// (hosting and cookieless Web Analytics, #576) and Cal.com (bookings). The
// controller wording is the sole-trader form Pedro confirmed (2026-09-24). It
// does not ship until pedro@borre.ro works (#563): the notice needs a contact
// route that works, and the DPA transfer terms are checked before publish.
const UPDATED = "24 September 2026";

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

function Contact() {
  return site.email ? (
    <a href={`mailto:${site.email}`} className={LINK}>
      {site.email}
    </a>
  ) : (
    <span className="text-accent">[contact email, once pedro@borre.ro works]</span>
  );
}

export default function Privacy() {
  return (
    <Page title="Privacy" crumbs={[{ href: "/", label: "Home" }]}>
      <Row label="Who we are">
        <div className="max-w-2xl space-y-4 leading-relaxed text-ink">
          <p>
            borre.ro is a trading name of Pedro Borrero, a sole trader in the United Kingdom. Pedro Borrero is the
            controller of the personal data described on this page, under the UK General Data Protection Regulation
            (UK GDPR) and the Data Protection Act 2018. In this notice, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean
            Pedro Borrero trading as borre.ro.
          </p>
          <p>
            Questions about your data: <Contact />
          </p>
          <p className="text-sm text-ink-soft">Last updated {UPDATED}</p>
        </div>
      </Row>

      <Row label="What we collect">
        <div className="max-w-2xl">
          <List
            items={[
              "When you book a call: your name, your email address and anything you write in the booking form. Cal.com collects these for us.",
              "When you use the site: page views and clicks on the demos and buttons, counted by Vercel Web Analytics without cookies. Visits are grouped by an anonymous code that is discarded after 24 hours, so the counts never identify you.",
              "On every visit: standard server logs kept by our host, Vercel, including your IP address, so the site can run and be kept secure.",
            ]}
          />
          <p className="mt-6 leading-relaxed text-ink-soft">
            We don&apos;t use cookies for tracking or advertising. The calendar on the contact page is Cal.com&apos;s own, and
            it may set the cookies it needs to take a booking.
          </p>
        </div>
      </Row>

      <Row label="Why, and on what basis">
        <div className="max-w-2xl">
          <List
            items={[
              "Booking details, to arrange the call, hold it and follow up. The basis is taking the steps you asked for before any agreement, and our legitimate interest in replying to you.",
              "Site statistics, to see which pages and demos are useful. The basis is our legitimate interest; the counts don't identify anyone.",
              "Server logs, to run the site and protect it. The basis is our legitimate interest.",
            ]}
          />
        </div>
      </Row>

      <Row label="Who handles it for us">
        <div className="max-w-2xl">
          <List
            items={[
              <>
                <span className="text-ink">Vercel</span>, which hosts the site and counts visits without cookies.
              </>,
              <>
                <span className="text-ink">Cal.com</span>, which runs the booking calendar.
              </>,
            ]}
          />
          <p className="mt-6 leading-relaxed text-ink-soft">
            Each works under a data processing agreement with us. Vercel and Cal.com are based in the United States, so
            your data may be processed there, under the safeguards UK law requires for transfers. We don&apos;t sell your
            data or share it with anyone else.
          </p>
        </div>
      </Row>

      <Row label="How long we keep it">
        <div className="max-w-2xl">
          <List
            items={[
              "Booking details: while we're in touch, and deleted within two years of our last contact.",
              "Site statistics: one month.",
              "Server logs: the short period Vercel keeps them for.",
            ]}
          />
        </div>
      </Row>

      <Row label="Your rights">
        <div className="max-w-2xl space-y-4 leading-relaxed text-ink-soft">
          <p>
            You can ask to see the data we hold about you, correct it, delete it, limit how we use it, object to how we
            use it, or take a copy with you. Email <Contact /> and we&apos;ll reply within one month.
          </p>
          <p>
            If you&apos;re unhappy with how we&apos;ve handled your data, you can complain to the Information
            Commissioner&apos;s Office at{" "}
            <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noreferrer" className={LINK}>
              ico.org.uk
            </a>
            .
          </p>
        </div>
      </Row>

      <Row label="Changes">
        <p className="max-w-2xl leading-relaxed text-ink-soft">
          If what we collect or who handles it changes, we update this page and the date at the top.
        </p>
      </Row>
    </Page>
  );
}
