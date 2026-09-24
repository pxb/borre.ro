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
    "You pay for {n} AI tools and your team still does the work by hand.",
    "{N} AI tools, and your team still copies and pastes between them.",
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
  // No public email until pedro@borre.ro works (Google Workspace, Pedro's to-do).
  // Empty hides every email link; the calendar is the way in meanwhile.
  email: "",
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

export const work: CaseStudy[] = [
  {
    slug: "context-engine",
    title: "Context Engine",
    tagline: "The company's knowledge in one place, so the sales team and their AI tools can ask about any account, deal or past conversation.",
    problem: [
      "HubSpot held the deals, but the account history was spread across emails, call notes, proposals and a few people's heads. Simple questions meant finding the one person who remembered.",
    ],
    drawsOn: [
      "HubSpot deals, companies and contacts",
      "Emails, notes, calls, meetings and tasks from HubSpot",
      "Proposals and documents",
      "Facts the team has signed off as correct",
    ],
    does: [
      "Syncs the CRM every hour and indexes proposals and documents alongside it",
      "Answers account, deal and pipeline questions in plain language, using RAG that cites the record behind every answer",
      "Repeats only facts the team has signed off, like the ideal customer profile",
      "Follows the access rules the business agreed, inside the team's AI assistants",
    ],
    journey: [
      "Built as a proof of concept on the client's own data in a day, it now sits behind the prospecting and follow-up workflows as their shared record.",
    ],
    metrics: [
      { value: "100%", label: "of the open pipeline visible in one answer, every figure traced to its deal in the CRM" },
      { value: "1 day", label: "from the client's own data to a working proof of concept" },
      { value: "8", label: "CRM record types synced every hour, from deals to call notes" },
    ],
    involved: [
      "The team decides what it can rely on and approves anything it drafts.",
    ],
    stack: ["HubSpot", "Proposals and documents", "AI assistants"],
    tech: ["Hybrid RAG", "Vector database", "Row-level security", "MCP", "Workflow automation", "Document parsing"],
    services: ["context-engine"],
  },
  {
    slug: "prospecting-loop",
    title: "Outbound prospecting",
    tagline: "A researched list of target accounts every week, built from the whole market and the deals already won.",
    problem: [
      "Years of won deals sat in HubSpot with nothing connecting them to the thousands of companies in the territory. Reps built lists by hand and opened calls with nothing specific to say.",
    ],
    drawsOn: [
      "Won deals and existing customers in HubSpot",
      "Every active company in the territory, from Companies House",
      "Buying signals from job boards, filings and company websites",
      "The sales lead's feedback on every batch",
    ],
    does: [
      "Maps the TAM: every active company in the territory",
      "Scores each one against an ICP built from won deals, holding back existing customers and open deals",
      "Watches for buying signals like hiring, fresh investment or a move to new premises",
      "Delivers researched briefs, checked contacts and a four-email sequence to the rep's portal each week",
    ],
    journey: [
      "Built in stages with the client's sales lead, from a pilot of hand-picked accounts to the live portal. Each round of feedback sharpened the profile: multi-site groups first, a recent investment required, businesses in financial distress screened out.",
    ],
    metrics: [
      { value: "~1 hour", label: "of account research done for the rep on every lead" },
      { value: "6", label: "buying signals watched across the whole territory, from hiring to new premises" },
    ],
    involved: [
      "The rep stays the human in the loop, sending from their own inbox and logging the outcome.",
    ],
    stack: ["HubSpot", "Companies House", "Job boards", "Company websites", "Data enrichment", "Email verification"],
    tech: ["Context Engine", "Workflow automation", "Web app", "Serverless API", "Passwordless sign-in"],
    services: ["agentic-workflows", "apps-dashboards"],
  },
  {
    slug: "lead-research",
    title: "Inbound lead enrichment",
    tagline: "Log a new lead in HubSpot and the rep has a researched brief on the contact before the first call.",
    problem: [
      "Every new enquiry meant half an hour in Companies House, the company website and LinkedIn before a sensible first conversation, and the findings rarely made it back into HubSpot.",
    ],
    drawsOn: ["Companies House filings and officers", "The company's own website", "Group and ownership structure", "Certification directories"],
    does: [
      "Picks up each new lead logged in HubSpot, including from Outlook",
      "Matches the right company, including the right entity in a group",
      "Pulls ownership, filings, buying signals and ESG commitments, and checks the contact is current",
      "Writes a research note onto the contact, with a source link on every claim",
    ],
    journey: [
      "Live since August, checking for new leads every ten minutes. The second version adds deeper buying signals and uses paid research only where free sources come up short.",
    ],
    metrics: [
      { value: "20 to 40 min", label: "of rep time saved on every inbound lead, estimated" },
      { value: "~10 min", label: "from a lead being logged to a researched brief on the contact" },
    ],
    involved: [
      "Everything the AI suggests is checked against an official record before the rep sees it.",
    ],
    stack: ["HubSpot", "Outlook", "Companies House", "Company websites", "Certification directories", "Email verification"],
    tech: ["Workflow automation", "LLM with source verification", "Web extraction", "Context Engine"],
    services: ["agentic-workflows"],
  },
  {
    resultsProven: false,
    slug: "post-call",
    title: "Post-call follow-up and handoff",
    tagline: "When a discovery call moves the deal forward, the follow-up, the notes and the handoff are ready for review.",
    problem: [
      "Good discovery calls went cold while the follow-up waited to be written. The client wanted it out within twenty minutes, with the notes in the CRM and a brief to the design team.",
    ],
    drawsOn: ["The call transcript", "The HubSpot deal and contact", "Account history from the Context Engine", "How the rep writes"],
    does: [
      "Starts when a deal moves out of Discovery and Qualification, the stage change the rep already makes",
      "Matches the call transcript to the right contact and deal, and pulls the account history",
      "Drafts the follow-up in the rep's voice, the CRM notes and a brief for the design team",
      "Waits for the rep's approval before sending anything or updating the CRM",
    ],
    journey: [
      "Tested end to end on a real discovery call, with nothing written to the CRM until the client signs off.",
    ],
    metrics: [
      { value: "20 min", label: "the client's target from call to follow-up, which it's built to hit" },
      { value: "4 jobs", label: "prepared for the rep after each discovery call: the email, the CRM notes, the project folder and the team brief" },
    ],
    involved: [
      "The rep is the human in the loop and sends the follow-up themselves.",
    ],
    stack: ["HubSpot", "Outlook", "Call recorder", "Document storage"],
    tech: ["Workflow automation", "LLM", "Context Engine", "Human-in-the-loop approval"],
    services: ["agentic-workflows"],
  },
];


// Public evidence for the opening claim. Each source was fetched and checked (#565).
export const evidence = [
  {
    stat: "35%",
    claim: "of UK businesses say the biggest barrier to using AI is not having the expertise",
    source: "ANS and YouGov, via techUK, 2025",
    href: "https://www.techuk.org/resource/major-barriers-to-ai-adoption-remain-for-uk-businesses-despite-growing-demand-new-report-reveals.html",
  },
  {
    stat: "40%",
    claim: "of AI agent projects are expected to be cancelled by 2027, over unclear business value",
    source: "Gartner",
    href: "https://www.gartner.com/en/articles/context-engineering",
  },
];

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
  {
    title: "Running it",
    body: "From £1,000 a month once it's built, month to month. Fixes, changes and a monthly report are included.",
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
    "We start by finding the work worth handing over, then build it on the tools you already have and keep it running.",
    "Everything runs on accounts in your name. Client work is delivered with our partner practice, Amplify My AI.",
  ],
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
    slug: "training",
    name: "AI-native training and setup",
    what: "We set up ChatGPT, Claude or Copilot properly for your business and train your team to use it on their real work.",
    includes: [
      "Workspace setup for ChatGPT, Claude, Copilot or Gemini",
      "Data and security settings that suit your business",
      "Hands-on sessions built around your team's own work",
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
      "Access that follows who can see what today",
      "Available inside Claude, ChatGPT and your other AI tools",
    ],
    under: "RAG and hybrid retrieval over documents and CRM, provenance on every answer, permissions that follow existing access, MCP access for your AI tools.",
    price: "From £5,000",
    duration: "Working on your data in days, live in 3 to 6 weeks",
  },
  {
    slug: "agentic-workflows",
    name: "Agentic workflows",
    what: "We automate the repeatable work around sales and service, such as researching a company before a call or writing up the notes afterwards. Your team reviews everything before it goes out.",
    includes: [
      "Mapping who does what today, and what should move to software",
      "Research on a company before the first call",
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
    name: "Full agentic platform",
    what: "We set up a private AI workspace for the whole team, connected to your business knowledge and tools and running on accounts you own.",
    includes: [
      "One chat workspace for the whole team",
      "A choice of models, including Claude, ChatGPT, Gemini and Grok",
      "Connected to the Context Engine and your everyday tools",
      "Per-person access, with usage and cost you can see",
    ],
    under: "Open WebUI with RAG over the Context Engine, model gateway, per-user access, usage and cost tracking.",
    price: "From £7,500",
    duration: "4 to 8 weeks",
  },
];

export const serviceFor = (slug: string) => serviceCategories.find((s) => s.slug === slug);
export const proofFor = (slug: string) => work.filter((w) => w.services.includes(slug));
