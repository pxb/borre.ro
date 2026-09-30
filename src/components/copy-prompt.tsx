"use client";

import { useRef, useState } from "react";

// A prompt the reader pastes into their own AI, with a copy button. The text is
// server-rendered, so it can be selected by hand without JavaScript. Where the
// clipboard isn't available, the button selects the text instead.
export function CopyPrompt({ text, track }: { text: string; track?: string }) {
  const [copied, setCopied] = useState(false);
  const box = useRef<HTMLParagraphElement>(null);

  function select() {
    const el = box.current;
    const sel = window.getSelection();
    if (!el || !sel) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function copy() {
    if (!navigator.clipboard) return select();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }, select);
  }

  return (
    <div className="mt-3 max-w-2xl">
      <p ref={box} className="pl-4 font-mono text-sm leading-relaxed text-ink [font-stretch:88%] [overflow-wrap:anywhere]">
        {text}
      </p>
      <button
        type="button"
        data-track="skill-prompt-copy"
        data-track-skill={track}
        onClick={copy}
        className="mt-2 min-h-11 text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {copied ? "Copied" : "Copy the prompt"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Prompt copied" : ""}
      </span>
    </div>
  );
}
