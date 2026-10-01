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

## Two ways to edit

**1. On the page.** Open the copy preview, https://borre-ro-git-copy-pedro-borrero.vercel.app/?copy (logged in to Vercel, any device). Every editable line has a dashed outline; click one, rewrite it in place and watch the count against its budget (Enter keeps, Esc undoes). Move from page to page: the panel keeps one list of all your changes. "Copy changes", paste the list to Claude. Best for tweaks, in context.

**2. The copy note in your vault.** `01 Projects/AI Cubed/borre.ro Copy.md`: every word on the site in one note, a heading per page, synced to all your devices. Rewrite anything under a "##" heading, then tell Claude "apply the copy note". Only the lines you changed are applied; a line that changed on the site since the note was made is flagged, never overwritten. Ask for a fresh note after a publish. Best for rewriting whole pages.

Either way the edits land on the `copy` branch and go live only when you approve the preview.

One catch on the page: when two files hold exactly the same words (a case study called "Context Engine" on the Context Engine service page), the line is credited to the page's own file. Lines with `{n}` in them (the homepage headlines) can't be edited on the page; change them in the note.

## Nothing publishes by itself

- Your edits are applied to the `copy` branch. The live site only changes when that branch is merged into `main`, and that only happens when you say so.
- When you're ready, tell Claude "publish the copy". Claude commits your edits, pushes the branch and checks the Vercel preview and the layout. You look at the preview and approve, and only then is it merged and tagged.
- Every change is a commit with a diff you can read, and any version can be brought back.

## If the build fails

The message names the file and the heading, for example `case-lead-research.md has no "## tagline"`. A heading was renamed or deleted; put it back.

## Which file is which

- `home.md`: the homepage. `work.md` and `case-*.md`: case studies. `services.md` and `service-*.md`: services.
- `about.md`, `contact.md`, `security.md`, `privacy.md`, `scorecard.md`, `newsletter.md`: those pages.
- `chrome.md`: what every page shares: the offer, the menu, the footer, the page-not-found screen.

Privacy and security say what is true today; change them only when the facts change. The scorecard's answers are scored in order, so keep each list in the same order and length.

Files starting with `_` (like this one) are ignored.
