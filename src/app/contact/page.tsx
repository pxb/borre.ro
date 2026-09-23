import type { Metadata } from "next";
import { Page } from "@/components/section";
import { site } from "@/content/site";

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
      {site.booking ? (
        <section className="py-12">
          <iframe
            src={`https://cal.com/${site.booking}?embed=true&theme=light&layout=month_view`}
            title="Book a free 30-minute call"
            loading="lazy"
            className="h-[44rem] w-full border border-rule bg-paper"
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
