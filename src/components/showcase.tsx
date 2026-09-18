"use client";

import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { work } from "@/content/site";
import { Funnel } from "@/components/funnel";

export function Showcase() {
  const [value, setValue] = useState(work[0].slug);

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      orientation="vertical"
      className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16"
    >
      <TabsList className="flex h-auto w-full flex-col items-stretch gap-0 bg-transparent p-0">
        {work.map((c, i) => (
          <TabsTrigger
            key={c.slug}
            value={c.slug}
            className="group justify-start rounded-none border-0 border-t border-rule px-0 py-5 text-left last:border-b data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <span className="flex items-baseline gap-4">
              <span className="font-mono text-xs tabular-nums text-ink-faint group-data-[state=active]:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg leading-snug text-ink-faint group-data-[state=active]:text-ink">
                {c.title}
              </span>
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {work.map((c) => (
        <TabsContent key={c.slug} value={c.slug} className="mt-0 min-w-0">
          {c.slug === "prospecting-loop" ? (
            <Funnel />
          ) : (
            <div className="border-t border-rule pt-6">
              <p className="max-w-xl text-xl leading-relaxed text-ink">{c.tagline}</p>
              <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">{c.problem[0]}</p>
              <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
                {c.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="font-mono text-2xl tabular-nums text-ink">{m.value}</dt>
                    <dd className="mt-1 text-sm leading-snug text-ink-faint">{m.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={`/work/${c.slug}`}
              className="inline-flex items-center gap-2 text-sm text-ink underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Read the detail
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <ul className="flex flex-wrap gap-2">
              {c.stack.map((s) => (
                <li key={s}>
                  <Badge variant="outline" className="font-mono text-[11px] font-normal text-ink-soft">
                    {s}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
