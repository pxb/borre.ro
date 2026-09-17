import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { site } from "@/content/site";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.summary,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description: site.summary,
    siteName: site.domain,
  },
  robots: { index: true, follow: true },
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

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-sm tracking-tight text-white">
          borre<span className="text-neutral-500">.ro</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-neutral-400">
          <Link href="/work" className="transition-colors hover:text-white">
            Work
          </Link>
          <Link href="/writing" className="transition-colors hover:text-white">
            Writing
          </Link>
          <Link href="/about" className="transition-colors hover:text-white">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{site.name}. Revenue operations, built and run with AI.</p>
        <div className="flex gap-6">
          <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
            {site.email}
          </a>
          <a
            href={site.linkedin}
            className="transition-colors hover:text-white"
            rel="me noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black font-sans text-neutral-200">
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
