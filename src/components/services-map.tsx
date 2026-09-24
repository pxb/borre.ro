import Link from "next/link";
import { serviceFor } from "@/content/site";

// How the services connect (#585): the ways to start lead into the Context
// Engine, the builds draw on it, and the managed service runs around the lot.
// It is also the page's index: every box links to its section. Lines are drawn
// in SVG stretched over the gutters; `non-scaling-stroke` keeps them hairline.
// Below lg it stacks top to bottom with plain vertical connectors.

const START = ["audit", "workshop", "training"];
const BUILD = ["agentic-workflows", "apps-dashboards", "agentic-platform"];
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const NODE = `flex min-h-11 items-center border border-ink bg-paper px-4 py-2.5 text-sm font-medium leading-snug text-ink transition-colors hover:bg-ink hover:text-paper ${FOCUS}`;

function Node({ slug }: { slug: string }) {
  const s = serviceFor(slug);
  if (!s) return null;
  return (
    <Link href={`#${slug}`} className={NODE}>
      {s.name}
    </Link>
  );
}

// Three lines fanning between a column of three and the hub's middle.
function Fan({ into }: { into: "left" | "right" }) {
  const hub = into === "left" ? 0 : 100;
  const col = 100 - hub;
  return (
    <svg aria-hidden="true" className="hidden h-full w-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none">
      {[100 / 6, 50, (100 * 5) / 6].map((y) => (
        <line key={y} x1={col} y1={y} x2={hub} y2={50} stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

function Down() {
  return <span aria-hidden="true" className="mx-auto block h-6 w-px bg-ink lg:hidden" />;
}

export function ServicesMap() {
  const hub = serviceFor("context-engine");
  const run = serviceFor("support");
  return (
    <nav aria-label="How the services connect" className="py-12 sm:py-16">
      <div className="border border-dashed border-ink p-4 sm:p-8">
        <Link
          href="#support"
          className={`inline-flex min-h-11 items-center text-sm font-medium text-ink-soft transition-colors hover:text-ink ${FOCUS}`}
        >
          {run?.name}
        </Link>
        <div className="mt-2 grid lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)_4rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
          <p className="label pb-3 lg:col-start-1">Start</p>
          <p className="label hidden pb-3 lg:col-start-5 lg:block">Build</p>

          <ul className="grid gap-2 lg:col-start-1 lg:row-start-2 lg:grid-rows-3 lg:gap-0">
            {START.map((s) => (
              <li key={s} className="lg:flex lg:flex-col lg:justify-center lg:py-1.5">
                <Node slug={s} />
              </li>
            ))}
          </ul>

          <div className="lg:col-start-2 lg:row-start-2">
            <Down />
            <Fan into="right" />
          </div>

          <div className="flex items-center lg:col-start-3 lg:row-start-2">
            <Link
              href="#context-engine"
              className={`flex min-h-20 w-full flex-col justify-center border-2 border-ink bg-paper px-5 py-4 text-ink transition-colors hover:bg-ink hover:text-paper ${FOCUS}`}
            >
              <span className="text-lg font-medium leading-snug">{hub?.name}</span>
            </Link>
          </div>

          <div className="lg:col-start-4 lg:row-start-2">
            <Down />
            <Fan into="left" />
          </div>

          <p className="label pb-3 lg:hidden">Build</p>
          <ul className="grid gap-2 lg:col-start-5 lg:row-start-2 lg:grid-rows-3 lg:gap-0">
            {BUILD.map((s) => (
              <li key={s} className="lg:flex lg:flex-col lg:justify-center lg:py-1.5">
                <Node slug={s} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
