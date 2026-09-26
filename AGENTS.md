<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# borre.ro — build standards

Profile site for an AI and Revenue Operations practice, written as "we" (a practice, not a sole trader). Client work is delivered with the partner practice Amplify My AI; this site is the proof behind it. Positioning lives in the Obsidian vault at `01 Projects/AI Cubed/`. Build spec is Baserow card #327.

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

Written for non-technical founders and revenue leaders. Plain language first: describe what it does for the business. Technical terms (RAG, hybrid retrieval, MCP, n8n) live only in a named layer below the plain copy, the small technical line under each service on /services, the "Runs on" row and the machine surfaces (llms.txt, /api/mcp, JSON-LD). Never in the hero or the first screen. Internal jargon (corpus, canon, entities, RRF) never ships.

No unsourced claims: every figure links to its source or comes from the client work and is labelled if estimated. No defining by negation, no status badges, no "most" claims. One offer name, `site.cta`, on every CTA that points at /contact.

Voice follows the vault skill `00 Meta/Skills/pedro-writing-style.md`. Plain, direct, no marketing throat-clearing, no em dashes, no three-part lists for rhythm.

## Homepage story

Hero, then a horizontal pinned story (vertical below 1024px and under reduced motion) of six steps:
01 Problem, 02 Review (the free 30-minute call; "Discovery" read as a sales stage and is a paid phase
elsewhere in this market), 03 Method (AI³: Context × Agents × Evals, with
the live Ask-the-Context-Engine demo), 04 Engagement (ways to start, audit to full build, with prices),
05 Value (what AI done properly is worth, sourced; client results live on /work), 06 Support. Content and
step ids live in `src/components/how-we-work.tsx`, the figures in `evidence` and `value` in `site.ts`.

**Slide standard (#584, 2026-09-24; labels and accents per DESIGN.md):** left, the title and one
short paragraph. Right, one `Frame`: a 2px ink rule, a label only where it names something the title
doesn't, no boxed or tinted backgrounds. Inside the frame each
slide has its own shape, matched to what it says, in `src/components/story-forms.tsx`: Problem as
three barriers in ink, each followed by our answer (the fear, then the fix), Review as a 0 to 30 minute timeline, Method as the Context × Agents × Evals
formula over the Ask demo, Engagement as a ladder of entry points that runs on into 06 Support,
Value as three sourced figures in the accent, Support as a monthly loop. No prices on the slides. The six were all one row list
before and read as text-heavy and identical.

The ladder draws the staircase above and sets every label on one baseline under it; labels hung
under their own treads stepped down the page and read as falling. The loop carries short headlines
only (the full list is the managed service on /services#support). No footer states the obvious
("free, and booked straight into the calendar" was cut), and no footer repeats the left paragraph.

Where a slide has several items, only the picked item's description shows (hover, focus, tap or the
arrow keys; a tab set). In the pinned story the scroll also picks (2026-09-25): a timeline of 14
stops in `how-we-work.tsx` (one unit of 64vh to move between slides, half a unit per item), `x`
flat across each slide's own stops, and a snap that settles on the next stop in the direction of
travel. `usePick(n, label, at)` takes the reached item and picks only when it changes, never while
focus is inside the set; hover picks on pointer movement, not entry, so a slide moving in under a
resting pointer picks nothing. Checked in headless Edge by `Lab/borre-tools/cdp-story.mjs` (every
stop, wheel steps, keyboard, reduced motion, no-JS) and `cdp-story-wheel.mjs`. All descriptions sit in one grid cell so the slot never jumps. Server render
and no-JS show every description inline, so no copy is lost. Reduced motion keeps the forms and drops
the animation (bars drawn full, no figure roll-up, no travelling dot on the loop). Slides are
top-aligned with an even gap under the step bar. The booking offer is not in the story; it is the
site-wide fixed `OfferBar`.

## Case studies

Challenge → Solution (four points, one how-it-was-built line, the human-in-the-loop line) → the
interactive demo, full width → Results (quantities only, estimates labelled) → Client feedback (only
real, permitted quotes) → Connected systems | Technology | Service. Demos use the invented client
Kiln & Kettle, generic system categories and industry terms (CRM, RAG, LLM, human in the loop). Real
names only for ubiquitous platforms (HubSpot, Outlook, Companies House); niche tools stay generic so a
client's stack can't be fingerprinted.

## Numbers

Real measured figures, rounded, marked approximate. No per-render randomiser: fuzzing stages independently breaks the funnel narrowing and makes a figure disagree with itself across pages. Companies are invented and checked against the Companies House register. Nothing that identifies a client ships without sign-off.

## Analytics and privacy

Cookieless analytics on Vercel Web Analytics (#576; Pedro chose it 2026-09-24 as already included):
`src/components/analytics.tsx` mounts `@vercel/analytics` and one site-wide click listener. Track a
click by putting `data-track="<name>"` (plus `data-track-<prop>="<value>"`, at most 2 props) on the
element; server components need no client code. Current events: `cta` (with `where`),
`demo-context-question`, `demo-portal-lead`, `demo-workflow-run`, `demo-workflow-approve`. **Custom
events are recorded on Vercel Pro only**; on Hobby, page views count and events are dropped. Web
Analytics must be enabled for the project in the Vercel dashboard. Bookings are counted in Cal.com.

`/privacy` (#575, live 2026-09-26) follows the ICO's Article 13 list and uses UK GDPR terms: controller,
lawful basis, legitimate interests, processors, restricted transfers, UK adequacy regulations. It
must name every processor actually in use: Vercel (hosting, analytics), Cal.com (bookings) and
Google Workspace (email). Transfer lines state only what each provider says of itself. **Vercel's
data processing addendum covers Pro and Enterprise only; on Hobby (Pedro's choice) the page must
not claim a contract with Vercel.** Add a provider, update the page and its date in the same change.

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

Public. No secrets. Commits terse, imperative, impersonal.

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

**Ink is for the offer only:** the footer offer band (`footer-cta.tsx`), full bleed on every inner
page, and the fixed `OfferBar` on the homepage, where it rides over the story (on inner pages the bar
stays paper). Do not add more dark bands without asking. On ink, measured: paper 14.5:1; `--rule` 11.2:1 and is the
secondary text there; `--ink-soft` 2.3:1 and is unusable; the accent 2.8:1, so on ink the accent is
only ever the button ground, and focus rings are paper. An accent lightened for ink (`#D16651`,
4.6:1) drops to 3.1:1 on paper, the original too-bright problem, so there is no dark-mode accent.

Per page, each deliberately different:

| Page | Treatment |
|---|---|
| /services | No visible header (see below). Three groups (Start, Build, Run: the AI³ method, kept by Pedro), each with its own shape: Start side by side, each under a short accent bar (the page's accent), Build beside the product still it makes, Run as the monthly loop. One small price line under every name |
| /work | No visible header. Previews alternate sides; figures in the accent |
| Case studies | Results figures in the accent; connected systems drawn as a hub into the build (`systems-hub.tsx`) |
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
