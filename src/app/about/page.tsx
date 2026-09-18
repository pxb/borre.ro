import type { Metadata } from "next";
import { Page } from "@/components/section";
import { about, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.lead,
};

export default function About() {
  return (
    <Page title={about.lead} crumbs={[{ href: "/", label: "Home" }]}>
      <section className="grid gap-12 py-16 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">{site.name}</p>
        <div className="max-w-2xl space-y-6">
          {about.body.map((p) => (
            <p key={p.slice(0, 24)} className="leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
          <p className="pt-4">
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent"
            >
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </Page>
  );
}
