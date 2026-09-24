import type { Metadata } from "next";
import { Page } from "@/components/section";
import { site } from "@/content/site";
import { Timeline } from "@/components/story-forms";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a free 30-minute call with borre.ro.",
};

export default function Contact() {
  return (
    <Page
      title="Book a free 30-minute call."
      lead="Pick a time that suits you. Tell us a little about your business when you book and we'll come prepared."
      crumbs={[{ href: "/", label: "Home" }]}
    >
      {/* What the call covers, the same track as 02 Review on the homepage. */}
      <section className="pt-12">
        <Timeline />
      </section>

      {site.booking ? (
        <section className="-mx-6 py-6 sm:mx-0 sm:py-12">
          {/* Full-bleed on phones so Cal.com's own mobile layout has the room. */}
          <iframe
            src={`https://cal.com/${site.booking}?embed=true&theme=light&layout=month_view`}
            title="Book a free 30-minute call"
            loading="lazy"
            className="h-[60rem] w-full border-y border-rule bg-paper sm:h-[44rem] sm:border"
          />
        </section>
      ) : null}

      <p className="pb-16">
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
    </Page>
  );
}
