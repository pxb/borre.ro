// Demo data for the Context Engine explainer and the workflow walk-throughs
// (#573). Same invented client as the portal demo, Kiln & Kettle Coffee
// Roasters. Every company and person is invented; company names were checked
// against the Companies House register (no match). Figures are demo figures.

// ---------------------------------------------------------------- Context Engine

export type SourceId = "deals" | "emails" | "calls" | "docs" | "canon" | "finance";

export const ceSources: { id: SourceId; name: string; from: string; restricted?: boolean }[] = [
  { id: "deals", name: "Deals and accounts", from: "CRM" },
  { id: "emails", name: "Emails", from: "CRM" },
  { id: "calls", name: "Calls and meetings", from: "CRM" },
  { id: "docs", name: "Proposals and contracts", from: "Document storage" },
  { id: "canon", name: "Approved facts", from: "Signed off by the team" },
  { id: "finance", name: "Margin and pricing notes", from: "Finance", restricted: true },
];

export const ceAsker = {
  name: "Tom Hartley",
  role: "Account Executive",
  tier: "Sales",
  canSee: "Deals, emails, calls, proposals and approved facts",
  hidden: "Margin and pricing notes are finance only",
};

export type CeQuestion = {
  id: string;
  q: string;
  kind: string; // what sort of question, in RevOps terms
  uses: SourceId[];
  answer: string;
  citations: string[];
};

export const ceQuestions: CeQuestion[] = [
  {
    id: "promise",
    q: "What did we promise Copperfield Hotel Group on the last call?",
    kind: "Account history",
    uses: ["calls", "emails", "deals"],
    answer:
      "Marco asked for a relaunch blend and barista training before the lobby bar reopens in November. Tom promised a tasting by 10 October and a quote covering all three hotels.",
    citations: ["Call with Marco Bellini, 18 September", "Email: tasting dates, 19 September", "Deal: Copperfield lobby relaunch"],
  },
  {
    id: "pipeline",
    q: "What's in the pipeline for Q4, by stage?",
    kind: "Pipeline",
    uses: ["deals"],
    answer:
      "£48k across seven open deals. Three in Discovery (£14k), two in Proposal (£21k) and two in Negotiation (£13k). The largest is the Copperfield relaunch at £12k.",
    citations: ["7 open deals closing October to December", "Pipeline stages as set in the CRM"],
  },
  {
    id: "renewals",
    q: "Which supply contracts renew before Christmas?",
    kind: "Renewals",
    uses: ["docs", "deals"],
    answer:
      "Three. Quayside Yard on 1 November, Mossbank Gym Group on 15 November and Tarnhollow Hotel on 20 December. Quayside's contract includes a price review, so start that conversation early.",
    citations: ["Supply agreement: Quayside Yard", "Supply agreement: Mossbank Gym Group", "Supply agreement: Tarnhollow Hotel"],
  },
  {
    id: "icp",
    q: "Who is our ideal customer?",
    kind: "Approved facts",
    uses: ["canon"],
    answer:
      "Workplaces and hospitality venues of 30 to 300 people in Greater Manchester, with their own café or a kitchen that gets busy. Multi-site groups first. They buy on quality and service over price.",
    citations: ["Ideal customer profile, signed off 3 September"],
  },
];

export const ceBonnet = [
  ["Hybrid RAG", "Retrieval-augmented generation that combines keyword and vector (semantic) search over documents with SQL over CRM records, so pipeline figures are counted, not guessed."],
  ["Citations and provenance", "Every answer carries the IDs of the records it used, shown as citations the reader can check."],
  ["Role-based access", "Access tiers are enforced by row-level security in the database, so a question only reaches what the asker's role allows."],
  ["Approved knowledge", "Facts the team has signed off, like the ICP and pricing rules, are held as the source of truth and repeated word for word."],
  ["Model Context Protocol (MCP)", "The same engine answers inside the team's AI assistants, and any LLM can sit behind it."],
  ["CRM sync", "Workflow automation syncs deals, companies, contacts, emails, notes, calls and meetings from the CRM every hour."],
] as const;

// ---------------------------------------------------------------- Workflows

// The systems a workflow touches.
export type SystemId =
  | "hubspot" | "outlook" | "sharepoint"
  | "companies-house" | "website" | "bcorp" | "hunter" | "linkedin" | "fireflies"
  | "context-engine" | "claude"
  | "rep";
// Each system shows on its node as a light type label, not a logo: enough to
// see what a step touches without the detail taking over (Pedro, 2026-09-24).
// Generic categories, not vendors: the demo shows the kind of system a step
// touches, in the industry's own terms (Pedro, 2026-09-24).
export const systems: Record<SystemId, { name: string; type: string }> = {
  hubspot: { name: "CRM", type: "CRM" },
  outlook: { name: "Email", type: "Email" },
  sharepoint: { name: "Document storage", type: "Docs" },
  "companies-house": { name: "Company registry", type: "API" },
  website: { name: "Company website", type: "Web" },
  bcorp: { name: "Certification directory", type: "API" },
  hunter: { name: "Email verification", type: "Enrichment" },
  linkedin: { name: "LinkedIn", type: "Enrichment" },
  fireflies: { name: "Call recorder", type: "Call recording" },
  "context-engine": { name: "Context Engine", type: "RAG" },
  claude: { name: "LLM", type: "LLM" },
  rep: { name: "The rep", type: "Human in the loop" },
};
export type Touch = { sys: SystemId; mode: "read" | "write" | "ai" | "approve" };

export type FlowNode = {
  id: string;
  title: string;
  system: string;
  touches: Touch[];
  found: string; // what the step produced in this run
  gate?: boolean; // the run stops here until the visitor approves
};

export type FlowRun = {
  id: string;
  subject: string; // the lead or deal being run through
  nodes: FlowNode[];
  done: string;
};

export const leadEnrichmentRun: FlowRun = {
  id: "lead-enrichment",
  subject: "New lead: Sophie Lang, Studio Manager at Orrin Architects",
  nodes: [
    {
      id: "trigger",
      title: "New lead in the CRM",
      system: "CRM · Email",
      touches: [{ sys: "outlook", mode: "read" }, { sys: "hubspot", mode: "read" }],
      found: "Sophie Lang, Studio Manager at Orrin Architects, logged from the inbox at 09:12.",
    },
    {
      id: "match",
      title: "Match the company",
      system: "Company registry",
      touches: [{ sys: "companies-house", mode: "read" }],
      found: "Orrin Architects, active since 2011. One trading entity, no parent group.",
    },
    {
      id: "research",
      title: "Ownership, filings and signals",
      system: "Company registry · website · certifications",
      touches: [{ sys: "companies-house", mode: "read" }, { sys: "website", mode: "read" }, { sys: "bcorp", mode: "read" }, { sys: "claude", mode: "ai" }],
      found: "Two directors. Six roles advertised this month. Not B Corp certified; a carbon-reduction pledge on the website.",
    },
    {
      id: "qualify",
      title: "Qualify against the ICP",
      system: "Context Engine · LLM",
      touches: [{ sys: "context-engine", mode: "read" }, { sys: "claude", mode: "ai" }],
      found: "Fit 3.8 out of 5. Design studio of about 40 staff with weekly client reviews, five minutes from the roastery.",
    },
    {
      id: "contact",
      title: "Check the contact",
      system: "Data enrichment",
      touches: [{ sys: "hunter", mode: "read" }, { sys: "linkedin", mode: "read" }],
      found: "Email deliverable. Still in the role, per LinkedIn and the company website.",
    },
    {
      id: "note",
      title: "Write the research note",
      system: "CRM",
      touches: [{ sys: "hubspot", mode: "write" }, { sys: "context-engine", mode: "write" }],
      found: "Research note on Sophie's contact with eight linked sources, ready at 09:21.",
    },
  ],
  done: "Brief on the contact before the first call.",
};

export const postCallRun: FlowRun = {
  id: "post-call",
  subject: "Discovery call: Copperfield Hotel Group",
  nodes: [
    {
      id: "stage",
      title: "Deal moves stage",
      system: "CRM",
      touches: [{ sys: "hubspot", mode: "read" }],
      found: "Copperfield lobby relaunch moved from Discovery and Qualification to Needs Analysis at 14:40.",
    },
    {
      id: "transcript",
      title: "Fetch the call transcript",
      system: "Conversation intelligence",
      touches: [{ sys: "fireflies", mode: "read" }, { sys: "hubspot", mode: "read" }],
      found: "42-minute call with Marco Bellini, matched to the right deal and contact.",
    },
    {
      id: "history",
      title: "Pull the account history",
      system: "Context Engine",
      touches: [{ sys: "context-engine", mode: "read" }],
      found: "Two earlier calls, the June tasting notes and the three-hotel quote.",
    },
    {
      id: "draft",
      title: "Draft the outputs",
      system: "LLM",
      touches: [{ sys: "claude", mode: "ai" }, { sys: "context-engine", mode: "read" }],
      found: "Commercial note, follow-up in Tom's voice, a brief for the roasting team and three proposed CRM updates.",
    },
    {
      id: "approve",
      title: "Rep approves",
      system: "Human in the loop",
      touches: [{ sys: "rep", mode: "approve" }],
      found: "Tom read the drafts, changed one line in the follow-up and approved.",
      gate: true,
    },
    {
      id: "handoff",
      title: "Handoff",
      system: "Email · document storage · CRM",
      touches: [{ sys: "outlook", mode: "write" }, { sys: "sharepoint", mode: "write" }, { sys: "hubspot", mode: "write" }],
      found: "Follow-up saved as an email draft, project folder created in document storage, notes and next steps written to the deal.",
    },
  ],
  done: "Follow-up ready while the call is still fresh.",
};
