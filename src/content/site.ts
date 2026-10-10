import { servicePages } from "./service-pages";
import { words, type Page } from "./copy";
import copyContextEngine from "./copy.gen/case-context-engine";
import copyProspectingLoop from "./copy.gen/case-prospecting-loop";
import copyLeadResearch from "./copy.gen/case-lead-research";
import copyPostCall from "./copy.gen/case-post-call";
import copyServices from "./copy.gen/services";
import copyHome from "./copy.gen/home";
import copyChrome from "./copy.gen/chrome";
import copyAbout from "./copy.gen/about";
import copyNewsletter from "./copy.gen/newsletter";
import copyAudit from "./copy.gen/service-audit";
import copyWorkshop from "./copy.gen/service-workshop";
import copyTraining from "./copy.gen/service-training";
import copyContextEngineService from "./copy.gen/service-context-engine";
import copyWorkflows from "./copy.gen/service-agentic-workflows";
import copyApps from "./copy.gen/service-apps-dashboards";
import copyPlatform from "./copy.gen/service-agentic-platform";
import copySupport from "./copy.gen/service-support";

// /services and what every service page shares: src/content/copy/services.md.
const svc = words(copyServices);
// The homepage: src/content/copy/home.md.
const home = words(copyHome);
// What every page shares (menu, footer, offer bar, 404): src/content/copy/chrome.md.
export const ui = words(copyChrome);
// The newsletter's name and the words around every article: newsletter.md.
export const nl = words(copyNewsletter);
// The menu: labels from chrome.md, links here, in the same order.
const NAV_HREFS = ["/work", "/services", "/newsletter", "/about", "/contact"];
export const nav = NAV_HREFS.map((href, i) => ({ href, label: ui.li("nav")[i] }));
export const navLabel = (href: string) => nav.find((n) => n.href === href)?.label ?? "";
const count = (w: ReturnType<typeof words>, prefix: string) => {
  let n = 0;
  while (w.has(`${prefix}.${n + 1}`)) n++;
  return n;
};

export const site = {
  name: "borre.ro",
  founder: "Pedro Borrero",
  domain: "borre.ro",
  url: "https://borre.ro",
  role: "AI for Humans",
  // The eyebrow that carried this was dropped from the hero, so the phrase
  // does its work in the page title and the structured data instead.
  tagline: "AI and Revenue Operations",
  // The rolling number and the four headlines (one per visit, picked before
  // first paint; see HeroHeadline): home.md. `{n}` is the number, `{N}` the
  // same capitalised.
  headlineCounts: home.li("hero.numbers"),
  headlines: Array.from({ length: count(home, "hero.headline") }, (_, i) => home.t(`hero.headline.${i + 1}`)),
  summary: home.t("hero.summary"),
  // One offer name, repeated everywhere a CTA points at /contact.
  cta: ui.t("cta"),
  ctaLine: ui.t("cta.line"),
  ctaNote: ui.t("cta.note"),
  // Cal.com booking link. Empty = /contact falls back to email.
  booking: "pedro-borrero-a4yjyv/30min",
  // Business address, live 2026-09-25. Empty hides every email link.
  email: "pedro@borre.ro",
  // Trading details a business website must show (Electronic Commerce (EC
  // Directive) Regulations 2002, reg 6): name, a geographic address, email.
  // The address is a business address service, never Pedro's home (Pedro,
  // 2026-09-28); empty hides it until he has one.
  address: "",
  // Where we are, so buyers can place us (Pedro, 2026-09-30). An area, not an
  // address: it does not meet reg 6, which still waits on `address`.
  location: "Chiswick, London",
  // Reg 6(2): where prices are shown, say whether they include VAT.
  // Pedro is not VAT registered (2026-09-28).
  vatNote: svc.t("vat"),
  // The monthly roundup (#221, #607). Its Substack address goes in `url` once
  // Pedro has set it up; until then no subscribe link shows.
  newsletter: { name: nl.t("name"), strap: nl.t("strap"), url: "" },
  linkedin: "https://www.linkedin.com/in/pedromborrero/",
};

// `note`: how an estimate was worked out, shown under the case study's results
// with an asterisk on its label (not on /work).
export type Metric = { value: string; label: string; note?: string };

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  problem: string[];
  drawsOn: string[];
  does: string[];
  metrics: Metric[];
  involved: string[]; // how the team stays involved: the controls, stated as what they do
  stack: string[]; // connected business systems
  tech: string[]; // how it is built
  services: string[]; // the ServiceCategories that deliver it, so the two cannot drift
  journey?: string[]; // how it was built and what makes it work; shown in Solution
  // False while results are targets, not outcomes (not live yet). Keeps it off
  // the homepage "what they've done" slide. Internal only, never displayed.
  resultsProven?: boolean;
  // A real client quote only, with permission. Never invented (#562).
  testimonial?: { quote: string; name: string; role: string };
};

// The case studies' words live in src/content/copy/case-<slug>.md (#561), so
// Pedro can rewrite them without touching code. What stays here: the slug, the
// figures (each backed by evidence), the services that deliver it, and flags.
function caseStudy(
  page: Page,
  rest: { slug: string; figures: string[]; services: string[]; resultsProven?: boolean },
): CaseStudy {
  const w = words(page);
  const { figures, resultsProven, ...keep } = rest;
  return {
    ...(resultsProven === false ? { resultsProven } : {}),
    ...keep,
    title: w.t("title"),
    tagline: w.t("tagline"),
    problem: w.ps("challenge"),
    drawsOn: w.li("draws-on"),
    does: w.li("solution"),
    metrics: figures.map((value, i) => ({
      value,
      label: w.t(`result.${i + 1}`),
      ...(w.has(`result.${i + 1}.note`) ? { note: w.t(`result.${i + 1}.note`) } : {}),
    })),
    involved: w.ps("involved"),
    stack: w.li("connected-systems"),
    tech: w.li("technology"),
    ...(w.has("journey") ? { journey: w.ps("journey") } : {}),
  };
}

export const work: CaseStudy[] = [
  caseStudy(copyContextEngine, { slug: "context-engine", figures: ["100%", "1 day", "8"], services: ["context-engine"] }),
  caseStudy(copyProspectingLoop, {
    slug: "prospecting-loop",
    figures: ["20 to 30 min", "6"],
    services: ["agentic-workflows", "apps-dashboards"],
  }),
  caseStudy(copyLeadResearch, { slug: "lead-research", figures: ["20 to 40 min", "~10 min"], services: ["agentic-workflows"] }),
  // Results are targets until it runs live; keeps it off the "done" slide.
  caseStudy(copyPostCall, { slug: "post-call", figures: ["20 min", "4 jobs"], services: ["agentic-workflows"], resultsProven: false }),
];


// Slide 01: three problems in the owner's words, each with our answer, and no
// survey figures (Pedro, 2026-10-10: competitors open with the problem or their
// work, not stats, and the figures' frames made the slide hard to read). The
// figures moved, in full, to /research (src/content/research.ts).
export const problems = [1, 2, 3].map((i) => ({ problem: home.t(`problem.${i}`), answer: home.t(`problem.${i}.answer`) }));
export const problemsMore = home.t("problem.research");

// Slide 05: what AI done properly is worth, in general rather than per client
// (client results live on /work). Sources checked 2026-09-24.
// Under the ways to start on /services (Pedro, 2026-09-30: market data can
// address the problem there). Microsoft 2026 Work Trend Index (5 May 2026,
// 20,000 AI users in 10 countries): "organizational factors like culture,
// manager support, and talent practices account for more than 2x the reported
// AI impact of individual factors like mindset and behavior (67% vs. 32%)".
export const startWhy = {
  stat: "67%",
  claim: svc.t("start-why.claim"),
  source: "Microsoft Work Trend Index, 2026",
  href: "https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization",
  answer: svc.t("start-why.answer"),
};


export const costNotes = [1, 2, 3].map((i) => ({ title: svc.t(`pricing.${i}.title`), body: svc.t(`pricing.${i}.text`) }));

// Agency-framed (we, not I). The employers are a credibility block, not a bio.
// The words: src/content/copy/about.md (#561). Each commitment reuses a line
// the site already makes, so /about adds no new claim.
const ab = words(copyAbout);
export const about = {
  title: ab.t("meta.title"),
  lead: ab.t("lead"),
  founder: ab.t("founder"),
  intro: ab.t("intro"),
  body: ab.ps("body"),
  principles: [1, 2, 3].map((i) => ({ t: ab.t(`principle.${i}.title`), d: ab.t(`principle.${i}.text`) })),
  labels: { who: ab.t("label.who"), standFor: ab.t("label.stand-for") },
};

// The services taxonomy (Pedro, 2026-09-22). Plain description first; `under`
// is the technical layer, for the buyer's evaluator and for search.
export type ServiceCategory = {
  slug: string;
  name: string;
  what: string;
  includes: string[];
  under: string;
  price: string;
  duration: string;
};

// The services' words live in src/content/copy/service-<slug>.md (#561). What
// stays here: the slug, the price and the timing (terms, backed by the scope
// sheet), so the words can change without the terms moving.
function service(page: Page, slug: string, price: string, duration: string): ServiceCategory {
  const w = words(page);
  return { slug, name: w.t("name"), what: w.t("what"), includes: w.li("includes"), under: w.t("built-with"), price, duration };
}

export const serviceCategories: ServiceCategory[] = [
  service(copyAudit, "audit", "From £450", "Usually 1 to 2 weeks"),
  service(copyWorkshop, "workshop", "From £950", "Half or full day"),
  service(copyTraining, "training", "From £950 a day", "Set up in a week, sessions over 2 to 4 weeks"),
  service(copyContextEngineService, "context-engine", "From £5,000", "Working on your data in days, live in 3 to 6 weeks"),
  service(copyWorkflows, "agentic-workflows", "From £1,500 per workflow", "Each workflow live in 1 to 2 weeks"),
  service(copyApps, "apps-dashboards", "From £7,500", "3 to 6 weeks"),
  service(copyPlatform, "agentic-platform", "From £7,500 a phase", "Each phase 4 to 8 weeks"),
  service(copySupport, "support", "From £1,000 a month", "Month to month"),
];

// The standalone portal demo's page title and description, shared with its
// share image.
export const prospectingDemo = {
  title: "Prospecting portal demo",
  description:
    "A working demo of the prospecting portal we build, run on an invented coffee roaster and invented prospects.",
};

// The three groups the services sit in (AI³ method, kept by Pedro): on
// /services and in the header's Services menu.
export const serviceGroups = [
  { name: svc.t("group.start"), slugs: ["audit", "workshop", "training"] },
  { name: svc.t("group.build"), slugs: ["context-engine", "agentic-workflows", "apps-dashboards", "agentic-platform"] },
  { name: svc.t("group.run"), slugs: ["support"] },
];

// The free tools (Pedro, 2026-10-09): the readiness review, the AI ROI calculator (/scorecard) and
// the signal check, listed under Services in both menus.
export const tools = [
  { href: "/try", label: ui.t("nav.review") },
  { href: "/scorecard", label: ui.t("nav.scorecard") },
  { href: "/work/prospecting-loop#signal-check", label: ui.t("nav.signals") },
];

// sessionStorage key: a finished readiness review's one line, added to the
// booking notes like the scorecard's (BookingFrame).
export const REVIEW_KEY = "borre-review";

// How to start, for agents (#564): the same offer the pages make, with the
// links an agent can hand straight to its user. llms.txt and the MCP server
// both read it, so neither can drift from the site.
export const howToStart = {
  call: `Book a free 30-minute call: https://cal.com/${site.booking}`,
  scorecard: `Not sure which service fits: try the AI ROI calculator at ${site.url}/scorecard (nine questions, about two minutes), or get a free AI readiness review of your website at ${site.url}/try.`,
  service: `To book about one service, use its page's button, or ${site.url}/contact?service=<slug> with a slug from the list of services.`,
  email: `Email: ${site.email}`,
};

// What each price pays for, so a summary can't turn a one-off build into a
// monthly fee or the reverse (#564). Builds are one-off; running costs are the
// client's own usage, billed to their accounts, plus the managed service if
// they want it.
export const priceBasis = (slug: string) =>
  slug === "support"
    ? "monthly"
    : ["context-engine", "agentic-workflows", "apps-dashboards", "agentic-platform"].includes(slug)
      ? "one-off build; running costs are your own usage, billed to your accounts, plus the Managed service if you want it"
      : slug === "training"
        ? "one-off, for the days agreed"
        : "one-off";

export const serviceFor = (slug: string) => serviceCategories.find((s) => s.slug === slug);
export const proofFor = (slug: string) => work.filter((w) => w.services.includes(slug));

// The booking button for a page: on a service page it names the service and
// carries it to /contact, which passes it into the booking form.
export function ctaFor(path: string) {
  const slug = path.match(/^\/services\/([^/]+)$/)?.[1];
  const page = slug ? servicePages[slug] : undefined;
  return page && slug
    ? { label: page.cta, href: `/contact?service=${slug}`, service: slug }
    : { label: site.cta, href: "/contact", service: undefined };
}
