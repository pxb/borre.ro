import Anthropic from "@anthropic-ai/sdk";
import { sic } from "@/content/sic";

/* The company lookup behind /try (2026-10-08, #622): the visitor names a UK
   company and gets what the prospecting system reads from the public register.
   Companies House only, server side. Nothing the visitor types is stored or
   logged, and nothing they type reaches an AI model: the optional opening line
   is written from the register's facts for the company they picked.

   Limits, in layers:
   - Vercel's firewall: one rate-limit rule on /api/lookup per IP (set in the
     dashboard, Pedro), so a single visitor can't run the key into its limit.
   - Here: a budget of Companies House calls per instance per five minutes,
     well under the key's 600, and an hour's cache, so repeats cost nothing.
   - The AI line: off unless LOOKUP_AI_KEY is set, a daily cap per instance,
     and the spend limit on the key itself (set in the Claude Console). */

const CH = "https://api.company-information.service.gov.uk";
const KEY = process.env.CH_API_KEY ?? "";

export class Busy extends Error {}
export class Unavailable extends Error {}

// ------------------------------------------------------------------ budget and cache

const WINDOW = 5 * 60_000;
const CH_BUDGET = 300; // calls per instance per window; the key allows 600
let windowStart = 0;
let used = 0;

function spend(n: number) {
  const now = Date.now();
  if (now - windowStart > WINDOW) {
    windowStart = now;
    used = 0;
  }
  if (used + n > CH_BUDGET) throw new Busy();
  used += n;
}

const HOUR = 60 * 60_000;
const cache = new Map<string, { at: number; value: unknown }>();
function cached<T>(key: string): T | undefined {
  const hit = cache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > HOUR) {
    cache.delete(key);
    return undefined;
  }
  return hit.value as T;
}
function keep(key: string, value: unknown) {
  if (cache.size > 500) cache.delete(cache.keys().next().value as string);
  cache.set(key, { at: Date.now(), value });
}

async function ch<T>(path: string): Promise<T | null> {
  if (!KEY) throw new Unavailable();
  let res: Response;
  try {
    res = await fetch(CH + path, {
      headers: { Authorization: "Basic " + Buffer.from(KEY + ":").toString("base64") },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
  } catch {
    throw new Unavailable();
  }
  if (res.status === 404) return null;
  if (res.status === 429) throw new Busy();
  if (!res.ok) throw new Unavailable();
  return (await res.json()) as T;
}

// ------------------------------------------------------------------ words from the register

// Company names and towns arrive in capitals; the site uses none.
const KEEP = new Set(["PLC", "LLP", "LP", "UK", "CIC", "UKI", "GB", "NHS", "IT", "AI", "HR", "CRM", "PR", "TV"]);
const SMALL = new Set(["and", "of", "the", "for", "in", "on", "at", "upon", "by", "to"]);
export function tidy(s: string) {
  let first = true;
  return s.toLowerCase().replace(/[a-z0-9]+(?:'[a-z]+)?/g, (w) => {
    const lead = first;
    first = false;
    if (KEEP.has(w.toUpperCase())) return w.toUpperCase();
    if (!lead && SMALL.has(w)) return w;
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
}

export type Match = { number: string; name: string; status: string; town: string | null; year: string | null };

// Filing types the prospecting system reads as buying signals, by kind.
const SIGNALS: Record<string, string> = {
  AP01: "director",
  AP02: "director",
  TM01: "left",
  SH01: "shares",
  AD01: "office",
  MR01: "charge",
  NM01: "name",
  CERTNM: "name",
  PSC01: "control",
  PSC02: "control",
  PSC07: "control",
  NEWINC: "new",
};

// The last accounts' type, as a size band.
const SIZE: Record<string, string> = {
  "micro-entity": "micro",
  small: "small",
  "total-exemption-full": "small",
  "total-exemption-small": "small",
  "partial-exemption": "small",
  "audited-abridged": "small",
  "unaudited-abridged": "small",
  medium: "medium",
  full: "full",
  group: "group",
  "audit-exemption-subsidiary": "subsidiary",
  "filing-exemption-subsidiary": "subsidiary",
  dormant: "dormant",
};

export type Signal = { kind: string; date: string; count: number };
export type Brief = {
  number: string;
  name: string;
  status: string;
  sector: string | null;
  size: string;
  incorporated: string | null;
  town: string | null;
  owners: { people: number } | { parent: string } | null;
  signals: Signal[];
  asOf: string;
};

// ------------------------------------------------------------------ search and brief

export function companyNumber(q: string): string | null {
  const s = q.trim().toUpperCase().replace(/\s+/g, "");
  if (/^\d{1,8}$/.test(s)) return s.padStart(8, "0");
  if (/^[A-Z]{2}\d{6}$/.test(s)) return s;
  return null;
}

type SearchItem = {
  title?: string;
  company_number?: string;
  company_status?: string;
  date_of_creation?: string;
  address?: { locality?: string };
};

export async function search(q: string): Promise<Match[]> {
  const key = "s:" + q.toLowerCase();
  const hit = cached<Match[]>(key);
  if (hit) return hit;
  spend(1);
  const r = await ch<{ items?: SearchItem[] }>(`/search/companies?q=${encodeURIComponent(q)}&items_per_page=6`);
  const out = (r?.items ?? [])
    .filter((i) => i.company_number && i.title)
    .map((i) => ({
      number: i.company_number!,
      name: tidy(i.title!),
      status: i.company_status ?? "",
      town: i.address?.locality ? tidy(i.address.locality) : null,
      year: i.date_of_creation?.slice(0, 4) ?? null,
    }));
  keep(key, out);
  return out;
}

type Profile = {
  company_name?: string;
  company_status?: string;
  date_of_creation?: string;
  sic_codes?: string[];
  registered_office_address?: { locality?: string };
  accounts?: { last_accounts?: { type?: string } };
};
type Filings = { items?: { type?: string; date?: string }[] };
type Controllers = { items?: { kind?: string; name?: string; ceased_on?: string; ceased?: boolean }[] };

export async function brief(number: string): Promise<Brief | null> {
  const key = "b:" + number;
  const hit = cached<Brief>(key);
  if (hit) return hit;
  spend(3);
  const [p, f, c] = await Promise.all([
    ch<Profile>(`/company/${number}`),
    ch<Filings>(`/company/${number}/filing-history?items_per_page=100`),
    ch<Controllers>(`/company/${number}/persons-with-significant-control?items_per_page=25`),
  ]);
  if (!p?.company_name) return null;

  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);
  const found = new Map<string, Signal>();
  for (const item of f?.items ?? []) {
    const kind = SIGNALS[item.type ?? ""];
    if (!kind || !item.date || new Date(item.date) < since) continue;
    const s = found.get(kind);
    if (s) s.count++;
    else found.set(kind, { kind, date: item.date, count: 1 });
  }

  // Count the people who control it; name a parent company, never a person.
  const live = (c?.items ?? []).filter((x) => !x.ceased_on && !x.ceased);
  const parent = live.find((x) => x.kind?.startsWith("corporate-entity") || x.kind?.startsWith("legal-person"));
  const people = live.filter((x) => x.kind?.startsWith("individual")).length;
  const owners = parent?.name ? { parent: tidy(parent.name) } : people ? { people } : null;

  const code = (p.sic_codes ?? []).find((s) => sic[s] && s !== "99999") ?? p.sic_codes?.[0];
  const b: Brief = {
    number,
    name: tidy(p.company_name),
    status: p.company_status ?? "",
    sector: code ? (sic[code] ?? null) : null,
    size: SIZE[p.accounts?.last_accounts?.type ?? ""] ?? "none",
    incorporated: p.date_of_creation ?? null,
    town: p.registered_office_address?.locality ? tidy(p.registered_office_address.locality) : null,
    owners,
    signals: [...found.values()].sort((a, z) => z.date.localeCompare(a.date)),
    asOf: new Date().toISOString().slice(0, 10),
  };
  keep(key, b);
  return b;
}

// ------------------------------------------------------------------ the AI line (off by default)

const AI_KEY = process.env.LOOKUP_AI_KEY ?? "";
const AI_MODEL = process.env.LOOKUP_AI_MODEL ?? "claude-opus-5-5";
const AI_DAILY = Number(process.env.LOOKUP_AI_DAILY ?? 200);
let aiDay = "";
let aiUsed = 0;

export const lineOn = () => Boolean(AI_KEY);

const SYSTEM = `You write the first sentence of a cold email from a sales rep at a UK business-to-business supplier to the company described. It shows the rep has read the company's public record. Rules:
- Use only the facts given. Never guess why something happened, never add numbers, names or events that are not in the facts.
- One sentence, at most 35 words, plain UK English.
- No pitch, no greeting, no sign-off, no flattery, no exclamation marks, no em dashes.
- If the facts include a recent filing, open with the most recent one. Otherwise open with what the company does.
Reply with the sentence only.`;

/** One opening line from the register's facts, or null when off, capped or declined. */
export async function line(b: Brief, facts: string): Promise<string | null> {
  if (!AI_KEY) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (today !== aiDay) {
    aiDay = today;
    aiUsed = 0;
  }
  const key = "l:" + b.number;
  const hit = cached<string>(key);
  if (hit) return hit;
  if (aiUsed >= AI_DAILY) return null;
  aiUsed++;
  const client = new Anthropic({ apiKey: AI_KEY, timeout: 20_000, maxRetries: 1 });
  try {
    const r = await client.beta.messages.create({
      model: AI_MODEL,
      max_tokens: 2000,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages: [{ role: "user", content: facts }],
    });
    if (r.stop_reason === "refusal") return null;
    const text = r.content
      .flatMap((block) => (block.type === "text" ? [block.text] : []))
      .join(" ")
      .replace(/\s*[—–]\s*/g, ", ")
      .trim();
    if (!text) return null;
    keep(key, text);
    return text;
  } catch {
    // Rate limits, a spent key, an outage: the brief stands without the line.
    return null;
  }
}
