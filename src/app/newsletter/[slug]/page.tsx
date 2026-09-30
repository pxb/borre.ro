import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Page } from "@/components/section";
import { longDate, post, posts } from "@/lib/newsletter";
import { site } from "@/content/site";

// One article or roundup (#606). The body is markdown rendered at build time
// into the `.prose` styles in globals.css. Only built slugs exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return posts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = post(slug);
  if (!p) return {};
  const path = `/newsletter/${p.slug}`;
  return {
    ...pageMeta({ title: p.title, description: p.description, path, image: { url: `${path}/opengraph-image`, alt: p.title } }),
    ...(p.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

const LINK =
  "text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = post(slug);
  if (!p) notFound();

  return (
    <Page title={p.title} lead={p.description} crumbs={[{ href: "/", label: "Home" }, { href: "/newsletter", label: "Newsletter" }]}>
      <article className="py-12">
        <p className="text-sm text-ink-soft">
          {site.founder} · {longDate(p.date)} · {p.type === "roundup" ? "Monthly roundup" : `${p.minutes} min read`}
          {p.draft ? " · Draft, preview only" : ""}
        </p>
        {/* Trusted content: markdown from this repo, rendered at build time. */}
        <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: p.html }} />
      </article>

      {/* The close: the newsletter when it exists, then the call. */}
      <section className="border-t border-rule py-10">
        <p className="max-w-2xl leading-relaxed text-ink">
          {site.newsletter.url ? (
            <>
              <a href={site.newsletter.url} className={LINK}>
                Subscribe to {site.newsletter.name}
              </a>
              , {site.newsletter.strap}, once a month.{" "}
            </>
          ) : null}
          <Link href="/newsletter" className={LINK}>
            More from the newsletter
          </Link>
        </p>
      </section>
    </Page>
  );
}
