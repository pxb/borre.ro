---
title: The case for boring automation
description: Agents can now write their own code and run on a schedule. Workflow platforms still earn their place, for reasons that have little to do with intelligence. Both sides, as of October 2026.
date: 2026-10-06
checked: 2026-09-30
type: article
skill: workflow-or-agent
skill_prompt: Read {url} and follow it to help me plan an automation for [the process you want to automate].
skill_note: Give your AI this skill and it will help you plan an automation: which steps stay fixed, where AI helps, where a person approves, and where it should run.
draft: true
---

There's a view going round that step-by-step automation is finished. Why wire up twenty steps in a workflow tool when an AI agent can take the goal and work out the steps itself?

I build both. For most of the work a business actually runs, I think that view is wrong, but not for the reasons it used to be. Agents have got much better this year. The case for plain, fixed steps now rests less on what AI can't do and more on what a business needs from anything that runs without a person watching.

## The hype, and what's behind it

Gartner expects over 40% of agentic AI projects to be cancelled by the end of 2027, "due to escalating costs, unclear business value or inadequate risk controls". It also reckons only about 130 of the thousands of vendors selling agentic AI are the real thing ([Gartner, June 2025](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)).

The people who build agents are calmer about it than the people selling them. Anthropic still advises starting with "the simplest solution possible", and using workflows where you want predictability and consistency ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)).

## The agent side has moved

Two things changed in the last year, and anyone arguing for workflows should say so.

Agents write the steps now. Instead of calling tools one at a time, an agent can write a short program that does the job. In Anthropic's example that cut the tokens used from 150,000 to 2,000, a 98.7% saving ([Anthropic, November 2025](https://www.anthropic.com/engineering/code-execution-with-mcp)). A program runs the same way every time. So the agent is choosing deterministic steps for itself.

Personal AI runs on its own. Claude and ChatGPT can both run tasks on a schedule while you're away from the screen. Claude's scheduled tasks already run remotely when your computer is asleep, unless they need local files, and from 6 October new Claude tasks on Pro and Max run in the cloud by default ([Claude Help Center](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork)). ChatGPT can also start a task when a new email, Slack message or GitHub pull request arrives ([OpenAI Help Center](https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt)).

So "the AI can't do it reliably" is a weaker argument than it was. What's left is still a strong one.

## The platform side

Code has to live somewhere. An agent that writes a useful script in a chat can lose it when the chat ends, unless it's saved. Anthropic's answer is to save it as a skill, a folder of instructions and scripts the agent can reuse. It also says plainly that running agent-written code needs "a secure execution environment with appropriate sandboxing, resource limits, and monitoring", which adds "operational overhead" ([Anthropic, November 2025](https://www.anthropic.com/engineering/code-execution-with-mcp)). A workflow platform is that environment, already built.

Personal automations belong to a person. A scheduled task in Claude or ChatGPT is set up by one person, on their account, with the apps they've connected, and they review the results. That's fine for their morning briefing. It's a problem for the invoice chaser when they're on holiday, or after they leave.

Triggers are narrow. Claude's scheduled tasks run hourly, daily, weekly, on weekdays or when you press go. ChatGPT's event triggers cover Gmail, Slack and GitHub. A business process usually starts somewhere else: a deal moving stage in the CRM, a form, a payment, a message from another system. n8n lists over 2,000 integrations ([n8n](https://n8n.io/integrations/)), and any system that can send a webhook can start a workflow.

Limits. ChatGPT allows 5 active tasks on Plus and 15 on Pro. Most businesses run more processes than that.

Failure has to be loud. OpenAI's advice if a task stops responding is to check whether it's paused, waiting for approval, or lost its connection. In a workflow platform you set an error workflow that emails or messages someone the moment a run fails, and every run leaves a record you can open later ([n8n docs](https://docs.n8n.io/build/flow-logic/handle-errors-gracefully)).

Credentials belong to the business. Keys and logins are stored once, in a system the business controls, and shared by the workflows that need them, not scattered across personal chat accounts.

None of that is intelligence. It's the plumbing that lets you trust something running at 3am.

## Every model still makes things up

The argument that hasn't moved is accuracy. OpenAI's own researchers say models hallucinate "because the training and evaluation procedures reward guessing over acknowledging uncertainty" ([Kalai et al., 2025](https://arxiv.org/abs/2509.04664)).

Handing the model the facts doesn't fix it. Vectara's leaderboard asks models only to summarise an article they've been given, and still finds them adding facts that aren't in it. On the September 2026 update the flagship models sit between 6.5% (GPT-6 Sol) and 12% (Claude Opus 4.7), with Gemini 3.1 Pro at 10.4% ([Vectara, 22 September 2026](https://github.com/vectara/hallucination-leaderboard)). Newer isn't always lower.

So where a fact can be read exactly, from the CRM, Companies House or the price list, a fixed step should read it. The AI should do the judgement on top.

## What I build

A workflow drawn as a graph of different kinds of step, each doing what it's good at:

- plain steps fetch the facts, exactly, from where they live
- AI steps do the judgement on those facts, and read only what they need
- plain steps check the AI's work before anything moves on: right shape, the quote is really in the source, the number is in range
- a person approves anything that leaves the business
- every step records what it did and what it cost

The AI steps can be agents, and they can write their own code. They run inside a frame the business owns, can see and can switch off.

## Six statistics that didn't exist

The research for this piece followed the same shape: search for sources, have AI pull out the claims, then fetch each source and look for the exact words before anything is used.

The AI search tool came back with six confident statistics: a 75% failure rate for agents built in-house, a $4.4 million average loss, 4.3 hours a week per employee spent checking AI output, and three more like them. It said they came from a Zapier survey and a Gartner report. None of them is in either. The check caught all six.

The AI step was useful. It found the real sources too. It just couldn't be trusted to check itself.

## Where each belongs

A personal AI task is right for work one person owns and reads: a briefing, a research digest, a first draft. An agent is right for the parts no one can map in advance. A workflow platform is right for anything the business depends on: it runs whoever is in, alerts someone when it breaks, and leaves a record.

Most good builds use all three.
