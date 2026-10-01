import Link from "next/link";
import { ui } from "@/content/site";

// Replaces the raw Next.js default 404.
export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <section className="flex min-h-[60vh] flex-col justify-center border-b border-rule py-24">
        <p className="font-mono text-sm tabular-nums text-ink-soft">404</p>
        <h1 className="mt-4 max-w-2xl text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink">
          {ui.t("not-found.title")}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          {ui.t("not-found.text")}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="btn-orange px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            {ui.t("not-found.home")}
          </Link>
          <Link
            href="/work"
            className="border-2 border-ink bg-cream px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            {ui.t("not-found.case-studies")}
          </Link>
          <Link
            href="/contact" data-track="cta" data-track-where="404"
            className="text-sm text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-action focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {ui.t("not-found.contact")}
          </Link>
        </div>
      </section>
    </div>
  );
}
