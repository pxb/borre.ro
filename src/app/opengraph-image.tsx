import { ogCard, OG_SIZE, OG_TYPE } from "./_og/card";
import { defaultHeadline as headline } from "@/lib/meta";

// The default share image for every route without its own.
export const alt = headline;
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({ title: headline });
}
