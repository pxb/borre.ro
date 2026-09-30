# The words on borre.ro

Every word on the site lives in these files, one per page. Change the words, and the site changes on the next build. You never need to touch code.

## How a file works

- `## title` is a slot: the page looks it up by that name. Keep the heading exactly as it is and change the words under it.
- One paragraph stays one paragraph. Where a slot has several paragraphs, leave a blank line between them.
- A list is one `- ` line per item. Add or remove lines freely.
- Lines starting `>` are notes for you: where the words appear, and a budget such as `max 110` (characters). Going over is allowed, but the build warns you, because a longer line can wrap or push something off the screen.
- Figures (100%, 1 day, £450) stay in code with their evidence. Change the words around a figure, never the number.
- `{title}` or `{n}` inside a line is filled in by the site. Keep it.

## Three ways to edit

1. **Read the whole site in one go.** Ask Claude for the deck (`COPY.md`): every page in the order a visitor meets them. Mark it up however you like and pass it back. Claude applies it slot by slot and checks the layout.
2. **On your phone.** In the GitHub app, open this folder on a `copy` branch, edit a file and commit. Vercel builds a preview; Claude checks it and merges.
3. **On your desktop.** Open this folder as its own vault in Obsidian and edit there.

## If the build fails

The message names the file and the heading, for example `case-lead-research.md has no "## tagline"`. A heading was renamed or deleted; put it back.

Files starting with `_` (like this one) are ignored.
