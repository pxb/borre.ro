// Demo data for the Context Engine explainer and the workflow walk-throughs
// (#573). Same invented client as the portal demo, Kiln & Kettle Coffee
// Roasters. Every company and person is invented; company names were checked
// against the Companies House register (no match). Figures are demo figures.

// ---------------------------------------------------------------- Context Engine

export type SourceId = "deals" | "emails" | "calls" | "docs" | "canon" | "finance";

export const ceSources: { id: SourceId; name: string; from: string; restricted?: boolean }[] = [
  { id: "deals", name: "Deals and accounts", from: "HubSpot" },
  { id: "emails", name: "Emails", from: "HubSpot" },
  { id: "calls", name: "Calls and meetings", from: "HubSpot" },
  { id: "docs", name: "Proposals and contracts", from: "Documents" },
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
    citations: ["7 open deals closing October to December", "Pipeline stages as set in HubSpot"],
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
  ["Hybrid retrieval", "Keyword and vector search over documents, and SQL over CRM records for pipeline and account questions, so numbers are counted, not guessed."],
  ["Provenance", "Every answer carries the IDs of the records it used, shown as citations."],
  ["Row-level security", "Access tiers are enforced in the database itself, so a question can only reach what the asker's role allows."],
  ["Canon", "Facts the team has approved, like the ICP and pricing rules, are stored separately and repeated word for word."],
  ["MCP server", "The same engine answers inside Claude and other AI tools through the Model Context Protocol."],
  ["Hourly sync", "n8n workflows pull HubSpot deals, companies, contacts, emails, notes, calls and meetings every hour."],
] as const;

// ---------------------------------------------------------------- Workflows

export type FlowNode = {
  id: string;
  title: string;
  system: string;
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
      title: "New lead in HubSpot",
      system: "HubSpot · Outlook",
      found: "Sophie Lang, Studio Manager at Orrin Architects, logged from Outlook at 09:12.",
    },
    {
      id: "match",
      title: "Match the company",
      system: "Companies House",
      found: "Orrin Architects, active since 2011. One trading entity, no parent group.",
    },
    {
      id: "research",
      title: "Ownership, filings and signals",
      system: "Companies House · website · B Corp directory",
      found: "Two directors. Six roles advertised this month. Not B Corp certified; a carbon-reduction pledge on the website.",
    },
    {
      id: "qualify",
      title: "Qualify against the ICP",
      system: "Context Engine",
      found: "Fit 3.8 out of 5. Design studio of about 40 staff with weekly client reviews, five minutes from the roastery.",
    },
    {
      id: "contact",
      title: "Check the contact",
      system: "Hunter · LinkedIn",
      found: "Email deliverable. Still in the role, per LinkedIn and the company website.",
    },
    {
      id: "note",
      title: "Write the research note",
      system: "HubSpot",
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
      system: "HubSpot",
      found: "Copperfield lobby relaunch moved from Discovery and Qualification to Needs Analysis at 14:40.",
    },
    {
      id: "transcript",
      title: "Fetch the call transcript",
      system: "Fireflies",
      found: "42-minute call with Marco Bellini, matched to the right deal and contact.",
    },
    {
      id: "history",
      title: "Pull the account history",
      system: "Context Engine",
      found: "Two earlier calls, the June tasting notes and the three-hotel quote.",
    },
    {
      id: "draft",
      title: "Draft the outputs",
      system: "Claude",
      found: "Commercial note, follow-up in Tom's voice, a brief for the roasting team and three proposed CRM updates.",
    },
    {
      id: "approve",
      title: "Rep approves",
      system: "Tom Hartley",
      found: "Tom read the drafts, changed one line in the follow-up and approved.",
      gate: true,
    },
    {
      id: "handoff",
      title: "Handoff",
      system: "Outlook · SharePoint · HubSpot",
      found: "Follow-up saved as an Outlook draft, project folder created in SharePoint, notes and next steps written to the deal.",
    },
  ],
  done: "Follow-up ready while the call is still fresh.",
};
