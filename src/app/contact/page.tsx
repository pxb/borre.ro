import type { Metadata } from "next";
import { Page } from "@/components/section";
import { site } from "@/content/site";
import { CallTrack } from "@/components/story-forms";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a free 30-minute call with borre.ro.",
};

export default function Contact() {
  return (
    <Page title="Book a free 30-minute call" bare>
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
              LinkedIn
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
            <iframe
              src={`https://cal.com/${site.booking}?embed=true&theme=light&layout=month_view`}
              title="Book a free 30-minute call"
              loading="lazy"
              className="h-[60rem] w-full border-y border-rule bg-paper sm:h-[44rem] sm:border"
            />
          </div>
        ) : null}
      </section>

    </Page>
  );
}
