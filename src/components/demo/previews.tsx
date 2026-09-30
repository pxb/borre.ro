import "./portal.css";
import { demoClient, demoLeads, type Status } from "@/content/demo-prospecting";
import { ceQuestions, leadEnrichmentRun, postCallRun, type FlowRun } from "@/content/demo-showcases";

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

// A chat: the question and a grounded answer with its citations. No input bar:
// a still that looks typeable reads as broken.
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

// An automation canvas: a four-step outline, left to right, on a dotted grid.
function FlowPreview({ run }: { run: FlowRun }) {
  return (
    <Frame nav="Workflows">
      <ol className="mini-canvas">
        {run.skeleton.map((n, i) => (
          <li key={n.title} className={n.gate ? "gate" : ""}>
            <span className="i">{i + 1}</span>
            <span className="t">{n.title}</span>
            <span className="ntype">{n.type}</span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

// The team workspace (full agentic platform), which has no case study yet: the
// models, teams and people on it, each person with their model and the
// knowledge their access reaches. Invented people at the invented client.
const PEOPLE = [
  { i: "PS", n: "Priya Shah", team: "Sales", model: "Claude", reach: "CRM and proposals" },
  { i: "TO", n: "Tom Okafor", team: "Operations", model: "ChatGPT", reach: "Orders and suppliers" },
  { i: "SM", n: "Sam Moore", team: "Finance", model: "Gemini", reach: "Invoices" },
];
export function PlatformPreview() {
  const strip = [
    { k: "Models", n: "4" },
    { k: "Teams", n: "3" },
    { k: "People", n: "18" },
  ];
  return (
    <Frame nav="Workspace">
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
          {PEOPLE.map((p) => (
            <li key={p.n}>
              <span className="av">{p.i}</span>
              <span className="lname">{p.n}</span>
              <span className="p-sub">
                {p.team} · {p.reach}
              </span>
              <span className="chip">{p.model}</span>
            </li>
          ))}
        </ul>
      </div>
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
