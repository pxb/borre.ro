// One-off migration (#561, 2026-09-30): writes src/content/copy/service-<slug>.md
// and services.md from the current TypeScript data, so no word is retyped.
// Kept for the record; run once, before site.ts and service-pages.ts read from
// the copy files.
import { createJiti } from "jiti";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": join(ROOT, "src") } });
const site = await jiti.import(join(ROOT, "src/content/site.ts"));
const { servicePages } = await jiti.import(join(ROOT, "src/content/service-pages.ts"));
const { serviceCategories, costNotes, startWhy, serviceGroups } = site;

const budget = (d, items) => Math.max(d, ...items.map((x) => x.length));
const slot = (key, note, items, d, list = false) =>
  [`## ${key}`, `> ${note} · max ${budget(d, items)}`, list ? items.map((x) => `- ${x}`).join("\n") : items.join("\n\n")].join("\n") + "\n";

const DATA_Q = "Is our data used to train AI models?";
for (const s of serviceCategories) {
  const p = servicePages[s.slug];
  const out = [
    `---\npage: service, ${s.name}\nroute: /services/${s.slug}\nalso: /services\n---\n`,
    `> The service's own page, and its entry on /services. Price (${s.price}) and timing (${s.duration}) stay in code with the scope sheet: change the words, not the terms.\n`,
    slot("name", "The service's name: menus, footer, /services, the page title, the share image", [s.name], 30),
    slot("line", "The outcome in one sentence: the page lead and the line on /services", [p.line], 110),
    slot("cta", "The page's button", [p.cta], 24),
    slot("what", "What it is: search results, AI agents (llms.txt) and the page description", [s.what], 260),
    slot("problem", "The buyer's situation in their terms: the Problem row", [p.problem], 320),
    slot("includes", "What you get, one line each", s.includes, 90, true),
    ...p.steps.flatMap((st, i) => [
      slot(`step.${i + 1}.title`, `How it runs, step ${i + 1}: title`, [st.t], 20),
      slot(`step.${i + 1}.text`, `How it runs, step ${i + 1}: one sentence`, [st.d], 90),
    ]),
    ...(p.priceNote ? [slot("price-note", "One commercial term beside the price; the detail is in the scope sheet", [p.priceNote], 110)] : []),
    ...p.faqs
      .filter((f) => f.q !== DATA_Q)
      .flatMap((f, i) => [slot(`faq.${i + 1}.q`, `Question ${i + 1}`, [f.q], 70), slot(`faq.${i + 1}.a`, `Answer ${i + 1}`, [f.a], 200)]),
    slot("built-with", "The technical line: the Built with row, near the end of the page", [s.under], 200),
  ];
  writeFileSync(join(ROOT, `src/content/copy/service-${s.slug}.md`), out.join("\n"), { encoding: "utf-8" });
}

const data = servicePages["context-engine"].faqs.find((f) => f.q === DATA_Q);
const LOOP = ["Monitor and fix", "Adapt as you change", "Report usage and cost", "Monthly KPI review"];
const LOOP_TEXT = [
  "We watch every run and fix what breaks.",
  "Small changes as your tools, team and customers change.",
  "What ran, what it cost and what changed, every month.",
  "A call on the numbers and what to do next.",
];
const meta = (await import("node:fs")).readFileSync(join(ROOT, "src/app/services/page.tsx"), "utf-8");
const desc = meta.match(/description:\s*"([^"]+)"/)[1];
const out = [
  `---\npage: services overview, and the labels on every service page\nroute: /services\nshared: label.\n---\n`,
  `> /services, and what every service page shares. Each service's own words are in service-<name>.md.\n`,
  slot("meta.title", "Browser tab and search result title", ["Services"], 40),
  slot("meta.description", "Search result and share description", [desc], 330),
  slot("heading", "Read by screen readers only; the menu already names the page", ["Services"], 40),
  ...serviceGroups.map((g) => slot(`group.${g.name.toLowerCase()}`, `Group heading on /services, also in the Services menu`, [g.name], 12)),
  slot("start-why.claim", `Under the figure ${startWhy.stat} (kept in code with its source, ${startWhy.source})`, [startWhy.claim], 170),
  slot("start-why.answer", "Our answer, after the arrow", [startWhy.answer], 80),
  slot("preview-case", "Read by screen readers on a service's case study preview; {name} is the service", ["{name}: see the case study"], 60),
  slot("preview-service", "Read by screen readers on the platform preview; {name} is the service", ["{name}: see the service"], 60),
  ...LOOP.flatMap((t, i) => [
    slot(`loop.${i + 1}.title`, `Managed service loop, stop ${i + 1}: label round the ring`, [t], 24),
    slot(`loop.${i + 1}.text`, `Managed service loop, stop ${i + 1}: the line under the ring`, [LOOP_TEXT[i]], 70),
  ]),
  slot("loop.label", "Read by screen readers: the name of the loop's set of stops", ["Managed service"], 30),
  slot("scorecard.lead", "Before the scorecard link", ["Not sure where to start?"], 40),
  slot("scorecard.link", "The scorecard link", ["Take the readiness scorecard"], 40),
  slot("pricing.heading", "Pricing section heading", ["Pricing"], 20),
  ...costNotes.flatMap((c, i) => [
    slot(`pricing.${i + 1}.title`, `Pricing note ${i + 1}: title`, [c.title], 40),
    slot(`pricing.${i + 1}.text`, `Pricing note ${i + 1}`, [c.body], 200),
  ]),
  slot("vat", "Under the pricing notes and on each service page's price (a legal requirement: whether prices include VAT)", [site.site.vatNote], 90),
  slot("security-link", "Link to /security after the VAT line", ["How we look after your data"], 40),
  slot("faq.data.q", "Asked on every service that touches business data (Context Engine, Workflow automation, Company AI platform)", [data.q], 70),
  slot("faq.data.a", "Its answer", [data.a], 200),
  slot("label.problem", "Service page row label", ["The problem"], 20),
  slot("label.includes", "Service page row label", ["What you get"], 20),
  slot("label.steps", "Service page row label", ["How it runs"], 20),
  slot("label.case-study", "Service page row label, one case study", ["Case study"], 20),
  slot("label.case-studies", "Service page row label, several", ["Case studies"], 20),
  slot("label.example", "Service page row label, no case study yet", ["Example"], 20),
  slot("label.price", "Service page row label", ["Price"], 20),
  slot("label.questions", "Service page row label", ["Questions"], 20),
  slot("label.built-with", "Service page row label", ["Built with"], 20),
  slot("label.next", "Service page row label", ["Next step"], 20),
  slot("label.also", "Before the other case studies' links", ["Also:"], 12),
];
writeFileSync(join(ROOT, "src/content/copy/services.md"), out.join("\n"), { encoding: "utf-8" });
console.log(`wrote ${serviceCategories.length} service files and services.md`);
