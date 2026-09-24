import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Page } from "@/components/section";
import { VoxelMark } from "@/components/mark/mark";
import { about, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.lead,
};

const LINK =
  "text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

// Three parts, each shaped like its neighbours elsewhere (DESIGN.md): who we
// are beside the mark, how we work as the same Start, Build and Run groups as
// /services (accent marks, like the ways to start), and the terms we work on.
export default function About() {
  return (
    <Page title={about.lead}>
      <section className="grid gap-12 pt-12 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <div className="max-w-xl space-y-6">
          <p className="text-xl leading-relaxed text-ink">{about.intro}</p>
          {about.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </div>
        <VoxelMark className="mx-auto aspect-square w-full max-w-md" />
      </section>

      <section aria-labelledby="how" className="pb-16">
        <h2 id="how" className="border-t-2 border-ink pt-3 text-sm font-medium text-ink-soft">
          How we work
        </h2>
        <ol className="mt-6 grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {about.how.map((h) => (
            <li key={h.group}>
              <span aria-hidden="true" className="mb-5 block h-1 w-10 bg-accent" />
              <Link
                href={h.href}
                className="group inline-flex min-h-11 items-center gap-1.5 text-xl font-medium tracking-[-0.01em] text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-0"
              >
                {h.group}
                <ArrowRight aria-hidden className="size-4 text-ink-soft transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="mt-2 text-lg leading-relaxed text-ink-soft">{h.line}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-rule py-10">
        <p className="max-w-2xl text-lg leading-relaxed text-ink">{about.close}</p>
        <p className="mt-4">
          <a href={site.linkedin} target="_blank" rel="me noreferrer" className={`inline-flex min-h-11 items-center sm:min-h-0 ${LINK}`}>
            LinkedIn
          </a>
        </p>
      </section>
    </Page>
  );
}
