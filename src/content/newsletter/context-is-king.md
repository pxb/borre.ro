---
title: Context is king
description: The model isn't what's holding your AI back. What it knows about your business is, and in most firms that's scattered across the CRM, inboxes and a dozen private chat histories.
date: 2026-10-13
type: article
draft: true
---

Two years ago the advice was to write better prompts. There were courses, prompt libraries and cheat sheets. The people who build these systems now say something different. Gartner titled a piece "Context Engineering Is the New Prompt Engineering", arguing that agentic AI "suffers high failure rates due to misalignment and poor coordination" and that context is the fix ([Gartner, October 2025](https://www.gartner.com/en/articles/context-engineering)). Anthropic describes the job as finding "the smallest possible set of high-signal tokens" for the outcome you want ([Anthropic, September 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

Put simply, the model can only be as good as what it's given to read. Most businesses give it very little of what matters.

## More isn't better

The obvious fix is to give it everything. That doesn't work either.

Chroma tested 18 models and found performance "grows increasingly unreliable as input length grows", even on simple tasks ([Chroma, July 2025](https://research.trychroma.com/context-rot)). Researchers found models use information best when it sits at the start or the end of what they're given, and worst when it's in the middle ([Liu et al.](https://arxiv.org/abs/2307.03172)). Anthropic calls the context window an attention budget, and a finite one.

So pasting the whole shared drive into a chat makes answers worse, and you pay for every word of it.

## Where your context actually lives

In most businesses I work with, the deals are in the CRM and the account history is spread across emails, call notes, proposals and a few people's heads. McKinsey estimated back in 2012 that people spend nearly 20% of their week looking for internal information or tracking down the colleague who knows ([McKinsey Global Institute](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy)).

AI hasn't fixed that. In most firms it has copied it. Microsoft's 2024 survey found 75% of knowledge workers using AI at work, and 78% of them bringing their own tools ([Work Trend Index](https://blogs.microsoft.com/blog/2024/05/08/microsoft-and-linkedin-release-the-2024-work-trend-index-on-the-state-of-ai-at-work/)). Each of those people has their own partial copy of the business: a chat history, a personal project, whatever they pasted in last Tuesday.

The tools are built that way. Claude projects are "self-contained workspaces", and sharing one with colleagues needs a Team or Enterprise plan ([Claude Help Center](https://support.claude.com/en/articles/9517075-what-are-projects)). ChatGPT's memory "decides which available information is relevant", on its own terms ([OpenAI Help Center](https://help.openai.com/en/articles/8590148-memory-in-chatgpt)).

One director I worked with had seven separate Claude projects, each holding a different slice of the business. The problem was obvious the moment we drew it.

## Exact questions need exact answers

"Which open deals haven't had a reply in two weeks?" "Which customers haven't we spoken to in 30 days?" These aren't questions for a chatbot reading documents. They're queries, with one right answer in the records.

Most "chat with your documents" tools work by similarity: they find the passages that look most like your question. That's good for "what did we propose to them last year?" and wrong for "how many?". It can't count what it didn't retrieve.

So the systems I build route each question. Questions about the records go to the records, as a query. Open questions go to the documents, and every answer cites where it came from. Questions about a named account find the account first, then pull everything linked to it. For one client that meant the whole open pipeline in one answer, with every figure traced back to its deal in the CRM, working on their own data within a day ([case study](/work/context-engine)).

Retrieval isn't magic, which is why the citations matter. Legal research tools built this way were still wrong 17% to 33% of the time in Stanford's testing ([Magesh et al., 2024](https://arxiv.org/abs/2405.20362)). An answer with its source attached can be checked in seconds. One without can't.

## One source, everyone's AI

The context should belong to the business, not sit in each person's chat history. That means one shared source that everyone's AI and every workflow reads from.

It follows the permissions you already have, so sales doesn't see payroll because the systems already say they shouldn't. It repeats the facts the team has signed off, like who your ideal customer is, word for word instead of paraphrased. And when someone leaves, what they knew stays with the business.

## Three questions before you buy another AI seat

1. Where does our AI get its facts about the business today?
2. If two people ask it the same question, do they get the same answer?
3. When someone leaves, what does their AI take with them?
