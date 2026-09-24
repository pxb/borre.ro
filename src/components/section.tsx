import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { href: string; label: string };

export function Page({
  title,
  lead,
  crumbs,
  bare,
  children,
}: {
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  // No visible header: the nav already names the page (Pedro, 2026-09-24), so
  // the title is for screen readers and the page opens on its content.
  bare?: boolean;
  children: ReactNode;
}) {
  if (bare) {
    return (
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <h1 className="sr-only">{title}</h1>
        {children}
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <header className="border-b border-rule py-12 sm:py-16 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action">
        {crumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <Link
                    href={c.href}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-0"
                  >
                    {c.label}
                  </Link>
                  <span aria-hidden="true" className="text-rule">
                    /
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div>
          <h1 className="max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink">
            {title}
          </h1>
          {lead ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{lead}</p>
          ) : null}
        </div>
      </header>
      {children}
    </div>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-6 border-b border-rule py-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
      <h2 className="label">{label}</h2>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
