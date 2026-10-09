import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { brief, companyNumber, type Brief } from "@/lib/lookup";

/* The AI readiness review behind /try (Pedro, 2026-10-09, #622): read a few
   public pages of a site, check whether AI assistants can find and read it,
   confirm the company on Companies House the way the prospecting pipeline does
   (the registered number on the site, Trading Disclosures Regulations 2015,
   else a name match), and hand the facts to the AI step (review-advice.ts).
   Server only. Nothing is stored beyond an hour's cache in memory. */

const UA = "Mozilla/5.0 (compatible; borre.ro readiness review; +https://borre.ro/try)";
const MAX_PAGE = 1_500_000; // bytes read from any one page
const PAGE_TEXT = 4_000; // characters of text kept per page
const PAGES = 4; // inner pages read besides the homepage: two about the business, two customers use

export class Unreachable extends Error {}
// The site answered with a "prove you're human" page instead of its content.
export class Blocked extends Error {}
const BOT_WALL = /bot verification|just a moment|attention required|checking (your|if the site connection is) (browser|secure)|verify you are (a )?human|access denied|captcha|ddos protection/i;
export class BadUrl extends Error {}

// ------------------------------------------------------------------ fetching, public addresses only

function privateV4(ip: string) {
  const [a, b] = ip.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19)) || a >= 224;
}
function privateV6(ip: string) {
  const s = ip.toLowerCase();
  if (s.startsWith("::ffff:")) return privateV4(s.slice(7));
  return s === "::" || s === "::1" || s.startsWith("fc") || s.startsWith("fd") || s.startsWith("fe8") || s.startsWith("fe9") ||
    s.startsWith("fea") || s.startsWith("feb") || s.startsWith("ff");
}

// Refuses anything that isn't a public web address: other schemes, odd ports,
// raw or private IPs, and names that resolve to a private network.
async function publicUrl(raw: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new BadUrl();
  }
  if (!/^https?:$/.test(u.protocol) || (u.port && u.port !== "80" && u.port !== "443") || u.username || u.password) throw new BadUrl();
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host) || !host.includes(".") || /\.(local|internal|localhost|home|lan)$/i.test(host)) throw new BadUrl();
  const addrs = await lookup(host, { all: true }).catch(() => []);
  if (!addrs.length) throw new Unreachable();
  if (addrs.some((a) => (a.family === 4 ? privateV4(a.address) : privateV6(a.address)))) throw new BadUrl();
  return u;
}

type Got = { url: string; status: number; type: string; body: string };

// GET with redirects followed by hand, each hop checked, and the body capped.
async function get(raw: string, timeoutMs = 8000): Promise<Got | null> {
  let url = raw;
  for (let hop = 0; hop < 4; hop++) {
    let u: URL;
    try {
      u = await publicUrl(url);
    } catch {
      return null;
    }
    let res: Response;
    try {
      res = await fetch(u, {
        redirect: "manual",
        headers: { "User-Agent": UA, Accept: "text/html,text/plain,application/xml;q=0.9,*/*;q=0.5" },
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      });
    } catch {
      return null;
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = new URL(res.headers.get("location")!, u).toString();
      continue;
    }
    const type = res.headers.get("content-type") ?? "";
    let body = "";
    if (res.body && /text|xml|json|html/i.test(type || "text")) {
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let n = 0;
      for (;;) {
        const { done, value } = await reader.read().catch(() => ({ done: true, value: undefined }));
        if (done || !value) break;
        n += value.length;
        body += dec.decode(value, { stream: true });
        if (n > MAX_PAGE) {
          reader.cancel().catch(() => {});
          break;
        }
      }
    }
    return { url: u.toString(), status: res.status, type, body };
  }
  return null;
}

// ------------------------------------------------------------------ reading pages

const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", pound: "£", copy: "©", rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"', ndash: "-", mdash: "-", hellip: "..." };
const decode = (s: string) =>
  s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : " ";
    }
    return ENT[e.toLowerCase()] ?? m;
  });

function text(html: string, keepChrome = false) {
  // Comments first: a commented-out tag ("<!-- <script ...></script-->")
  // would otherwise open a match that runs on to the next real closing tag.
  let h = html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1\s*>/gi, " ");
  if (!keepChrome) h = h.replace(/<(nav|header)\b[\s\S]*?<\/\1\s*>/gi, " ");
  return decode(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
const meta = (html: string, re: RegExp) => decode((html.match(re)?.[1] ?? "").trim());
const words = (t: string) => (t ? t.split(" ").length : 0);

// Inner pages worth reading, by what their links say: two on what the
// business does and who it serves (for the suggestions), two that answer
// customers' questions (for the chat): help, delivery, returns, booking.
const WANT = /about|service|what-we-do|solutions|products|sectors|industr|who-we|our-work|\bwork\b|case|clients/i;
const ASKED = /faq|help|question|support|deliver|shipping|returns|refund|booking|book|appointment|pricing|prices|fees|how-it-works|contact/i;
function innerLinks(html: string, base: URL) {
  const seen = new Set<string>([base.pathname.replace(/\/$/, "") || "/"]);
  const scored: { url: string; score: number; asked: boolean }[] = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let u: URL;
    try {
      u = new URL(m[1], base);
    } catch {
      continue;
    }
    if (u.hostname.replace(/^www\./, "") !== base.hostname.replace(/^www\./, "")) continue;
    if (/\.(pdf|jpe?g|png|gif|webp|zip|docx?|xlsx?|mp4|mp3)$/i.test(u.pathname)) continue;
    const path = u.pathname.replace(/\/$/, "") || "/";
    if (seen.has(path) || path.split("/").length > 3) continue;
    const label = text(m[2]).toLowerCase();
    const asked = ASKED.test(path) || ASKED.test(label);
    const want = (WANT.test(path) ? 2 : 0) + (WANT.test(label) ? 1 : 0);
    const score = Math.max(want, asked ? (ASKED.test(path) ? 2 : 1) : 0) - (/blog|news|privacy|terms|cookie|login|cart|account/i.test(path) ? 3 : 0);
    if (score > 0) {
      seen.add(path);
      scored.push({ url: u.origin + path, score, asked: asked && !want });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  // Half each where the site has both; otherwise whatever it has.
  const half = PAGES / 2;
  const asked = scored.filter((s) => s.asked).slice(0, half);
  const rest = scored.filter((s) => !asked.includes(s)).slice(0, PAGES - asked.length);
  return [...rest, ...asked].map((s) => s.url);
}

// ------------------------------------------------------------------ the checks

export type Check = { id: string; ok: boolean; vars?: Record<string, string | number> };

// AI crawlers by the name their makers publish for robots.txt.
const AI_BOTS: [string, string][] = [
  ["gptbot", "ChatGPT"], ["oai-searchbot", "ChatGPT search"], ["chatgpt-user", "ChatGPT"],
  ["claudebot", "Claude"], ["claude-searchbot", "Claude search"], ["claude-user", "Claude"], ["anthropic-ai", "Claude"],
  ["perplexitybot", "Perplexity"], ["perplexity-user", "Perplexity"], ["google-extended", "Gemini"],
  ["applebot-extended", "Apple Intelligence"], ["ccbot", "Common Crawl"],
];

// Which of those robots.txt shuts out of the whole site.
function blockedBots(robots: string) {
  const groups: { agents: string[]; rules: string[] }[] = [];
  let cur: { agents: string[]; rules: string[] } | null = null;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^(user-agent|disallow|allow)\s*:\s*(.*)$/i);
    if (!m) continue;
    const k = m[1].toLowerCase();
    if (k === "user-agent") {
      if (!cur || cur.rules.length) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(m[2].toLowerCase());
    } else if (cur) cur.rules.push(`${k}:${m[2].trim()}`);
  }
  const shut = (rules: string[]) => rules.includes("disallow:/") && !rules.some((r) => r === "allow:/");
  const all = groups.find((g) => g.agents.includes("*"));
  const names = new Set<string>();
  for (const [bot, name] of AI_BOTS) {
    const own = groups.find((g) => g.agents.includes(bot));
    if (own ? shut(own.rules) : all ? shut(all.rules) : false) names.add(name);
  }
  return [...names];
}

const CHATS: [RegExp, string][] = [
  [/widget\.intercom\.io|intercomcdn|intercomSettings/i, "Intercom"], [/js\.driftt\.com|drift\.com\/include/i, "Drift"],
  [/js(-eu1)?\.hs-scripts\.com|js(-eu1)?\.usemessages\.com/i, "HubSpot chat"], [/code\.tidio\.co/i, "Tidio"],
  [/client\.crisp\.chat/i, "Crisp"], [/embed\.tawk\.to/i, "tawk.to"], [/static\.zdassets\.com|zopim/i, "Zendesk"],
  [/cdn\.livechatinc\.com/i, "LiveChat"], [/wchat\.freshchat\.com|fw-cdn\.com/i, "Freshchat"], [/olark/i, "Olark"],
  [/chatbase\.co/i, "Chatbase"], [/voiceflow/i, "Voiceflow"], [/botpress/i, "Botpress"], [/landbot/i, "Landbot"],
  [/gorgias/i, "Gorgias"], [/smartsupp/i, "Smartsupp"], [/userlike/i, "Userlike"], [/chatra/i, "Chatra"],
  [/wa\.me\/|api\.whatsapp\.com/i, "WhatsApp"],
];
// Online booking: a booking tool, a form with an email field, or a link that
// says it books a call, a demo or an appointment.
const BOOK_LINK = /<a\b[^>]*>[^<]{0,40}\b(book|schedule|arrange)\b[^<]{0,30}\b(call|demo|consultation|meeting|appointment|viewing|table|visit)\b/i;
const BOOKING = /calendly\.com|cal\.com\/|meetings(-eu1)?\.hubspot\.com|acuityscheduling|youcanbook\.me|outlook\.office\.com\/bookwithme|simplybook|setmore|squareup\.com\/appointments|<form\b[\s\S]*?type=["']?email/i;
const BUSINESS = /"@type"\s*:\s*\[?\s*"(Organization|Corporation|LocalBusiness|ProfessionalService|Store|Restaurant|[A-Za-z]*Business|[A-Za-z]*Service|Hotel|Dentist|Physician|LegalService|AccountingService|RealEstateAgent|AutoDealer|EducationalOrganization|NGO)"/;

// ------------------------------------------------------------------ the company

export type Company = { status: "verified"; number: string; name: string; brief: Brief } | { status: "none" };

const NUMBER = /(?:company|registration|registered|reg\.?)\s*(?:no\.?|number|num\.?|#)?[^0-9a-z]{0,12}(?:in england(?: and wales)?|in scotland|in northern ireland)?[^0-9a-z]{0,12}(?:no\.?|number)?[^0-9a-z]{0,6}((?:SC|NI|OC|SO|NC)?\s?\d{6,8})\b/gi;

// Each number with the 200 characters before it, where the company's own name
// usually sits ("Your Grind Ltd (trading as Pact Coffee) ... company number").
function numbersIn(t: string) {
  const out = new Map<string, string>();
  for (const m of t.matchAll(NUMBER)) {
    const n = companyNumber(m[1].replace(/\s/g, ""));
    if (n && !out.has(n)) out.set(n, t.slice(Math.max(0, (m.index ?? 0) - 200), m.index).toLowerCase());
  }
  return [...out].slice(0, 4);
}

const STOP = new Set(["limited", "ltd", "plc", "llp", "the", "and", "group", "holdings", "company", "services", "solutions", "trading"]);
const stems = (s: string) => s.toLowerCase().replace(/&/g, " ").split(/[^a-z0-9]+/).filter((x) => x.length > 2 && !STOP.has(x));

// The name the site gives itself: og:site_name, else the part of the title
// that matches the domain ("... Subscription Service | Pact Coffee" is Pact
// Coffee), else the title's first part, else the domain.
function siteName(html: string, host: string) {
  const og = meta(html, /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)/i) || meta(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name/i);
  if (og) return og;
  const stem = host.replace(/^www\./, "").split(".")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
  const parts = meta(html, /<title[^>]*>([\s\S]*?)<\/title>/i).split(/\s[|\-:\u2013\u2014]\s/).map((p) => p.trim()).filter(Boolean);
  const own = parts.find((p) => {
    const ws = p.toLowerCase().split(/[^a-z0-9]+/).filter((x) => x.length > 2);
    return ws.length > 0 && ws.length <= 4 && ws.every((x) => stem.includes(x));
  });
  return own || parts[0] || stem;
}

// Confirmed only by the registered number the site itself shows, as the law
// asks a company to (the prospecting pipeline's "verified"). A name match
// alone picked the wrong company too often to show on a public page
// (2026-10-09: a denim maker matched to a dormant ceramics firm), so without
// a number the review says so and goes on without the register.
//
// A site can name another firm's number (a payment provider's, a landlord's),
// so each registered company is scored: its name in the domain or the site's
// own name counts most, its name just before the number counts too. The best
// one that scores at all wins.
async function company(allText: string, own: string): Promise<Company> {
  let best: { score: number; c: Company } | null = null;
  for (const [n, before] of numbersIn(allText)) {
    const b = await brief(n).catch(() => null);
    if (!b) continue;
    const ws = stems(b.name);
    const score = (ws.some((x) => own.includes(x)) ? 2 : 0) + (ws.some((x) => before.includes(x)) ? 1 : 0);
    if (score && (!best || score > best.score)) best = { score, c: { status: "verified", number: n, name: b.name, brief: b } };
  }
  return best?.c ?? { status: "none" };
}

// ------------------------------------------------------------------ the whole read

export type SiteRead = {
  host: string;
  url: string;
  name: string;
  title: string;
  description: string;
  words: number;
  checks: { ai: Check[]; customers: Check[] };
  pages: { url: string; text: string }[];
  // Server only, never sent to the browser: the homepage as fetched and every
  // page's text with its header and footer, where the registered number sits.
  homeHtml: string;
  fullText: string;
};

export function normalise(input: string) {
  let s = input.trim();
  if (!s || s.length > 200 || /\s/.test(s)) throw new BadUrl();
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  const u = new URL(s);
  return `${u.protocol}//${u.hostname.toLowerCase()}/`;
}

export async function readSite(start: string): Promise<SiteRead> {
  const home = (await get(start)) ?? (start.startsWith("https:") ? await get(start.replace("https:", "http:")) : null);
  if (home && (home.status === 403 || home.status === 429 || home.status === 503) && BOT_WALL.test(home.body)) throw new Blocked();
  if (!home || home.status >= 400 || !/html/i.test(home.type) || !home.body) throw new Unreachable();
  // A security check page instead of the site: say so rather than review it.
  const firstText = text(home.body);
  if (words(firstText) < 60 && BOT_WALL.test(meta(home.body, /<title[^>]*>([\s\S]*?)<\/title>/i) + " " + firstText)) throw new Blocked();
  const base = new URL(home.url);
  const root = base.origin;
  const [robots, llms, sitemap, ...inner] = await Promise.all([
    get(root + "/robots.txt", 5000),
    get(root + "/llms.txt", 5000),
    get(root + "/sitemap.xml", 5000),
    ...innerLinks(home.body, base).map((u) => get(u, 6000)),
  ]);

  const homeText = text(home.body);
  const pages = [{ url: home.url, text: homeText.slice(0, PAGE_TEXT) }];
  for (const p of inner) if (p && p.status < 400 && /html/i.test(p.type)) pages.push({ url: p.url, text: text(p.body).slice(0, PAGE_TEXT) });

  const robotsOk = !!robots && robots.status < 400 && !/html/i.test(robots.type) && /user-agent|sitemap|disallow|allow/i.test(robots.body);
  const blocked = robotsOk ? blockedBots(robots!.body) : [];
  const llmsOk = !!llms && llms.status < 400 && !/html/i.test(llms.type) && llms.body.trim().length > 40;
  const sitemapOk = (!!sitemap && sitemap.status < 400 && /<(urlset|sitemapindex)/i.test(sitemap.body)) || (robotsOk && /^\s*sitemap\s*:/im.test(robots!.body));
  const allHtml = [home.body, ...inner.map((p) => p?.body ?? "")].join("\n");
  const chat = CHATS.find(([re]) => re.test(home.body))?.[1];
  const description = meta(home.body, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || meta(home.body, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description/i);
  const n = words(homeText);

  return {
    host: base.hostname.replace(/^www\./, ""),
    url: home.url,
    name: siteName(home.body, base.hostname),
    title: meta(home.body, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description,
    words: n,
    pages,
    homeHtml: home.body,
    fullText: [home.body, ...inner.map((p) => p?.body ?? "")].map((h) => text(h, true)).join(" "),
    checks: {
      ai: [
        { id: "robots", ok: robotsOk },
        ...(robotsOk ? [{ id: "ai-access", ok: !blocked.length, vars: { names: blocked.join(", ") } }] : []),
        { id: "llms", ok: llmsOk },
        { id: "sitemap", ok: sitemapOk },
        { id: "schema", ok: BUSINESS.test(allHtml) },
        { id: "readable", ok: n >= 150, vars: { words: n } },
        { id: "description", ok: description.length > 20 },
      ],
      customers: [
        { id: "chat", ok: !!chat, vars: { name: chat ?? "" } },
        { id: "booking", ok: BOOKING.test(allHtml) || BOOK_LINK.test(allHtml) },
      ],
    },
  };
}

// Where a site keeps its legal details: its own links to terms, privacy or
// company pages first, then the usual paths (Shopify's included).
const LEGAL_LINK = /terms|privacy|legal|imprint|company-info|about-us/i;
const LEGAL_PATHS = ["/terms", "/terms-and-conditions", "/privacy-policy", "/policies/terms-of-service", "/legal", "/contact"];

function legalPages(site: SiteRead) {
  const base = new URL(site.url);
  const found: string[] = [];
  for (const m of site.homeHtml.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)) {
    try {
      const u = new URL(m[1], base);
      if (u.hostname === base.hostname && LEGAL_LINK.test(u.pathname) && !found.includes(u.origin + u.pathname)) found.push(u.origin + u.pathname);
    } catch {}
  }
  for (const p of LEGAL_PATHS) if (!found.includes(base.origin + p)) found.push(base.origin + p);
  return found.slice(0, 6);
}

export async function findCompany(site: SiteRead): Promise<Company> {
  // What the site calls itself: its domain and its own name, in plain words.
  const own = `${site.host.split(".")[0]} ${site.name}`.toLowerCase();
  // The number usually sits in the footer of the pages already read.
  const first = await company(site.fullText, own);
  if (first.status === "verified") return first;
  // If not, the legal pages.
  const legal = await Promise.all(legalPages(site).map((u) => get(u, 5000)));
  const more = legal.filter((l) => l && l.status < 400).map((l) => text(l!.body, true)).join(" ");
  return more ? company(more, own) : first;
}
