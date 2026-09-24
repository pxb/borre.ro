import { Wipe } from "@/components/draw";

// A case study's connected systems drawn as what they are (#585): the
// business's own tools, all feeding one build. Lines are SVG stretched over the
// gutter with `non-scaling-stroke`, so they stay hairline at any height; rows
// are equal so each line meets the middle of its box. The lines wipe in left
// to right once, the tools connecting into the build. Stacks on phones.
export function SystemsHub({ systems, name }: { systems: string[]; name: string }) {
  const n = systems.length;
  return (
    <div className="mt-5 grid sm:grid-cols-[minmax(0,1fr)_4rem_minmax(0,14rem)]">
      <ul className="grid gap-2 sm:gap-0" style={{ gridTemplateRows: `repeat(${n}, minmax(0, 1fr))` }}>
        {systems.map((x) => (
          <li key={x} className="flex flex-col justify-center sm:py-1">
            <span className="border border-ink px-3 py-2 text-sm leading-snug text-ink">{x}</span>
          </li>
        ))}
      </ul>
      <span aria-hidden="true" className="mx-auto block h-6 w-px bg-ink sm:hidden" />
      <Wipe className="hidden h-full sm:block">
        <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {systems.map((x, i) => (
            <line
              key={x}
              x1={0}
              y1={((2 * i + 1) * 100) / (2 * n)}
              x2={100}
              y2={50}
              stroke="var(--ink)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </Wipe>
      <div className="flex items-center">
        <p className="w-full border-2 border-ink px-4 py-4 text-base font-medium leading-snug text-ink">{name}</p>
      </div>
    </div>
  );
}
