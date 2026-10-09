import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Row } from "@/components/section";
import { VoxelMark } from "@/components/mark/mark";
import { about, site, ui } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: about.title,
  description: about.lead,
  path: "/about",
});

const LINK =
  "text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

// One document about the practice, in the same label-left rows as the case
// studies (DESIGN.md): who we are and what we hold to. The mark
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

      <Row label={about.labels.who}>
        <div className="max-w-2xl space-y-5">
          <p className="text-xl font-medium tracking-[-0.01em] text-ink">{about.founder}</p>
          <p className="text-xl leading-relaxed text-ink">{about.intro}</p>
          {about.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
          <p>
            <a href={site.linkedin} target="_blank" rel="me noreferrer" className={`inline-flex min-h-11 items-center sm:min-h-0 ${LINK}`}>
              {ui.t("footer.linkedin")}
            </a>
          </p>
        </div>
      </Row>

      <Row label={about.labels.standFor}>
        <ul className="grid gap-8 md:grid-cols-3 md:gap-8">
          {about.principles.map((x) => (
            <li key={x.t}>
              <span aria-hidden="true" className="mb-4 block h-1 w-10 bg-accent" />
              <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">{x.t}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{x.d}</p>
            </li>
          ))}
        </ul>
      </Row>

    </div>
  );
}
