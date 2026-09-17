"use client";

import { useEffect, useRef, useState } from "react";
import { funnel } from "@/content/site";

function format(n: number, approx: boolean) {
  const s = n.toLocaleString("en-GB");
  return approx ? `~${s}` : s;
}

// Pure log hides the first cut; pure linear hides the last stages.
// Blend the two so both the 86k-to-50k drop and the final 17 stay readable.
const widths = (() => {
  const max = funnel[0].value;
  const logMax = Math.log10(max);
  const logMin = Math.log10(funnel[funnel.length - 1].value);
  return funnel.map((s) => {
    const linear = s.value / max;
    const log = (Math.log10(s.value) - logMin) / (logMax - logMin);
    const t = 0.5 * linear + 0.5 * log;
    return 8 + t * 92;
  });
})();

export function Funnel() {
  const [active, setActive] = useState(funnel.length - 1);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 sm:p-8">
      <div className="flex flex-col gap-1 pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          One week of prospecting
        </p>
        <p className="text-sm text-neutral-400">
          Select a step to see what happens at that point.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {funnel.map((stage, i) => {
          const isActive = i === active;
          return (
            <button
              key={stage.label}
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className="group grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/5"
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-3">
                  <span
                    className={`truncate text-sm transition-colors ${
                      isActive ? "text-white" : "text-neutral-400"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isActive ? "bg-white" : "bg-neutral-600 group-hover:bg-neutral-500"
                    }`}
                    style={{
                      width: shown ? `${widths[i]}%` : "0%",
                      transitionDelay: `${i * 120}ms`,
                    }}
                  />
                </div>
              </div>
              <span
                className={`font-mono text-sm tabular-nums transition-colors ${
                  isActive ? "text-white" : "text-neutral-500"
                }`}
              >
                {format(stage.value, stage.approx)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-20 rounded-xl border border-white/10 bg-black/40 p-4">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          {funnel[active].label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-300">{funnel[active].note}</p>
      </div>

      <p className="mt-4 text-xs text-neutral-600">
        Real figures from a live run, rounded. Companies are never named.
      </p>
    </div>
  );
}
