import type { Metadata } from "next";
import { Page } from "@/components/section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about AI that pays for itself.",
};

export default function Contact() {
  return (
    <Page
      title="Get in touch."
      lead="Tell me what you have already bought and what it was supposed to do. That is usually enough to tell whether there is anything here worth doing."
      crumbs={[{ href: "/", label: "Home" }]}
    >
      <section className="grid gap-10 py-16 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-ink-faint">Email</h2>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 block text-xl text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
          >
            {site.email}
          </a>
        </div>
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-ink-faint">LinkedIn</h2>
          <a
            href={site.linkedin}
            target="_blank"
            rel="me noreferrer"
            className="mt-3 block text-xl text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
          >
            Pedro Borrero
          </a>
        </div>
      </section>
    </Page>
  );
}
