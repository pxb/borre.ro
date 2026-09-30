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

// The words live in src/content/copy/service-<slug>.md and services.md (#561).
// What stays here: which service leads on to which, and which ask the data
// question.
import { words, type Page } from "./copy";
import copyServices from "./copy.gen/services";
import copyAudit from "./copy.gen/service-audit";
import copyWorkshop from "./copy.gen/service-workshop";
import copyTraining from "./copy.gen/service-training";
import copyContextEngine from "./copy.gen/service-context-engine";
import copyWorkflows from "./copy.gen/service-agentic-workflows";
import copyApps from "./copy.gen/service-apps-dashboards";
import copyPlatform from "./copy.gen/service-agentic-platform";
import copySupport from "./copy.gen/service-support";

// Asked of every service that touches business data.
const shared = words(copyServices);
const DATA_FAQ = { q: shared.t("faq.data.q"), a: shared.t("faq.data.a") };

function servicePage(page: Page, next: string, dataFaq = false): ServicePage {
  const w = words(page);
  const count = (prefix: string) => {
    let n = 0;
    while (w.has(`${prefix}.${n + 1}.${prefix === "step" ? "title" : "q"}`)) n++;
    return n;
  };
  const steps = Array.from({ length: count("step") }, (_, i) => ({ t: w.t(`step.${i + 1}.title`), d: w.t(`step.${i + 1}.text`) }));
  const faqs = Array.from({ length: count("faq") }, (_, i) => ({ q: w.t(`faq.${i + 1}.q`), a: w.t(`faq.${i + 1}.a`) }));
  return {
    line: w.t("line"),
    cta: w.t("cta"),
    next,
    problem: w.t("problem"),
    steps,
    ...(w.has("price-note") ? { priceNote: w.t("price-note") } : {}),
    faqs: dataFaq ? [...faqs, DATA_FAQ] : faqs,
  };
}

export const servicePages: Record<string, ServicePage> = {
  audit: servicePage(copyAudit, "agentic-workflows"),
  workshop: servicePage(copyWorkshop, "audit"),
  training: servicePage(copyTraining, "agentic-workflows"),
  "context-engine": servicePage(copyContextEngine, "apps-dashboards", true),
  "agentic-workflows": servicePage(copyWorkflows, "context-engine", true),
  "apps-dashboards": servicePage(copyApps, "support"),
  "agentic-platform": servicePage(copyPlatform, "support", true),
  support: servicePage(copySupport, "agentic-workflows"),
};
