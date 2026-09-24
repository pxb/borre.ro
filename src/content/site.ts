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
      "HubSpot held the deals, but the account history that mattered was spread across emails, call notes, meeting records, proposals and a few people's heads.",
      "Answering a simple question, like which accounts had gone quiet or what was promised on a call six months ago, meant finding the one person who remembered. The team's AI tools could see none of it.",
    ],
    drawsOn: [
      "HubSpot deals, companies and contacts",
      "Emails, notes, calls, meetings and tasks from HubSpot",
      "Proposals and documents",
      "Facts the team has signed off as correct",
    ],
    does: [
      "Syncs HubSpot every hour: deals, companies, contacts, emails, notes, calls, meetings and tasks",
      "Reads proposals and documents and indexes them alongside the CRM data",
      "Answers questions about accounts, deals and pipeline in plain language, using retrieval-augmented generation (RAG) that cites the record behind every answer",
      "Holds the facts the team has signed off, like the ideal customer profile, and repeats only those",
      "Follows the access rules the business agreed, so each person sees what their role allows",
      "Works inside Claude and the company's other AI tools, and feeds the prospecting and follow-up workflows",
    ],
    journey: [
      "It started as a proof of concept on the client's own data, built in a day. From there we added the hourly CRM sync, the access tiers the client signed off and a governed connector, so the team use it straight from Claude.",
      "It's the backbone for everything else we built. The prospecting pipeline reads its ICP and writes every brief back to it, and the follow-up workflow draws on its account history.",
    ],
    metrics: [
      { value: "One question", label: "for full pipeline visibility, every figure traced to its deal in the CRM" },
      { value: "1 day", label: "from the client's own data to a working proof of concept" },
      { value: "Hourly", label: "CRM sync, so every answer reflects the current pipeline" },
    ],
    involved: [
      "Your team decides what material it can rely on, and approves anything it drafts before it's used.",
    ],
    stack: ["HubSpot", "Proposals and documents", "Claude"],
    tech: ["Hybrid RAG", "Postgres with pgvector", "Row-level security", "MCP server", "n8n", "Document parsing"],
    services: ["context-engine"],
  },
  {
    slug: "prospecting-loop",
    title: "Outbound prospecting",
    tagline: "A researched list of target accounts every week, built from the whole market and the deals already won.",
    problem: [
      "The sales team had years of won deals in HubSpot and a territory of thousands of companies, with nothing connecting the two. The ideal customer profile lived in people's heads.",
      "Prospect lists were bought or built by hand, reps spent their week researching instead of selling, and first calls opened with nothing specific to say.",
    ],
    drawsOn: [
      "Won deals and existing customers in HubSpot",
      "Every active company in the territory, from Companies House",
      "Buying signals from job boards, filings and company websites",
      "The sales lead's feedback on every batch",
    ],
    does: [
      "Maps the TAM: every active company in the territory, straight from Companies House",
      "Builds the ICP from won deals and scores every company against it",
      "Holds back existing customers and open deals before anything reaches the pipeline",
      "Watches for buying signals, like hiring, a new site, fresh investment or a move to new premises",
      "Each shortlisted account gets a researched brief with the evidence, checked contacts and a four-email sequence written in the rep's own voice",
      "Delivers the week's leads to a portal where the rep reviews, sends and logs replies and meetings",
    ],
    journey: [
      "The Context Engine is what makes it work. The ICP, the full candidate pool, every brief with its sources and the status of every lead sit in one place, alongside the CRM data, so the research, the portal and the sales team all work from the same record.",
      "We built it in stages with the client's sales lead: a pilot of hand-picked accounts, then weekly research packs, then the live portal. Each round of feedback sharpened the profile. Multi-site groups rank above single sites, a recent investment is a must-have, an ESG commitment counts in a company's favour and businesses in financial distress are screened out.",
    ],
    metrics: [
      { value: "Weekly", label: "new researched leads in the pipeline, sized to the team and market" },
      { value: "~1 hour", label: "of account research behind every lead, done before the rep starts" },
      { value: "£0", label: "paid data per lead in the weekly runs, from public registers and free tiers" },
    ],
    involved: [
      "The rep stays the human in the loop: they read every brief, send from their own inbox and log the outcome. Contact details for the very smallest firms still need a person to find them.",
    ],
    stack: ["HubSpot", "Companies House", "Hunter", "Apollo", "Job boards", "Company websites"],
    tech: ["Context Engine", "n8n", "React web app", "Edge functions", "Magic-link sign-in"],
    services: ["agentic-workflows", "apps-dashboards"],
  },
  {
    slug: "lead-research",
    title: "Inbound lead enrichment",
    tagline: "Log a new lead in HubSpot and the rep has a researched brief on the contact before the first call.",
    problem: [
      "Every new enquiry meant someone digging through Companies House, the company website and LinkedIn before they could have a sensible first conversation.",
      "Much of it was out of date by the time it was used, and it rarely made it back into HubSpot.",
    ],
    drawsOn: ["Companies House filings and officers", "The company's own website", "Group and ownership structure", "The B Corp directory"],
    does: [
      "Picks up each new lead logged in HubSpot, including the ones added from Outlook",
      "Works out which company it is from Companies House, including which entity in a group",
      "Pulls ownership, directors and filings, plus buying signals and ESG commitments from the company's website and the B Corp directory",
      "Qualifies the lead against the ICP and checks the contact two ways: the email works and the person is still in the role",
      "Writes a research note onto the contact in HubSpot, with a source link on every claim",
    ],
    journey: [
      "The first version went live in August, checking HubSpot every ten minutes and writing research notes onto new contacts. The second version, now in testing, adds deeper buying signals and B Corp checks, and runs on free sources by default, calling paid research only where the free ones come up short.",
    ],
    metrics: [
      { value: "20 to 40 min", label: "of rep time saved on every inbound lead, estimated" },
      { value: "~10 min", label: "from a lead being logged to a researched brief on the contact" },
    ],
    involved: [
      "Everything the AI suggests is checked against an official record before it reaches anyone, and the rep reads the note before the first call.",
    ],
    stack: ["HubSpot", "Outlook", "Companies House", "Company websites", "B Corp directory", "Hunter"],
    tech: ["n8n", "LLM with source verification", "Web extraction", "Context Engine"],
    services: ["agentic-workflows"],
  },
  {
    resultsProven: false,
    slug: "post-call",
    title: "Post-call follow-up and handoff",
    tagline: "When a discovery call moves the deal forward, the follow-up, the notes and the handoff are ready for review.",
    problem: [
      "Good discovery calls were going cold while the follow-up waited for someone to have time to write it, and the notes rarely made it into HubSpot.",
      "The client wanted the follow-up out within twenty minutes of the call, with the notes in the CRM and a brief to the design team, every time.",
    ],
    drawsOn: ["The Fireflies call transcript", "The HubSpot deal and contact", "Account history from the Context Engine", "How the rep writes"],
    does: [
      "Starts when a deal moves out of Discovery and Qualification in HubSpot, so the stage change the rep already makes is the trigger",
      "Reads the call transcript from Fireflies and matches it to the right contact and deal, setting aside anything ambiguous",
      "Pulls the account history from the Context Engine",
      "Produces four things for review: a commercial note, a follow-up draft in the rep's voice, a brief for the design team and the CRM updates it proposes",
      "Lines up the Outlook draft, the SharePoint project folder and the HubSpot updates, and waits for the rep's approval before any of them happen",
    ],
    journey: [
      "We made the stage change the trigger rather than adding a new field, because the rep already moves the deal. A field would be one more thing to remember and forget.",
      "It has been tested end to end on a real discovery call, with nothing written to the CRM until the client signs off.",
    ],
    metrics: [
      { value: "20 min", label: "the client's target from call to follow-up, which it's built to hit" },
      { value: "4 jobs", label: "prepared for the rep after each discovery call: the email, the CRM notes, the project folder and the team brief" },
    ],
    involved: [
      "The rep is the human in the loop: they check the drafts and send the follow-up themselves.",
    ],
    stack: ["Fireflies", "HubSpot", "Outlook", "SharePoint"],
    tech: ["n8n", "LLM", "Context Engine", "Human-in-the-loop approval"],
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
