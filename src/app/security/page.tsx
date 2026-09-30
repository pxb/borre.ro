import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Page, Row } from "@/components/section";

export const metadata: Metadata = pageMeta({
  title: "Trust and security",
  description:
    "How we look after your data and systems: accounts in your name, access that follows your permissions, your team approving what goes out, and your data kept out of AI training.",
  path: "/security",
});

// Trust and security (#580). Every line is true of how we build today (the
// live client build, checked 2026-09-30): client-owned Supabase, n8n and AI
// accounts; access tiers enforced by Postgres row-level security, mirroring
// what each person can see at source; draft by default with human approval;
// sourced answers and a run log; business APIs. The live client database is
// in the EU (eu-central-1), so the page says UK or EU, never UK only. Not
// claimed until true: a signed data processing agreement (#249), ICO
// registration (deferred), backup schedules and uptime figures. Positive
// wording only (Pedro): say what we do.

const ROWS: { label: string; body: string[] }[] = [
  {
    label: "Your accounts",
    body: [
      "Everything we build runs on accounts in your name: the database, the workflows and the AI subscription. You can see all of it, and if we stop working together, you keep all of it.",
    ],
  },
  {
    label: "Where your data lives",
    body: [
      "In your own database, with a major cloud provider, in a UK or EU region. Data moves between your systems encrypted.",
    ],
  },
  {
    label: "Who sees what",
    body: [
      "Access follows the permissions you already have, so people see through AI what they can already see in your CRM and documents. The rules are enforced in the database itself.",
    ],
  },
  {
    label: "Your team approves",
    body: [
      "Our systems draft and your team decides. Emails, CRM updates and anything a customer will see wait for someone on your team to approve them.",
    ],
  },
  {
    label: "AI and your data",
    body: [
      "We use business accounts and APIs that keep your data out of model training. Every answer links to the record it came from, and each system keeps a log of what it did, so you can check any result.",
    ],
  },
  {
    label: "What we build on",
    body: [
      "Supabase for the database, n8n for workflows, and OpenAI and Anthropic for AI models, alongside the systems you already use, such as HubSpot and Microsoft 365. Each is set up in your name wherever it can be.",
    ],
  },
];

export default function Security() {
  return (
    <Page title="Trust and security" crumbs={[{ href: "/", label: "Home" }]}>
      {ROWS.map((r) => (
        <Row key={r.label} label={r.label}>
          <div className="max-w-2xl space-y-4 leading-relaxed text-ink">
            {r.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Row>
      ))}
    </Page>
  );
}
