import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import { Page } from "@/components/section";
import { longDate, posts } from "@/lib/newsletter";
import { site, nl } from "@/content/site";

// {name} and {strap} in the newsletter's copy.
const brand = (t: string) => t.replace("{name}", site.newsletter.name).replace("{strap}", site.newsletter.strap);

export const metadata: Metadata = pageMeta({
  title: nl.t("meta.title"),
  description: brand(nl.t("meta.description")),
  path: "/newsletter",
});

// The newsletter index (#606): newest first, one row per piece, date and length
// small, the title leading. Like /work and /services, no visible header: the
// nav names the page.
export default function Newsletter() {
  const all = posts();
  return (
    <Page title={nl.t("meta.title")} bare>
      <section className="pt-12 pb-16 sm:pt-16">
        <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
          {brand(nl.t("intro"))}{" "}
          {site.newsletter.url ? (
            <a
              href={site.newsletter.url}
              className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {nl.t("subscribe")}
            </a>
          ) : null}
        </p>
        {all.length ? (
          <ol className="mt-10 border-t-2 border-ink">
            {all.map((p) => (
              <li key={p.slug} className="border-b border-rule py-8">
                <p className="text-sm text-ink-soft">
                  {longDate(p.date)} · {p.type === "roundup" ? nl.t("article.roundup") : nl.t("article.minutes").replace("{n}", String(p.minutes))}
                  {p.draft ? ` · ${nl.t("article.draft")}` : ""}
                </p>
                <h2 className="mt-2 text-[clamp(1.35rem,2.4vw,1.75rem)] font-medium leading-snug tracking-[-0.015em] text-ink">
                  <Link
                    href={`/newsletter/${p.slug}`}
                    className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{p.description}</p>
              </li>
            ))}
          </ol>
        ) : (
          // No issues yet: the rule alone, no placeholder text (Pedro, 2026-09-30).
          <div aria-hidden="true" className="mt-10 border-t-2 border-ink" />
        )}
      </section>
    </Page>
  );
}
