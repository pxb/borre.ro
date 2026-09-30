Newsletter pieces for borre.ro/newsletter. One markdown file per article or monthly roundup, named
<slug>.md, starting with:

---
title: The case for boring automation
description: One or two sentences for the index, search and share cards.
date: 2026-10-06
checked: 2026-09-30  (the day every source was last read at the source; shown on the post)
type: article        (or: roundup)
skill: workflow-or-agent   (optional: a companion skill in skills/<name>/)
skill_note: One plain line for readers on what the skill does.
draft: true          (shows on previews only; remove to publish)
---

Freshness: a post published more than 30 days after its checked date fails the build. Re-read the
sources, update figures that moved, and change the date. In the copy, give every figure its date or
the model it was measured on; prefer sources from the last 12 months and say so when one is older.

Skills: skills/<name>/SKILL.md in the open Agent Skills format (agentskills.io): front matter with
name (matches the folder, lowercase and hyphens, max 64) and description (what it does and when to
use it, max 1024), then plain instructions. Optional references/ and assets/. Served as
/newsletter/skills/<name>.zip (Claude and ChatGPT apps) and /newsletter/skills/<name>/SKILL.md.
No figures in a skill that aren't in its post; tell the agent to check tool limits at the source.

Files starting with "_" (like this one) are ignored.
