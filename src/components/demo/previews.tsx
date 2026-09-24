import "./portal.css";
import { demoClient, demoLeads, type Status } from "@/content/demo-prospecting";
import { ceQuestions, leadEnrichmentRun, postCallRun, systems, type FlowRun } from "@/content/demo-showcases";

// Still, server-rendered previews of each case study's interactive piece, in
// the portal's design, for the /work index. Each kind of product gets its own
// form so they don't read as four copies: the Context Engine as a chat, the
// prospecting portal as a board, the workflows as an automation canvas.

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
      {children}
    </div>
  );
}

// A chat: the question, a grounded answer with its citations, an input bar.
function ContextPreview() {
  const q = ceQuestions.find((x) => x.id === "pipeline") ?? ceQuestions[0];
  return (
    <Frame nav="Context Engine">
      <div className="mini-chat">
        <p className="ask">{q.q}</p>
        <div className="ans">
          <p className="by">Context Engine · {q.citations.length} sources</p>
          <p>{q.answer}</p>
          <div className="ce-cites">
            {q.citations.map((c) => (
              <span key={c} className="chip dot t-ver">
                {c}
              </span>
            ))}
          </div>
        </div>
        <p className="bar">Ask about any account, deal or call…</p>
      </div>
    </Frame>
  );
}

// A board: the funnel strip over the week's leads.
function ProspectingPreview() {
  const week = demoLeads.filter((l) => l.batch === "W38");
  const at = (s: Status[]) => week.filter((l) => s.includes(l.status)).length;
  const strip = [
    { k: "TAM", n: "·" },
    { k: "ICP match", n: "·" },
    { k: "Researched", n: String(week.length) },
    { k: "Sent", n: String(at(["sent", "reply", "meeting"])) },
    { k: "Reply", n: String(at(["reply", "meeting"])) },
  ];
  return (
    <Frame nav="Pipeline">
      <div className="p-wrap">
        <ol className="mini-strip">
          {strip.map((x) => (
            <li key={x.k}>
              <span className="n">{x.n}</span>
              <span className="k">{x.k}</span>
            </li>
          ))}
        </ol>
        <ul className="mini-rows">
          {week.slice(0, 3).map((l) => (
            <li key={l.id}>
              <span className={`cdot cdot-${l.contactState}`} />
              <span className="lname">{l.name}</span>
              <span className="p-sub">{l.signal}</span>
              <span className={`chip dot s-${l.status}`}>{STATUS[l.status]}</span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

// An automation canvas: nodes snake across two rows on a dotted grid.
function FlowPreview({ run }: { run: FlowRun }) {
  return (
    <Frame nav="Workflows">
      <ol className="mini-canvas">
        {run.nodes.map((n, i) => (
          <li key={n.id} className={`n${i + 1}${n.gate ? " gate" : ""}`}>
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
