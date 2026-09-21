export const site = {
  name: "Pedro Borrero",
  domain: "borre.ro",
  url: "https://borre.ro",
  role: "AI for Humans",
  headlineBefore: "You have",
  headlineCounts: ["five", "seven", "three", "nine", "twelve", "more"],
  headlineAfter: "AI tools. None of them talk to each other.",
  headline: "You have five AI tools. None of them talk to each other.",
  summary:
    "We connect the AI a business already pays for, build the part that is missing, and run it. The research before the call, the follow-up after it, the record of what the company knows. Your people stay in charge.",
  email: "pedro@borre.ro",
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
  limits: string[];
  stack: string[];
};

export const work: CaseStudy[] = [
  {
    slug: "context-engine",
    title: "Context Engine",
    tagline: "Your CRM knows your deals. It does not know your business.",
    problem: [
      "The CRM held the deals. Everything that mattered sat somewhere else: call recordings, old proposals, email threads, and a few people's heads.",
      "Nobody could answer a simple question like which customers had gone quiet, or what had been promised on a call six months ago, without asking the one person who remembered.",
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
      "Remembers what it has been told and improves as it is used",
      "Only repeats facts a human has approved, so it does not drift",
    ],
    metrics: [
      { value: "~£900k", label: "of pipeline surfaced from one question" },
      { value: "1 day", label: "from their data to a working demo" },
      { value: "Next day", label: "the deal closed" },
    ],
    limits: [
      "It answers and drafts. It does not act on its own.",
      "It is only as good as the material it is given, which is why someone has to curate it.",
    ],
    stack: ["Postgres", "n8n", "HubSpot", "Claude"],
  },
  {
    slug: "prospecting-loop",
    title: "Prospecting Loop",
    tagline: "From 86,000 companies to 17 worth phoning.",
    problem: [
      "Buying a list of local companies gets you thousands of names and no reason to call any of them today.",
      "The reps were spending their week researching instead of selling, and still opening calls with nothing to say.",
    ],
    drawsOn: [
      "What a good customer has looked like before",
      "Deals already won, and why they were won",
      "The area being covered",
      "The pitch that works for each type of business",
    ],
    does: [
      "Builds the full list of companies in the area",
      "Cuts it to the ones that actually fit on size and type",
      "Watches for the ones that just did something worth calling about",
      "Researches those, and writes the reason to call with the evidence attached",
    ],
    metrics: [
      { value: "17", label: "researched leads a week, with evidence" },
      { value: "~86,000", label: "companies narrowed automatically" },
      { value: "Minutes", label: "of research per lead, not an hour" },
    ],
    limits: [
      "Around 15 to 17 a week is the honest ceiling. More needs a second signal, not a wider map.",
      "Contact details for the very smallest firms are still a wall.",
      "It writes the brief. A human writes the email and makes the call.",
    ],
    stack: ["Companies House", "Postgres", "n8n", "React"],
  },
  {
    slug: "lead-research",
    title: "Lead Research",
    tagline: "A name in, a briefed salesperson out.",
    problem: [
      "Every new enquiry meant half an hour of someone digging through Companies House, the company website and LinkedIn before they could have a sensible conversation.",
      "Half of it was wrong by the time it was used, and none of it was written down anywhere useful.",
    ],
    drawsOn: [
      "Official company records",
      "The company's own website",
      "Group and ownership structure",
    ],
    does: [
      "Works out which company you actually mean, including which one in a group",
      "Pulls who owns it, who runs it and what they have been doing",
      "Puts a link next to every claim so it can be checked",
      "Writes it into the CRM as a note, ready for the call",
    ],
    metrics: [
      { value: "30 to 60 min", label: "of manual research removed per lead" },
      { value: "Every claim", label: "carries a source link" },
      { value: "2 checks", label: "before any contact is used" },
    ],
    limits: [
      "Anything the model suggests is checked against an official source, or it does not ship.",
      "Contacts are verified twice: that the address works, and that the person is still in the role.",
    ],
    stack: ["Companies House", "n8n", "HubSpot"],
  },
  {
    slug: "post-call",
    title: "Post-call Follow-up",
    tagline: "The follow-up writes itself, then waits for a human.",
    problem: [
      "Good calls were going cold because the follow-up took two days to write, and the notes never made it into the CRM at all.",
    ],
    drawsOn: ["The call recording", "What was agreed on the call", "How the team writes"],
    does: [
      "Reads the call and pulls out what was agreed and what happens next",
      "Drafts the follow-up email in the team's own voice",
      "Writes the notes and the next steps into the CRM",
      "Puts all of it in front of a human before anything moves",
    ],
    metrics: [
      { value: "Minutes", label: "to a drafted follow-up, not days" },
      { value: "0", label: "emails sent without a human" },
    ],
    limits: [
      "It drafts. It never sends. That is deliberate, and it is the reason people trust it.",
    ],
    stack: ["Fireflies", "n8n", "HubSpot", "Claude"],
  },
];

export const funnel = [
  { label: "Companies in the area", value: 86000, approx: true, note: "Every active company in the patch, straight from the official register." },
  { label: "Trading from real premises", value: 50000, approx: true, note: "Drops the ones registered at an accountant's address rather than a real one." },
  { label: "Hiring a salesperson now", value: 270, approx: true, note: "A company advertising a sales role has just published its budget and its intent." },
  { label: "Right size and type", value: 150, approx: true, note: "Matched back to the profile of customers already won." },
  { label: "Researched and worth phoning", value: 17, approx: false, note: "Each one with a reason to call and the evidence behind it." },
];

export const paradigm = {
  title: "AI³",
  subtitle: "Context × Agents × Evals",
  lead:
    "Three things, multiplied rather than added. Any one on its own disappoints, which is why most AI spend disappoints. They only pay together.",
  parts: [
    {
      term: "Context",
      plain: "What your business knows",
      body: "The proposals, the calls, the decisions, the things only two people remember. Gathered in one place you own, so it can be used rather than searched for.",
    },
    {
      term: "Agents",
      plain: "Software that does the work",
      body: "Not a chatbot someone has to prompt. Software that researches the company before the call, writes the follow-up after it, and keeps the records straight. Your team reviews and sends.",
    },
    {
      term: "Evals",
      plain: "Proof it worked",
      body: "Every system is measured against what it was supposed to do, and reported monthly in your numbers. This is the part most AI projects skip, and the reason so many of them get quietly switched off.",
    },
  ],
};

export const fears = {
  title: "What people tell us",
  close:
    "None of this is unusual, and none of it needs a big programme to fix. It starts with working out where this would actually pay.",
  cta: "Book a free 30-minute review",
  items: [
    {
      fear: "We do not know where it would even help.",
      answer: "A named list of where it pays in your business, with the numbers. Or an honest no.",
      stat: "25%",
      note: "of UK businesses are unsure of the return on investment",
      href: "https://www.techuk.org/resource/major-barriers-to-ai-adoption-remain-for-uk-businesses-despite-growing-demand-new-report-reveals.html",
    },
    {
      fear: "We have five AI tools and none of them talk.",
      answer: "One place that knows the business, connected to the tools you already own.",
      stat: "78%",
      note: "of organisations say they are struggling to connect AI to the systems they already run (Zapier, October 2025)",
      href: "https://zapier.com/blog/ai-resistance-survey/",
    },
    {
      fear: "We got burned by the bill.",
      answer: "Your accounts, your caps, costs visible. No bundled usage and no markup on what you use.",
      stat: "47%",
      note: "of organisations spent more on AI than they had budgeted (Futurum Group, September 2026)",
      href: "https://futurumgroup.com/press-release/46-9-of-enterprises-report-ai-spend-over-budget-in-2h-2026/",
    },
    {
      fear: "Nobody here knows how.",
      answer: "We run it, and train your people to direct it rather than be replaced by it.",
      stat: "27%",
      note: "of small businesses name lack of expertise as the barrier",
      href: "https://www.techuk.org/resource/major-barriers-to-ai-adoption-remain-for-uk-businesses-despite-growing-demand-new-report-reveals.html",
    },
  ],
};


// Public evidence for the opening claim. Both are cited on the site.
export const evidence = [
  {
    stat: "35%",
    claim: "of UK businesses say the biggest barrier to using AI is not having the expertise",
    source: "ANS and YouGov, via techUK, 2025",
    href: "https://www.techuk.org/resource/major-barriers-to-ai-adoption-remain-for-uk-businesses-despite-growing-demand-new-report-reveals.html",
  },
  {
    stat: "40%",
    claim: "of agentic AI projects are expected to be cancelled by 2027, on unclear business value",
    source: "Gartner",
    href: "https://www.gartner.com/en/articles/context-engineering",
  },
];

export type Solution = {
  slug: string;
  name: string;
  what: string;
  forWho: string;
  price: string;
};

export const solutions: Solution[] = [
  {
    slug: "audit",
    name: "Where AI actually pays",
    what: "A short review of how the business runs, ending in a written answer to one question: where would this make or save money. You keep the document either way.",
    forWho: "Anyone who has bought AI tools and cannot tell whether they are working.",
    price: "From £500, taken off the price if you go ahead",
  },
  {
    slug: "process-map",
    name: "Process mapping",
    what: "Who does what today, and which of those steps should be handed to software. Most AI spend fails here, automating a process nobody had agreed on.",
    forWho: "Teams where the same job is done three different ways depending on who picks it up.",
    price: "From £950",
  },
  {
    slug: "company-brain",
    name: "Context Engine",
    what: "One store for the proposals, calls and decisions that live in people's heads and inboxes. Your team and your tools can both ask it questions, and every answer shows its source.",
    forWho: "Businesses where one or two people are the only ones who know how things work.",
    price: "From £5,000",
  },
  {
    slug: "workflows",
    name: "Workflows and automations",
    what: "Research before a call, notes and follow-up after it, updating the CRM, chasing what gets forgotten.",
    forWho: "Teams losing a day a week to work that is necessary but not skilled.",
    price: "From £1,500 per workflow",
  },
  {
    slug: "prospecting",
    name: "Finding your next customers",
    what: "Builds the list, watches for companies doing something worth calling about, and hands your team a reason to call.",
    forWho: "Anyone whose pipeline depends on outbound and whose reps are researching instead of selling.",
    price: "From £5,000, then run monthly",
  },
  {
    slug: "training",
    name: "Getting your team to actually use it",
    what: "Sessions with the people who will use it, on their own work, until they are faster with it than without it.",
    forWho: "Companies already paying for Claude or ChatGPT seats that nobody opens.",
    price: "From £950 a day",
  },
  {
    slug: "run",
    name: "Running it",
    what: "I monitor it, fix it when it breaks, extend it, and send a monthly report in your numbers.",
    forWho: "Anyone who has had something built and then watched it quietly stop working.",
    price: "From £1,000 a month",
  },
];

export const costNotes = [
  {
    title: "You own the accounts",
    body: "The model subscription, the database, the hosting. They are in your name and you pay for them directly, usually £25 to £60 a month for a small team. If we stop working together you keep all of it.",
  },
  {
    title: "No bundled usage",
    body: "I do not resell you inference at a markup, and I do not sell unlimited anything. Your usage costs what it costs, and you can see it.",
  },
  {
    title: "These are current rates",
    body: "Early rates while I build up published case studies. They go up, and anyone already on a retainer keeps what they signed at for that work.",
  },
  {
    title: "Priced on the job, not the hour",
    body: "Fixed price per piece of work, agreed before it starts. A day rate exists for open-ended advisory, but most work should not need one.",
  },
];

export const about = {
  lead: "Fifteen years selling software. Now I build the systems instead.",
  body: [
    "I spent my career in enterprise sales, at Canto, Freshworks, SAP, Samsung and BlackBerry. I know what a sales team does all day, and how little of it is selling. So I build the other part: the research before the call, the follow-up after it, the record of what the company knows.",
    "I am not a data scientist. I work out which bit of this is worth doing, build it on tools you own, and keep it running. I work as a sole trader, and client work is usually delivered with Amplify My AI.",
  ],
};
