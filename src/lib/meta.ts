import type { Metadata } from "next";
import { site } from "@/content/site";

// The headline that renders without JavaScript, on the default share image.
export const defaultHeadline = site.headlines[0].replace("{n}", site.headlineCounts[0]);

// Each page names its own canonical URL, og:url and og:title. These once came
// from the root layout, which told search engines and LinkedIn that every page
// was the homepage. A page's openGraph replaces the layout's and outranks its
// segment's opengraph-image file, so the share image is named here: the
// default one unless the page has its own (`image`, the path of its file).
export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title?: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
}): Metadata {
  const img = image ?? { url: "/opengraph-image", alt: defaultHeadline };
  const full = title ? `${title} · ${site.name}` : `${site.name} · ${site.tagline}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.domain,
      url: path,
      title: full,
      description,
      images: [{ ...img, width: 1200, height: 630 }],
    },
  };
}
