import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Page } from "@/components/section";
import { site, ui } from "@/content/site";
import { words } from "@/content/copy";
import copyContact from "@/content/copy.gen/contact";

// The words: src/content/copy/contact.md (#561).
const w = words(copyContact);
import { CallTrack } from "@/components/story-forms";
import { Suspense } from "react";
import { BookingFrame, BookingFrameFallback } from "@/components/booking-frame";

export const metadata: Metadata = pageMeta({
  title: w.t("meta.title"),
  description: w.t("meta.description"),
  path: "/contact",
});

export default function Contact() {
  return (
    <Page title={w.t("heading")} bare>
      {/* Like /work: no header, the page opens on what it is for. What the call
          covers beside the calendar; on phones the calendar comes first. */}
      <section className="grid gap-10 pt-12 pb-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="order-2 lg:order-1">
          <CallTrack />
          <p className="mt-10">
            <a
              href={site.linkedin}
              target="_blank"
              rel="me noreferrer"
              className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {ui.t("footer.linkedin")}
            </a>
            {site.email ? (
              <>
                {" · "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {site.email}
                </a>
              </>
            ) : null}
          </p>
        </div>
        {site.booking ? (
          <div className="order-1 -mx-6 sm:mx-0 lg:order-2">
            {/* Full-bleed on phones so Cal.com's own mobile layout has the room. */}
            <Suspense fallback={<BookingFrameFallback />}>
              <BookingFrame />
            </Suspense>
          </div>
        ) : null}
      </section>

    </Page>
  );
}
