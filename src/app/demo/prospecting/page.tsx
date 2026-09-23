import type { Metadata } from "next";
import { Page } from "@/components/section";
import { ProspectingDemo } from "@/components/demo/prospecting-demo";

// Standalone, shareable version of the portal demo (#560). Copy is minimal and
// parked for Pedro's review with the rest of the site (#561).
export const metadata: Metadata = {
  title: "Prospecting portal demo",
  description:
    "A working demo of the prospecting portal we build, run on an invented coffee roaster and invented prospects.",
};

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
