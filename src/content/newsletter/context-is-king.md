---
title: Context is king
description: What your AI knows about your business matters more than which model you pay for. How to give it that knowledge for one person, a team and a whole company, as of October 2026.
date: 2026-10-13
checked: 2026-09-30
type: article
skill: business-context-map
skill_prompt: Read {url} and follow it to map where my business's knowledge lives and draft my standing notes.
skill_note: Give your AI this skill and it will map where your business knowledge lives, draft your standing notes and suggest a folder layout your team can share.
draft: true
---

Microsoft's 2026 Work Trend Index surveyed 20,000 people who use AI at work. Organisational factors like culture, manager support and talent practices accounted for 67% of the impact they reported. Individual factors, the person and their prompts, accounted for 32% ([Microsoft, May 2026](https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization)).

That matches what I see. The model isn't what holds most businesses back. What it knows about the business is. In most firms that knowledge sits in the CRM, inboxes, proposals and a few people's heads, and each person's AI has its own partial copy.

## The method has changed

A couple of years ago the answer was better prompts, then "upload everything". Neither holds up.

More text makes models worse, not better. Chroma tested 18 models and found performance "grows increasingly unreliable as input length grows" ([Chroma, July 2025](https://research.trychroma.com/context-rot)). Anthropic says models have an "attention budget", and that the job is to find "the smallest possible set of high-signal tokens" for the outcome you want ([Anthropic, September 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

The newer approach is closer to how people work. You don't memorise the filing cabinet, you know where things are. Anthropic describes agents that keep file paths, saved queries and links, and load the content only when they need it. Its own coding agent reads a notes file at the start, then searches folders as it goes, which avoids a stale index. Folder and file names tell the agent what to open.

So "second brain" is the wrong picture. It's closer to a well-organised office: a short brief on the desk, labelled folders, and a records room with a key.

How you set that up depends on scale.

## You

For one person, the brief on the desk is a page of standing notes: what you sell, who buys, how you write, the decisions already made, and what the AI must never do. Keep it short and put the important things first.

Both main tools support this through projects: a workspace with its own instructions and files that every chat inside it reads ([Claude](https://support.claude.com/en/articles/9517075-what-are-projects)). Don't rely on memory alone. ChatGPT's memory "does not retain every detail from every conversation" and decides for itself what's relevant ([OpenAI](https://help.openai.com/en/articles/8590148-memory-in-chatgpt)). Your notes are what you decide it should know.

Date the page. When the AI gets something wrong and you correct it, add the correction, so you only correct it once.

## Your team

Five people with five private notes files give five different answers about your prices. At team level the knowledge has to be shared, and the procedures too.

One director I worked with had at least seven separate Claude projects, each holding a different slice of the business. A project per topic is sensible advice for one person. Across a business it meant every answer worked from part of the picture, and nobody else could see any of it. Advice goes stale quickly in this space, and stale advice can quietly make things worse. It's why every post here says when its sources were checked.

That's what skills are for. A skill is a folder of instructions, and optionally scripts and templates, that the AI loads only when a task needs it. Only each skill's name and description load at the start, so a team can keep many of them without filling up the AI's attention ([Anthropic, October 2025](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)). The format is an open standard, supported by Claude, ChatGPT and Codex, GitHub Copilot and others ([agentskills.io](https://agentskills.io/home)). Write the proposal checklist once, and everyone's AI follows it.

Sharing depends on the plan. Shared projects in Claude need Team or Enterprise. Skills in ChatGPT are for Business, Enterprise and Edu workspaces ([OpenAI](https://help.openai.com/en/articles/20001066-skills-in-chatgpt)). Claude has skills on every plan, including Free ([Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)).

## Your company

At company level the knowledge is too big, changes too fast and is too sensitive to put in anyone's project. Customer history, every email, every proposal, who may see what.

This is where retrieval earns its keep, but it needs two different routes.

Questions about records need an exact query. "Which open deals haven't had a reply in two weeks?" has one right answer in the CRM. A search for passages that look like the question can't count what it didn't find.

Questions about documents need search, and search works best when it combines meaning and keywords. Anthropic found that adding a short note of context to each chunk of a document, and searching by both meaning and keywords, cut failed searches by 49%, and by 67% with a reranking step ([Anthropic, 2024](https://www.anthropic.com/engineering/contextual-retrieval)).

Every answer should cite where it came from, so a person can check it in seconds, and the whole thing should follow the permissions you already have. Sales doesn't see payroll because the systems already say so.

For one client, this meant the whole open pipeline in one answer, every figure traced back to its deal in the CRM, working on their own data within a day ([case study](/work/context-engine)). Each person's AI reads the same source, and what someone knew stays with the business when they leave.

## Where to start

Most firms don't need the company layer first. The ONS found that of UK businesses using AI, only 10% use it extensively ([ONS, July 2026](https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/articles/artificialintelligenceinukbusinesses/2023to2026)). Start with the page of notes, then the shared folders and skills. Move to a shared company source when two people get different answers to the same question, or when the knowledge you need is in a system nobody can paste into a chat.

Three questions to ask this week:

1. Where does our AI get its facts about the business today?
2. If two people ask it the same question, do they get the same answer?
3. When someone leaves, what does their AI take with them?
