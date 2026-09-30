# The words on borre.ro

Every word on the site lives in these files, one per page. Change the words, and the site changes on the next build. You never need to touch code.

## How a file works

- `## title` is a slot: the page looks it up by that name. Keep the heading exactly as it is and change the words under it.
- One paragraph stays one paragraph. Where a slot has several paragraphs, leave a blank line between them.
- A list is one `- ` line per item. Add or remove lines freely.
- Lines starting `>` are notes for you: where the words appear, and a budget such as `max 110` (characters). Going over is allowed, but the build warns you, because a longer line can wrap or push something off the screen.
- Figures (100%, 1 day, £450) stay in code with their evidence. Change the words around a figure, never the number.
- `{title}` or `{n}` inside a line is filled in by the site. Keep it.
- The lines at the top between `---` (route, also, shared) tell the site and the review mode where the words appear. Leave them.

## Reviewing and editing

**In Obsidian, with the page beside it (desktop).** Open `Lab/borre-copy/src/content/copy` as its own vault. It's a separate working copy on the `copy` branch, so nothing you do there touches the live site. Ask Claude to start live editing (or run `npm run copy:live` in `Lab/borre-copy`) and open http://localhost:3012. Every save shows on the page within a second or two.

**On the page itself.** Add `?copy` to any preview or local address. Every line from these files gets a dashed outline; click one to edit it in place, with a count against its budget (Enter keeps, Esc undoes). Nothing is saved: the panel collects your changes, and "Copy changes" gives you a list to paste back to Claude. `?copy=off` or Exit leaves review mode. The live site never has it.

One catch: when two files hold exactly the same words (a case study called "Context Engine" on the Context Engine service page), the page credits the line to its own file. If an edit lands in the wrong place, say which you meant. Lines with `{n}` in them (the homepage headlines) can't be edited on the page; change them in `home.md`.

**The whole site in one read.** Ask Claude for the deck (`COPY.md`), mark it up and pass it back.

## Nothing publishes by itself

- Your edits live on the `copy` branch in `Lab/borre-copy`. The live site only changes when that branch is merged into `main`, and that only happens when you say so.
- When you're ready, tell Claude "publish the copy". Claude commits your edits, pushes the branch and checks the Vercel preview and the layout. You look at the preview and approve, and only then is it merged and tagged.
- Every change is a commit with a diff you can read, and any version can be brought back.
- Don't add an auto-commit or auto-push plugin to this vault, and keep it out of LiveSync.

## If the build fails

The message names the file and the heading, for example `case-lead-research.md has no "## tagline"`. A heading was renamed or deleted; put it back.

Files starting with `_` (like this one) are ignored.
