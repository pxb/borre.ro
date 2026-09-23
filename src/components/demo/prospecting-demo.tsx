"use client";

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
// data (#560). Same two screens as the real product: the pipeline board and a
// lead's brief. Everything is local state; "Mark sent" changes nothing outside
// this component. Renders its first screen on the server, so it reads without JS.

const STATUS_LABEL: Record<Status, string> = {
  new: "New",
  sent: "Sent",
  reply: "Reply",
  meeting: "Meeting",
};
const STATUS_ORDER: Status[] = ["new", "sent", "reply", "meeting"];

function statusClass(s: Status) {
  if (s === "meeting") return "border-accent bg-accent text-paper";
  if (s === "reply") return "border-ink bg-ink text-paper";
  if (s === "sent") return "border-ink-soft text-ink";
  return "border-rule text-ink-soft";
}

function dmy(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function Dot({ state }: { state: DemoLead["contactState"] }) {
  const tip =
    state === "ready" ? "Contact ready" : state === "verify" ? "Check contact before sending" : "No contact yet";
  const cls =
    state === "ready"
      ? "bg-ink"
      : state === "verify"
        ? "border-2 border-ink-soft bg-transparent"
        : "bg-rule";
  return <span title={tip} aria-label={tip} className={`inline-block size-2.5 shrink-0 rounded-full ${cls}`} />;
}

function StatusChip({ s }: { s: Status }) {
  return (
    <span className={`inline-block whitespace-nowrap border px-2 py-0.5 text-xs ${statusClass(s)}`}>
      {STATUS_LABEL[s]}
    </span>
  );
}

export function ProspectingDemo() {
  const [open, setOpen] = useState<string | null>(null);
  const [batch, setBatch] = useState<string>("W38");
  const [status, setStatus] = useState<Record<string, Status>>(() =>
    Object.fromEntries(demoLeads.map((l) => [l.id, l.status])),
  );
  const top = useRef<HTMLDivElement>(null);

  const go = (id: string | null) => {
    setOpen(id);
    // Keep the frame's top in view when switching screens.
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lead = open ? demoLeads.find((l) => l.id === open) : undefined;

  return (
    <div ref={top} className="scroll-mt-40 border border-rule bg-paper">
      <div className="flex items-center gap-4 border-b border-rule px-4 py-3 sm:px-5">
        <span className="text-sm font-medium text-ink">{demoClient.short}</span>
        <span aria-hidden="true" className="h-4 w-px bg-rule" />
        <button
          onClick={() => go(null)}
          className={`text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
            lead ? "text-ink-soft hover:text-ink" : "text-ink"
          }`}
        >
          Pipeline
        </button>
      </div>

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
      sort.key === "name"
        ? l.name
        : sort.key === "fit"
          ? l.fit
          : sort.key === "status"
            ? STATUS_ORDER.indexOf(status[l.id])
            : l.researched;
    return [...f].sort((a, b) => {
      const x = val(a);
      const y = val(b);
      const c = x < y ? -1 : x > y ? 1 : 0;
      return sort.desc ? -c : c;
    });
  }, [inBatch, q, sort, status]);

  // Live pipeline counts, from the demo's own leads.
  const counts = useMemo(() => {
    const at = (s: Status) => inBatch.filter((l) => STATUS_ORDER.indexOf(status[l.id]) >= STATUS_ORDER.indexOf(s)).length;
    return { Researched: inBatch.length, Sent: at("sent"), Reply: at("reply"), Meeting: at("meeting") } as Record<string, number>;
  }, [inBatch, status]);

  const wc = batches.find((b) => b.label === batch)?.wc;
  const th = (key: SortKey, label: string, right = false) => (
    <th scope="col" className={`py-2.5 pr-4 font-medium ${right ? "text-right" : "text-left"}`}>
      <button
        onClick={() => setSort((s) => ({ key, desc: s.key === key ? !s.desc : key !== "name" }))}
        className="text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {label}
        <span aria-hidden="true">{sort.key === key ? (sort.desc ? " ↓" : " ↑") : ""}</span>
      </button>
    </th>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">Prospecting pipeline</h3>
        <div className="flex flex-wrap items-center gap-2">
          {[...batches.map((b) => b.label), "All"].map((b) => (
            <button
              key={b}
              onClick={() => setBatch(b)}
              aria-pressed={batch === b}
              className={`min-h-9 border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                batch === b ? "border-ink bg-ink text-paper" : "border-rule text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {b === "All" ? "All weeks" : b}
            </button>
          ))}
          {wc ? <span className="ml-1 text-sm text-ink-soft">{wc}</span> : null}
        </div>
      </div>

      {/* The narrowing: method first; only the demo's own pipeline stages count. */}
      <ol className="mt-6 flex flex-wrap items-stretch gap-y-2 text-sm">
        {demoFunnel.map((stage, i) => (
          <li key={stage} className="flex items-center">
            {i ? <span aria-hidden="true" className="px-2 text-rule">&rsaquo;</span> : null}
            <span className="border border-rule px-3 py-1.5">
              {counts[stage] != null ? (
                <span className="mr-1.5 font-mono tabular-nums text-ink">{counts[stage]}</span>
              ) : null}
              <span className={counts[stage] != null ? "text-ink" : "text-ink-soft"}>{stage}</span>
            </span>
          </li>
        ))}
      </ol>

      <MixChart leads={inBatch} />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="label">Leads</p>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          placeholder="Search company"
          aria-label="Search company"
          className="min-h-10 w-full border border-rule bg-paper px-3 text-base text-ink placeholder:text-ink-soft focus-visible:border-ink focus-visible:outline-none sm:w-56 sm:text-sm"
        />
      </div>

      {/* Table on wider screens, a list on phones. */}
      <div className="mt-3 hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-rule">
            <tr>
              {th("name", "Company")}
              <th scope="col" className="py-2.5 pr-4 text-left font-medium text-ink-soft">Signal</th>
              <th scope="col" className="py-2.5 pr-4 text-left font-medium text-ink-soft">Offer</th>
              {th("fit", "Fit", true)}
              {th("status", "Status")}
              {th("researched", "Researched")}
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr
                key={l.id}
                onClick={() => onOpen(l.id)}
                className="cursor-pointer border-b border-rule transition-colors hover:bg-ink/[0.03]"
              >
                <td className="py-3 pr-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(l.id);
                    }}
                    className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <Dot state={l.contactState} />
                    <span>
                      <span className="block font-medium text-ink">{l.name}</span>
                      {l.group ? <span className="block text-xs text-ink-soft">{l.group}</span> : null}
                    </span>
                  </button>
                </td>
                <td className="py-3 pr-4 text-ink-soft">{l.signal}</td>
                <td className="py-3 pr-4 text-ink">{l.offer}</td>
                <td className="py-3 pr-4 text-right font-mono tabular-nums text-ink">{l.fit.toFixed(1)}</td>
                <td className="py-3 pr-4">
                  <StatusChip s={status[l.id]} />
                </td>
                <td className="py-3 pr-4 font-mono text-xs tabular-nums text-ink-soft">{dmy(l.researched)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-3 divide-y divide-rule border-y border-rule md:hidden">
        {rows.map((l) => (
          <li key={l.id}>
            <button
              onClick={() => onOpen(l.id)}
              className="flex w-full items-start gap-3 py-3.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
            >
              <span className="mt-1.5">
                <Dot state={l.contactState} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">{l.name}</span>
                <span className="block text-sm text-ink-soft">
                  {l.signal} · {l.offer}
                </span>
              </span>
              <StatusChip s={status[l.id]} />
            </button>
          </li>
        ))}
      </ul>
      {!rows.length ? <p className="py-6 text-sm text-ink-soft">No leads match.</p> : null}

      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5"><Dot state="ready" /> Contact ready</span>
        <span className="flex items-center gap-1.5"><Dot state="verify" /> Check contact</span>
        <span className="flex items-center gap-1.5"><Dot state="none" /> No contact yet</span>
      </p>
    </div>
  );
}

// This week's leads against the client's won business, by sector. Tints of ink,
// not new colours: the site's four-colour rule holds inside the demo.
const SECTORS = ["Workplaces", "Hospitality", "Fitness", "Retail", "Other"];
const SHADE = ["bg-ink", "bg-ink/70", "bg-ink/45", "bg-ink/25", "bg-rule"];

function MixChart({ leads }: { leads: DemoLead[] }) {
  const n = leads.length || 1;
  const week = Object.fromEntries(
    SECTORS.map((s) => [s, Math.round((leads.filter((l) => l.sector === s).length / n) * 100)]),
  );
  const bar = (label: string, mix: Record<string, number>) => (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 text-sm">
      <span className="text-ink-soft">{label}</span>
      <div className="flex h-3 overflow-hidden bg-paper ring-1 ring-rule">
        {SECTORS.map((s, i) =>
          mix[s] ? <span key={s} title={`${s} ${mix[s]}%`} style={{ width: `${mix[s]}%` }} className={SHADE[i]} /> : null,
        )}
      </div>
    </div>
  );
  return (
    <div className="mt-6 space-y-2.5 border border-rule p-4">
      <p className="label">This week against won deals</p>
      {bar("This week", week)}
      {bar("Won deals", wonMix)}
      <p className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-ink-soft">
        {SECTORS.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`inline-block size-2.5 ${SHADE[i]}`} />
            {s}
          </span>
        ))}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------- brief

type Tab = "lead" | "contacts" | "sequence";

function EvidenceChip({ s }: { s: Evidence }) {
  const cls = s === "Verified" ? "border-ink text-ink" : s === "Likely" ? "border-ink-soft text-ink-soft" : "border-rule text-ink-soft";
  return <span className={`inline-block whitespace-nowrap border px-1.5 py-0.5 text-xs ${cls}`}>{s}</span>;
}

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
    <div className="p-4 sm:p-6">
      <button
        onClick={onBack}
        className="text-sm text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        &lsaquo; All leads
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-medium tracking-[-0.015em] text-ink">{lead.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {lead.town} · researched {dmy(lead.researched)}
          </p>
        </div>
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-ink-soft">Lead with</dt>
            <dd className="font-medium text-ink">{lead.offer}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Fit</dt>
            <dd className="font-mono tabular-nums text-ink">
              {lead.fit.toFixed(1)}
              <span className="text-ink-soft"> / 5</span>
            </dd>
          </div>
          <div>
            <dt className="text-ink-soft">Status</dt>
            <dd>
              <StatusChip s={status} />
            </dd>
          </div>
        </dl>
      </div>

      {/* How the lead got here: the agents' work, then the person's decision. */}
      <ol className="mt-6 grid gap-px overflow-hidden border border-rule bg-rule text-xs sm:grid-cols-5">
        {[...lead.trail, "Your call"].map((t, i, a) => (
          <li key={t} className={`bg-paper px-3 py-2.5 ${i === a.length - 1 ? "text-ink" : "text-ink-soft"}`}>
            <span className="mr-1.5 font-mono tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            {t}
          </li>
        ))}
      </ol>

      <div role="tablist" aria-label="Brief sections" className="mt-6 flex gap-5 border-b border-rule">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px min-h-11 border-b-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              tab === t.id ? "border-ink text-ink" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
            {t.n ? <span className="ml-1.5 font-mono text-xs tabular-nums text-ink-soft">{t.n}</span> : null}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="pt-6">
        {tab === "lead" ? <LeadTab lead={lead} /> : null}
        {tab === "contacts" ? <ContactsTab lead={lead} /> : null}
        {tab === "sequence" ? <SequenceTab lead={lead} status={status} onStatus={onStatus} /> : null}
      </div>
    </div>
  );
}

function LeadTab({ lead }: { lead: DemoLead }) {
  return (
    <div className="space-y-8">
      <p className="max-w-2xl leading-relaxed text-ink">{lead.summary}</p>

      <dl className="grid max-w-2xl grid-cols-[minmax(0,11rem)_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm">
        {lead.facts.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-soft">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead className="border-b border-rule text-left text-ink-soft">
            <tr>
              <th scope="col" className="py-2 pr-4 font-medium">Fit</th>
              <th scope="col" className="w-36 py-2 pr-4 font-medium">Source</th>
              <th scope="col" className="w-24 py-2 font-medium">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {lead.qualification.map((q) => (
              <tr key={q.axis} className="border-b border-rule align-top">
                <td className="py-2.5 pr-4 text-ink">
                  <span className="font-medium">{q.axis}.</span> {q.finding}
                </td>
                <td className="py-2.5 pr-4 text-ink-soft">{q.source}</td>
                <td className="py-2.5">
                  <EvidenceChip s={q.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="label">Buying signals</p>
        <ul className="mt-3 space-y-3">
          {lead.signals.map((s) => (
            <li key={s.text} className="border-l-2 border-rule pl-4 text-sm">
              <span className="text-ink">{s.text}</span>
              <span className="mt-0.5 block text-ink-soft">
                {s.source} · <span className="font-mono text-xs tabular-nums">{dmy(s.date)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-2xl border-l-2 border-accent pl-4">
        <p className="label">Approach</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">{lead.approach}</p>
      </div>
    </div>
  );
}

function ContactsTab({ lead }: { lead: DemoLead }) {
  if (!lead.contacts.length) {
    return <p className="text-sm text-ink-soft">No contact found yet.</p>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {lead.contacts.map((c, i) => (
        <li key={c.name} className="flex gap-4 border border-rule p-4">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center bg-ink text-sm font-medium text-paper"
          >
            {c.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </span>
          <div className="min-w-0 text-sm">
            <p className="text-xs text-ink-soft">{i ? "Alternate" : "Primary"}</p>
            <p className="font-medium text-ink">{c.name}</p>
            <p className="text-ink-soft">{c.role}</p>
            <p className="mt-1 break-all font-mono text-xs text-ink">{c.email}</p>
            <p className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className={`border px-1.5 py-0.5 ${c.state === "ready" ? "border-ink text-ink" : "border-rule text-ink-soft"}`}>
                {c.state === "ready" ? "Email verified" : "Check before sending"}
              </span>
              {c.linkedin ? <span className="border border-rule px-1.5 py-0.5 text-ink-soft">LinkedIn found</span> : null}
            </p>
          </div>
        </li>
      ))}
    </ul>
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {outcomes.map((o) => {
          const on = status === o.s;
          return (
            <button
              key={o.s}
              aria-pressed={on}
              // Clicking the current outcome again undoes it.
              onClick={() => onStatus(on ? "new" : o.s)}
              className={`min-h-10 border px-3.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                on ? "border-ink bg-ink text-paper" : "border-rule text-ink hover:border-ink"
              }`}
            >
              {o.label}
              {on ? " ✓" : ""}
            </button>
          );
        })}
      </div>

      {lead.sequence.length ? (
        <ol className="space-y-4">
          {lead.sequence.map((t, i) => (
            <li key={t.when} className="border border-rule">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-4 py-2.5 text-sm">
                <span className="text-ink-soft">
                  <span className="font-mono tabular-nums">{String(i + 1).padStart(2, "0")}</span> · {t.when} ·{" "}
                  <span className="text-ink">{t.subject}</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(t.body).then(
                      () => {
                        setCopied(i);
                        setTimeout(() => setCopied(null), 1400);
                      },
                      () => {},
                    );
                  }}
                  className="text-ink-soft underline decoration-rule underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {copied === i ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="whitespace-pre-line px-4 py-3 text-sm leading-relaxed text-ink">{t.body}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-ink-soft">No sequence written for this lead yet.</p>
      )}
    </div>
  );
}
