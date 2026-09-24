"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { scrollToTop } from "@/lib/scroll";

// The wordmark. From another page it goes home as usual; on the homepage,
// where a link to "/" would do nothing, it takes you back to the top like the
// back-to-top button.
export function HomeLink({ className, children }: { className: string; children: ReactNode }) {
  const path = usePathname();
  return (
    <Link
      href="/"
      className={className}
      onClick={(e) => {
        if (path !== "/") return;
        e.preventDefault();
        scrollToTop();
      }}
    >
      {children}
    </Link>
  );
}
