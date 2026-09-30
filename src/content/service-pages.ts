// One sales page per service (#602, #583). The lead states the outcome, the
// problem row names the buyer's situation in their terms, and the rest is what
// they get, how it runs, proof, price and the questions buyers ask before
// booking (the objections competitors' pages answer: who builds it, who takes
// part, who owns it, what happens to our data). Each thing is said once. The
// name, what it is, what you get, the price and the timing stay in
// serviceCategories (site.ts), so the overview, the page and llms.txt cannot
// drift. Positive wording only; scope and limits live in the scope sheet (#603).
export type ServicePage = {
  line: string; // the outcome, used on the overview and as the page lead
  cta: string; // the button, naming the service
  problem: string; // the buyer's situation, in their terms
  steps: { t: string; d: string }[]; // how it runs, 3 or 4 steps
  priceNote?: string; // one commercial term beside the price; the detail is in the scope sheet
  next: string; // the service a buyer usually moves on to (Tenhaw pattern, #583)
  faqs: { q: string; a: string }[];
};

// Asked of every service that touches business data.
const DATA_FAQ = {
  q: "Is our data used to train AI models?",
  a: "We set everything up on business accounts in your name, which keep your data out of AI training.",
};

export const servicePages: Record<string, ServicePage> = {
  audit: {
    line: "Know which jobs to hand to AI first, and what each would cost and save.",
    cta: "Book an audit",
    next: "agentic-workflows",
    problem:
      "You know AI should be taking some of the work off your team, and some of them already use it in their own way. What you're missing is an answer to which jobs to start with, in what order, and whether the saving covers the cost.",
    steps: [
      { t: "Interviews", d: "We talk to you and to the people who do the work." },
      { t: "Review", d: "We go through your workflows, your tools and your data." },
      { t: "Plan", d: "We rank the jobs by return and effort, and cost the top ones." },
      { t: "Walk-through", d: "We take you through the plan and agree what to do next." },
    ],
    priceNote: "If you go ahead with a build from the plan, the audit fee comes off its price.",
    faqs: [
      { q: "Can someone else build it?", a: "Yes. The plan is yours and any builder can work from it." },
      { q: "Who needs to be involved?", a: "You at the start and the end, and a short conversation with each of the people who do the work." },
    ],
  },
  workshop: {
    line: "Your leadership team agreed on where AI goes first and who owns each step.",
    cta: "Book a workshop",
    next: "audit",
    problem:
      "Everyone on the leadership team has a view on AI. Sales wants one thing, operations wants another, and someone is worried about customer data. Until the team agrees a plan, nothing gets funded and people keep trying tools on their own.",
    steps: [
      { t: "Prepare", d: "A call beforehand to understand the business and pick examples from your own work." },
      { t: "Session", d: "A half or full day with your leadership team." },
      { t: "Write-up", d: "Priorities, owners and next steps, sent to everyone." },
    ],
    faqs: [
      { q: "Who should attend?", a: "The people who set priorities and budgets. Usually the owner and the heads of sales, operations and finance." },
      { q: "Half day or full day?", a: "A half day is enough to agree priorities. A full day leaves time to work through your own processes in detail." },
    ],
  },
  training: {
    line: "Your team getting real work done with the AI tools you already pay for.",
    cta: "Book training",
    next: "agentic-workflows",
    problem:
      "You pay for ChatGPT, Claude or Copilot, and most of the team uses it for the odd email. Some people are on personal accounts, pasting in customer details. It has never been set up for how your business works.",
    steps: [
      { t: "Set up", d: "We configure your company workspace and its data and security settings." },
      { t: "Train", d: "Hands-on sessions on your team's own work." },
      { t: "Hand over", d: "Shared prompts and templates, ready for the jobs you repeat." },
    ],
    faqs: [
      { q: "Which tools do you work with?", a: "ChatGPT, Claude, Copilot and Gemini, on your own company account." },
      { q: "How many days will we need?", a: "We agree the number before we start, based on the size of the team and the work they do." },
    ],
  },
  "context-engine": {
    line: "Any question about a customer or deal, answered from your own records with the source attached.",
    cta: "Plan a Context Engine",
    next: "apps-dashboards",
    problem:
      "Your customer history is split across the CRM, inboxes, call notes and proposals. When someone needs the full picture on an account, they search four places or ask whoever has been there longest. New starters lean on colleagues to catch up.",
    steps: [
      { t: "Connect", d: "We connect your CRM and bring your documents and call notes together." },
      { t: "First version", d: "Working on your own data within days." },
      { t: "Sign-off", d: "Your team confirms the facts it will rely on." },
      { t: "Live", d: "In your AI tools and updated on a schedule." },
    ],
    priceNote: "Includes 30 days of fixes after go-live.",
    faqs: [
      { q: "Which CRMs do you work with?", a: "HubSpot, Salesforce, Pipedrive, and any other CRM that lets other software connect to it." },
      { q: "Where does our data live?", a: "On accounts in your name. If we stop working together, you keep all of it." },
      DATA_FAQ,
    ],
  },
  "agentic-workflows": {
    line: "Research, call notes and CRM updates done for your sales team.",
    cta: "Automate a task",
    next: "context-engine",
    problem:
      "Your salespeople research each company before a call, write up notes afterwards and keep the CRM up to date. It all matters, and it all comes out of selling time. When the week gets busy, it's the first thing to slip.",
    steps: [
      { t: "Pick the task", d: "We look at who does what today and choose the job to hand over." },
      { t: "Build", d: "On your own systems, using real examples from your work." },
      { t: "Test", d: "Your team tests it and approves what it produces." },
      { t: "Live", d: "Each workflow live in one to two weeks." },
    ],
    priceNote: "Includes 30 days of fixes after go-live.",
    faqs: [
      { q: "Which CRMs do you work with?", a: "HubSpot, Salesforce, Pipedrive, and any other CRM that lets other software connect to it." },
      { q: "Does anything go out without us seeing it?", a: "Your team approves every email and CRM update before it's sent or saved." },
      { q: "Can we adjust it along the way?", a: "Yes. A few small changes are agreed up front as part of the build, and the managed service covers changes after that." },
      DATA_FAQ,
    ],
  },
  "apps-dashboards": {
    line: "One screen for the job your team does every week, built on your own data.",
    cta: "Plan an app",
    next: "support",
    problem:
      "Your team builds its weekly list from spreadsheet exports and CRM views. It's out of date soon after it's made, and you can't see what was done with each lead or what the tools behind it cost.",
    steps: [
      { t: "Design", d: "We design the screen around the job your team does." },
      { t: "Build", d: "On your own data and accounts." },
      { t: "Test", d: "One of your team runs the job in it and signs it off." },
    ],
    priceNote: "Includes 30 days of fixes after go-live.",
    faqs: [
      { q: "Who owns it?", a: "You do. It runs on accounts in your name." },
      { q: "How do people sign in?", a: "With a link sent to their work email." },
    ],
  },
  "agentic-platform": {
    line: "Company-wide AI on accounts you own: search and chat across everything your business knows, with agents doing the repeat work.",
    cta: "Plan a platform",
    next: "support",
    problem:
      "Your knowledge sits in a dozen tools and everyone reaches it with a different AI. Staff sign up for their own accounts, the cost turns up on expense claims, and nobody can say which answers to trust.",
    steps: [
      { t: "Connect", d: "We connect your main systems and bring your knowledge together." },
      { t: "Workspace", d: "Search and chat for every team, with the models you choose." },
      { t: "Agents", d: "We add agents for the repeat work, one at a time." },
      { t: "Checks", d: "Every release is scored against your team's own questions." },
    ],
    priceNote: "Includes 30 days of fixes after each phase goes live.",
    faqs: [
      {
        q: "How does this compare to enterprise AI platforms?",
        a: "It does the same job: unified search and chat across your company's knowledge, with agents on top. It runs on accounts you own, and we build it around how your business works.",
      },
      { q: "Which models can we use?", a: "A choice including Claude, ChatGPT, Gemini and Grok." },
      DATA_FAQ,
    ],
  },
  support: {
    line: "Your AI systems kept running and improved every month, with a report on what they did and cost.",
    cta: "Set up support",
    next: "agentic-workflows",
    problem:
      "Once a system is live, the business keeps moving. Tools update, processes change and new people join. A system nobody looks after slowly stops being used.",
    steps: [
      { t: "Monitor", d: "We watch every run and fix what breaks." },
      { t: "Adjust", d: "Small changes as your business changes." },
      { t: "Review", d: "A monthly report and a call on what ran, what it cost and what to do next." },
    ],
    faqs: [
      { q: "How long do we sign up for?", a: "It runs month to month." },
      { q: "Which systems do you look after?", a: "The ones we've built for you, named when we start." },
    ],
  },
};
