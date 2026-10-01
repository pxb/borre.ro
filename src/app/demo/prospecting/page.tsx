import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Page } from "@/components/section";
import { ProspectingDemo } from "@/components/demo/prospecting-demo";
import { prospectingDemo, ui } from "@/content/site";

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
        { href: "/", label: ui.t("crumb.home") },
        { href: "/work/prospecting-loop", label: ui.t("crumb.case-study") },
      ]}
    >
      <section aria-labelledby="demo-heading" className="py-10">
        {/* The demo's own headings are h3 (as on the case study), so the page
            needs an h2 between them and the h1 (2026-09-30 review). */}
        <h2 id="demo-heading" className="sr-only">
          The portal
        </h2>
        <ProspectingDemo />
      </section>
    </Page>
  );
}
