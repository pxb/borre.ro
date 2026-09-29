import { ogCard, OG_SIZE, OG_TYPE } from "../../_og/card";
import { serviceCategories, serviceFor } from "@/content/site";
import { servicePages } from "@/content/service-pages";

// Each service: its name and its one line of value. No price: prices are
// never the headline.
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return serviceCategories.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceFor(slug);
  if (!s) return ogCard({ title: "Services" });
  return ogCard({ title: s.name, line: servicePages[slug]?.line });
}
