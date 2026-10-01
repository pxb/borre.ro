// Prints every scorecard question, band and the result for every possible set of
// answers, so a change to where the words live can be proved to change nothing
// (#561). Usage: node scripts/scorecard-fingerprint.mjs > before.json
import { createJiti } from "jiti";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": join(ROOT, "src") } });
const { questions, bands, result } = await jiti.import(join(ROOT, "src/content/scorecard.ts"));
const combos = [];
const walk = (i, a) => {
  if (i === questions.length) return combos.push({ ...a });
  for (let o = 0; o < questions[i].options.length; o++) walk(i + 1, { ...a, [questions[i].id]: o });
};
walk(0, {});
console.log(JSON.stringify({ questions, bands, results: combos.map((a) => [a, result(a)]) }));
