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
| Hairline | 1px `--rule`, horizontal | Divides sibling rows or groups (the upside on slide 01). Never vertical |
| Figure bar | 2px `--rule`, vertical, left of a figure | Only in the figure form (below). The one vertical hairline |
| Track | 2px ink, straight or curved; stops are 16px circles, 2px ink, filled in the accent when picked | Drawn sequences: the call track (slide 02, /contact), the ladder (slide 04), the loop (slide 06, /services Run), the systems hub |

No other borders, no side tabs, no dashed rules except the dashed run-on from the ladder into 06
Support.

## Accent

The accent means **act here** or **a good result**. Nothing else.

- The primary CTA ground, once per view.
- Figures that are results or upside: case-study results, /work, slide 05, the upside on slide 01.
  Problem figures are ink, so the good number reads as the good number.
- The accent mark: a 4px by 40px bar over each way to start (/services Start).
- **The picked item on a slide**: the stop on the slide 02 track, the underline under the term on
  slide 03, the tread on the slide 04 ladder. The moving dot on the slide 06 loop. One rule, so every
  slide carries the accent without adding anything.
- Brand: the `.ro` wordmark, the cycling word in the headline.

Never on body text, labels or structural linework, never in the backdrop.

## The figure form

One component, `src/components/figure.tsx`, for every number on the site: figure bar, figure, label.

- **Over** its label when the label is short (/work, case-study results, slide 05).
- **Beside** its label when the label is a sentence (slide 01), figure in a 5.5rem column.
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
- Index where order matters: mono 12px ink-soft ("01"), above the title (/work).

## Headers

- No title-and-subtitle header where the nav already names the page. /services, /work and /contact
  open on their content (`Page bare`, h1 for screen readers only). /about and the case studies keep a
  visible title because it says something the nav does not.
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

Counts roll up, blocks below the fold fade in (never anything already on screen), and the call track, ladder and loop respond to picking. Everything renders complete
without JavaScript and under reduced motion. The NET backdrop is the one signature visual.

## Type

Archivo throughout, 118% width for display; Martian Mono for numbers and code only. No uppercase.
Size order at every width: hero headline > slide title > figure.
