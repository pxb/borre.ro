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

One accent, used for the mark, the statistics, the primary call to action and nothing else.

**Vermillion `#D8452A`**, defined as `--accent: oklch(0.56 0.2 28)` in `globals.css`. Use the token, not the hex, except where a non-CSS consumer needs it (the WebGL material takes the hex).

Everything else is ink on paper: `--ink` `--ink-soft` `--ink-faint` `--rule` `--paper`. No second accent, no gradients outside the primary call to action.

## Type

Geist sans throughout. Mono is reserved for numbers and code, never for section labels or running text.
