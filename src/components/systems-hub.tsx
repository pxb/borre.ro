import { ArrowRight } from "lucide-react";

// A case study's connected systems feeding one build, drawn as a track (#585;
// redrawn 2026-09-30: boxed names read as form fields, and six lines fanning
// into one point looked odd on both desktop and phone). The systems hang off a
// 2px ink spine, one tick each; the spine runs on into the build, and the
// accent arrow leads into it, as it leads into our answer on slide 01. Each row
// draws its own piece of the spine, so the lines meet the middle of every row at
// any text size. Same shape on every screen.
const SPINE = "absolute left-0 w-0.5 bg-ink";
const TICK = "absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 bg-ink";

export function SystemsHub({ systems, name }: { systems: string[]; name: string }) {
  return (
    <div className="mt-5">
      <ul>
        {systems.map((x, i) => (
          <li key={x} className="relative py-1.5 pl-7 leading-snug text-ink">
            <span aria-hidden="true" className={`${SPINE} ${i === 0 ? "top-1/2" : "top-0"} bottom-0`} />
            <span aria-hidden="true" className={TICK} />
            {x}
          </li>
        ))}
      </ul>
      <p className="relative pt-3 pl-7 text-lg font-medium leading-snug text-ink">
        <span aria-hidden="true" className={`${SPINE} top-0 h-[calc(50%+0.375rem)]`} />
        <span aria-hidden="true" className="absolute top-[calc(50%+0.375rem)] left-0 flex -translate-y-1/2 items-center">
          <span className="h-0.5 w-2.5 bg-ink" />
          <ArrowRight className="-ml-1.5 size-4 text-accent" strokeWidth={2.5} />
        </span>
        <span className="sr-only">All feeding </span>
        {name}
      </p>
    </div>
  );
}
