<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# borre.ro — build standards

Profile site for an AI and Revenue Operations practice, written as "we" (a practice, not a sole trader), run by Pedro Borrero. The site no longer credits a partner practice (Pedro, 2026-10-09). Positioning lives in the Obsidian vault at `01 Projects/AI Cubed/`. Build spec is Baserow card #327.

## Design

**The site's design language is `DESIGN.md`** (grounds, lines, accent, the figure form, items,
headers, spacing). Read it before building any page or slide, and extend it there rather than
inventing a one-off.

Follow the Vercel Web Interface Guidelines: https://vercel.com/design/guidelines

The rules that bite most here:
- Every focusable element shows a visible, unobscured focus ring. All flows keyboard-operable.
- Honour `prefers-reduced-motion` with real reduced variants. Animations cancelable by user input.
- Never `transition: all`. List the properties. Animate `transform` and `opacity`, not layout.
- Prefer CSS animation over JavaScript. `Reveal` and `CountUp` (`motion-bits.tsx`) run on IntersectionObserver and requestAnimationFrame, so the text pages do not load the `motion` library (54 KB gzipped); `motion` is only on the homepage story and the demos.
- Reduced motion is handled per piece, not by a blanket `0.01ms` rule: each animation carries its own reduced variant.
- Hit targets at least 24px, 44px on mobile. Inputs at least 16px on mobile.
- `font-variant-numeric: tabular-nums` anywhere numbers are compared.
- Shadows use at least two layers, ambient plus direct.
- Hover, active and focus all increase contrast.
- Explicit image dimensions, lazy-load below the fold, preload critical fonts.
- Design the empty, sparse, dense and error states, not just the happy one.
- Set `meta theme-color` to match the page background.

## Checks

Impeccable is installed: https://github.com/pbakaus/impeccable

- `npm run build` before every commit, and check the **exit code**, not the output. The bundler prints "Compiled successfully" before type checking runs, so grepping the log hides a failing build.
- `npx impeccable detect src/` before every commit. 61 deterministic rules, no API key.
- `/impeccable critique` and `/impeccable polish` for the subjective layer.
- A clean detector run is evidence, not proof. It does not judge whether the design is good.

## Components

- No component library at runtime (2026-09-24 audit): the one shadcn/Base UI piece in use, the phone menu's sheet, was 33 KB gzipped on every page and is now a native `<dialog>` (`mobile-nav.tsx`). The unused shadcn components were deleted. Prefer the platform (dialog, IntersectionObserver, CSS transitions) before adding a dependency. Icons are lucide.
- 21st.dev for marketing blocks and richer components: https://21st.dev/community/components
- Aceternity for signature moments only, not as the default look.

Do not let the site read as a generic AI-generated template. Vary layout rhythm; no long column of identical stacked cards.

## Visual effects budget

Candidates: react-three-fiber, shadergradient, liquid-glass-js, liquid-logo.

Rule: **one** signature visual on the site, not four. Everything else stays flat and fast. Any WebGL or shader work must be lazy-loaded, must not block first paint, must have a static fallback, and must be disabled under `prefers-reduced-motion`.

## Copy

Written for non-technical founders and revenue leaders. Plain language first: describe what it does for the business. Technical terms (RAG, hybrid retrieval, MCP, n8n) live only in a named layer below the plain copy, the small technical line under each service on /services, the "Built with" row near the end of each service page (moved below the questions 2026-09-30: under "What you get" it made the page read technical to a non-technical reviewer), the "Runs on" row and the machine surfaces (llms.txt, /api/mcp, JSON-LD). Never in the hero or the first screen. Internal jargon (corpus, canon, entities, RRF) never ships.

No unsourced claims: every figure links to its source or comes from the client work and is labelled if estimated. No defining by negation, no status badges, no "most" claims. One offer name, `site.cta`, on every CTA that points at /contact, except a service's own button (below).

Voice follows the vault skill `00 Meta/Skills/pedro-writing-style.md`. Plain, direct, no marketing throat-clearing, no em dashes, no three-part lists for rhythm.

## Homepage story

Hero, then a horizontal pinned story (vertical below 1024px and under reduced motion) of four steps (2026-09-30, when the homepage felt endless on a phone: 06 Support came off, the managed service is on /services; 05 Value folded into 01 Problem as its upside figure):
01 Problem, 02 Review (the free 30-minute call; "Discovery" read as a sales stage and is a paid phase
elsewhere in this market), 03 Method (AI³: Context × Agents × Evals, with
the live Ask-the-Context-Engine demo), 04 Engagement (ways to start, audit to full build, with prices).
Content and
step ids live in `src/components/how-we-work.tsx`, the figures in `evidence` and `upside` in `site.ts`.

**Slide standard (#584, 2026-09-24; labels and accents per DESIGN.md):** left, the title and one
short paragraph. Right, one `Frame`: a 2px ink rule, a label only where it names something the title
doesn't, no boxed or tinted backgrounds. Inside the frame each
slide has its own shape, matched to what it says, in `src/components/story-forms.tsx`: Problem as
three barriers in ink, each followed by our answer (the fear, then the fix), Review as a 0 to 30 minute timeline, Method as the Context × Agents × Evals
formula over the Ask demo, Engagement as a ladder of entry points that runs on, dashed, into "Then we keep it running" (a link to /services/support),
Problem ends on the upside: a fourth row after the three problems, same shape, the figure (`upside` in site.ts, PwC 163%) in the accent and "Done properly, AI pulls you ahead." where the answers sit. Every pinned slide must fit above the offer bar down to 1280x720 (`Lab/borre-tools/cdp-slide-fit.mjs`); short screens tighten the slide padding and the Method slide (`max-height` variants). No prices on the slides. The six were all one row list
before and read as text-heavy and identical.

The ladder draws the staircase above and sets every label on one baseline under it; labels hung
under their own treads stepped down the page and read as falling. The loop carries short headlines
and, since 2026-09-30, is a tab set like the other slides (Pedro: not a dot circling on its own):
hover, tap, arrow keys or the story's scroll pick a stop, the accent dot runs clockwise round the ring
to it, and its one line shows under the loop. The 02 Review stop fills in place (a marker flying in
from the side was distracting). The 04 ladder uses one short word per tread (Audit, Workshop,
Training, Automation) so nothing wraps, with each service's own line of value under it. The 03
Ask demo uses the portal's design, like the Context Engine preview on /work. No footer states the obvious
("free, and booked straight into the calendar" was cut), and no footer repeats the left paragraph.

Where a slide has several items, only the picked item's description shows (hover, focus, tap or the
arrow keys; a tab set). In the pinned story the scroll also picks (2026-09-25): a timeline of 14
stops in `how-we-work.tsx` (one unit of 64vh to move between slides, half a unit per item), `x`
flat across each slide's own stops, and a snap that settles on the next stop in the direction of
travel (12 stops since 2026-09-30). `usePick(n, label, at)` takes the reached item and picks only when it changes, never while
focus is inside the set; hover picks on pointer movement, not entry, so a slide moving in under a
resting pointer picks nothing. Checked in headless Edge by `Lab/borre-tools/cdp-story.mjs` (every
stop, wheel steps, keyboard, reduced motion, no-JS) and `cdp-story-wheel.mjs`. All descriptions sit in one grid cell so the slot never jumps. Server render
and no-JS show every description inline, so no copy is lost. Reduced motion keeps the forms and drops
the animation (bars drawn full, no figure roll-up, the loop's dot jumps). Slides are
top-aligned with an even gap under the step bar. The booking offer is not in the story; it is the
site-wide fixed `OfferBar`.

## Service pages (#602, 2026-09-29)

Pedro: the site sells, the scope protects. /services is a short overview; every service has its own
page at `/services/<slug>`, in the order a buyer decides: the outcome as the lead, the problem (the
buyer's situation in their terms), what you get, how it runs, the case studies that use it (or, with
none yet, the product it makes: `PlatformPreview`), the price (small, with at most one commercial
term such as the audit credit), questions (the objections competitors' pages answer: who builds it,
who takes part, who owns it, what happens to our data). Each thing is said once: an answer paragraph
and an outcomes list were cut (2026-09-30) because they repeated the lead, the list and the steps.
Row labels are plain business words, never "who it's for" or "where it pays". Page
content lives in `src/content/service-pages.ts`; name, what, includes, price and duration stay in
`serviceCategories` so the overview and the page cannot drift. Scope, exclusions and change terms
never go on the site: they live in the scope sheet shared with a proposal (#603). Positive wording
only; no "not included".

Each service has its own button (`cta`, plain: "Book an audit", "Automate a task"). `ctaFor(path)`
gives it to the page header, the footer band and the offer bar on that service's page, and links to
`/contact?service=<slug>`; `BookingFrame` passes the service name into Cal.com's notes field
(`notes=` prefill, checked 2026-09-29). Clicks carry `data-track-service`.

## AI ROI calculator, `/scorecard` (#581, 2026-09-30)

Called the readiness scorecard until 2026-10-09 and the AI value calculator until 2026-10-10 (#624), when
Pedro asked for the pounds version: a ninth question prices an hour of the admin (wages plus employer
costs, bands of about £15, £25, £40 and £60), the hours back become pounds a year over 46 working weeks
(52 less 5.6 weeks' statutory holiday, gov.uk), and the recommended service's published starting price
is shown as weeks of the time it gives back. The address stays `/scorecard` so links keep working.

`/scorecard`: eight multiple-choice questions (`src/content/scorecard.ts`), native radios in
`src/components/scorecard.tsx`. Two questions size the repeated admin (people x hours, at midpoints);
the result shows a band, the hours back as a range in the figure form, labelled as an estimate with
its assumption on screen (a quarter to a half of that time moving to software, set under McKinsey's
60 to 70% technical potential, linked), and one service to
start with (audit by default; training if they want the team using AI well; workshop if leadership
has talked but not agreed; workflow automation when everything is in place). Its button stores a
one-line summary in sessionStorage, which `BookingFrame` adds to the Cal.com notes. Answers are
never put in a URL.

**Results log (option A, Pedro 2026-09-30).** Each finished set of answers is posted once, after a
1.5 s pause, to `/api/scorecard`, which recomputes the result from the same code and forwards it to
the n8n workflow `W8RamKJvJGkWRaLG` ("borre.ro: scorecard results (anonymous)", export in
`ai-stack/n8n-workflows`), which keeps known fields only and inserts into the data table
`borre_scorecard_results` (`rQRs5Sb1TVVgw8Rg`). No name, email or IP: n8n sees Vercel, and the
workflow keeps no run data for successful runs, so /privacy is unchanged. The webhook URL is in this
public repo; the n8n side drops anything malformed. Option B ("email me my result", real lead
capture, needs a /privacy change) is paused on #581.

Linked from /services, the footer and the header's Services menu.

## Free tools (#622, 2026-10-09)

Three, listed together as "Try it free" under Services in both menus (`tools` in `site.ts`): the
AI ROI calculator (above), the AI readiness review and the signal check.

**AI readiness review, `/try`** (Pedro's spec, 2026-10-09). A visitor pastes a website; `/api/review`
streams one JSON line per stage (site, checks and pages read; company; chat and suggestions; done), so
the card fills in as it goes. `src/lib/review.ts` reads the homepage and four inner pages, two about
the business and two customers use (help, delivery, returns, booking, contact), refusing anything that
isn't a public web address (other schemes and ports, raw or private IPs, names resolving to private
networks; every redirect hop checked; bodies capped). Measured checks: robots.txt, AI crawlers
allowed (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others), llms.txt, sitemap, business
structured data, text readable without scripts, meta description, a chat widget, online booking. A
"prove you're human" page is reported as such, not reviewed. Waits: 15 s for the homepage (a slow one is
reported as slow, not as unreachable), 10 s for each other page; a file counts as missing only when the
site answers 404 or 410, so a timeout leaves that check out instead of claiming robots.txt or a sitemap
is missing (a slow WordPress site behind Cloudflare took 7 to 12 s per uncached page, 2026-10-09). The
AI step gets what is left of 55 s. Functions run in London (`vercel.json` regions `lhr1`; Hobby allows
one region): the default, Washington, made UK sites slower and timed one out. Our own failures (the
firewall's 429, a cut-off stream) say "on our side", never that their site couldn't be opened. The company is confirmed **only by the
registered number the site shows** (the law asks limited companies to), scored against the domain
and the site's own name; a name match alone picked wrong companies and was removed. Then
`src/lib/review-advice.ts` makes one call to a model through OpenRouter (`src/lib/openrouter.ts`;
providers that don't keep data; structured output) for two things:

- **Their site as a chat** ("Ask {name}", Pedro's go-ahead 2026-10-09): the four questions a customer
  would most likely ask, answered only from the pages read, each with the page it came from (the
  schema only allows pages we read). A question the pages don't answer is shown as a gap. Phone
  numbers and email addresses are replaced, never repeated. Typed out like the Ask demo, at once
  under reduced motion; the longest question and answer sit invisibly underneath so it never jumps.
- **Two or three of our services** with one specific automation each and the closest case study; the
  server keeps only known slugs.

Model: `REVIEW_MODEL`, Claude Sonnet 5.5 by default. Pedro had suggested DeepSeek V4.1 Flash; on the
17-site eval with the chat (2026-10-09; Sonnet finished 6 sites before the account ran low) both
stayed grounded, but DeepSeek dodged questions the pages
couldn't answer ("book a demo" for "how long to get started"), pasted marketing paragraphs as answers
and sometimes ignored wording rules; Sonnet asked the questions customers really ask (price, finance)
and wrote naturally. Cost per review: Sonnet about 1.2p to 2p, DeepSeek about 0.1p. Switching is
`REVIEW_MODEL=deepseek/deepseek-v4.1-flash` with `REVIEW_EFFORT=none`. `REVIEW_EFFORT` sets the
model's thinking: `low` by default, which Sonnet 5.5 needs (it refuses `none`); DeepSeek needs `none`
(at `low` it ran past 40 s). The key's own limit doesn't reserve money: the OpenRouter account's
balance is shared with other keys, and when it runs out calls fail with 402 and the review shows its
checks without the AI part. The summary in the answer is for checking only and isn't shown (it would
tell visitors what their own business does). Passed checks are one short line; only misses say why
they matter. The checks are measured; the chat and suggestions are labelled as written by AI.
Words: `copy/try.md`. Evaluated with `Lab/borre-tools/review-eval.mjs` over the prospecting pack's
hand-verified sites (2026-10-09: 16 of 17 numbers right, none wrong, the one miss a bot wall).
Checked by `cdp-review.mjs` (chat included).

**Counting runs** (Pedro, 2026-10-10; Vercel Hobby keeps logs an hour and drops custom events): each
review sends one anonymous line to the n8n workflow "borre.ro: readiness review runs (anonymous)"
(`g8lscLMvhXznYBHV`), stored in the n8n data table `borre_review_runs`: outcome, company found, chat
and suggestions returned, gaps, seconds, model cost, source (`try` or a case study slug) and
environment. Never the address or the company, so /privacy stays true. Sent only from a deployment
(`VERCEL_ENV`), or locally with `REVIEW_LOG=1`; filter on `env = production` for real use.

**From a case study** (Pedro, 2026-10-10): each case study has a "Your business" row after Results,
"What would this do for your business?", linking to `/try?from=<slug>`. The review then asks the model
to make that kind of work its first pick where it fits. The row is drawn after load
(`case-review.tsx`) to keep the case studies' HTML small. Checked by `cdp-case-review.mjs`.

**Signal check** (the company lookup, on `/work/prospecting-loop#signal-check`; it was `/try` until
2026-10-09): name any UK company, see what the prospecting system reads from the register
(`src/lib/lookup.ts`, `/api/lookup`, words in `copy/signal-check.md`). Loaded after the page
(`company-lookup-lazy.tsx`). Checked by `cdp-try.mjs`.

**Settings (Vercel, Preview and Production):** `CH_API_KEY` (a Companies House key for the site only),
`OPENROUTER_API_KEY` (a key with a credit limit; without it both AI parts switch off and the rest still
works), optional `REVIEW_MODEL`, `REVIEW_EFFORT`, `REVIEW_DAILY` (default 150 per instance), `LOOKUP_AI_MODEL`,
`LOOKUP_AI_DAILY`. One firewall rate-limit rule (Hobby allows one): paths starting `/api/`, per IP.
Same-site requests only; nothing typed is stored or logged (only the model's cost is). /privacy
names both tools.

**Page size.** Mobile Lighthouse adds a round trip (about 150 ms of first paint) once a page's
compressed HTML and headers pass about 14.6 KB. The homepage and the prospecting case study sit just
under it; check with `Lab/borre-tools/html-budget.mjs` after any change to them, copy included.

## Agent-facing surfaces (#564, 2026-09-30)

`/llms.txt` and `/api/mcp` are read by agents shortlisting suppliers, so both open with how to start:
`howToStart` in `site.ts` (the free call's booking link, the scorecard, `/contact?service=<slug>`,
email). Headings and MCP tools use the menu's words (Case studies, Services: `list_case_studies`,
`get_case_study`, `list_services`, `how_to_start`); the old names (`list_work`, `get_work`,
`list_solutions`) still answer. Every price carries `priceBasis` (one-off, one-off build with running
costs on the client's own accounts, or monthly), so a summary can't turn a build price into a monthly
fee. Discoverable from robots.txt (Allow lines), the sitemap and a `<link rel="alternate">` in every
page head, as well as the footer.

Each service page ends on a Next step row: the service buyers usually move on to (`next` in
`service-pages.ts`, #583).

## Newsletter (#606, 2026-09-30; Pedro renamed it from Writing)

`/newsletter`: articles and the monthly roundup (The Boring Bits, AI for UK Business Leaders; name and
Substack address in `site.newsletter`). Each piece is a markdown file in `src/content/newsletter/<slug>.md`
with front matter (title, description, date, type: article or roundup, draft), rendered to HTML at
build time by `marked` in `src/lib/newsletter.ts`, styled by `.prose` in globals.css (no side bars on
quotes). **Drafts show everywhere except the live site** (Vercel production), carry
"Draft, preview only" and noindex, so Pedro reads them on a preview. The Newsletter link joins the nav, sitemap,
llms.txt and the RSS feed (`/newsletter/feed.xml`) only when something is published on that deploy.
Each piece has its own share image. borre.ro publishes first; Substack and LinkedIn link back.

**Freshness and companion skills (Pedro, 2026-09-30).** AI moves fast, so every post carries `checked`
(the day every source was last read at the source), shown as "Sources checked <date>"; a published post
dated more than 30 days after its check fails the build. Figures carry their date or the model they were
measured on. Every post can carry a companion Agent Skill (open standard, agentskills.io) in
`src/content/newsletter/skills/<name>/`, validated at build (name matches folder, description length),
served as `/newsletter/skills/<name>.zip` (for the Claude and ChatGPT apps; stored ZIP from `src/lib/zip.ts`)
and `/newsletter/skills/<name>/SKILL.md` (coding agents), listed in llms.txt with the post, and offered
under "Use this with your AI" with a plain `skill_note`. A draft's skill stays off the live site with it. The easiest route comes first: a
copy-paste prompt (`skill_prompt`, "Read <SKILL.md URL> and follow it to ...", `CopyPrompt`) that works in
any AI that can read a web page, with nothing to install. The reader sends it, so their AI treats it as
their request; the page never addresses agents directly. Skills name Pedro Borrero and borre.ro as the
maker, CC BY 4.0, provided as is with no support (Pedro, 2026-09-30).

## Header menus (2026-09-30)

From 1024px (640px until 2026-09-30, when the link row wrapped to two lines on an iPad; tablets now get the menu button), Services opens a panel of every service in its group (Start, Build, Run) plus the
free tools ("Try it free", since 2026-10-09), on hover or keyboard focus, in CSS only (`services-menu.tsx`): hidden with `invisible`
so its links stay out of the tab order until Services has focus, hung from the right edge of the
header's links so it never runs past the page, and no wider than the viewport less 3rem. The phone
menu lists the same services under Services. Groups live in `serviceGroups` in `site.ts`, shared
with /services. Checked by `Lab/borre-tools/cdp-nav.mjs` (hover, moving into the panel, keyboard,
1024 and 1280 widths, phone menu links).

## Case studies

Challenge → Solution (four points, one how-it-was-built line, the human-in-the-loop line) → the
interactive demo, full width → Results (quantities only, estimates labelled) → Client feedback (only
real, permitted quotes) → Connected systems | Technology | Service. Demos use the invented client
Kiln & Kettle, generic system categories and industry terms (CRM, RAG, LLM, human in the loop). Real
names only for ubiquitous platforms (HubSpot, Outlook, Companies House); niche tools stay generic so a
client's stack can't be fingerprinted.

## Numbers

Real measured figures, rounded, marked approximate. Exception (Pedro, 2026-09-30): the prospecting demo's top-of-funnel counts (TAM 18.4k, ICP match 2.3k, buying signals 34 and 29 a week) are invented for the invented client, rounded, and identical everywhere (`demoReach`, `signalsByBatch`); the dots read as missing data. No per-render randomiser: fuzzing stages independently breaks the funnel narrowing and makes a figure disagree with itself across pages. Companies are invented and checked against the Companies House register. Nothing that identifies a client ships without sign-off.

## Analytics and privacy

Cookieless analytics on Vercel Web Analytics (#576; Pedro chose it 2026-09-24 as already included):
`src/components/analytics.tsx` mounts `@vercel/analytics` and one site-wide click listener. Track a
click by putting `data-track="<name>"` (plus `data-track-<prop>="<value>"`, at most 2 props) on the
element; server components need no client code. Current events: `cta` (with `where`),
`demo-context-question`, `demo-portal-lead`, `demo-workflow-run`, `demo-workflow-approve`. **Custom
events are recorded on Vercel Pro only**; on Hobby, page views count and events are dropped. Web
Analytics must be enabled for the project in the Vercel dashboard. Bookings are counted in Cal.com.

`/privacy` (#575, live 2026-09-26) is the bare minimum the ICO lists as required (Article 13), in UK
GDPR terms, about 270 words (Pedro: "bare minimum required... we're just trying to be compliant";
competitors run 1,900 to 3,200 words). Recipients are given as categories (hosting, booking
calendar, email), which the ICO allows; in use: Vercel, Cal.com, Google Workspace. **Vercel's data
processing addendum covers Pro and Enterprise only; on Hobby (Pedro's choice) the page claims no
contract with providers.** A new kind of provider or a new use of data means updating the page and
its date in the same change.

**Trading details (2026-09-28).** The Electronic Commerce (EC Directive) Regulations 2002, reg 6,
require a business website to show the provider's name, a geographic address and an email, a VAT
number if registered, and whether shown prices include VAT. The footer carries "A trading name of
Pedro Borrero" and the email; `site.address` adds a business address service when Pedro has one
(never his home address); `site.vatNote` sits under the Pricing notes on /services and in llms.txt
(Pedro is not VAT registered). Companies Act 2006 s1202 puts his name and an address on invoices
and letters, not the site.

**Trust and security (#580, 2026-09-30).** `/security`: six short rows, each true of how we build
today (the live client build): accounts in the client's name; their own database in a UK or EU region
(the live client project is eu-central-1, so never "UK only"); access that follows existing
permissions, enforced by row-level security; draft by default with team approval; business APIs kept
out of training, sourced answers and a run log; the main suppliers by name. Not claimed until true: a
signed UK GDPR data processing agreement (#249), ICO registration, backup schedules, uptime. Linked
from the footer (beside Privacy), /services (under Pricing), the sitemap and llms.txt.

## Metadata and share images (#578, 2026-09-25)

Every page builds its metadata with `pageMeta` (`src/lib/meta.ts`): its own canonical URL, og:url,
og:title and share image. The root layout sets none of these; it once set them to the homepage, so
every page told search engines and LinkedIn it was a copy of `/` (Lighthouse SEO flagged the
canonical on every inner page). A page's `openGraph` replaces the layout's and outranks its own
segment's `opengraph-image` file, so a page with its own image passes `image` to `pageMeta`.

Share images are 1200x630 PNGs rendered at build time from `src/app/_og/card.tsx`, in the site's
language: paper, the wordmark, a block rule, the title, at most one figure in the figure form. They
carry only existing site strings. Default: the headline that renders without JavaScript. Case
studies: title and first result, or the tagline where results are still targets
(`resultsProven: false`). The portal demo: its title and description. Fonts are static instances of
Archivo and Martian Mono under the OFL in `src/app/_og/fonts`, read by module-relative URL.

## Repo

Public. No secrets, and no client names anywhere, comments included: clients are "the client" or
"the live client build" (2026-09-30 audit found and removed five mentions; old commits keep them). Commits terse, imperative, impersonal.

## Colour

**Four colours. Nothing else is a colour.** Set 2026-09-21. **Kept for now (Pedro, 2026-09-24,
#585): he is working on the palette separately, by hand.** Until he hands a change over, do not
change these values. Every ratio below was computed against paper, not estimated.

| # | Token | Hex | Role | On paper |
|---|---|---|---|---|
| 1 | `--paper` | `#F2EDE4` | the page ground | — |
| 2 | `--ink` | `#1F1C19` | primary type | 14.5:1 |
| 3 | `--ink-soft` | `#5C554D` | secondary type, labels, captions | 6.3:1 |
| 4 | `--accent` | `#A8402C` | CTA ground, figures, the wordmark | 5.2:1 both ways |

**A fifth colour was tried twice and rejected twice**, both times olive `#4F5D3E`: first as
backdrop linework, where it was measurably invisible (0 of 50,217 line pixels read green), then as a
second accent on the small uppercase labels, where Pedro's verdict was that it was distracting and
looked wrong. Do not propose a fifth colour without a specific job for it that the four cannot do.

**One scoped exception: the prospecting portal demo** (`src/components/demo/`). It keeps the real
product's own design system (`portal.css`, scoped to `.portal`, brown accent for the invented client)
so it reads as a product sitting on the page. Pedro, 2026-09-23: on the site's palette "it just blends
into the page and gets lost". Nothing outside `.portal` may use those tokens.

`--rule` `#D9D1C4` is not a colour, it is a hairline weight. `--accent-deep` `#8F3524` is the
accent's hover state.

**The accent may be softened but never lightened past AA.** The original `#D8452A` measured
**3.75:1**, failing as normal text and as a button ground with paper on it. `#B2341D` fixed that at
5.29:1, then softened to `#A8402C`: saturation 72% to 58.5% with contrast effectively unchanged at
5.24:1. Soften by dropping **saturation**, not lightness. A palette whose primary button fails
contrast is not a palette.

**Retired, do not reintroduce:** `--ink-faint` `#877E74` (3.42:1, failed AA and was the dominant
body colour on the work pages), `--concrete`, `--cream-deep`, and the wash trio `--sage`, `--sea`,
`--clay`.

### One accent role per scale

The accent appeared 19 times on the homepage across every scale and role, so it stopped reading as
emphasis. The rule that fixed it:

| Scale | Accent? |
|---|---|
| Solid ground | Yes, the primary CTA, **once per view** |
| Large text, 24px and up | Yes, figures only |
| Body and small text, 14px and under | **No.** It also fails AA at these sizes |
| Backdrop | White tracery only. **The accent does not go in here** |

Named exceptions, all large or brand: the `.ro` wordmark and the cycling word in the headline.
Graphic marks, not text: the short bars over the three ways to start on /services (#585).
The **R** and **O** highlight went with the hero eyebrow.

Contrast and hierarchy turned out to be the same problem here: every element demoted under this
rule was small text that was already failing AA.

**The accent never appears in the backdrop.** The first rule is
what stopped sage-on-vermillion; the second is what stopped orange-on-orange.

## Surfaces (#585, 2026-09-24)

Competitors get variety from light and dark bands and from imagery, not from extra hues. Pedro
picked all three directions proposed on #585, with two limits: **ink is used sparingly**, and **not
every page gets a diagram**. The point is to break up patterns, so each page gets a different
treatment rather than one treatment everywhere.

**Ink is for the offer only:** the footer offer band (`footer-cta.tsx`), full bleed on every page
but /contact (on the homepage too since 2026-09-30, closing the story instead of an empty stretch), and the fixed `OfferBar` on the homepage, where it rides over the story (on inner pages the bar
stays paper). Do not add more dark bands without asking. On ink, measured: paper 14.5:1; `--rule` 11.2:1 and is the
secondary text there; `--ink-soft` 2.3:1 and is unusable; the accent 2.8:1, so on ink the accent is
only ever the button ground, and focus rings are paper. An accent lightened for ink (`#D16651`,
4.6:1) drops to 3.1:1 on paper, the original too-bright problem, so there is no dark-mode accent.

Per page, each deliberately different:

| Page | Treatment |
|---|---|
| /services | No visible header (see below). Three groups (Start, Build, Run: the AI³ method, kept by Pedro), each with its own shape: Start side by side, each under a short accent bar (the page's accent), Build beside the product still it makes, Run as the monthly loop. Each service in short: name (the link to its page), one small price line, one line of value, its own button |
| /work | No visible header. Previews alternate sides; figures in the accent |
| Case studies | Results figures in the accent; connected systems drawn as a track into the build (`systems-hub.tsx`) |
| /contact | No visible header. The 0 to 30 minute call, every stop described (`CallTrack`), beside the calendar; calendar first on phones |
| /about | The mark; no diagram |

**No title-and-subtitle headers where the nav already names the page** (Pedro, 2026-09-24): "Eight
ways we can help" plus a lead, and "Built from real client work" plus a lead, read as a written-by-AI
pattern. /services, /work and /contact use `Page bare`: the h1 is screen-reader only and the page opens on its
content. **Breadcrumbs only where there is a level to go back to** (case studies); a lone "Home /" on
a top-level page is noise.

**No prices on the homepage slides.** Prices live on /services only.

**Prices never outrank the service.** A price set as the biggest thing in a section makes the cost
the headline (Pedro, 2026-09-24); on /services it is one small line under the name. A services map
(Start into the Context Engine into Build) was built and cut: it added little and did not make sense.

Diagrams are ink linework on paper. Connector lines are SVG stretched over a gutter with
`preserveAspectRatio="none"` and `vector-effect: non-scaling-stroke`, over equal grid rows, so each
line meets the middle of its box at any height. They are not a second signature visual: the
signature is still the NET backdrop.

## Backdrop

**Vanta NET, full bleed behind the hero.** Shipped 2026-09-21, replacing a shadergradient wash.

Parameters are Pedro's, taken from the vantajs.com customiser, with only the two colours moved onto
the site palette: vermillion lines on cream. **Do not substitute your own parameters.** A bounded,
inverted, dark-panel variant was built and rejected: it read as a logo rather than a backdrop, lost
the dots entirely, and ignored the spec it was given.

**There is no mask and no border, and that is the point.** The net paints its own background in the
page's exact cream, so the canvas has no visible edge and the entire class of seam artifact simply
does not arise. Three separate seams were shipped and reverted fighting this on the old wash: a hard
bottom edge, two crossing linear fades meeting at a corner, and a radial mask clipped mid-fade at
0.678 opacity. Matching the background beats masking the edge.

**The containment rule was learned on a wash, and does not transfer to linework.** A saturated colour
wash under paragraphs has no readable setting. Fine lines on a light ground cover a tiny fraction of
the area and never sit as a block behind a letterform, so copy stays readable on top. Do not cite the
old rule to argue against linework.

NET over the other effects for two reasons. It argues the headline: the site says the tools do not
talk to each other, and a mesh finding its connections is the thing being sold. And WAVES is a
full-bleed effect that needs a wide, short band; in a bounded panel the camera sits inside the wave
surface and it renders as a flat block. Verified twice.

**Update 2026-09-30 (Pedro): fewer junctions, more zoomed in:** points 7 (was 13, then 9), spacing 32 (15, then 24), maxDistance 34 (16, then 25).

**Update 2026-09-24 (Pedro):** dots OFF (`showDots: false`) and the lines are one soft warm tone,
`0xc2b6a4`. The lit dot spheres rendered grey and pulled focus off the text; white lines barely showed.
The paragraph below is the earlier state, kept for the reasoning.

The backdrop was WHITE lines and dots. Cream is not white, so white reads as a light web
lifted off the page rather than a tint laid over it. Three coloured backdrops were tried and every
one competed with the copy.

**Measured, and it is why colour does not belong here:** the line colour is very nearly a no-op. Vanta
draws lines as a `transparent` `LineBasicMaterial` with per-segment vertex colours that fade with
distance, so over a warm cream ground any hue washes out to warm grey. Sampling the full rendered
hero, **0 of 50,217 line pixels had more green than red** with the lines set to olive `#4F5D3E`.
The **dots** are the only part that carries colour, because they are opaque lit spheres. So if the
backdrop needs to read as a colour, change the dots, not the lines.

Settings live in `src/components/hero/net-backdrop.tsx`. `mouseControls` is on, so the element must
NOT carry `pointer-events-none` or it stops receiving mousemove. Reduced motion gets a real variant:
plain cream, no WebGL context created at all.

Known and open: at 375px the net is denser relative to the text than on desktop, because the world
scale is fixed and the viewport is narrower. Readable, but busy. `scaleMobile` is the lever.

Tried and reverted, do not re-propose:
- A CSS noise layer stacked on the shader's own grain. Two grains read as dirty.
- Four wash colour attempts, each rejected. The recurring error was too much **saturation**, not
  wrong lightness. Natural colours are far less chromatic than screen colours.
- A dark hero band, and a dark bounded NET panel.

## Mark

Generated at runtime from a formula, never shipped as geometry: the reference SVGs are 334KB and 1.5MB. `sphereVoxels(4)` gives 341 instances; `crossVoxels()` gives the three-beam version at 135. Swap the call in `mark-scene.tsx`.

One flat concrete tone with self-shadowing. Not multi-coloured, and never the accent colour.

**Loading (#582, 2026-09-25).** three.js cost a mid-range phone one 505 ms task that no deferral can
split (641 ms of blocking time on /about). So the page ships a still of the mark
(`public/mark-still.webp`, rendered from this scene at its first frame by
`Lab/borre-tools/cdp-mark-still.mjs`; re-render it if the scene changes). Phones and reduced motion
keep the still and never fetch three.js. Screens 1024px and up swap in the live scene once the page
has loaded, the browser is idle and the mark is in view, and drop the still after its first frame.
Measured locally, mobile: blocking time 641 to about 35 ms, performance 82 to 96.

## Type

**Archivo** throughout, **Martian Mono** for numbers and code. Chosen 2026-09-21 after impeccable's
`overused-font` rule fired on every route.

Geist was the previous face and it was the problem, not a matter of taste: it is Vercel's own
typeface and the first code example in Next's own font documentation, so every project that follows
the official guide ships it. The detector's full overused list is in
`.claude/skills/impeccable/scripts/data/font-index.json`: DM Sans, Figtree, Fraunces, Geist, Inter,
Manrope, Montserrat, Outfit, Plus Jakarta, Poppins, Roboto, Sora, Space Grotesk. Any future change
must avoid all of them, and Roboto Mono is out too because the rule matches on `roboto`.

Archivo has a real width axis (62 to 125), loaded via `axes: ["wdth"]`. Use it:

| Role | Width | Where |
|---|---|---|
| Display | `font-stretch: 118%` | `h1` and `.display`, applied in globals.css |
| Reading | 100%, the default | everything else |
| Mono | `font-stretch: 88%` | figures and code, so the mono does not compete with expanded headings |

Never fake expanded with `letter-spacing`. The axis exists; use it.

Mono is still reserved for numbers and code, never for section labels, breadcrumbs or running text.

**Size order (2026-09-24):** hero headline > slide title > figure, at every width. Measured at
1920x940: 50 / 43 / 36px; at 375px: 34 / 28 / 24px. The Problem figures had grown to 66px and the
slide titles to 60px, both above the hero headline and louder than the CTA. Story figures share one
`FIGURE` class in `story-forms.tsx`; change it there, not per slide.

**No uppercase anywhere** (Pedro, 2026-09-23): all-caps reads as a font accent rather than a style accent. Labels use the one `.label` class (normal case, weight 500, ink-soft); emphasis comes from weight and position.

## Mobile and tablet pass (2026-09-30, iPhone and iPad feedback)

- Hero cycling word: every word sits invisibly in one grid cell, so the slot is as wide as the widest
  word and the rest of the headline never moves (`cycling-word.tsx`).
- Story step bar below 1024px: numbers only, the current step opens to show its name (flex-grow eases,
  none under reduced motion), so all six fit and you can see where you are without swiping the bar.
- Header: full links from 1024px, menu button below, nothing wraps.
- Checked by `Lab/borre-tools/cdp-mobile-pass.mjs` (header on one line, hero line still across word
  changes, bar fits and names the current step at every step; 375, 390, 430, 768, 820, 1024, 1180).

## Copy system (#561, 2026-09-30)

Every visible word is moving into `src/content/copy/<page>.md` (done: /work and the four case studies,
`case-<slug>.md` and `work.md`; /services and the eight service pages, `service-<slug>.md` and
`services.md` (prices and timings stay in code); the homepage, `home.md` (hero headlines and numbers, summary, the
four steps, the figures' words, the call track also used on /contact, AI³, the ladder); `about.md`,
`contact.md`, `security.md`, `privacy.md` (a legal notice: `{email}` and `{ico}` become links via `fill()` in
`src/components/fill.tsx`; the date stays in code), `scorecard.md` (questions, answers, bands, result words; scores,
the two sizing questions' ranges and the logic stay in code; `scripts/scorecard-fingerprint.mjs` proves every
answer combination gives the same result), `newsletter.md` (name, strapline, the words around every article) and
`chrome.md` (the offer, menu, footer, breadcrumbs, skip link, 404). Still in code: the brand line with its R and O
accents, the footer's trading-name sentence (a legal requirement), the machine surfaces' own wording (llms.txt,
/api/mcp), and the demos' invented content. The menus find the scorecard's group by position, not by name). A `## key` heading is a
slot; plain text, paragraphs or a `- ` list under it; `>` lines are notes and budgets (`max N`
characters, a warning not a failure). `scripts/copy.mjs build` compiles them to
`src/content/copy.gen/<page>.ts` (git-ignored; runs as `predev` and `prebuild`, so Vercel runs it);
code reads them through `words(page)` in `src/content/copy.ts` (`t` one paragraph, `ps` paragraphs,
`li` list, `has`). A missing slot, or two paragraphs where one is expected, throws during the build
with the file and heading named. Figures, sources, URLs, slugs, prices, timings and layout stay in code. The review mode also matches a line shown sentence-cased or with a full stop added (a figure's claim), and turns edits back into the slot's form.
`npm run copy -- deck [out]` writes the whole site as one document (COPY.md, git-ignored) and
`npm run copy -- apply <file>` writes an edited deck back, slot by slot. Proof of a migration:
`Lab/borre-tools/text-snapshot.py` before and after must print "identical". After any copy change run
the layout checks (`cdp-slide-fit`, `cdp-mobile-pass`, `cdp-route-audit`, `cdp-story`). The dev
launch config calls `next dev` directly, so run `npm run copy -- build` first when copy has changed.
Writer's guide for Pedro: `src/content/copy/_README.md`. Pedro edits two ways (2026-10-01, simplified from three): `?copy` on the
`copy` branch's preview (change list applied with `npm run copy -- changes <file>`), and the copy note in his
vault, `01 Projects/AI Cubed/borre.ro Copy.md`, written by `npm run copy -- deck <path>` (a `# file.md` heading
per page, the base commit on a "> Base:" line; refuses to run with uncommitted copy changes) and applied by
`npm run copy -- apply <path>`: three-way per slot against the base commit, so only slots Pedro changed are
written, a slot changed in the repo since the base is a conflict and nothing is written, notes are never
changed, and new slot names are skipped. Refresh the note only when Pedro asks (or after a publish), never
while he may be editing it on another device (LiveSync).

**Review mode and live editing (2026-09-30).** `?copy` on any preview or local page loads
`copy-review.tsx` (through `copy-review-loader.tsx`; `COPY_REVIEW` is set in next.config.ts from
VERCEL_ENV, "off" in production, so the code is not in the live bundle: check with a
`VERCEL_ENV=production` build that no static chunk contains "copy-review-changes"). It finds each
line of the page's copy files in `<main>` by its text (a file's `route`, `shared` slot prefix and
`also` routes decide which files feed a page), outlines it, edits in place with a budget count,
keeps edits in sessionStorage only, and copies a change list (`file.md ## slot` / `was:` / `now:`)
that `npm run copy -- changes <file>` applies, refusing any change whose old words are no longer in
the slot. Live editing: `npm run copy:live [port]` (copy watcher plus next dev, default 3012), run
from the `Lab/borre-copy` worktree on branch `copy` (launch config "borre.ro copy (live)"); Pedro
opens `Lab/borre-copy/src/content/copy` in Obsidian. Nothing publishes automatically: copy edits
reach main only by a merge Pedro approves after checking the preview.
