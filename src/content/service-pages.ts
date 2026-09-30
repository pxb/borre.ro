// One sales page per service (#602, #583). Each opens on its buyer's problem in
// their own words, then what we do about it, what they get, how it runs, proof,
// price and the questions buyers ask before booking (the objections competitors'
// pages answer: who builds it, who needs to be involved, who owns it). The name,
// what it is, what you get, the price and the timing stay in serviceCategories
// (site.ts), so the overview, the page and llms.txt cannot drift. Positive
// wording only: say what it is. Scope and limits live in the scope sheet (#603).
export type ServicePage = {
  line: string; // the outcome, used on the overview and as the page lead
  cta: string; // the button, naming the service
  problem: string; // the buyer's situation, in their terms
  answer: string; // what we do about it
  outcomes: string[]; // what is different afterwards
  steps: { t: string; d: string }[]; // how it runs, 3 or 4 steps
  faqs: { q: string; a: string }[];
};

export const servicePages: Record<string, ServicePage> = {
  audit: {
    line: "The jobs in your business AI should take on first, with what each would cost and save.",
    cta: "Book an audit",
    problem:
      "You know AI should be taking some of the work off your team. Some of them already use it, each in their own way. What you don't have yet is an answer to which jobs to start with, in what order, and whether the saving covers the cost.",
    answer:
      "We talk to the people who do the work, look at the tools you pay for and the data you hold, and rank the jobs worth automating by return and effort. You get a written plan you can hand to any builder.",
    outcomes: [
      "A shortlist of the jobs to automate first",
      "A cost and an estimated saving against each",
      "A plan you own, whoever builds it",
    ],
    steps: [
      { t: "Interviews", d: "We talk to you and to the people who do the work." },
      { t: "Review", d: "We go through your workflows, your tools and your data." },
      { t: "Plan", d: "We rank the jobs by return and effort, and cost the top ones." },
      { t: "Walk-through", d: "We take you through the plan and agree what to do next." },
    ],
    faqs: [
      { q: "Can someone else build it?", a: "Yes. The plan is yours and any builder can work from it. If you'd like us to build it, we quote from the plan." },
      { q: "Who needs to be involved?", a: "You at the start and the end, and a short conversation with each of the people who do the work." },
      { q: "What do we need to prepare?", a: "A list of the tools you pay for, and time in the diary with the people we'll talk to." },
    ],
  },
  workshop: {
    line: "Your leadership team agreed on where AI goes first and who owns each step.",
    cta: "Book a workshop",
    problem:
      "Everyone on the leadership team has a view on AI. Sales wants one thing, operations wants another, and someone is rightly worried about customer data. Until the team agrees a plan, nothing gets funded and people keep trying tools on their own.",
    answer:
      "We run a working session with your leadership team, built on your own processes. We cover what AI can do for a business your size, the risks, and which ideas to back first. You leave with priorities and owners the whole team has signed up to.",
    outcomes: [
      "Agreed priorities, each with an owner",
      "The data and risk rules settled before anyone builds",
      "A write-up of what was agreed and what happens next",
    ],
    steps: [
      { t: "Prepare", d: "A call beforehand to understand the business and pick examples from your own work." },
      { t: "Session", d: "A half or full day with your leadership team." },
      { t: "Write-up", d: "Priorities, owners and next steps, sent to everyone afterwards." },
    ],
    faqs: [
      { q: "Who should attend?", a: "The people who set priorities and budgets. Usually the owner and the heads of sales, operations and finance." },
      { q: "Half day or full day?", a: "A half day is enough to agree priorities. A full day leaves time to work through your own processes in detail." },
    ],
  },
  training: {
    line: "Your team getting real work done with the AI tools you already pay for.",
    cta: "Book training",
    problem:
      "You pay for ChatGPT, Claude or Copilot, and most of the team uses it for the odd email. Some people are on personal accounts, pasting in customer details. Nobody has set it up for how your business works.",
    answer:
      "We set up the workspace on your company account, with data and security settings that suit your business, then train your team on the work they do every day. They finish with shared prompts and templates for the jobs they repeat.",
    outcomes: [
      "One company workspace, set up for how you work",
      "Customer data kept inside your own account",
      "Templates for the jobs your team repeats",
    ],
    steps: [
      { t: "Set up", d: "We configure your workspace and its data and security settings." },
      { t: "Train", d: "Hands-on sessions on your team's own work." },
      { t: "Hand over", d: "Shared prompts and templates, ready for the jobs you repeat." },
    ],
    faqs: [
      { q: "Which tools do you work with?", a: "ChatGPT, Claude, Copilot and Gemini, on your own company account." },
      { q: "How many days will we need?", a: "We agree the number of days before we start, based on the size of the team and the work they do." },
      { q: "Who owns the account?", a: "You do. Licences and settings stay in your name." },
    ],
  },
  "context-engine": {
    line: "Any question about a customer or deal, answered from your own records with the source attached.",
    cta: "Plan a Context Engine",
    problem:
      "Your customer history is split across the CRM, inboxes, call notes and proposals. When someone needs the full picture on an account, they search four places or ask whoever has been there longest. New starters depend on colleagues to catch up.",
    answer:
      "We connect your CRM and bring your documents and call notes together, so your team and your AI tools can ask about any account and get an answer linked to the record behind it. Access follows the permissions you already have.",
    outcomes: [
      "Answers on any account, deal or past conversation",
      "Every answer linked to the record behind it",
      "Claude and ChatGPT working from your own business knowledge",
    ],
    steps: [
      { t: "Connect", d: "We connect your CRM and bring your documents and call notes together." },
      { t: "First version", d: "Working on your own data within days." },
      { t: "Sign-off", d: "Your team confirms the facts it will rely on." },
      { t: "Live", d: "Available in your AI tools and updated on a schedule." },
    ],
    faqs: [
      { q: "How soon can we use it?", a: "It works on your own data within days, and is live in three to six weeks." },
      { q: "Where does our data live?", a: "On accounts in your name. If we stop working together, you keep all of it." },
      { q: "Which AI tools can use it?", a: "Claude, ChatGPT and your other AI tools." },
    ],
  },
  "agentic-workflows": {
    line: "Research, call notes and CRM updates done for your team, and checked by them before anything goes out.",
    cta: "Automate a task",
    problem:
      "Your salespeople research each company before a call, write up notes afterwards and keep the CRM up to date. It all matters, and it all comes out of selling time. When the week gets busy, it's the first thing to slip.",
    answer:
      "We automate one repeated task at a time, on your own systems, tested on real examples from your work. Everything is a draft until someone on your team approves it.",
    outcomes: [
      "Research ready before the call",
      "Follow-ups drafted while the call is still fresh",
      "A CRM kept up to date for your reps",
    ],
    steps: [
      { t: "Pick the task", d: "We look at who does what today and choose the job to hand over." },
      { t: "Build", d: "We build it on your systems, using real examples from your work." },
      { t: "Test", d: "Your team tests it and approves what it produces." },
      { t: "Live", d: "Each workflow live in one to two weeks." },
    ],
    faqs: [
      { q: "Can we check the work before it goes out?", a: "Yes. Everything is a draft until someone on your team approves it." },
      { q: "What does it run on?", a: "Your own systems, such as HubSpot and Outlook, on accounts in your name." },
      { q: "Can we adjust it along the way?", a: "Yes. We agree a few small changes up front as part of the build, and the managed service covers changes after that." },
    ],
  },
  "apps-dashboards": {
    line: "One screen for the job your team does every week, built on your own data.",
    cta: "Plan an app",
    problem:
      "Your team builds its weekly list from spreadsheet exports and CRM views. It's out of date soon after it's made, and you can't see what was done with each lead or what the tools behind it cost.",
    answer:
      "We build the screen your team works in, such as this week's leads and what's been done on each, with a view of what the system behind it did and cost. It runs on your own data and accounts.",
    outcomes: [
      "The week's work in one place",
      "What the system did and what it cost, visible to you",
      "Sign-in with a link to each person's work email",
    ],
    steps: [
      { t: "Design", d: "We design the screen around the job your team does." },
      { t: "Build", d: "We build it on your own data." },
      { t: "Test", d: "A named user runs the job in it and signs it off." },
    ],
    faqs: [
      { q: "Who owns it?", a: "You do. It runs on accounts in your name." },
      { q: "How do people sign in?", a: "With a link sent to their work email." },
    ],
  },
  "agentic-platform": {
    line: "A private AI workspace for the whole team, connected to your business knowledge and tools.",
    cta: "Plan a platform",
    problem:
      "Once a first system works, everyone wants AI. Staff sign up for their own accounts, the cost turns up on expense claims, and company data goes wherever each tool sends it.",
    answer:
      "We set up one AI workspace for the whole business, on accounts you own, connected to the Context Engine and your everyday tools. You choose the models, decide who can use what, and see usage and cost per person.",
    outcomes: [
      "One workspace for the whole team",
      "Your choice of models, including Claude and ChatGPT",
      "Usage and cost per person you can see",
    ],
    steps: [
      { t: "First project", d: "The platform builds on a system that already works for you." },
      { t: "Plan", d: "We agree the phases, the teams and the tools." },
      { t: "Build", d: "Each phase is built and checked with the people who will use it." },
      { t: "Roll out", d: "Team by team, with access and costs you can see." },
    ],
    faqs: [
      { q: "Which models can we use?", a: "A choice including Claude, ChatGPT, Gemini and Grok." },
      { q: "Where does it run?", a: "On accounts in your name." },
    ],
  },
  support: {
    line: "Your AI systems kept running and improved every month, with a report on what they did and cost.",
    cta: "Set up support",
    problem:
      "Once a system is live, the business keeps moving. Tools update, processes change and new people join. A system nobody looks after slowly stops being used.",
    answer:
      "We watch every run, fix what breaks and make small changes as your business changes. Every month we send a report on what ran, what it cost and what we suggest next, and go through it with you.",
    outcomes: [
      "Problems found and fixed",
      "Small changes made as you need them",
      "A monthly report on what ran and what it cost",
    ],
    steps: [
      { t: "Monitor", d: "We watch every run and fix what breaks." },
      { t: "Adjust", d: "We make small changes as your business changes." },
      { t: "Review", d: "A monthly report and a call on what ran, what it cost and what to do next." },
    ],
    faqs: [
      { q: "How long do we sign up for?", a: "It runs month to month." },
      { q: "What's in the monthly report?", a: "What ran, what was fixed, what it cost, and what we suggest next." },
    ],
  },
};
