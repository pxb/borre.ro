import Link from "next/link";
import { navLabel, serviceFor, serviceGroups, tools, ui } from "@/content/site";

// Styled once in globals.css (.menu-link).
const ITEM = "menu-link";

// The header's Services link with its menu on screens from 1024px: the three
// groups and every service, opened by hover or by keyboard focus (CSS only, no
// script). Hidden panels are `invisible`, so their links are out of the tab
// order until the Services link itself has focus. The panel hangs from the
// right edge of the header's links (their wrapper is `relative`), so it never
// runs past the page edge.
export function ServicesMenu() {
  return (
    <div className="group">
      <Link
        href="/services"
        className="transition-colors group-hover:text-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {navLabel("/services")}
      </Link>
      {/* pt-6 bridges the gap under the link, so the pointer can reach the panel. */}
      <div className="invisible absolute top-full right-0 z-50 pt-6 opacity-0 transition-[opacity,visibility] duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none">
        <div className="grid w-[min(40rem,calc(100vw-3rem))] grid-cols-3 gap-8 bg-paper p-8 shadow-[0_1px_2px_rgb(25_23_18/0.06),0_24px_50px_-20px_rgb(25_23_18/0.3)]">
          {serviceGroups.map((g, gi) => (
            <div key={g.name}>
              <p className="label">{g.name}</p>
              <ul className="mt-3 text-sm">
                {g.slugs.map((slug) => {
                  const s = serviceFor(slug);
                  return s ? (
                    <li key={slug}>
                      <Link href={`/services/${slug}`} className={ITEM}>
                        {s.name}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
              {/* The free tools close the last group (Run), by position, so a renamed group keeps them. */}
              {gi === serviceGroups.length - 1 ? (
                <div className="mt-6 border-t border-rule pt-4">
                  <p className="label">{ui.t("nav.tools")}</p>
                  <ul className="mt-3 text-sm">
                    {tools.map((t) => (
                      <li key={t.href}>
                        <Link href={t.href} className={ITEM}>
                          {t.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
