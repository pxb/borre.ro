---
title: The case for boring automation
description: Agents are sold as the end of the step-by-step workflow. For most business work the better build is plain steps that fetch the facts, AI only where it needs judgement, and a check after every AI step.
date: 2026-10-06
type: article
draft: true
---

There's a view going round that step-by-step automation is finished. Why wire up twenty steps in a workflow tool when you can give an AI agent the goal and let it work out the steps itself?

I build both, and for most of the work a business actually runs, I think that view is wrong. Agents aren't useless. But the builds that hold up, including the ones I run, are mostly plain steps, with AI placed where it earns its keep.

## The pitch, and what's behind it

Gartner expects over 40% of agentic AI projects to be cancelled by the end of 2027, "due to escalating costs, unclear business value or inadequate risk controls". In the same release it says only about 130 of the thousands of vendors selling agentic AI are the real thing. The rest is what it calls agent washing: chatbots and older automation, relabelled. ([Gartner, June 2025](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027))

The people who build agents for a living are calmer about it than the people selling them. Anthropic's advice is to start with "the simplest solution possible", and to use workflows where you want predictability and consistency ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)). The 12-Factor Agents project found that agents in production are often "mostly deterministic code, with LLM steps sprinkled in at just the right points" ([HumanLayer](https://github.com/humanlayer/12-factor-agents)). McKinsey, writing up more than 50 agentic builds, put it plainly: "It's not about the agent; it's about the workflow." ([QuantumBlack, September 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/one-year-of-agentic-ai-six-lessons-from-the-people-doing-the-work))

## Agents cost more to run

An agent decides its own next step. It reasons, calls a tool, reads the result and reasons again, and all of that is tokens, which is what you're billed for. Anthropic measured its own research agents at about 4 times the tokens of a normal chat, and about 15 times when several agents work together ([Anthropic, June 2025](https://www.anthropic.com/engineering/multi-agent-research-system)).

That's worth paying when the task needs it. It isn't worth paying to look up a company number, check a date or copy a field from the CRM, which a plain step does for next to nothing, the same way every time.

And it isn't getting cheaper as fast as people assume. Gartner expects the cost of each customer service query resolved by AI to pass $3 by 2030, more than many offshore human agents, partly because vendors stop subsidising prices and partly because use cases get more complex and "consume more tokens" ([Gartner, January 2026](https://www.gartner.com/en/newsroom/press-releases/2026-01-26-gartner-predicts-genai-cost-per-resolution-for-customer-service-will-exceed-offshore-human-agent-costs-by-2030)).

## Every model still makes things up

OpenAI's own researchers say models hallucinate "because the training and evaluation procedures reward guessing over acknowledging uncertainty" ([Kalai et al., 2025](https://arxiv.org/abs/2509.04664)). A confident guess scores better than "I don't know".

Handing the model the facts doesn't make this go away. Vectara's leaderboard asks models only to summarise an article they've been given, and still finds them adding facts that aren't in it: 1.8% of the time for the best model, between 7% and 12% for the well-known ones, and over 20% for the worst ([Vectara, September 2026](https://github.com/vectara/hallucination-leaderboard)). Legal research tools built on retrieval, the approach sold as the fix, still got it wrong 17% to 33% of the time in Stanford's testing ([Magesh et al., 2024](https://arxiv.org/abs/2405.20362)).

On business tasks, reliability drops as the steps pile up. Salesforce tested leading agents on CRM work: about 58% success when the task took one step, about 35% when it took several turns. Given a defined workflow to follow, success went above 83% ([CRMArena-Pro, 2025](https://arxiv.org/abs/2505.18878)).

## What I build instead

A workflow drawn as a graph of different kinds of step, each doing what it's good at.

Plain steps fetch the facts, exactly, from where they live: the CRM, Companies House, the price list, the contract. No model is involved, so there's no chance of a made-up company number.

AI steps do the judgement on those facts. Is this company a fit? What does this call mean for the deal? What should the follow-up say? They get only what they need to read, which keeps the token bill down.

Plain steps then check the AI's work before anything moves on. Is the output in the right shape, is the quote actually in the source, is the number in range? n8n's own guidance says the same: use fast, inexpensive deterministic checks "wherever possible", and save model-based checks for problems that need semantic understanding ([n8n, July 2026](https://blog.n8n.io/llm-guardrails/)).

A person approves anything that leaves the business. Everything is a draft until then.

Every step logs what it did and what it cost, so when something goes wrong you can see which step and why.

## Six statistics that didn't exist

The research for this piece followed the same shape: search for sources, have AI pull out the claims, then fetch each source and look for the exact words before anything is used.

The AI search tool came back with six confident statistics: a 75% failure rate for agents built in-house, a $4.4 million average loss, 4.3 hours a week per employee spent checking AI output, and three more like them. It said they came from a Zapier survey and a Gartner report. None of them is in either. The check caught all six, and none made it into this article.

That's the argument in one example. The AI step was useful, and it found the real sources too. It just couldn't be trusted to check itself.

## When an agent is the right call

When the path can't be known in advance: open-ended research, a messy inbox, a question nobody wrote a step for. Even then I'd put the agent inside a workflow, so plain steps hand it the facts and plain steps check what it hands back. When something unexpected turns up, send it to the agent or to a person. Don't make everything an agent just in case.

## Five questions to ask a supplier

1. Which steps use AI, which don't, and why?
2. What does one run cost, and where is that recorded?
3. When the AI gets something wrong, what catches it before a customer sees it?
4. Where does each fact come from, and can I see the source?
5. What needs a person's approval?

If the answer to most of them is "the agent handles it", ask again.
