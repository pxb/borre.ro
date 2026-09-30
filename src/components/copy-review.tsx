"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "@/content/copy";

/* Review mode for the site's words (#561, 2026-09-30). Previews and local
   builds only: the root layout leaves it out of the live site.

   Add ?copy to any page. Every line that comes from src/content/copy/*.md is
   found on the rendered page by its text and outlined; click one to edit it in
   place, with a count against its budget. Edits are kept in this tab only
   (sessionStorage) and never saved anywhere: "Copy changes" puts them on the
   clipboard as a change list, which Pedro passes back and Claude applies on a
   branch with `npm run copy -- changes <file>`. Nothing publishes from here.
   ?copy=off leaves review mode. */

type Entry = { file: string; route: string; shared: string; also: string[]; slot: string; item: number | null; value: string; max?: number; joined?: string[] };
type Change = { file: string; slot: string; item: number | null; was: string; now: string };

const FLAG = "copy-review";
const STORE = "copy-review-changes";
const norm = (s: string) => s.replace(/\s+/g, " ").trim();
// A line may be shown sentence-cased or with a full stop added (a figure's
// claim: "Of the impact ... effort."). `form` records which, so an edit is
// turned back into the slot's own form before it is recorded.
type Form = { cap: boolean; dot: boolean };
const capFirst = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);
const toDisplay = (v: string, f: Form) => (f.cap ? capFirst(v) : v) + (f.dot ? "." : "");
const toSlot = (shown: string, f: Form, original: string) => {
  let v = f.dot && shown.endsWith(".") ? shown.slice(0, -1) : shown;
  if (f.cap && original.charAt(0) !== original.charAt(0).toUpperCase()) v = v.charAt(0).toLowerCase() + v.slice(1);
  return v;
};
const formOf = (el: HTMLElement): Form => ({ cap: el.dataset.copyForm?.includes("cap") ?? false, dot: el.dataset.copyForm?.includes("dot") ?? false });

function load<T>(key: string, fallback: T): T {
  try {
    const v = sessionStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function entriesOf(pages: Page[]): Entry[] {
  const out: Entry[] = [];
  for (const p of pages) {
    const file = `${p.name}.md`;
    const route = p.route;
    const shared = p.shared ?? "";
    const also = (p.also ?? "").split(",").map((r) => r.trim()).filter(Boolean);
    for (const [slot, s] of Object.entries(p.slots)) {
      // Titles and descriptions for the browser tab and search results aren't on the page.
      if (slot.startsWith("meta.")) continue;
      // Lines built from a template ({title}, {n}) can't be found by their text.
      const usable = s.v.filter((v) => !/\{[a-z]+\}/i.test(v));
      if (usable.length !== s.v.length) continue;
      s.v.forEach((value, i) => out.push({ file, route, shared, also, slot, item: s.v.length > 1 || s.t === "list" ? i + 1 : null, value: norm(value), max: s.max }));
      // A list shown joined by dots on one line (Technology, the /work systems line).
      if (s.t === "list" && s.v.length > 1) out.push({ file, route, shared, also, slot, item: null, value: norm(s.v.join(" · ")), max: s.max, joined: s.v });
    }
  }
  return out;
}

function changeList(changes: Change[]) {
  const date = new Date().toISOString().slice(0, 10);
  return (
    `# borre.ro copy changes, ${date} (${changes.length})\n\n` +
    changes.map((c) => `${c.file} ## ${c.slot}${c.item ? ` item ${c.item}` : ""}\nwas: ${c.was}\nnow: ${c.now}\n`).join("\n")
  );
}

export function CopyReview() {
  const [on, setOn] = useState(false);
  const [found, setFound] = useState(0);
  const [changes, setChanges] = useState<Change[]>([]);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState<{ label: string; count: number; max?: number } | null>(null);
  const changesRef = useRef<Change[]>([]);

  const record = useCallback((c: Change) => {
    const rest = changesRef.current.filter((x) => !(x.file === c.file && x.slot === c.slot && x.item === c.item));
    // Back to the original wording: drop the change.
    const first = changesRef.current.find((x) => x.file === c.file && x.slot === c.slot && x.item === c.item);
    const was = first ? first.was : c.was;
    const next = was === c.now ? rest : [...rest, { ...c, was }];
    changesRef.current = next;
    setChanges(next);
    save(STORE, next);
  }, []);

  // Turn review mode on or off from the URL, and keep it on across pages.
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("copy");
    try {
      if (q === "off") sessionStorage.removeItem(FLAG);
      else if (q !== null) sessionStorage.setItem(FLAG, "1");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOn(sessionStorage.getItem(FLAG) === "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!on) return;
    let cancelled = false;
    const saved = load<Change[]>(STORE, []);
    changesRef.current = saved;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChanges(saved);

    const style = document.createElement("style");
    style.textContent = `
      [data-copy-slot]{outline:1px dashed var(--accent);outline-offset:3px;cursor:text}
      [data-copy-slot][data-copy-changed]{background:color-mix(in srgb,var(--accent) 10%,transparent)}
      [data-copy-slot][contenteditable]{outline:2px solid var(--accent);background:var(--paper)}`;
    document.head.appendChild(style);

    let marked: HTMLElement[] = [];
    const mark = async () => {
      const { pages } = await import("@/content/copy.gen/index");
      if (cancelled) return;
      // Only the files that feed this page: its own (an exact route) first, then
      // shared ones whose route is a parent (work.md's labels on every case study).
      const path = location.pathname.replace(/\/$/, "") || "/";
      const rank = (e: Entry) =>
        e.route === path
          ? 0
          : e.shared && e.slot.startsWith(e.shared) && e.route && e.route !== "/" && path.startsWith(e.route + "/")
            ? 1
            : e.also.includes(path)
              ? 2
              : -1;
      const entries = entriesOf(pages).filter((e) => rank(e) >= 0);
      type Hit = { e: Entry; form: Form };
      const byValue = new Map<string, Hit[]>();
      const add = (text: string, e: Entry, form: Form) => byValue.set(text, [...(byValue.get(text) ?? []), { e, form }]);
      const addForms = (v: string, e: Entry) => {
        for (const cap of [false, true]) for (const dot of [false, true]) {
          const f = { cap, dot };
          if (cap && capFirst(v) === v && dot === false) continue;
          add(toDisplay(v, f), e, f);
        }
      };
      for (const e of entries) {
        if (e.joined) add(e.value, e, { cap: false, dot: false });
        else addForms(e.value, e);
      }
      for (const list of byValue.values()) list.sort((x, y) => rank(x.e) - rank(y.e) || Number(x.form.cap || x.form.dot) - Number(y.form.cap || y.form.dot));
      const current = changesRef.current;
      // Show pending edits on the page, so a reload keeps the review in view.
      for (const c of current) {
        const e = entries.find((x) => x.file === c.file && x.slot === c.slot && x.item === c.item && !x.joined);
        if (e) addForms(norm(c.now), e);
      }
      // The page's content only: the header and footer come from other files.
      const root = document.querySelector("main") ?? document.body;
      const els = [...root.querySelectorAll<HTMLElement>("*")].filter(
        (el) => !el.closest("[data-copy-review-ui],script,style,svg,noscript,template,[aria-hidden=true],.sr-only"),
      );
      const found: { el: HTMLElement; e: Entry; form: Form }[] = [];
      for (const el of els) {
        const text = norm(el.textContent ?? "");
        if (!text || text.length < 3 || !byValue.has(text)) continue;
        // The deepest element holding exactly this text.
        if ([...el.children].some((c) => norm(c.textContent ?? "") === text)) continue;
        const hit = byValue.get(text)![0];
        found.push({ el, e: hit.e, form: hit.form });
      }
      // A list the page shows as one dotted line is edited as that line: drop
      // single-item matches of it (they are some other element with the same word).
      const joinedSlots = new Set(found.filter((f) => f.e.joined).map((f) => `${f.e.file} ## ${f.e.slot}`));
      for (const { el, e, form } of found) {
        if (!e.joined && joinedSlots.has(`${e.file} ## ${e.slot}`)) continue;
        el.dataset.copySlot = `${e.file} ## ${e.slot}`;
        el.dataset.copyItem = e.item ? String(e.item) : "";
        el.dataset.copyOriginal = e.joined ? e.joined.join(" · ") : e.value;
        if (e.joined) el.dataset.copyJoined = "1";
        if (e.max) el.dataset.copyMax = String(e.max);
        if (form.cap || form.dot) el.dataset.copyForm = `${form.cap ? "cap " : ""}${form.dot ? "dot" : ""}`.trim();
        // Pending edits show on every page the line appears on.
        const slotChanges = current.filter((c) => `${c.file} ## ${c.slot}` === el.dataset.copySlot);
        if (e.joined && slotChanges.length) {
          const items = [...e.joined];
          for (const c of slotChanges) if (c.item) items[c.item - 1] = c.now;
          el.textContent = items.join(" · ");
          el.dataset.copyOriginal = el.textContent;
          el.dataset.copyChanged = "";
        } else {
          const c = slotChanges.find((x) => String(x.item ?? "") === el.dataset.copyItem);
          if (c) {
            el.textContent = toDisplay(c.now, form);
            el.dataset.copyOriginal = c.now;
            el.dataset.copyChanged = "";
          }
        }
        el.tabIndex = 0;
        marked.push(el);
      }
      setFound(marked.length);
    };
    mark();

    const begin = (el: HTMLElement) => {
      if (el.isContentEditable) return;
      el.contentEditable = "plaintext-only";
      el.focus();
      const [file, slot] = el.dataset.copySlot!.split(" ## ");
      const max = el.dataset.copyMax ? Number(el.dataset.copyMax) : undefined;
      const label = `${file} · ${slot}${el.dataset.copyItem ? ` · item ${el.dataset.copyItem}` : ""}`;
      setEditing({ label, count: norm(el.textContent ?? "").length, max });
      const onInput = () => setEditing({ label, count: norm(el.textContent ?? "").length, max });
      const finish = (keep: boolean) => {
        el.removeEventListener("input", onInput);
        el.removeEventListener("blur", onBlur);
        el.removeEventListener("keydown", onKey);
        el.removeAttribute("contenteditable");
        setEditing(null);
        const before = el.dataset.copyOriginal ?? "";
        if (!keep) {
          el.textContent = el.dataset.copyJoined ? before : toDisplay(before, formOf(el));
          return;
        }
        const now = el.dataset.copyJoined ? norm(el.textContent ?? "") : toSlot(norm(el.textContent ?? ""), formOf(el), before);
        el.dataset.copyOriginal = now;
        const item = el.dataset.copyItem ? Number(el.dataset.copyItem) : null;
        if (el.dataset.copyJoined) {
          // A dotted list: one change per item that moved.
          const a = before.split(" · ");
          const b = now.split(" · ");
          a.forEach((w, i) => b[i] !== undefined && b[i] !== w && record({ file, slot, item: i + 1, was: w, now: b[i] }));
        } else if (now !== before) {
          record({ file, slot, item, was: before, now });
        }
        if (now !== before) el.dataset.copyChanged = "";
        // Every other place showing the same line follows.
        for (const other of marked) {
          if (other !== el && other.dataset.copySlot === el.dataset.copySlot && other.dataset.copyItem === el.dataset.copyItem) {
            other.textContent = toDisplay(now, formOf(other));
            other.dataset.copyOriginal = now;
            other.dataset.copyChanged = "";
          }
        }
      };
      const onBlur = () => finish(true);
      const onKey = (ev: KeyboardEvent) => {
        if (ev.key === "Escape") {
          ev.preventDefault();
          finish(false);
          el.blur();
        } else if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          el.blur();
        }
      };
      el.addEventListener("input", onInput);
      el.addEventListener("blur", onBlur);
      el.addEventListener("keydown", onKey);
    };

    // Clicking a marked line edits it instead of following a link.
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement | null)?.closest<HTMLElement>("[data-copy-slot]");
      if (!el) return;
      ev.preventDefault();
      ev.stopPropagation();
      begin(el);
    };
    const onKeyOpen = (ev: KeyboardEvent) => {
      const el = ev.target as HTMLElement;
      if (ev.key === "Enter" && el.dataset?.copySlot && !el.isContentEditable) {
        ev.preventDefault();
        begin(el);
      }
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyOpen, true);
    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyOpen, true);
      style.remove();
      for (const el of marked) {
        for (const k of ["copySlot", "copyItem", "copyOriginal", "copyJoined", "copyMax", "copyChanged", "copyForm"]) delete el.dataset[k];
        el.removeAttribute("tabindex");
      }
      marked = [];
    };
  }, [on, record]);

  if (!on) return null;

  const copy = () => {
    const text = changeList(changesRef.current);
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => setOpen(true),
    );
  };
  const clear = () => {
    changesRef.current = [];
    setChanges([]);
    save(STORE, []);
    location.reload();
  };
  const exit = () => {
    try {
      sessionStorage.removeItem(FLAG);
    } catch {}
    location.href = location.pathname;
  };

  const BTN =
    "min-h-9 px-2 text-sm text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <div
      data-copy-review-ui
      className="fixed bottom-24 left-4 z-[60] w-[min(26rem,calc(100vw-2rem))] border-2 border-ink bg-paper p-4 text-sm text-ink shadow-[0_1px_2px_rgb(25_23_18/0.08),0_18px_40px_-18px_rgb(25_23_18/0.35)]"
    >
      <p className="font-medium">Copy review</p>
      <p className="mt-1 text-ink-soft">
        {found} lines on this page · {changes.length} change{changes.length === 1 ? "" : "s"} · preview only, nothing is saved
      </p>
      {editing ? (
        <p className="mt-2 font-mono text-xs tabular-nums [font-stretch:88%]">
          {editing.label} · <span className={editing.max && editing.count > editing.max ? "text-accent" : ""}>{editing.count}</span>
          {editing.max ? ` / ${editing.max}` : ""} · Enter keeps, Esc undoes
        </p>
      ) : (
        <p className="mt-2 text-xs text-ink-soft">Click an outlined line to edit it.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-x-2">
        <button type="button" className={BTN} onClick={copy} disabled={!changes.length}>
          {copied ? "Copied" : "Copy changes"}
        </button>
        <button type="button" className={BTN} onClick={() => setOpen((o) => !o)} disabled={!changes.length}>
          {open ? "Hide list" : "Show list"}
        </button>
        <button type="button" className={BTN} onClick={clear} disabled={!changes.length}>
          Discard all
        </button>
        <button type="button" className={BTN} onClick={exit}>
          Exit
        </button>
      </div>
      {open && changes.length ? (
        <textarea
          readOnly
          aria-label="Change list"
          className="mt-3 h-40 w-full border border-rule bg-paper p-2 font-mono text-xs [font-stretch:88%]"
          value={changeList(changes)}
          onFocus={(e) => e.currentTarget.select()}
        />
      ) : null}
    </div>
  );
}
