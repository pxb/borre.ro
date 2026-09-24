import "./portal.css";
import { demoClient, demoLeads, type Status } from "@/content/demo-prospecting";
import { ceQuestions, leadEnrichmentRun, postCallRun, systems, type FlowRun } from "@/content/demo-showcases";

// Still, server-rendered previews of each case study's interactive piece, in
// the portal's design, for the /work index. They show the same invented client
// as the full demos, so the index and the case studies read as one system.

const STATUS: Record<Status, string> = { new: "New", sent: "Sent", reply: "Reply", meeting: "Meeting" };

function Frame({ nav, children }: { nav: string; children: React.ReactNode }) {
  return (
    <div className="portal mini" aria-hidden="true">
      <div className="p-top">
        <span className="p-brand">{demoClient.short}</span>
        <nav className="p-nav">
          <span className="on">{nav}</span>
        </nav>
      </div>
      <div className="p-wrap">{children}</div>
    </div>
  );
}

function ContextPreview() {
  const q = ceQuestions.find((x) => x.id === "pipeline") ?? ceQuestions[0];
  return (
    <Frame nav="Context Engine">
      <p className="p-panel-title">{q.q}</p>
      <p style={{ margin: 0, color: "var(--p-ink)" }}>{q.answer}</p>
      <div className="ce-cites">
        {q.citations.map((c) => (
          <span key={c} className="chip dot t-ver">
            {c}
          </span>
        ))}
      </div>
    </Frame>
  );
}

function ProspectingPreview() {
  const rows = demoLeads.filter((l) => l.batch === "W38").slice(0, 4);
  return (
    <Frame nav="Pipeline">
      <p className="p-panel-title">Prospecting pipeline · W38</p>
      <ul className="mini-rows">
        {rows.map((l) => (
          <li key={l.id}>
            <span className={`cdot cdot-${l.contactState}`} />
            <span className="lname">{l.name}</span>
            <span className="p-sub">{l.signal}</span>
            <span className={`chip dot s-${l.status}`}>{STATUS[l.status]}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function FlowPreview({ run }: { run: FlowRun }) {
  return (
    <Frame nav="Workflows">
      <ol className="mini-flow">
        {run.nodes.map((n, i) => (
          <li key={n.id} className={n.gate ? "gate" : ""}>
            <span className="i">{i + 1}</span>
            <span className="t">{n.title}</span>
            <span className="ntype">{systems[n.touches[0].sys].type}</span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

export function CasePreview({ slug }: { slug: string }) {
  if (slug === "context-engine") return <ContextPreview />;
  if (slug === "prospecting-loop") return <ProspectingPreview />;
  if (slug === "lead-research") return <FlowPreview run={leadEnrichmentRun} />;
  if (slug === "post-call") return <FlowPreview run={postCallRun} />;
  return null;
}
