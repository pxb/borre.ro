import Link from "next/link";
import { NetBackdrop } from "@/components/hero/net-backdrop";
import { HeroHeadline } from "@/components/hero-headline";
import { SmoothScroll } from "@/components/smooth-scroll";
import { HowWeWork } from "@/components/how-we-work";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({ description: site.summary, path: "/" });

// Hero (the hook), then one story that unfolds Problem -> Plan -> Idea ->
// Execution -> Results as you scroll, with an example at each step (#569).
export default function Home() {
  return (
    <>
      <SmoothScroll />

      <section id="hero" className="relative isolate text-ink">
        <NetBackdrop />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:px-10 sm:py-16 lg:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <HeroHeadline />
          </div>
          <div className="lg:pb-2">
            <p className="max-w-xl text-lg leading-relaxed text-ink-soft">{site.summary}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/contact" data-track="cta" data-track-where="hero"
                className="btn-orange px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                {site.cta}
              </Link>
              <Link
                href="/work"
                className="border-2 border-ink bg-cream px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                Case studies
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HowWeWork />
    </>
  );
}
