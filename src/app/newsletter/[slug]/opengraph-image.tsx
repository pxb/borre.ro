import { ogCard, OG_SIZE, OG_TYPE } from "../../_og/card";
import { post, posts } from "@/lib/newsletter";

// Each piece: its title and description. Rendered at build time.
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return posts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = post(slug);
  if (!p) return ogCard({ title: "Newsletter" });
  return ogCard({ title: p.title, line: p.description });
}
