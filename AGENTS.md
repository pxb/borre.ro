<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# borre.ro — build standards

Personal profile site for Pedro Borrero. Sole trader. The commercial front is Amplify; this site is the proof behind it. Positioning lives in the Obsidian vault at `01 Projects/AI Cubed/`. Build spec is Baserow card #327.

## Design

Follow the Vercel Web Interface Guidelines: https://vercel.com/design/guidelines

The rules that bite most here:
- Every focusable element shows a visible, unobscured focus ring. All flows keyboard-operable.
- Honour `prefers-reduced-motion` with real reduced variants. Animations cancelable by user input.
- Never `transition: all`. List the properties. Animate `transform` and `opacity`, not layout.
- Prefer CSS animation over JavaScript.
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

- shadcn/ui is the base layer. Already initialised (base-nova, neutral, lucide).
- 21st.dev for marketing blocks and richer components: https://21st.dev/community/components
- Aceternity for signature moments only, not as the default look.

Do not let the site read as a generic AI-generated template. Vary layout rhythm; no long column of identical stacked cards.

## Visual effects budget

Candidates: react-three-fiber, shadergradient, liquid-glass-js, liquid-logo.

Rule: **one** signature visual on the site, not four. Everything else stays flat and fast. Any WebGL or shader work must be lazy-loaded, must not block first paint, must have a static fallback, and must be disabled under `prefers-reduced-motion`.

## Copy

Written for non-technical founders and revenue leaders. No architecture jargon: no corpus, canon, entities, hybrid retrieval, RRF, RAG. Describe what it does for the business.

Voice follows the vault skill `00 Meta/Skills/pedro-writing-style.md`. Plain, direct, no marketing throat-clearing, no em dashes, no three-part lists for rhythm.

## Numbers

Real measured figures, rounded, marked approximate. No per-render randomiser: fuzzing stages independently breaks the funnel narrowing and makes a figure disagree with itself across pages. Companies are invented and checked against the Companies House register. Nothing that identifies a client ships without sign-off.

## Repo

Public. No secrets. Commits terse, imperative, impersonal.

## Colour

Barbican, simplified. Cream page, warm near-black type, one vermillion accent. Settled 2026-09-18 after several rounds; do not reopen without a reason.

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#F2EDE4` | page |
| `--ink` | `#1F1C19` | headings and body |
| `--vermillion` | `#D8452A` | **accent only**: one primary action per view, the eyebrow label, the cycled word, the figures |

Supporting: `--ink-soft` `#4E4741`, `--ink-faint` `#877E74`, `--rule` `#D9D1C4`, `--concrete` `#9A9289` (the mark).

Wash only, never used as type or UI colour: `--sage` `#C3CF8E`, `--sea` `#7FA39A`, `--clay` `#D98F6A`.

Two rules that keep it out of trouble:
- **The accent never appears in the wash.** That is what caused orange-on-orange.
- **The wash colours never appear as type or UI.** That is what caused sage-on-vermillion.

Nothing is pure black or pure white. This is a professional portfolio, not a design study: restraint wins over novelty.

## Backdrop

**Vanta NET, bounded inside a framed panel.** Shipped 2026-09-21, replacing a shadergradient wash.

The rule that survived every round: **a backdrop is bounded, never behind body text.** A full-bleed
animated wash under paragraphs has no good setting. Turn it up and the text is unreadable, turn it
down and the page reads grey, and every edge then needs a mask that leaves a seam. Three separate
seam artifacts were shipped and reverted trying to solve that: a hard bottom edge, two crossing
linear fades meeting at a visible corner, and a radial mask clipped mid-fade at 0.678 opacity.

Inside a frame none of that applies. The edge is deliberate, so it is a border rather than an
artifact, and nothing has to be read through the effect. Pedro's framing, which is the better one:
a gradient "works best as a bounded element. Like a frame, a highlight, a carousel."

NET over the other Vanta effects because it argues the headline. The site says the tools do not talk
to each other; a mesh of points finding each other is the thing being sold. Pick effects that carry
the argument, not effects that decorate.

Settings live in `src/components/hero/net-panel.tsx`. Lines are `ink`, ground is `cream`.
**The accent never appears in the backdrop**, which is what caused orange-on-orange. The backdrop
colours never appear as type or UI, which is what caused sage-on-vermillion. Both rules still hold.

`touchControls` is off: drag on a phone fights the page scroll. Reduced motion gets a real variant,
the static frame with no animation and no WebGL context created at all.

Tried and reverted, do not re-propose:
- A CSS noise layer stacked on the shader's own grain. Two grains read as dirty.
- Four wash colour attempts, each rejected. The recurring error was too much **saturation**, not
  wrong lightness. Natural colours are far less chromatic than screen colours.
- A dark hero band.

## Mark

Generated at runtime from a formula, never shipped as geometry: the reference SVGs are 334KB and 1.5MB. `sphereVoxels(4)` gives 341 instances; `crossVoxels()` gives the three-beam version at 135. Swap the call in `mark-scene.tsx`.

One flat concrete tone with self-shadowing. Not multi-coloured, and never the accent colour.

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

Mono is still reserved for numbers and code, never for section labels or running text.
