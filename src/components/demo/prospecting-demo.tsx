"use client";

import "./portal.css";
import { useMemo, useRef, useState } from "react";
import {
  batches,
  demoClient,
  demoFunnel,
  demoLeads,
  wonMix,
  type DemoLead,
  type Evidence,
  type Status,
} from "@/content/demo-prospecting";

// The prospecting portal (#542), rebuilt as a self-contained demo on invented
// data (#560). Same two screens and the same design system as the real product
// (portal.css), so it reads as a product sitting on the page. Everything is
// local state; "Mark sent" changes nothing outside this component. The first
// screen renders on the server, so it reads without JavaScript.

const STATUS_LABEL: Record<Status, string> = { new: "New", sent: "Sent", reply: "Reply", meeting: "Meeting" };
const STATUS_ORDER: Status[] = ["new", "sent", "reply", "meeting"];

const dmy = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const Dot = ({ state }: { state: DemoLead["contactState"] }) => {
  const tip = state === "ready" ? "Contact ready" : state === "verify" ? "Check contact before sending" : "No contact yet";
  return <span className={`cdot cdot-${state}`} title={tip} aria-label={tip} />;
};

const StatusChip = ({ s }: { s: Status }) => <span className={`chip dot s-${s}`}>{STATUS_LABEL[s]}</span>;

export function ProspectingDemo() {
  const [open, setOpen] = useState<string | null>(null);
  const [batch, setBatch] = useState<string>("W38");
  const [status, setStatus] = useState<Record<string, Status>>(() =>
    Object.fromEntries(demoLeads.map((l) => [l.id, l.status])),
  );
  const top = useRef<HTMLDivElement>(null);

  const go = (id: string | null) => {
    setOpen(id);
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lead = open ? demoLeads.find((l) => l.id === open) : undefined;

  return (
    <div ref={top} className="portal scroll-mt-28">
      <div className="p-top">
        <span className="p-brand">{demoClient.short}</span>
        <nav className="p-nav">
          <button className={lead ? "" : "on"} onClick={() => go(null)}>
            Pipeline
          </button>
        </nav>
      </div>
      <div className="p-wrap">
        {lead ? (
          <Brief
            lead={lead}
            status={status[lead.id]}
            onStatus={(s) => setStatus((m) => ({ ...m, [lead.id]: s }))}
            onBack={() => go(null)}
          />
        ) : (
          <Board batch={batch} setBatch={setBatch} status={status} onOpen={go} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- board

type SortKey = "name" | "fit" | "status" | "researched";

function Board({
  batch,
  setBatch,
  status,
  onOpen,
}: {
  batch: string;
  setBatch: (b: string) => void;
  status: Record<string, Status>;
  onOpen: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "fit", desc: true });

  const inBatch = useMemo(
    () => (batch === "All" ? demoLeads : demoLeads.filter((l) => l.batch === batch)),
    [batch],
  );

  const rows = useMemo(() => {
    const f = inBatch.filter((l) => l.name.toLowerCase().includes(q.trim().toLowerCase()));
    const val = (l: DemoLead) =>
      sort.key === "name" ? l.name : sort.key === "fit" ? l.fit : sort.key === "status" ? STATUS_ORDER.indexOf(status[l.id]) : l.researched;
    return [...f].sort((a, b) => {
      const x = val(a);
      const y = val(b);
      const c = x < y ? -1 : x > y ? 1 : 0;
      return sort.desc ? -c : c;
    });
  }, [inBatch, q, sort, status]);

  // Counts only for the demo's own pipeline stages; the top of the funnel is shape.
  const counts = useMemo(() => {
    const at = (s: Status) => inBatch.filter((l) => STATUS_ORDER.indexOf(status[l.id]) >= STATUS_ORDER.indexOf(s)).length;
    return { Researched: inBatch.length, Sent: at("sent"), Reply: at("reply"), Meeting: at("meeting") } as Record<string, number>;
  }, [inBatch, status]);

  const wc = batches.find((b) => b.label === batch)?.wc;
  const sortBtn = (key: SortKey, label: string) => (
    <button onClick={() => setSort((s) => ({ key, desc: s.key === key ? !s.desc : key !== "name" }))}>
      {label}
      <span aria-hidden="true" style={{ color: "var(--p-faint)", fontWeight: 400 }}>
        {sort.key === key ? (sort.desc ? " ↓" : " ↑") : ""}
      </span>
    </button>
  );

  return (
    <div>
      <h3 className="p-h1">Prospecting pipeline</h3>
      <p className="p-sub">{demoClient.region}</p>

      <div className="p-weeks">
        {[...batches.map((b) => b.label), "All"].map((b) => (
          <button key={b} className={batch === b ? "on" : ""} aria-pressed={batch === b} onClick={() => setBatch(b)}>
            {b === "All" ? "All weeks" : b}
          </button>
        ))}
        {wc ? <span className="wc">{wc}</span> : null}
      </div>

      <ol className="p-funnel">
        {demoFunnel.map((stage, i) => (
          <li key={stage} style={{ display: "contents" }}>
            {i ? <span aria-hidden="true" className="p-farr">&rsaquo;</span> : null}
            <div className="p-fstep">
              <div className={`fn${counts[stage] == null ? " shape" : ""}`}>
                {counts[stage] != null ? counts[stage] : "·"}
              </div>
              <div className="fl">{stage}</div>
            </div>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: 16 }}>
        <MixChart leads={inBatch} />
      </div>

      <div className="p-table" style={{ marginTop: 16 }}>
        <div className="p-table-bar">
          <h4 style={{ fontSize: 12.5, fontWeight: 600 }}>Leads</h4>
          <input
            type="search"
            className="p-search"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            placeholder="Search company"
            aria-label="Search company"
          />
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="p-leads">
            <thead>
              <tr>
                <th scope="col">{sortBtn("name", "Company")}</th>
                <th scope="col">Signal</th>
                <th scope="col">Offer</th>
                <th scope="col" className="num">{sortBtn("fit", "Fit")}</th>
                <th scope="col">{sortBtn("status", "Status")}</th>
                <th scope="col">{sortBtn("researched", "Researched")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} onClick={() => onOpen(l.id)}>
                  <td>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <Dot state={l.contactState} />
                      <button
                        className="lname"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(l.id);
                        }}
                      >
                        {l.name}
                      </button>
                    </span>
                    {l.group ? <div className="lsub">{l.group}</div> : null}
                  </td>
                  <td>{l.signal}</td>
                  <td>
                    <span className="chip brand">{l.offer}</span>
                  </td>
                  <td className="num">{l.fit.toFixed(1)}</td>
                  <td>
                    <StatusChip s={status[l.id]} />
                  </td>
                  <td style={{ color: "var(--p-muted)", fontSize: 13, whiteSpace: "nowrap" }}>{dmy(l.researched)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="p-list md:hidden">
          {rows.map((l) => (
            <li key={l.id}>
              <button onClick={() => onOpen(l.id)}>
                <span style={{ marginTop: 7 }}>
                  <Dot state={l.contactState} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="lname" style={{ display: "block" }}>
                    {l.name}
                  </span>
                  <span className="p-sub" style={{ display: "block" }}>
                    {l.signal} · {l.offer}
                  </span>
                </span>
                <StatusChip s={status[l.id]} />
              </button>
            </li>
          ))}
        </ul>
        {!rows.length ? <p className="p-sub" style={{ padding: "18px 14px" }}>No leads match.</p> : null}
      </div>

      <p className="p-legend" style={{ color: "var(--p-muted)" }}>
        <span><Dot state="ready" />Contact ready</span>
        <span><Dot state="verify" />Check contact</span>
        <span><Dot state="none" />No contact yet</span>
      </p>
    </div>
  );
}

const SECTORS: { key: string; color: string }[] = [
  { key: "Workplaces", color: "#6b3a22" },
  { key: "Hospitality", color: "#c08552" },
  { key: "Fitness", color: "#7d8a5a" },
  { key: "Retail", color: "#dab49d" },
  { key: "Other", color: "#b1ada1" },
];

function MixChart({ leads }: { leads: DemoLead[] }) {
  const n = leads.length || 1;
  const week: Record<string, number> = Object.fromEntries(
    SECTORS.map((s) => [s.key, Math.round((leads.filter((l) => l.sector === s.key).length / n) * 100)]),
  );
  const row = (label: string, mix: Record<string, number>) => (
    <div className="p-cov-row">
      <span className="lab">{label}</span>
      <div className="p-cov-bar">
        {SECTORS.map((s) =>
          mix[s.key] ? (
            <span key={s.key} title={`${s.key} ${mix[s.key]}%`} style={{ width: `${mix[s.key]}%`, background: s.color }} />
          ) : null,
        )}
      </div>
    </div>
  );
  return (
    <div className="p-panel">
      <p className="p-panel-title">This week compared to won deals</p>
      {row("This week", week)}
      {row("Won deals", wonMix)}
      <p className="p-legend">
        {SECTORS.map((s) => (
          <span key={s.key}>
            <i style={{ background: s.color }} />
            {s.key}
          </span>
        ))}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------- brief

type Tab = "lead" | "contacts" | "sequence";

const EvidenceChip = ({ s }: { s: Evidence }) => (
  <span className={`chip dot ${s === "Verified" ? "t-ver" : s === "Likely" ? "t-lik" : ""}`}>{s}</span>
);

function Brief({
  lead,
  status,
  onStatus,
  onBack,
}: {
  lead: DemoLead;
  status: Status;
  onStatus: (s: Status) => void;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<Tab>("lead");
  const tabs: { id: Tab; label: string; n?: number }[] = [
    { id: "lead", label: "Lead" },
    { id: "contacts", label: "Contacts", n: lead.contacts.length },
    { id: "sequence", label: "Sequence", n: lead.sequence.length },
  ];

  return (
    <div>
      <button className="p-back" onClick={onBack}>
        &lsaquo; All leads
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, marginTop: 12 }}>
        <div>
          <h3 className="p-h1">{lead.name}</h3>
          <p className="p-sub">
            {lead.town} · researched {dmy(lead.researched)}
          </p>
        </div>
        <dl className="p-meta" style={{ display: "flex", gap: 22, margin: 0 }}>
          <div>
            <dt>Lead with</dt>
            <dd>{lead.offer}</dd>
          </div>
          <div>
            <dt>Fit</dt>
            <dd>
              {lead.fit.toFixed(1)}
              <span style={{ color: "var(--p-muted)", fontWeight: 400 }}> / 5</span>
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <StatusChip s={status} />
            </dd>
          </div>
        </dl>
      </div>

      <ol className="p-trail grid-cols-1 sm:grid-cols-5" style={{ marginTop: 16 }}>
        {[...lead.trail, "Your call"].map((t, i, a) => (
          <li key={t} className={i === a.length - 1 ? "you" : ""}>
            <span className="n">{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>

      <div role="tablist" aria-label="Brief sections" className="p-tabs" style={{ marginTop: 18 }}>
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
            {t.n ? <span className="n">{t.n}</span> : null}
          </button>
        ))}
      </div>

      <div role="tabpanel" style={{ paddingTop: 16 }}>
        {tab === "lead" ? <LeadTab lead={lead} /> : null}
        {tab === "contacts" ? <ContactsTab lead={lead} /> : null}
        {tab === "sequence" ? <SequenceTab lead={lead} status={status} onStatus={onStatus} /> : null}
      </div>
    </div>
  );
}

function LeadTab({ lead }: { lead: DemoLead }) {
  return (
    <div className="p-account">
      <p style={{ fontSize: 15, margin: "0 0 14px", color: "var(--p-body)", maxWidth: "72ch" }}>{lead.summary}</p>
      <table className="p-fw">
        <tbody>
          {lead.facts.map(([k, v]) => (
            <tr key={k}>
              <th scope="row">{k}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ overflowX: "auto", marginTop: 22 }}>
        <table className="p-ev">
          <thead>
            <tr>
              <th scope="col">Fit</th>
              <th scope="col" style={{ width: 140 }}>Source</th>
              <th scope="col" style={{ width: 110 }}>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {lead.qualification.map((q) => (
              <tr key={q.axis}>
                <td>
                  <span className="axis">{q.axis}</span>
                  {q.finding}
                </td>
                <td className="src">{q.source}</td>
                <td>
                  <EvidenceChip s={q.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ overflowX: "auto", marginTop: 22 }}>
        <table className="p-ev">
          <thead>
            <tr>
              <th scope="col">Buying signal</th>
              <th scope="col" style={{ width: 250 }}>Source</th>
            </tr>
          </thead>
          <tbody>
            {lead.signals.map((s) => (
              <tr key={s.text}>
                <td>{s.text}</td>
                <td className="src">
                  {s.source}
                  <br />
                  {dmy(s.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 style={{ fontSize: 13, fontWeight: 600, margin: "22px 0 8px" }}>Recommended approach</h4>
      <div className="p-offer">{lead.approach}</div>
    </div>
  );
}

function ContactsTab({ lead }: { lead: DemoLead }) {
  if (!lead.contacts.length) return <p className="p-sub">No contact found yet.</p>;
  return (
    <div style={{ display: "grid", gap: 12 }} className="sm:grid-cols-2">
      {lead.contacts.map((c, i) => (
        <div key={c.name} className={`p-cc${i ? " alt" : ""}`}>
          <div className="p-avatar" aria-hidden="true">
            {c.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "var(--p-faint)" }}>{i ? "Alternate" : "Primary"}</div>
            <div style={{ fontWeight: 600, color: "var(--p-ink)" }}>{c.name}</div>
            <div className="p-sub">{c.role}</div>
            <div style={{ fontSize: 12.5, color: "var(--p-accent)", wordBreak: "break-all", marginTop: 3 }}>{c.email}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              <span className={`chip dot ${c.state === "ready" ? "t-ver" : "t-lik"}`}>
                {c.state === "ready" ? "Verified" : "Check before sending"}
              </span>
              {c.linkedin ? <span className="chip">LinkedIn</span> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SequenceTab({
  lead,
  status,
  onStatus,
}: {
  lead: DemoLead;
  status: Status;
  onStatus: (s: Status) => void;
}) {
  const [copied, setCopied] = useState<number | null>(null);
  const outcomes: { s: Status; label: string }[] = [
    { s: "sent", label: "Mark sent" },
    { s: "reply", label: "Log reply" },
    { s: "meeting", label: "Log meeting" },
  ];

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {outcomes.map((o) => {
          const on = status === o.s;
          return (
            <button key={o.s} className={`p-btn${on ? " on" : ""}`} aria-pressed={on} onClick={() => onStatus(on ? "new" : o.s)}>
              {o.label}
              {on ? " ✓" : ""}
            </button>
          );
        })}
      </div>
      {lead.sequence.length ? (
        lead.sequence.map((t, i) => (
          <div key={t.when} className="p-touch">
            <div className="p-touch-head">
              <span>
                Touch {i + 1} · {t.when} · <span style={{ color: "var(--p-ink)" }}>{t.subject}</span>
              </span>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(t.body).then(
                    () => {
                      setCopied(i);
                      setTimeout(() => setCopied(null), 1400);
                    },
                    () => {},
                  )
                }
              >
                {copied === i ? "Copied" : "Copy"}
              </button>
            </div>
            <pre>{t.body}</pre>
          </div>
        ))
      ) : (
        <p className="p-sub">No sequence written for this lead yet.</p>
      )}
    </div>
  );
}
