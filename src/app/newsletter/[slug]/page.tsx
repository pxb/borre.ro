import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Page } from "@/components/section";
import { longDate, post, posts, skillPrompt } from "@/lib/newsletter";
import { CopyPrompt } from "@/components/copy-prompt";
import { navLabel, site, ui, nl } from "@/content/site";
import { fill } from "@/components/fill";

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
    <Page title={p.title} lead={p.description} crumbs={[{ href: "/", label: ui.t("crumb.home") }, { href: "/newsletter", label: navLabel("/newsletter") }]}>
      <article className="py-12">
        <p className="text-sm text-ink-soft">
          {site.founder} · {longDate(p.date)} · {p.type === "roundup" ? nl.t("article.roundup") : nl.t("article.minutes").replace("{n}", String(p.minutes))}
          {p.draft ? ` · ${nl.t("article.draft")}` : ""}
        </p>
        <p className="mt-1 text-sm text-ink-soft">{nl.t("article.checked").replace("{date}", longDate(p.checked))}</p>
        {/* Trusted content: markdown from this repo, rendered at build time. */}
        <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: p.html }} />
      </article>

      {p.skill ? (
        <section aria-labelledby="skill" className="border-t border-rule py-10">
          <h2 id="skill" className="text-xl font-medium text-ink">
            {nl.t("article.skill.heading")}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink">
            {p.skillNote ?? nl.t("article.skill.default").replace("{description}", p.skill.description)}
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-ink">
            {nl.t("article.skill.quick")}
          </p>
          <CopyPrompt text={skillPrompt(p)} track={p.skill.name} />
          <p className="mt-6 max-w-2xl leading-relaxed text-ink">{nl.t("article.skill.keep")}</p>
          <ul className="mt-2 space-y-2 leading-relaxed text-ink">
            <li>
              <a href={`/newsletter/skills/${p.skill.name}.zip`} download className={LINK} data-track="skill-download" data-track-skill={p.skill.name}>
                {nl.t("article.skill.download")}
              </a>{" "}
              <span className="text-ink-soft">
                {nl.t("article.skill.download-help")}
              </span>
            </li>
            <li>
              <a href={`/newsletter/skills/${p.skill.name}/SKILL.md`} className={LINK}>
                SKILL.md
              </a>{" "}
              <span className="text-ink-soft">{nl.t("article.skill.raw-help")}</span>
            </li>
          </ul>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {nl.t("article.skill.terms").replace("{name}", site.name)}
          </p>
        </section>
      ) : null}

      {/* The close: the newsletter when it exists, then the call. */}
      <section className="border-t border-rule py-10">
        <p className="max-w-2xl leading-relaxed text-ink">
          {site.newsletter.url ? (
            <>
              {fill(nl.t("article.subscribe").replace("{strap}", site.newsletter.strap), {
                link: (
                  <a href={site.newsletter.url} className={LINK}>
                    {nl.t("article.subscribe-link").replace("{name}", site.newsletter.name)}
                  </a>
                ),
              })}{" "}
            </>
          ) : null}
          <Link href="/newsletter" className={LINK}>
            {nl.t("article.more")}
          </Link>
        </p>
      </section>
    </Page>
  );
}
