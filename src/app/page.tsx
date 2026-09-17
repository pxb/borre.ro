import Link from "next/link";
import { Showcase } from "@/components/showcase";
import { HeroMark } from "@/components/hero/mark";
import { WorkField } from "@/components/work-field";
import { evidence, pillars, site } from "@/content/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <section className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
        <div>
          <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.06] tracking-[-0.03em] text-ink">
            {site.headline}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">{site.summary}</p>
        </div>
        <div className="flex flex-col justify-end gap-6 lg:items-start">
          <div className="mb-2 hidden w-full lg:block">
            <HeroMark />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            {site.name}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/work"
              className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              See the work
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="rounded-full border border-rule px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-rule py-16">
        <dl className="grid gap-10 sm:grid-cols-2">
          {evidence.map((e) => (
            <div key={e.stat} className="flex gap-6">
              <dt className="font-mono text-4xl tabular-nums leading-none text-accent">
                {e.stat}
              </dt>
              <dd className="max-w-xs">
                <p className="leading-snug text-ink">{e.claim}</p>
                <p className="mt-2 text-xs text-ink-faint">{e.source}</p>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="relative isolate border-t border-rule py-20">
        <WorkField />
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink-faint">
          Selected work
        </h2>
        <div className="mt-12">
          <Showcase />
        </div>
      </section>

      <section className="border-t border-rule py-20">
        <div className="grid gap-12 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title}>
              <h3 className="text-base text-ink">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-rule py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <h2 className="font-mono text-xs uppercase tracking-widest text-ink-faint">About</h2>
          <div>
            <p className="max-w-2xl text-2xl leading-snug tracking-[-0.01em] text-ink">
              Fifteen years selling software. Now I build the systems instead.
            </p>
            <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">
              Enterprise sales at Canto, Freshworks, SAP, Samsung and BlackBerry. I know what a
              sales team actually does all day, which is mostly not selling. That is the part
              worth automating, and it is why this work gets judged on pipeline rather than on
              the tooling.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-block text-sm text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
