import { words } from "./copy";
import copyResearch from "./copy.gen/research";

// Every sourced figure the site has used, in full, on /research (Pedro,
// 2026-10-10: "the stats are genuinely useful", but not as the homepage's
// opener). Each source was fetched and checked (#565, 2026-09-24; frames
// named 2026-10-08). The words, including who was asked: copy/research.md.
//
// techUK: "Lack of expertise is the top barrier (35%)", from over 1,000 UK IT
// decision-makers (ANS and YouGov).
// Zapier: "More than 3 in 4 enterprises (78%) are struggling to integrate AI
// with their existing systems"; 500+ enterprise leaders, October 2025.
// Gartner press release, 25 June 2025: "Over 40% of agentic AI projects will
// be canceled by the end of 2027, due to escalating costs, unclear business
// value or inadequate risk controls". Checked 2026-10-01.
// Microsoft 2026 Work Trend Index (5 May 2026, 20,000 AI users in 10
// countries): "organizational factors like culture, manager support, and
// talent practices account for more than 2x the reported AI impact of
// individual factors like mindset and behavior (67% vs. 32%)". Also on
// /services as `startWhy`.
// PwC press release, 15 June 2026: "The top 20% of the most AI-exposed
// companies achieved average labour productivity growth of 163% relative to
// 2018 - nearly five times higher than the most AI-exposed companies overall".
// It measures labour productivity, not revenue.
const w = words(copyResearch);

const FIGURES = [
  { stat: "35%", href: "https://www.techuk.org/resource/major-barriers-to-ai-adoption-remain-for-uk-businesses-despite-growing-demand-new-report-reveals.html" },
  { stat: "78%", href: "https://zapier.com/blog/ai-resistance-survey/" },
  { stat: "40%", href: "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027" },
  { stat: "67%", href: "https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization" },
  { stat: "163%", href: "https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html" },
];

export const research = FIGURES.map((f, i) => ({
  ...f,
  label: w.t(`figure.${i + 1}.label`),
  claim: w.t(`figure.${i + 1}.claim`),
  who: w.t(`figure.${i + 1}.who`),
  answer: w.t(`figure.${i + 1}.answer`),
}));
export const researchWords = w;
