import Link from "next/link";
import { Funnel } from "@/components/funnel";
import { pillars, site, work } from "@/content/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          {site.name}
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-6xl">
          Revenue operations, built and run with AI.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400">
          {site.summary}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/work"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            See the work
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
          >
            Get in touch
          </a>
        </div>
      </section>

      <section className="pb-8">
        <Funnel />
      </section>

      <section className="py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title}>
              <h2 className="text-base font-medium text-white">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-medium tracking-tight text-white">Selected work</h2>
          <Link href="/work" className="text-sm text-neutral-400 transition-colors hover:text-white">
            All work
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {work.map((c) => (
            <Link
              key={c.slug}
              href={`/work/${c.slug}`}
              className="group rounded-2xl border border-white/10 bg-neutral-950/60 p-6 transition-colors hover:border-white/25"
            >
              <h3 className="text-lg font-medium text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{c.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {c.metrics.slice(0, 2).map((m) => (
                  <div key={m.label}>
                    <div className="font-mono text-sm text-white">{m.value}</div>
                    <div className="text-xs text-neutral-500">{m.label}</div>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <h2 className="text-2xl font-medium tracking-tight text-white">
          Fifteen years selling software. Now I build the systems instead.
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-400">
          Enterprise sales at Canto, Freshworks, SAP, Samsung and BlackBerry. I know what a sales
          team actually does all day, which is mostly not selling. That is the part worth
          automating, and it is why this work gets judged on pipeline rather than on the tooling.
        </p>
        <div className="mt-8">
          <a
            href={`mailto:${site.email}`}
            className="text-sm text-white underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            {site.email}
          </a>
        </div>
      </section>
    </div>
  );
}
