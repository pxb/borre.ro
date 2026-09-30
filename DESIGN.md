# borre.ro design language

The visual rules every page and slide follows, drawn from /work and /services (Pedro, 2026-09-24:
"we need to be cohesive"). Colour values, type faces and the history behind them are in AGENTS.md.
This file is the vocabulary: if a page needs something that is not here, add it here first.

Pages vary in layout so no two read as the same template. They do not vary in their parts.

## Grounds

- **Paper** everywhere.
- **Ink** for the offer only: the footer offer band on inner pages, and the fixed offer bar on the
  homepage. No other dark bands.
- No tinted or boxed backgrounds. The one exception is our product itself (the portal previews and
  demos), which keeps its own design system so it reads as a product on the page.

## Lines

Four kinds, each with one job.

| Line | Looks like | Job |
|---|---|---|
| Block rule | 2px ink, full width, a label under it only when the label names something the title doesn't | Opens a block: a slide's right side (`Frame`), a /services group, the call track. One per block |
| Hairline | 1px `--rule`, horizontal | Divides sibling rows or groups. Never vertical |
| Figure bar | 2px `--rule`, vertical, left of a figure | Only in the figure form (below). The one vertical hairline |
| Track | 2px ink, straight or curved; stops are 16px circles, 2px ink, filled in the accent when picked | Drawn sequences: the call track (slide 02, /contact), the ladder (slide 04), the loop (/services Run), the systems track on each case study (names off a 2px spine, one tick each, the spine running on into the build with the accent arrow; boxes and a fan of lines were cut 2026-09-30) |

No other borders, no side tabs, no dashed rules except the dashed run-on from the ladder into the managed
service.

## Accent

The accent means **act here** or **a good result**. Nothing else.

- The primary CTA ground, once per view.
- Figures that are results or value: case-study results, /work, the upside figure at the foot of slide 01. Problem figures
  (slide 01) are ink, so the good number reads as the good number.
- The accent mark: a 4px by 40px bar over the items a page is built on: the ways to start (/services
  Start) and our commitments (/about).
- **Our answer**: the arrow that leads into each answer on slide 01. The problem is ink; the fix
  carries the accent.
- **Where you start**: the first stop of the call track on /contact.
- **A picked answer** on the readiness scorecard: its radio fills in the accent, like a picked stop.
- **The picked item on a slide**: the stop on the slide 02 track, the newest edges of the cube on
  slide 03, the tread on the slide 04 ladder. The moving dot on the /services loop. Every slide carries
  the accent.
- Brand: the `.ro` wordmark, the cycling word in the headline.

Never on body text, labels or structural linework, never in the backdrop.

## The figure form

One component, `src/components/figure.tsx`, for every number on the site: figure bar, figure, label.

- **Over** its label when the label is short (/work, case-study results).
- **Beside** its label when the label is a sentence (slide 01, the /services Start figure), figure in a 5.5rem column.
- Mono and tabular for numbers; words ("Minutes") in the sans face.
- One size: 24px, 28px from lg. Always below the slide titles and the hero headline.
- No bars or charts beside similar percentages; they read as progress bars.
- Every figure carries its source or is labelled as an estimate.

## Items

A thing in a list (a service, a case study, a stop on the call track):

- Title: 20px medium ink (`text-xl`), or 16px medium on tracks and ladders.
- Optional meta line under it: 14px, the key fact in medium ink, the rest in ink-soft
  ("From £450 · Usually 1 to 2 weeks"). Prices only here, on /services, and never the largest thing in
  a section.
- Body: 16px ink-soft, relaxed leading.
- Bullets: a 4px ink-soft dot, 14px ink text.
- Index only where the sequence carries information (the story step bar). Case studies and services are
  not a sequence, so no "01".

## Framing

- **A problem is always followed by our answer.** Slide 01 pairs each barrier with the line that fixes
  it, so the story turns from the fear to the fix. No figure is there only to frighten.
- **Why now, why us.** Slide 01 ends on the value of doing AI properly in general terms, with a source
  (a fourth row after the three problems, same shape, figure in the accent, the takeaway where the
  answers sit; under the paragraph was tried and read oddly); client-specific results stay on
  /work and the case studies. /services carries one market figure under Start, in the problem form.

## Headers

- No title-and-subtitle header where the nav already names the page. /services, /work and /contact
  open on their content (`Page bare`, h1 for screen readers only). /about and the case studies keep a
  visible title because it says something the nav does not.
- **Document pages** (/about, the case studies) are one structure: label-left rows (`Row`) divided by
  hairlines. /about: the title beside the mark, then Who we are, What we stand for, Who we work with.
  Each commitment reuses a line the site already makes, so /about adds no new claim.
- Breadcrumbs only where there is a level to go back to (case studies).
- Slides: the title and one short paragraph left, one `Frame` right.
- **No over-explaining.** A frame label that repeats the slide title, a footer that restates the
  paragraph, a caption that says what the picture shows: cut them. Labels stay only where they name
  something (AI³, Managed service).

## Spacing

- Block rule to its label 12px, label to content 24px.
- Between rows in a list: 56px with a hairline (/work, /services Build).
- Between blocks on a page: 64px or more.
- Links that sit with content (LinkedIn) go inside the content column, never on their own ruled row.

## Motion

Motion explains something or it doesn't ship. Never the same entrance on every section (a scroll
fade on every block was removed for that reason). Two kinds, both in `src/components/draw.tsx` on
motion.dev (Pedro, 2026-09-24):

- **Drawn lines draw themselves once** as they come into view: the call track (slide 02, /contact),
  the ladder tread by tread (slide 04), the support loop (/services Run) with its stops
  and moving dot after it. The systems track on each case study is static.
- **The pick moves along the drawing it belongs to.** On slide 02 the stop marker runs along the
  track (`layoutId`). On slide 04 it climbs the staircase: up each riser, then across the next tread,
  never a diagonal glide (Pedro: it should climb the steps). On slide 03 nothing slides sideways: the
  underline draws itself under the picked term and a small cube builds one dimension per term,
  Context a line, Agents a square, Evals a cube (AI³, drawn).
- **The scroll walks the picks (Pedro, 2026-09-25).** In the pinned story a slide holds still while
  scrolling steps through its items in order (the call's stops, the three terms, the treads), then
  moves on; scrolling back walks them in reverse. One notch of a wheel is one step. Hover, tap and
  the arrow keys still pick, and scrolling never moves the pick while keyboard focus is inside the
  set. Stacked (phones, reduced motion) nothing picks by scroll.
- **The ladder shows its trail.** Treads climbed so far are ink, treads still ahead are the hairline,
  so the staircase shows there is more above. Complete in ink without JavaScript.

Counts roll up on figures. Everything renders finished on the server, without JavaScript and under
reduced motion; the motion version only replaces the still one after mount. Everything renders complete
without JavaScript and under reduced motion. The NET backdrop is the one signature visual.

## Browser surfaces

Selection in the accent, caret in the accent, scrollbar ink-soft on paper, underline offset 4px,
tabular numerals wherever figures are compared.

## Type

Archivo throughout, 118% width for display; Martian Mono for numbers and code only. No uppercase.
Size order at every width: hero headline > slide title > figure.
