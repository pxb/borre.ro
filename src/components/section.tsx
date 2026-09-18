import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { href: string; label: string };

export function Page({
  title,
  lead,
  crumbs,
  children,
}: {
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <header className="border-b border-rule py-12 sm:py-16 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brick">
        {crumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-faint">
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <Link
                    href={c.href}
                    className="transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
        <h1 className="max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink">
          {title}
        </h1>
        {lead ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{lead}</p> : null}
      </header>
      {children}
    </div>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-6 border-b border-rule py-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brick">
      <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-ink-faint">{label}</h2>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
