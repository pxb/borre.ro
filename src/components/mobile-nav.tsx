"use client";

import Link from "next/link";
import { useRef } from "react";
import { Menu, X } from "lucide-react";
import { ui } from "@/content/site";

type NavLink = { href: string; label: string };

// The phone menu on the browser's own modal <dialog>: it traps focus, closes on
// Escape, makes the page behind inert and returns focus to the button, with no
// component library (that library was 33 KB gzipped on every page for this one
// panel). A tap on the backdrop closes it too. Under Services, every service by
// group, so a phone reader can go straight to one.
export function MobileNav({
  items,
  services,
}: {
  items: NavLink[];
  services: { name: string; links: NavLink[] }[];
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={ui.t("menu.open")}
        aria-haspopup="dialog"
        className="flex size-11 items-center justify-center text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ml-auto lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>
      <dialog
        ref={ref}
        aria-labelledby="mobile-nav-title"
        className="mobile-nav"
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between pt-3 pr-3 pl-6">
            <p id="mobile-nav-title" className="label">
              {ui.t("menu.title")}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label={ui.t("menu.close")}
              className="flex size-11 items-center justify-center text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label={ui.t("menu.title")} className="mt-2 flex flex-col overflow-y-auto px-6 pb-8">
            {items.map((i) => (
              <div key={i.href} className="border-b border-rule">
                <Link
                  href={i.href}
                  onClick={close}
                  className="block py-4 text-lg text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {i.label}
                </Link>
                {i.href === "/services" ? (
                  <div className="grid gap-5 pb-5">
                    {/* Group names are dividers, not links: a hairline over a small grey
                        label, with the services under it in ink. */}
                    {services.map((g, gi) => (
                      <div key={g.name}>
                        <p className="flex items-center gap-3 text-xs font-medium text-ink-soft">
                          <span>{g.name}</span>
                          <span aria-hidden="true" className="h-px flex-1 bg-rule" />
                        </p>
                        <ul className="mt-1">
                          {/* The scorecard closes the last group (Run), found by position so renaming the group in the copy files can't drop it. */}
                          {[...g.links, ...(gi === services.length - 1 ? [{ href: "/scorecard", label: ui.t("nav.scorecard") }] : [])].map((l) => (
                            <li key={l.href}>
                              <Link
                                href={l.href}
                                onClick={close}
                                className="flex min-h-11 items-center text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      </dialog>
    </>
  );
}
