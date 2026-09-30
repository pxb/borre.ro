---
title: Give your AI a notebook
description: If you pay for ChatGPT or Claude and keep re-explaining your business to it, one page of notes kept in a project will get you better answers from the same subscription.
date: 2026-10-20
type: article
draft: true
---

If you pay for ChatGPT or Claude, you've probably typed "we're a 30-person firm that..." more times than you'd like. Or you've left it to memory and hoped.

Memory helps, but it works on the tool's terms. OpenAI's own help page says ChatGPT's memory "does not retain every detail from every conversation. ChatGPT decides which available information is relevant to a response" ([OpenAI Help Center](https://help.openai.com/en/articles/8590148-memory-in-chatgpt)). It remembers what it thinks matters about you. It won't reliably remember your prices, your best customers or the decision you made in March.

The fix is old-fashioned. Write it down, once, and keep it where the AI reads it every time.

## One page, five parts

1. The business in five lines: what you sell, who to, roughly what it costs, where you work.
2. Your customers: who buys, why they buy, what worries them before they do.
3. How you write: three rules and one example you're happy with. "Short sentences, no jargon, never 'I hope this finds you well'" does more than "professional but friendly".
4. Decisions already made, so it stops suggesting them again: the supplier you've chosen, the market you've ruled out, the price you won't drop below.
5. What it must never do: make up figures, name clients, promise delivery dates.

## Where to keep it

Both tools have projects: a workspace with its own instructions and files that every chat inside it reads. In Claude, a project is a "self-contained workspace" with its own knowledge and instructions, and even free accounts get up to five ([Claude Help Center](https://support.claude.com/en/articles/9517075-what-are-projects)). Put the page in the project's instructions or add it as a file, and start your work chats there instead of in a blank chat.

One project per kind of work is enough to start: sales, operations, writing.

## Keep it short

It's tempting to upload everything. Don't. Anthropic's advice is to give the model "the smallest possible set of high-signal tokens" for the job ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). Chroma tested 18 models and found they get less reliable as the text you give them gets longer ([Chroma](https://research.trychroma.com/context-rot)), and researchers found that what sits in the middle of a long document is the most likely to be missed ([Liu et al.](https://arxiv.org/abs/2307.03172)).

So a page, not a folder. The most important things go first.

## Tell it how to be wrong

Add one line: "If you don't know, say so, and don't invent figures." Anthropic's own guidance for cutting made-up answers starts there: let it say "I don't know", ask it to quote its source, and keep it to the documents you've given it ([Anthropic docs](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)).

## Keep it current

Put a date at the top. A note that's out of date is worse than no note, because the AI will repeat it with confidence. When it gets something wrong and you correct it, add the correction to the page, so you only make that correction once.

I run this practice the same way: short notes, one fact each, that every AI session reads before it starts. Most of them began as a correction.

## When one notebook isn't enough

This works for one person. It gets harder when the whole team does it. The ONS found that of UK businesses using AI, only 10% use it extensively ([ONS, July 2026](https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/articles/artificialintelligenceinukbusinesses/2023to2026)), and in most firms each person using it has their own private notebook, or none. When five people keep five different versions of your prices, the next step is one shared source. That's the subject of [Context is king](/newsletter/context-is-king).
