import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/section";
import { Reveal } from "@/components/motion-bits";
import { VoxelMark } from "@/components/mark/mark";
import { about, site, work } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.lead,
};

export default function About() {
  return (
    <Page title={about.lead} crumbs={[{ href: "/", label: "Home" }]}>
      <section className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <Reveal>
          <div className="max-w-xl space-y-6">
            <p className="text-lg leading-relaxed text-ink">{about.intro}</p>
            {about.body.map((p) => (
              <p key={p.slice(0, 24)} className="leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <VoxelMark className="mx-auto aspect-square w-full max-w-md" />
        </Reveal>
      </section>

      <p className="border-t border-rule py-8">
        <a
          href={site.linkedin}
          target="_blank"
          rel="me noreferrer"
          className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          LinkedIn
        </a>
      </p>

      <section className="border-t border-rule py-12">
        <h2 className="text-2xl font-medium tracking-[-0.01em] text-ink">Case studies</h2>
        <ul className="mt-8 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
          {work.map((w) => (
            <li key={w.slug} className="bg-paper">
              <Link
                href={`/work/${w.slug}`}
                className="group flex h-full flex-col p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              >
                <h3 className="text-base font-medium text-ink">{w.title}</h3>
                <p className="mt-2 text-sm leading-snug text-ink-soft">{w.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
