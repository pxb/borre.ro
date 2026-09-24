import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { serviceCategories, site, work } from "@/content/site";
import { MobileNav } from "@/components/mobile-nav";
import { FooterCta } from "@/components/footer-cta";
import { BackToTop } from "@/components/back-to-top";
import { OfferBar } from "@/components/offer-bar";

// Archivo carries a real width axis (62-125), so the display cuts are genuinely
// expanded rather than letter-spaced. Geist was Vercel's own face and the first
// example in Next's font docs, which is why it read as the default.
const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["wdth"],
});
const martianMono = Martian_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.summary,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} · ${site.tagline}`,
    description: site.summary,
    siteName: site.domain,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F2EDE4",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  slogan: site.role,
  description: site.summary,
  areaServed: "GB",
  founder: { "@type": "Person", name: site.founder, sameAs: [site.linkedin] },
  knowsAbout: [
    "Revenue operations",
    "AI agents",
    "Agentic workflows",
    "Retrieval-augmented generation",
    "Context engineering",
    "HubSpot",
    "AI training",
  ],
};

const nav = [
  { href: "/work", label: "Case studies" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper">
      <nav className="mx-auto flex h-20 max-w-6xl items-center px-6 sm:px-10">
        <Link
          href="/"
          className="text-lg font-medium tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          borre<span className="text-accent">.ro</span>
        </Link>
        {/* R and O accented so the category line reads back to the .ro domain:
            borre.RO = Revenue Operations. One typeface, Archivo, throughout. */}
        <p className="ml-3 border-l border-rule pl-3 text-xs text-ink-soft sm:ml-5 sm:pl-5 sm:text-sm">
          AI and <span className="text-accent">R</span>evenue{" "}
          <span className="text-accent">O</span>perations
        </p>
        <MobileNav items={nav} />
        <div className="ml-auto hidden items-center gap-8 text-sm text-ink-soft sm:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="label">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-rule">
      <FooterCta />
      <div className="mx-auto max-w-6xl px-6 sm:px-10">

        <div className="grid gap-12 border-b border-rule py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="text-lg font-medium tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              borre<span className="text-accent">.ro</span>
            </Link>
            <p className="mt-4 max-w-xs leading-relaxed text-ink-soft">
              AI and Revenue Operations, delivered with{" "}
              <a
                href="https://www.amplifymyai.com/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-action"
              >
                Amplify My AI
              </a>
              .
            </p>
          </div>

          <FooterCol
            title="Case studies"
            links={work.map((w) => ({ href: `/work/${w.slug}`, label: w.title }))}
          />

          <FooterCol
            title="Services"
            links={[
              ...serviceCategories.slice(0, 4).map((x) => ({ href: `/services#${x.slug}`, label: x.name })),
              { href: "/services", label: "Prices" },
            ]}
          />

          <div>
            <h2 className="label">Contact</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  Book a call
                </Link>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  rel="me noreferrer"
                  target="_blank"
                  className="text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-10 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-soft">
            <span className="font-mono tabular-nums">{new Date().getFullYear()}</span>{" "}
            {site.name}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-ink-soft">
            <a
              href="/llms.txt"
              className="font-mono underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-action focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              /llms.txt
            </a>
            <a
              href="/api/mcp"
              className="font-mono underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-action focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              /api/mcp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      lang="en-GB"
      className={`${archivo.variable} ${martianMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:border-2 focus-visible:border-ink focus-visible:bg-paper focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <OfferBar />
        <BackToTop />
      </body>
    </html>
  );
}
