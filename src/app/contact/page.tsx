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
      lead="Tell me what you have already bought and what it was supposed to do. That is usually enough to work out whether there is anything here worth doing."
    >
      <section className="grid gap-10 py-16 sm:grid-cols-2">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-ink-faint">Email</h2>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 block text-xl text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent"
          >
            {site.email}
          </a>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-ink-faint">LinkedIn</h2>
          <a
            href={site.linkedin}
            target="_blank"
            rel="me noreferrer"
            className="mt-3 block text-xl text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent"
          >
            Pedro Borrero
          </a>
        </div>
      </section>
    </Page>
  );
}
