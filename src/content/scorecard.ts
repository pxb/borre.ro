// The readiness scorecard (#581). Eight questions about how the business works
// today. Two size the repeated admin, for a rough estimate of the time AI could
// give back; the rest score readiness and pick the service to start with. Runs
// in the browser only: answers are never sent anywhere (Pedro, 2026-09-30).

export type Option = { t: string; score?: number };
export type Question = { id: string; q: string; options: Option[] };

export const questions: Question[] = [
  {
    id: "people",
    q: "How many people spend time on repeated admin, such as research, call notes, CRM updates or reports?",
    options: [{ t: "1 or 2" }, { t: "3 to 10" }, { t: "11 to 25" }, { t: "More than 25" }],
  },
  {
    id: "hours",
    q: "Roughly how many hours a week does each of them spend on it?",
    options: [{ t: "Under 2" }, { t: "2 to 5" }, { t: "5 to 10" }, { t: "More than 10" }],
  },
  {
    id: "use",
    q: "How does your team use AI today?",
    options: [
      { t: "Hardly at all", score: 0 },
      { t: "Some people, on their own accounts", score: 1 },
      { t: "Most people, on a company account", score: 2 },
      { t: "It's part of how we work", score: 3 },
    ],
  },
  {
    id: "data",
    q: "Where does your customer information live?",
    options: [
      { t: "In inboxes and people's heads", score: 0 },
      { t: "Spread across several tools", score: 1 },
      { t: "Mostly in one CRM, kept up to date", score: 2 },
    ],
  },
  {
    id: "job",
    q: "Is there a repeated job you'd hand over tomorrow if you could?",
    options: [
      { t: "Not sure yet", score: 0 },
      { t: "A few ideas", score: 1 },
      { t: "Yes, one clear job", score: 2 },
    ],
  },
  {
    id: "agreed",
    q: "Has your leadership team agreed where AI fits?",
    options: [
      { t: "We haven't talked about it", score: 0 },
      { t: "We've talked, but haven't agreed", score: 1 },
      { t: "Yes, and someone owns it", score: 2 },
    ],
  },
  {
    id: "rules",
    q: "Are there rules for what data can go into AI tools?",
    options: [
      { t: "Not yet", score: 0 },
      { t: "Informal ones", score: 1 },
      { t: "Written down", score: 2 },
    ],
  },
  {
    id: "want",
    q: "What do you most want from AI in the next six months?",
    options: [
      { t: "To know where it would help" },
      { t: "To get the team using it well" },
      { t: "To take work off the team" },
    ],
  },
];

// Midpoints for the two sizing questions, and the share of that time we assume
// moves to software: a quarter to a half. An assumption, shown on the result,
// set under McKinsey's 60 to 70% of work time that current AI and other
// technology could technically automate ("The economic potential of generative
// AI", 14 June 2023; checked 2026-09-30).
const PEOPLE = [1.5, 6, 18, 30];
const HOURS = [1, 3.5, 7.5, 12];
export const SHARE = {
  low: 0.25,
  high: 0.5,
  source: "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier",
};

export type Answers = Record<string, number>; // question id -> option index

// The result, kept in this tab only, for the booking form's notes (booking-frame.tsx).
export const SCORECARD_KEY = "borre-scorecard";

const MAX = questions.reduce((n, q) => n + Math.max(...q.options.map((o) => o.score ?? 0)), 0);

export const bands = [
  { min: 0, name: "Getting started", line: "The first step is deciding where AI fits, before anyone buys or builds." },
  { min: 5, name: "Ready for a first step", line: "The groundwork is there. Pick one job and prove it." },
  { min: 9, name: "Ready to build", line: "You have a clear job, the data behind it and someone to own it." },
];

export function result(a: Answers) {
  const score = questions.reduce((n, q) => n + (q.options[a[q.id]]?.score ?? 0), 0);
  const band = [...bands].reverse().find((b) => score >= b.min) ?? bands[0];
  const weekly = PEOPLE[a.people] * HOURS[a.hours];
  const low = Math.max(1, Math.round(weekly * SHARE.low));
  const high = Math.max(low + 1, Math.round(weekly * SHARE.high));

  // Where to start: what they want first, then what would stop it working.
  let service = "audit";
  if (a.want === 1) service = "training";
  else if (a.agreed === 1) service = "workshop";
  else if (a.want === 2 && a.job === 2 && a.data === 2 && a.agreed === 2) service = "agentic-workflows";

  return { score, max: MAX, band, low, high, weekly, service };
}
