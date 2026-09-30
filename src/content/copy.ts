// Reads the site's words from src/content/copy/<page>.md, compiled by
// scripts/copy.mjs into src/content/copy.gen/<page>.ts (#561, 2026-09-30).
// Import a page's module and wrap it: `const w = words(page)`, then `w.t("tagline")`.
// A missing slot, or a one-line slot given two paragraphs, throws while the
// site builds, so a bad edit fails the build with a message naming the file
// and the heading instead of shipping a broken page.

export type Slot = { t: "text" | "list"; v: string[]; max?: number };
// `route` is the page the file feeds; `shared` names the slots (by prefix)
// that also appear on the pages under it, e.g. work.md's "label." row labels
// on every case study; `also` lists other pages that show some of its lines
// (each case study's title and results on /work). The review mode uses these to
// credit a line on the page to the file it comes from.
export type Page = { name: string; route: string; shared?: string; also?: string; slots: Record<string, Slot> };

export function words(page: Page) {
  const get = (key: string) => {
    const s = page.slots[key];
    if (!s) throw new Error(`copy: src/content/copy/${page.name}.md has no "## ${key}"`);
    return s;
  };
  return {
    // One paragraph: a title, a line, a label.
    t(key: string): string {
      const s = get(key);
      if (s.t !== "text" || s.v.length !== 1) {
        throw new Error(`copy: "## ${key}" in ${page.name}.md should be one paragraph, not ${s.t === "list" ? "a list" : `${s.v.length} paragraphs`}`);
      }
      return s.v[0];
    },
    // One or more paragraphs.
    ps(key: string): string[] {
      return get(key).v;
    },
    // A list, one item per "- " line.
    li(key: string): string[] {
      return get(key).v;
    },
    has(key: string): boolean {
      return key in page.slots;
    },
  };
}
