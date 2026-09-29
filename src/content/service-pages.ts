// One sales page per service (#602, #583): who it's for, what changes, how it
// works, the questions buyers ask, and the button that books the call about
// that service. The name, what it is, what you get, the price and the timing
// stay in serviceCategories (site.ts), so the overview and the page cannot
// drift. Placeholder copy drafted from the site as it stands; the value-led
// copy pass (#561) replaces it in place. Positive wording only: say what it is.
export type ServicePage = {
  line: string; // one line of value, used on the overview and as the page lead
  cta: string; // the button, naming the service
  forWho: string; // who it's for and the problem they have
  changes: string[]; // what is different afterwards
  steps: { t: string; d: string }[]; // how it works, 3 or 4 steps
  faqs: { q: string; a: string }[];
};

export const servicePages: Record<string, ServicePage> = {
  audit: {
    line: "Find out where AI would pay in your business before you spend on it.",
    cta: "Book an audit",
    forWho:
      "For owners and managing directors who can see AI changing their market and want a clear answer on where it would help them first, and what it would take.",
    changes: [
      "You know the one or two places AI would pay first",
      "You have costs and timings to plan and budget against",
      "You can brief any builder, us or anyone else",
    ],
    steps: [
      { t: "Talk", d: "We talk through how the business runs and where the time goes." },
      { t: "Review", d: "We look at your workflows, the tools you pay for and the data you hold." },
      { t: "Roadmap", d: "You get a written roadmap, ranked by return and effort." },
      { t: "Walk through", d: "We go through it with you and agree the next step." },
    ],
    faqs: [
      { q: "Who owns the roadmap?", a: "You do. Use it with any builder. If you'd like us to build it, we quote from the roadmap." },
      { q: "What do you need from us?", a: "Time with you, time with the people who do the work, and a look at the tools and data you use today." },
    ],
  },
  workshop: {
    line: "Get your leadership team agreed on where AI fits and what to do first.",
    cta: "Book a workshop",
    forWho:
      "For leadership teams where everyone has a view on AI and the business needs one plan. One session turns those views into agreed priorities, each with an owner.",
    changes: [
      "Priorities the whole leadership team has signed up to",
      "An owner and a next step for each one",
      "A shared, plain view of the risks",
    ],
    steps: [
      { t: "Prepare", d: "A short call to understand the business and pick examples from your own work." },
      { t: "Workshop", d: "A half or full day with your leadership team, working on your own use cases." },
      { t: "Write up", d: "Agreed priorities, owners and next steps, written up afterwards." },
    ],
    faqs: [
      { q: "Who should attend?", a: "The people who set priorities and budgets, usually the owner and the heads of sales, operations and finance." },
      { q: "Half day or full day?", a: "A half day suits agreeing priorities. A full day leaves room to work through your own processes in detail." },
    ],
  },
  training: {
    line: "Your team using ChatGPT, Claude or Copilot properly, on their real work.",
    cta: "Book training",
    forWho:
      "For teams that pay for an AI tool, or are about to, and want everyone using it well and safely on the work they do every day.",
    changes: [
      "A workspace set up for your business, with the right data settings",
      "A team that uses it on their daily work",
      "Shared prompts and templates for the jobs you repeat",
    ],
    steps: [
      { t: "Set up", d: "We set up your workspace and its data and security settings." },
      { t: "Train", d: "Hands-on sessions built around your team's own work." },
      { t: "Hand over", d: "Shared prompts and templates, ready for the jobs you repeat." },
    ],
    faqs: [
      { q: "Which tools?", a: "ChatGPT, Claude, Copilot or Gemini, on your own account." },
      { q: "Whose account is it?", a: "Yours. Licences and settings stay in your name, so you keep full control." },
    ],
  },
  "context-engine": {
    line: "Ask about any customer or deal and get an answer with its source.",
    cta: "Plan a Context Engine",
    forWho:
      "For sales and service teams whose customer knowledge is spread across the CRM, inboxes, call notes and proposals, where a simple question means finding the one person who remembers.",
    changes: [
      "Any account, deal or past conversation answered in plain language",
      "Every answer linked to the record behind it",
      "Your AI tools working from your own business knowledge",
    ],
    steps: [
      { t: "Connect", d: "We connect your CRM and bring your documents and call notes into one place." },
      { t: "First version", d: "Working on your own data within days." },
      { t: "Check", d: "Your team signs off the facts it will rely on." },
      { t: "Live", d: "Available in your AI tools and kept up to date on a schedule." },
    ],
    faqs: [
      { q: "Where does our data live?", a: "On accounts in your name. If we stop working together, you keep all of it." },
      { q: "Which AI tools can use it?", a: "Claude, ChatGPT and your other AI tools." },
    ],
  },
  "agentic-workflows": {
    line: "Hand the repeatable work around sales and service to software your team checks.",
    cta: "Automate a task",
    forWho:
      "For teams that spend hours on the same jobs every week: researching a company before a call, writing up notes afterwards, keeping the CRM current.",
    changes: [
      "Research ready before the call",
      "Follow-ups drafted while the call is still fresh",
      "A CRM that stays up to date",
    ],
    steps: [
      { t: "Pick the task", d: "We map who does what today and choose the job to hand over." },
      { t: "Build", d: "We build it on your systems, using real examples from your work." },
      { t: "Test", d: "Your team tests it and approves what it produces." },
      { t: "Live", d: "Each workflow live in one to two weeks." },
    ],
    faqs: [
      { q: "Can we check the work before it goes out?", a: "Yes. Everything is a draft until someone on your team approves it." },
      { q: "What does it run on?", a: "Your own systems, such as HubSpot, on accounts in your name." },
    ],
  },
  "apps-dashboards": {
    line: "The screens your team works in, built around your own data.",
    cta: "Plan an app",
    forWho:
      "For teams moving between spreadsheets and CRM views to get through the week, who want one screen built for one job, such as working this week's leads.",
    changes: [
      "One place to do the job",
      "What the system did and what it cost, on one screen",
      "Sign-in by email link for your team",
    ],
    steps: [
      { t: "Design", d: "We design the screen around the job your team does." },
      { t: "Build", d: "We build it on your own data." },
      { t: "Test", d: "A named user runs the job in it and signs it off." },
    ],
    faqs: [
      { q: "Where does it run?", a: "On accounts in your name, so you own it." },
      { q: "How do people sign in?", a: "With a link sent to their work email." },
    ],
  },
  "agentic-platform": {
    line: "A private AI workspace for the whole team, connected to what your business knows.",
    cta: "Plan a platform",
    forWho:
      "For businesses that have seen a first AI system pay and want AI available to every team, with one place to manage access, models and cost.",
    changes: [
      "One AI workspace for the whole team",
      "Your business knowledge and everyday tools inside it",
      "Usage and cost per person you can see",
    ],
    steps: [
      { t: "Start from a first project", d: "The platform builds on a system that already works for you." },
      { t: "Plan", d: "We agree the phases, teams and tools." },
      { t: "Build", d: "Each phase is built and checked with the people who will use it." },
      { t: "Roll out", d: "Team by team, with access and costs you can see." },
    ],
    faqs: [
      { q: "Which models?", a: "A choice including Claude, ChatGPT, Gemini and Grok." },
      { q: "Where does it run?", a: "On accounts in your name." },
    ],
  },
  support: {
    line: "Your AI systems kept working and improving as the business changes.",
    cta: "Set up support",
    forWho:
      "For businesses with a live AI system that needs to keep working as their tools, team and customers change.",
    changes: [
      "Problems found and fixed",
      "Changes made as your business changes",
      "A clear monthly view of what ran and what it cost",
    ],
    steps: [
      { t: "Monitor", d: "We watch every run and fix what breaks." },
      { t: "Improve", d: "We make changes as your business changes." },
      { t: "Review", d: "A monthly report and a call on what ran, what it cost and what to do next." },
    ],
    faqs: [
      { q: "How long do we sign up for?", a: "It runs month to month." },
      { q: "What's in the monthly report?", a: "What ran, what was fixed, what it cost, and what we suggest next." },
    ],
  },
};
