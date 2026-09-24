"use client";

import Link from "next/link";
import { useRef } from "react";
import { Menu, X } from "lucide-react";

// The phone menu on the browser's own modal <dialog>: it traps focus, closes on
// Escape, makes the page behind inert and returns focus to the button, with no
// component library (that library was 33 KB gzipped on every page for this one
// panel). A tap on the backdrop closes it too.
export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label="Open menu"
        aria-haspopup="dialog"
        className="flex size-11 items-center justify-center text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:hidden"
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
              Menu
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="flex size-11 items-center justify-center text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Menu" className="mt-2 flex flex-col px-6">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={close}
                className="border-b border-rule py-4 text-lg text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
      </dialog>
    </>
  );
}
