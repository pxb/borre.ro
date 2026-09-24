import type { Metadata } from "next";
import { Page } from "@/components/section";
import { Reveal } from "@/components/motion-bits";
import { VoxelMark } from "@/components/mark/mark";
import { about, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.lead,
};

export default function About() {
  return (
    <Page title={about.lead}>
      <section className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <Reveal>
          <div className="max-w-xl space-y-6">
            <p className="text-lg leading-relaxed text-ink">{about.intro}</p>
            {about.body.map((p) => (
              <p key={p.slice(0, 24)} className="leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
            <p>
              <a href={site.linkedin} target="_blank" rel="me noreferrer" className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                LinkedIn
              </a>
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <VoxelMark className="mx-auto aspect-square w-full max-w-md" />
        </Reveal>
      </section>
    </Page>
  );
}
