import { ogCard, OG_SIZE, OG_TYPE } from "../../_og/card";
import { prospectingDemo } from "@/content/site";

export const alt = prospectingDemo.title;
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({ title: prospectingDemo.title, line: prospectingDemo.description });
}
