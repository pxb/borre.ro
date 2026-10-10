// The AI ROI calculator, /scorecard (#581; the readiness scorecard until
// 2026-10-09, the AI value calculator until 2026-10-10, #624). Nine questions
// about how the business works today. Two size the repeated admin and one
// prices an hour of it, for a rough estimate of the time and money AI could
// give back; the rest score readiness and pick the service to start with. The
// page sets that against the service's published starting price.

import { words } from "./copy";
import copyScorecard from "./copy.gen/scorecard";

export type Option = { t: string; score?: number };
export type Question = { id: string; q: string; options: Option[] };

// The words: src/content/copy/scorecard.md (#561). What stays here: each
// question's id, the scores, and the number ranges of the two sizing
// questions, which the estimate below is calculated from.
const w = words(copyScorecard);
const scored = (n: number, scores: number[]): Option[] => {
  const answers = w.li(`q.${n}.answers`);
  if (answers.length !== scores.length) {
    throw new Error(`copy: scorecard.md "## q.${n}.answers" needs ${scores.length} answers, in order`);
  }
  return answers.map((t, i) => ({ t, score: scores[i] }));
};
const plain = (n: number | string, count: number): Option[] => {
  const answers = w.li(`q.${n}.answers`);
  if (answers.length !== count) throw new Error(`copy: scorecard.md "## q.${n}.answers" needs ${count} answers, in order`);
  return answers.map((t) => ({ t }));
};

export const questions: Question[] = [
  { id: "people", q: w.t("q.1"), options: [{ t: "1 or 2" }, { t: "3 to 10" }, { t: "11 to 25" }, { t: "More than 25" }] },
  { id: "hours", q: w.t("q.2"), options: [{ t: "Under 2" }, { t: "2 to 5" }, { t: "5 to 10" }, { t: "More than 10" }] },
  { id: "cost", q: w.t("q.cost"), options: plain("cost", 4) },
  { id: "use", q: w.t("q.3"), options: scored(3, [0, 1, 2, 3]) },
  { id: "data", q: w.t("q.4"), options: scored(4, [0, 1, 2]) },
  { id: "job", q: w.t("q.5"), options: scored(5, [0, 1, 2]) },
  { id: "agreed", q: w.t("q.6"), options: scored(6, [0, 1, 2]) },
  { id: "rules", q: w.t("q.7"), options: scored(7, [0, 1, 2]) },
  { id: "want", q: w.t("q.8"), options: plain(8, 3) },
];

// The page's own words, for the page and the scorecard component.
export const scorecardWords = w;

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

// What an hour of that time costs, by answer (Pedro, 2026-10-10: the pounds
// version). Wages plus employer costs, as the question asks.
const RATE = [15, 25, 40, 60];
// Working weeks in a year: 52 less the 5.6 weeks of statutory paid holiday
// (gov.uk, checked 2026-10-10).
export const WEEKS = { n: 46, source: "https://www.gov.uk/holiday-entitlement-rights" };

export type Answers = Record<string, number>; // question id -> option index

// The result, kept in this tab only, for the booking form's notes (booking-frame.tsx).
export const SCORECARD_KEY = "borre-scorecard";

const MAX = questions.reduce((n, q) => n + Math.max(...q.options.map((o) => o.score ?? 0)), 0);

export const bands = [0, 5, 9].map((min, i) => ({ min, name: w.t(`band.${i + 1}.name`), line: w.t(`band.${i + 1}.line`) }));

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

  const rate = RATE[a.cost];
  // Rounded to the nearest £100: it's an estimate, not a quote.
  const year = (h: number) => Math.round((h * rate * WEEKS.n) / 100) * 100;
  return { score, max: MAX, band, low, high, weekly, service, rate, valueLow: year(low), valueHigh: year(high) };
}
