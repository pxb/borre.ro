import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Page } from "@/components/section";
import { ProspectingDemo } from "@/components/demo/prospecting-demo";
import { prospectingDemo } from "@/content/site";

// Standalone, shareable version of the portal demo (#560). Copy is minimal and
// parked for Pedro's review with the rest of the site (#561).
export const metadata: Metadata = pageMeta({
  title: prospectingDemo.title,
  description: prospectingDemo.description,
  path: "/demo/prospecting",
  image: { url: "/demo/prospecting/opengraph-image", alt: prospectingDemo.title },
});

export default function ProspectingDemoPage() {
  return (
    <Page
      title="Prospecting portal demo."
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/work/prospecting-loop", label: "Case study" },
      ]}
    >
      <section className="py-10">
        <ProspectingDemo />
      </section>
    </Page>
  );
}
