import { servicePages } from "./service-pages";
import { words, type Page } from "./copy";
import copyContextEngine from "./copy.gen/case-context-engine";
import copyProspectingLoop from "./copy.gen/case-prospecting-loop";
import copyLeadResearch from "./copy.gen/case-lead-research";
import copyPostCall from "./copy.gen/case-post-call";

export const site = {
  name: "borre.ro",
  founder: "Pedro Borrero",
  domain: "borre.ro",
  url: "https://borre.ro",
  role: "AI for Humans",
  // The eyebrow that carried this was dropped from the hero, so the phrase
  // does its work in the page title and the structured data instead.
  tagline: "AI and Revenue Operations",
  headlineCounts: ["five", "seven", "three", "nine", "twelve", "more"],
  // One headline per visit, picked before first paint (see HeroHeadline). The
  // first is what renders without JavaScript. `{n}` is the cycling count.
  headlines: [
    "You have {n} AI tools. None of them talk to each other.",
    "You have {n} AI tools. None of them know your business.",
    // Two of four say "tools", not "AI tools" (Pedro, 2026-09-30): we connect
    // the CRM, the accounts package and the inbox as well as the AI.
    "You pay for {n} tools and your team still does the work by hand.",
    "{N} tools, and your team still copies and pastes between them.",
  ],
  // The line that sat under the headline, now the Problem slide's opener,
  // extended to name the tools people search for.
  recognition:
    "ChatGPT here, Claude there, Copilot in Office, Gemini in Google, an AI feature in the CRM and another in accounting.",
  summary:
    "We build and run the systems that take busywork off small and medium-sized UK businesses, using the tools you already pay for. Your team signs off everything before a customer sees it.",
  // One offer name, repeated everywhere a CTA points at /contact.
  cta: "Book a free 30-minute call",
  ctaLine: "What's slowing your team down?",
  ctaNote: "Book a free 30-minute call and we'll tell you what we'd do first.",
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
  vatNote: "We're not VAT registered, so no VAT is added to our prices.",
  // The monthly roundup (#221, #607). Its Substack address goes in `url` once
  // Pedro has set it up; until then no subscribe link shows.
  newsletter: { name: "The Boring Bits", strap: "AI for UK Business Leaders", url: "" },
  linkedin: "https://www.linkedin.com/in/pedromborrero/",
};

export type Metric = { value: string; label: string };

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
    metrics: figures.map((value, i) => ({ value, label: w.t(`result.${i + 1}`) })),
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
    figures: ["~1 hour", "6"],
    services: ["agentic-workflows", "apps-dashboards"],
  }),
  caseStudy(copyLeadResearch, { slug: "lead-research", figures: ["20 to 40 min", "~10 min"], services: ["agentic-workflows"] }),
  // Results are targets until it runs live; keeps it off the "done" slide.
  caseStudy(copyPostCall, { slug: "post-call", figures: ["20 min", "4 jobs"], services: ["agentic-workflows"], resultsProven: false }),
];


// Public evidence. Each source was fetched and checked (#565; 2026-09-24).
// Slide 01: each barrier with our answer to it, so the slide ends on the fix
// rather than the fear (Pedro, 2026-09-24).
export const evidence = [
  {
    stat: "35%",
    claim: "of UK businesses say the biggest barrier to using AI is not having the expertise",
    answer: "We bring the expertise and train your team.",
    source: "ANS and YouGov, via techUK, 2025",
    href: "https://www.techuk.org/resource/major-barriers-to-ai-adoption-remain-for-uk-businesses-despite-growing-demand-new-report-reveals.html",
  },
  // Zapier, "Nearly 4 in 5 (78%) indicated that they're struggling to
  // integrate AI" with existing systems; 500+ enterprise leaders, October 2025.
  {
    stat: "78%",
    claim: "of organisations are struggling to connect AI to the systems they already run",
    answer: "We connect it to the systems you already use.",
    source: "Zapier survey, 2025",
    href: "https://zapier.com/blog/ai-resistance-survey/",
  },
  {
    stat: "40%",
    claim: "of AI agent projects are expected to be cancelled by 2027, over unclear business value",
    answer: "We agree the value up front, then measure it.",
    source: "Gartner",
    href: "https://www.gartner.com/en/articles/context-engineering",
  },
];

// Slide 05: what AI done properly is worth, in general rather than per client
// (client results live on /work). Sources checked 2026-09-24.
// Under the ways to start on /services (Pedro, 2026-09-30: market data can
// address the problem there). Microsoft 2026 Work Trend Index (5 May 2026,
// 20,000 AI users in 10 countries): "organizational factors like culture,
// manager support, and talent practices account for more than 2x the reported
// AI impact of individual factors like mindset and behavior (67% vs. 32%)".
export const startWhy = {
  stat: "67%",
  claim: "of the impact people report from AI comes from the business around them, like culture and manager support, twice the share of individual effort",
  source: "Microsoft Work Trend Index, 2026",
  href: "https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization",
  answer: "So we start with how your business works, not with the tools.",
};

// The upside at the foot of the Problem slide (05 Value folded into it,
// 2026-09-30). PwC measures labour productivity, not revenue. Press release,
// 15 June 2026: "The top 20% of the most AI-exposed companies achieved average
// labour productivity growth of 163% relative to 2018 – nearly five times
// higher than the most AI-exposed companies overall". The other two Value
// figures: Brynjolfsson et al. 14% (in git history) and Microsoft's 67%
// (now `startWhy`, on /services).
export const upside = {
  stat: "163%",
  claim: "labour productivity growth since 2018 at the top fifth of the companies most exposed to AI, nearly five times that group's average",
  source: "PwC Global AI Jobs Barometer, 2026",
  href: "https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html",
};

export const costNotes = [
  {
    title: "You own the accounts",
    body: "The AI subscription, the database and the hosting are in your name and billed to you directly. If we stop working together, you keep all of it.",
  },
  {
    title: "Usage you can see",
    body: "You pay the provider's own price for what you use, and you can see it at any time.",
  },
  {
    title: "Fixed prices, agreed up front",
    body: "We agree a fixed price before any work starts. Our rates will go up over time, and work you've already agreed stays at the price you signed.",
  },
];

// Agency-framed (we, not I). The employers are a credibility block, not a bio.
export const about = {
  lead: "We build and run AI systems for small and medium-sized UK businesses.",
  // Broad on purpose (Pedro, 2026-09-23): no role list, no company list. The
  // LinkedIn profile carries the detail. Source: his LinkedIn experience, 2007
  // to now: IT and web development, technical support, systems and sales
  // engineering, then enterprise account executive roles from 2016.
  intro:
    "The practice grew out of nearly twenty years in technology. It started hands-on, building websites and keeping systems running, then moved through technical support and sales engineering into ten years of selling enterprise software.",
  body: [
    "So we know what a sales team does all day, because we've done the job, and we know how to build the software that takes work off it.",
  ],
  // What we hold to, each line reused from elsewhere on the site so /about
  // makes no claim the rest of it doesn't (Pedro 2026-09-24: /about is about
  // us, one structure, not a stack of sections).
  principles: [
    { t: "You own it", d: "Everything runs on accounts in your name. If we stop working together, you keep all of it." },
    { t: "Your team decides", d: "Your team signs off everything before a customer sees it." },
    { t: "We prove it works", d: "Each system is measured against the job it was built to do." },
  ],
  partner: "Client work is delivered with our partner practice, Amplify My AI.",
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

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "audit",
    name: "AI readiness audit",
    what: "We review how your business runs, the tools you pay for and the data you hold, and give you a written plan of the jobs to automate first, with costs and estimated savings. You keep it, whoever builds it.",
    includes: [
      "Interviews with the people who do the work",
      "A map of your workflows, tools and data",
      "The jobs worth automating, ranked by return and effort",
      "A written plan with costs and timings",
    ],
    under: "Process mapping, AI readiness scoring, use-case prioritisation, ROI modelling.",
    price: "From £450",
    duration: "Usually 1 to 2 weeks",
  },
  {
    slug: "workshop",
    name: "Leadership workshop",
    what: "A working session with your leadership team to agree where AI fits the business: the use cases worth pursuing, the risks, and who owns what. You leave with priorities everyone has signed up to.",
    includes: [
      "A short briefing on what AI can do for a business your size",
      "Ideas taken from your own processes",
      "Risks, data and governance covered",
      "Agreed priorities and next steps, written up afterwards",
    ],
    under: "AI strategy, use-case discovery, governance and risk, change management.",
    price: "From £950",
    duration: "Half or full day",
  },
  {
    slug: "training",
    name: "AI-native training and setup",
    what: "We set up ChatGPT, Claude or Copilot properly for your business and train your team to use it on their real work.",
    includes: [
      "Workspace setup for ChatGPT, Claude, Copilot or Gemini",
      "Data and security settings to suit your business",
      "Hands-on sessions on your team's own work",
      "Shared prompts and templates for the jobs you repeat",
    ],
    under: "Workspace and model setup, secure usage, prompt patterns, team adoption.",
    price: "From £950 a day",
    duration: "Set up in a week, sessions over 2 to 4 weeks",
  },
  {
    slug: "context-engine",
    name: "Context Engine",
    what: "We gather your proposals, call notes and customer records into one place that your team and your AI tools can ask questions of. Every answer links to where it came from.",
    includes: [
      "Documents, proposals and call notes brought into one place",
      "Connected to your CRM, so it knows your customers and deals",
      "The same access rules as your CRM",
      "Available inside Claude, ChatGPT and your other AI tools",
    ],
    under: "RAG and hybrid retrieval over documents and CRM, provenance on every answer, permissions that follow existing access, MCP access for your AI tools.",
    price: "From £5,000",
    duration: "Working on your data in days, live in 3 to 6 weeks",
  },
  {
    slug: "agentic-workflows",
    name: "Workflow automation",
    what: "We automate the repeatable work around sales and service, such as researching a company before a call or writing up the notes afterwards. Your team reviews everything before it goes out.",
    includes: [
      "Mapping who does what today, and what should move to software",
      "Research on each company before the first call, from Companies House, its website and whatever else the job needs",
      "Call summaries and follow-up drafts after it",
      "Finding companies worth calling each week",
      "Keeping the CRM up to date",
    ],
    under: "n8n orchestration, tool use, HubSpot and CRM integration, human approval gates, draft by default.",
    price: "From £1,500 per workflow",
    duration: "Each workflow live in 1 to 2 weeks",
  },
  {
    slug: "apps-dashboards",
    name: "Custom apps and dashboards",
    what: "We build the screens your team works in, such as a portal for this week's leads or a dashboard of what the system has done and what it cost.",
    includes: [
      "A portal your sales team works through each week",
      "Dashboards of what the system did and what it cost",
      "Internal tools built on your own data",
      "Sign-in by email link for your team",
    ],
    under: "React, scoped read APIs, magic-link sign-in, hosted on your own accounts.",
    price: "From £7,500",
    duration: "3 to 6 weeks",
  },
  {
    slug: "agentic-platform",
    name: "Company AI platform",
    what: "Company-wide AI on accounts you own. Your team searches and asks across the CRM, documents and email from one workspace, agents take on the repeat work, and every release is checked against questions your team has signed off.",
    includes: [
      "Search across your CRM, documents, email and drives, with every answer linked to its source",
      "One chat workspace for every team, with a choice of models including Claude, ChatGPT and Gemini",
      "Agents that do the repeat work, with your team approving what goes out",
      "Answers checked on every release against questions your team has signed off",
      "Access that follows your existing permissions, with usage and cost per person",
    ],
    under: "Enterprise search and chat: Open WebUI over the Context Engine (hybrid RAG), agents on n8n, an eval suite run per release, a model gateway, per-user access, usage and cost tracking.",
    price: "From £7,500 a phase",
    duration: "Each phase 4 to 8 weeks",
  },
  {
    slug: "support",
    name: "Managed service",
    what: "Once a system is live, we look after it. We keep it working as your tools, team and customers change, make small changes each month, and go through the numbers with you.",
    includes: [
      "Monitoring, and fixing what breaks",
      "Small changes as your business changes",
      "A monthly report and review call",
    ],
    under: "Run monitoring and alerts, error handling, usage and cost tracking, change control.",
    price: "From £1,000 a month",
    duration: "Month to month",
  },
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
  { name: "Start", slugs: ["audit", "workshop", "training"] },
  { name: "Build", slugs: ["context-engine", "agentic-workflows", "apps-dashboards", "agentic-platform"] },
  { name: "Run", slugs: ["support"] },
];

// How to start, for agents (#564): the same offer the pages make, with the
// links an agent can hand straight to its user. llms.txt and the MCP server
// both read it, so neither can drift from the site.
export const howToStart = {
  call: `Book a free 30-minute call: https://cal.com/${site.booking}`,
  scorecard: `Not sure which service fits: take the readiness scorecard at ${site.url}/scorecard (eight questions, about two minutes).`,
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
