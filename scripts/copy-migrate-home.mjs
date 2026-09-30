// One-off migration (#561, 2026-09-30): writes src/content/copy/home.md from
// the current data, so no word is retyped. Kept for the record.
import { createJiti } from "jiti";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": join(ROOT, "src") } });
const { site, evidence, upside } = await jiti.import(join(ROOT, "src/content/site.ts"));
const hww = readFileSync(join(ROOT, "src/components/how-we-work.tsx"), "utf-8");
const sf = readFileSync(join(ROOT, "src/components/story-forms.tsx"), "utf-8");

// The four story steps, read from the literal in how-we-work.tsx.
const block = hww.slice(hww.indexOf("const STEPS: Step[] = ["), hww.indexOf("];", hww.indexOf("const STEPS: Step[] = [")));
const steps = [...block.matchAll(/id: "([a-z]+)",\s*n: "\d+",\s*label: "([^"]+)",\s*title: (\[[^\]]+\]|"[^"]+"),\s*body: (`[^`]+`|"[^"]+"),/g)].map((m) => ({
  id: m[1],
  label: m[2],
  title: m[3].startsWith("[") ? [...m[3].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [m[3].slice(1, -1)],
  body: m[4].slice(1, -1).replace("${site.recognition}", site.recognition),
}));
if (steps.length !== 4) throw new Error(`found ${steps.length} steps`);
const call = [...sf.slice(sf.indexOf("const CALL"), sf.indexOf("];", sf.indexOf("const CALL"))).matchAll(/\{ t: "([^"]+)", d: "([^"]+)" \}/g)];
const ladder = [...sf.slice(sf.indexOf("const START_SLUGS"), sf.indexOf("];", sf.indexOf("const START_SLUGS"))).matchAll(/\["([^"]+)", "[^"]+"\]/g)].map((m) => m[1]);
const ai3 = [...sf.slice(sf.indexOf("const AI3"), sf.indexOf("];", sf.indexOf("const AI3"))).matchAll(/term: "([^"]+)", plain: "([^"]+)"/g)];

const budget = (d, items) => Math.max(d, ...items.map((x) => x.length));
const slot = (key, note, items, d, list = false) =>
  [`## ${key}`, `> ${note} · max ${budget(d, items)}`, list ? items.map((x) => `- ${x}`).join("\n") : items.join("\n\n")].join("\n") + "\n";

const out = [
  `---\npage: homepage\nroute: /\nalso: /contact\n---\n`,
  `> The homepage: the hero, then the story (Problem, Review, Method, Engagement). The call track (review.call) also shows on /contact. Figures and their sources stay in code: change the words around them, not the numbers.\n`,
  ...site.headlines.map((h, i) => slot(`hero.headline.${i + 1}`, `Hero headline ${i + 1} of 4 (one is picked per visit). {n} is the rolling number, {N} the same at the start of a sentence. The first is what shares and no-JavaScript readers see`, [h], 70)),
  slot("hero.numbers", "The rolling number, in order. The widest one sets the slot's width", site.headlineCounts, 8, true),
  slot("hero.summary", "Under the headline; also the site's description in search results, share cards and for AI agents", [site.summary], 200),
  slot("hero.case-studies", "The second hero button", ["Case studies"], 20),
  ...steps.flatMap((s) => [
    slot(`${s.id}.label`, `Story step: the name in the step bar`, [s.label], 12),
    slot(`${s.id}.title`, s.title.length > 1 ? "The slide title, one line per paragraph" : "The slide title", s.title, 60),
    slot(`${s.id}.body`, "The paragraph under the title", [s.body], 240),
  ]),
  ...evidence.flatMap((e, i) => [
    slot(`problem.figure.${i + 1}.claim`, `Under the figure ${e.stat} (kept in code with its source, ${e.source}). Shown sentence-cased with a full stop`, [e.claim], 110),
    slot(`problem.figure.${i + 1}.answer`, "Our answer, after the arrow. Keep it to one line on a laptop", [e.answer], 45),
  ]),
  slot("problem.upside.claim", `Under the figure ${upside.stat} (kept in code with its source, ${upside.source})`, [upside.claim], 140),
  slot("problem.upside.answer", "The takeaway, after the arrow", ["Done properly, AI pulls you ahead."], 45),
  slot("review.call.label", "Read by screen readers: the name of the call's set of stops", ["In the 30 minutes"], 30),
  ...call.flatMap((m, i) => [
    slot(`review.call.${i + 1}.title`, `The call, stop ${i + 1}`, [m[1]], 30),
    slot(`review.call.${i + 1}.text`, `The call, stop ${i + 1}: one line`, [m[2]], 90),
  ]),
  slot("method.ai3.label", "Read by screen readers: the name of the three parts", ["Context, agents and evals"], 40),
  ...ai3.flatMap((m, i) => [
    slot(`method.ai3.${i + 1}.term`, `AI³ part ${i + 1}: the word in the formula`, [m[1]], 12),
    slot(`method.ai3.${i + 1}.text`, `AI³ part ${i + 1}: its line in plain words`, [m[2]], 100),
  ]),
  slot("engagement.ladder.label", "Read by screen readers: the name of the ladder", ["Ways to start"], 30),
  slot("engagement.ladder", "One short word per tread, smallest first (each links to its service; the line under it is the service's own line)", ladder, 12, true),
  slot("engagement.run-on", "The dashed run-on past the top of the ladder, linking to the managed service", ["Then we keep it running"], 30),
];
writeFileSync(join(ROOT, "src/content/copy/home.md"), out.join("\n"), { encoding: "utf-8" });
console.log(`wrote home.md: ${steps.length} steps, ${call.length} call stops, ${ai3.length} AI3 parts, ${ladder.length} treads`);
