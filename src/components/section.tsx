import type { ReactNode } from "react";

export function Page({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <header className="border-b border-rule py-16 sm:py-20">
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
    <div className="grid gap-6 border-b border-rule py-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
      <h2 className="font-mono text-xs uppercase tracking-widest text-ink-faint">{label}</h2>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
