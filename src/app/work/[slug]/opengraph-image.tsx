import { ogCard, OG_SIZE, OG_TYPE } from "../../_og/card";
import { work } from "@/content/site";

// Each case study: its title and its first result. Where the results are
// still targets (resultsProven: false), the tagline instead of a figure.
export const size = OG_SIZE;
export const contentType = OG_TYPE;

// Rendered at build time, one per case study.
export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = work.find((w) => w.slug === slug);
  if (!c) return ogCard({ title: "Case studies" });
  const proven = c.resultsProven !== false && c.metrics.length > 0;
  return ogCard({ title: c.title, figure: proven ? c.metrics[0] : undefined, line: proven ? undefined : c.tagline });
}
