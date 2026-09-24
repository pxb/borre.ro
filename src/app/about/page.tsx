import type { Metadata } from "next";
import { Row } from "@/components/section";
import { VoxelMark } from "@/components/mark/mark";
import { about, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.lead,
};

const LINK =
  "text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

// One document about the practice, in the same label-left rows as the case
// studies (DESIGN.md): who we are, what we hold to, who we work with. The mark
// stands beside the title in place of a photograph.
export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <header className="grid items-center gap-10 border-b border-rule py-12 sm:py-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <h1 className="max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink">
          {about.lead}
        </h1>
        <VoxelMark className="mx-auto aspect-square w-full max-w-[18rem] lg:max-w-xs" />
      </header>

      <Row label="Who we are">
        <div className="max-w-2xl space-y-5">
          <p className="text-xl leading-relaxed text-ink">{about.intro}</p>
          {about.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </div>
      </Row>

      <Row label="What we stand for">
        <ul className="grid gap-8 md:grid-cols-3 md:gap-8">
          {about.principles.map((x) => (
            <li key={x.t}>
              <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">{x.t}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{x.d}</p>
            </li>
          ))}
        </ul>
      </Row>

      <Row label="Who we work with">
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-ink">{about.partner}</p>
          <p className="mt-4">
            <a href={site.linkedin} target="_blank" rel="me noreferrer" className={`inline-flex min-h-11 items-center sm:min-h-0 ${LINK}`}>
              LinkedIn
            </a>
          </p>
        </div>
      </Row>
    </div>
  );
}
