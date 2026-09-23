"use client";

import { useState } from "react";
import { AskDemo } from "@/components/ask-demo";

// The connected system, made interactive: three parts of one system. Select a
// part and it shows how it links to the others. The full running demo is #560.
const PARTS = [
  {
    id: "agents",
    name: "Agents",
    role: "The software that does the repeatable jobs, like researching a company before a call or drafting the follow-up afterwards.",
    link: "It reads from the Context Engine and adds what it learns back into it.",
  },
  {
    id: "context",
    name: "Context Engine",
    role: "Everything your business knows, kept in one place that you own, including proposals, call notes, customer records and the facts your team has confirmed.",
    link: "The agents keep it up to date as they work, and the dashboard shows what's in it.",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    role: "The screen your team uses to review what the agents have prepared and decide what happens next.",
    link: "Every answer on it links back to where it came from in the Context Engine.",
  },
] as const;

export function ConnectedSystem() {
  const [sel, setSel] = useState<string>("context");
  const active = PARTS.find((p) => p.id === sel) ?? PARTS[1];

  return (
    <div>
      <div className="relative grid grid-cols-3 gap-2 sm:gap-4">
        {/* The connection: one line through all three. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[16%] top-1/2 hidden h-px -translate-y-1/2 bg-rule sm:block"
        />
        {PARTS.map((p) => {
          const on = p.id === sel;
          return (
            <button
              key={p.id}
              onClick={() => setSel(p.id)}
              aria-pressed={on}
              className={`relative z-10 border-2 bg-paper px-2 py-4 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-3 ${
                on ? "border-accent" : "border-rule hover:border-ink"
              }`}
            >
              <span
                className={`block text-sm font-medium transition-colors ${
                  on ? "text-accent" : "text-ink"
                }`}
              >
                {p.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 border-l-2 border-accent pl-4">
        <p className="text-sm leading-relaxed text-ink">{active.role}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{active.link}</p>
      </div>
      <div className="mt-6">
        <AskDemo />
      </div>
    </div>
  );
}
