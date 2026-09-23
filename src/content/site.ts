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
  stack: string[];
  services: string[]; // the ServiceCategories that deliver it, so the two cannot drift
  // A real client quote only, with permission. Never invented (#562).
  testimonial?: { quote: string; name: string; role: string };
};

export const work: CaseStudy[] = [
  {
    slug: "context-engine",
    title: "Context Engine",
    tagline: "One place your team can ask about any customer, deal or past conversation.",
    problem: [
      "The CRM had the deals, but everything else that mattered was in call recordings, old proposals, email threads and a few people's heads.",
      "Answering a simple question, like which customers had gone quiet or what was promised on a call six months ago, meant finding the one person who remembered.",
    ],
    drawsOn: [
      "Documents and proposals",
      "Call recordings and meeting notes",
      "Customer, deal and contact records",
      "Facts the team has signed off as correct",
    ],
    does: [
      "Answers questions about customers and deals in plain language",
      "Shows where every answer came from, so it can be checked",
      "Learns more as the team adds to it",
      "Repeats only what someone on the team has signed off as correct",
    ],
    metrics: [
      { value: "~£900k", label: "of pipeline surfaced from one question" },
      { value: "1 day", label: "from their data to a working demo" },
    ],
    involved: [
      "Your team decides what material it can rely on, and approves anything it drafts before it's used.",
    ],
    stack: ["HubSpot", "Claude", "Postgres", "n8n"],
    services: ["context-engine"],
  },
  {
    slug: "prospecting-loop",
    title: "Finding customers worth calling",
    tagline: "A short list each week of local companies worth phoning, with a reason to call each one.",
    problem: [
      "A bought list gave the team thousands of local company names without any reason to call one of them today.",
      "The sales team spent their week researching, and still opened calls with nothing specific to say.",
    ],
    drawsOn: [
      "What a good customer has looked like before",
      "Deals already won, and why they were won",
      "The area being covered",
      "The pitch that works for each type of business",
    ],
    does: [
      "Builds the full list of companies in the area from the official register",
      "Cuts it to the ones that fit on size and type",
      "Watches for the ones that just did something worth calling about",
      "Researches those and writes the reason to call, with the evidence attached",
    ],
    metrics: [
      { value: "A short list", label: "each week, sized to your team and market" },
      { value: "Minutes", label: "of research per lead" },
    ],
    involved: [
      "Your team writes the email and makes the call, working from the brief it prepares.",
      "Contact details for the very smallest firms still need a person to find them.",
    ],
    stack: ["Companies House", "HubSpot", "Postgres", "n8n", "React"],
    services: ["agentic-workflows", "apps-dashboards"],
  },
  {
    slug: "lead-research",
    title: "Lead research",
    tagline: "Give it a company name and your salesperson has a researched brief before the call.",
    problem: [
      "Every new enquiry meant someone digging through Companies House, the company website and LinkedIn before they could have a sensible conversation.",
      "Much of it was out of date by the time it was used, and it was rarely written down anywhere useful.",
    ],
    drawsOn: ["Official company records", "The company's own website", "Group and ownership structure"],
    does: [
      "Works out which company you mean, including which one in a group",
      "Pulls who owns it, who runs it and what they have been doing",
      "Puts a link next to every claim so it can be checked",
      "Writes it up as a note, ready for the call",
    ],
    metrics: [
      { value: "20 to 40 min", label: "of manual research saved per lead, estimated" },
      { value: "Every claim", label: "carries a source link" },
      { value: "2 checks", label: "before any contact is used" },
    ],
    involved: [
      "Everything the AI suggests is checked against an official record before it reaches anyone.",
      "Each contact is checked to make sure the email address works and the person is still in the role.",
    ],
    stack: ["HubSpot", "Companies House", "n8n"],
    services: ["agentic-workflows"],
  },
  {
    slug: "post-call",
    title: "Post-call follow-up",
    tagline: "The follow-up is ready while the call is still fresh.",
    problem: [
      "Good calls were going cold while the follow-up waited for someone to have time to write it, and the notes rarely made it into the CRM.",
    ],
    drawsOn: ["The call recording", "What was agreed on the call", "How the team writes"],
    does: [
      "Reads the call and pulls out what was agreed and what happens next",
      "Drafts the follow-up email in the team's own voice",
      "Prepares the call notes and next steps for the CRM",
      "Puts all of it in front of the team to review",
    ],
    metrics: [
      { value: "Every call", label: "gets a summary, a drafted email and an action list, ready to review" },
    ],
    involved: [
      "Your team checks the draft and sends it themselves.",
    ],
    stack: ["HubSpot", "Fireflies", "Claude", "n8n"],
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
