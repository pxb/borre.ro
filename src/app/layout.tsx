import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { site, solutions, work } from "@/content/site";
import { MobileNav } from "@/components/mobile-nav";

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
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: "Revenue operations consultant",
  description: site.summary,
  sameAs: [site.linkedin],
  knowsAbout: [
    "Revenue operations",
    "Sales pipeline automation",
    "HubSpot",
    "AI agents",
    "Lead research",
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
    <header className="border-b border-rule">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          borre<span className="text-accent">.ro</span>
        </Link>
        <MobileNav items={nav} />
        <div className="hidden items-center gap-8 text-sm text-ink-soft sm:flex">
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
      <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
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
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="flex flex-col gap-8 border-b border-rule py-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="max-w-xl text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink">
              Start with a conversation about where this would actually pay.
            </p>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
              Thirty minutes, no charge. You get a straight answer, including an
              honest no if that is the answer.
            </p>
          </div>
          <Link
            href="/contact"
            className="btn-orange shrink-0 px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            Get in touch
          </Link>
        </div>

        <div className="grid gap-12 border-b border-rule py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-mono text-sm tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              borre<span className="text-accent">.ro</span>
            </Link>
            <p className="mt-4 max-w-xs leading-relaxed text-ink-soft">
              {site.role}. Built and run by {site.name}, sole trader in the UK.
              Client work is usually delivered with{" "}
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
              ...solutions.slice(0, 4).map((x) => ({ href: "/services", label: x.name })),
              { href: "/services", label: "All services and prices" },
            ]}
          />

          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-ink">Contact</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {site.email}
                </a>
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
                  About Pedro
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
            <span>Readable by agents:</span>
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
      lang="en-GB"
      className={`${archivo.variable} ${martianMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
