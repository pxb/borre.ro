"use client";

import "./portal.css";
import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { demoClient } from "@/content/demo-prospecting";
import type { FlowRun } from "@/content/demo-showcases";

// An automation canvas you can run (#573), in the portal's product design.
// "Run it" plays one invented lead or call through the steps; each node fills
// with what it found. A gate node stops the run until the visitor approves,
// so the human approval is demonstrated, not claimed. Server render shows the
// canvas with every step name and the first step's detail.

type NodeState = "idle" | "running" | "done" | "waiting";

export function WorkflowDemo({ run, title }: { run: FlowRun; title: string }) {
  const reduce = useReducedMotion();
  const n = run.nodes.length;
  const [state, setState] = useState<NodeState[]>(() => run.nodes.map(() => "idle"));
  const [sel, setSel] = useState(0);
  const [status, setStatus] = useState<"ready" | "running" | "waiting" | "done">("ready");
  const token = useRef(0);

  const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

  async function play(from: number, id: number) {
    for (let i = from; i < n; i++) {
      if (id !== token.current) return;
      const node = run.nodes[i];
      setSel(i);
      if (node.gate) {
        setState((s) => s.map((v, j) => (j === i ? "waiting" : v)));
        setStatus("waiting");
        return; // resumes from approve()
      }
      setState((s) => s.map((v, j) => (j === i ? "running" : v)));
      await wait(900);
      if (id !== token.current) return;
      setState((s) => s.map((v, j) => (j === i ? "done" : v)));
      await wait(250);
    }
    setStatus("done");
  }

  function start() {
    const id = ++token.current;
    setState(run.nodes.map(() => "idle"));
    setStatus("running");
    play(0, id);
  }

  function approve() {
    const i = run.nodes.findIndex((x) => x.gate);
    setState((s) => s.map((v, j) => (j === i ? "done" : v)));
    setStatus("running");
    play(i + 1, token.current);
  }

  const node = run.nodes[sel];
  const nodeState = state[sel];

  return (
    <div className="portal scroll-mt-28">
      <div className="p-top">
        <span className="p-brand">{demoClient.short}</span>
        <nav className="p-nav">
          <button className="on">Workflows</button>
        </nav>
      </div>
      <div className="p-wrap">
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <h3 className="p-h1">{title}</h3>
            <p className="p-sub">{run.subject}</p>
          </div>
          <button className="p-btn on" onClick={start} disabled={status === "running"}>
            {status === "ready" ? "Run it" : status === "running" ? "Running…" : "Run again"}
          </button>
        </div>

        <ol className="wf-canvas" aria-label={`${title} steps`}>
          {run.nodes.map((x, i) => (
            <li key={x.id} style={{ display: "contents" }}>
              {i ? (
                <span
                  aria-hidden="true"
                  className={`wf-link${state[i - 1] === "done" ? " lit" : ""}${
                    state[i] === "running" || state[i] === "waiting" ? " flow" : ""
                  }`}
                />
              ) : null}
              <button
                className={`wf-node ${state[i]}${x.gate ? " gate" : ""}${i === sel ? " sel" : ""}`}
                onClick={() => setSel(i)}
                aria-current={i === sel ? "step" : undefined}
              >
                <span className="top">
                  <span className="st" aria-hidden="true" />
                  Step {i + 1}
                  {x.gate ? " · you" : ""}
                </span>
                <span className="t">{x.title}</span>
                <span className="s">{x.system}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="wf-detail" aria-live="polite">
          <p className="p-panel-title" style={{ marginBottom: 6 }}>
            Step {sel + 1}: {node.title}
          </p>
          {node.gate && nodeState === "waiting" ? (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
              <span>Drafts ready for review.</span>
              <button className="p-btn on" onClick={approve}>
                Approve drafts
              </button>
            </div>
          ) : (
            <p style={{ margin: 0, color: nodeState === "idle" && status !== "ready" ? "var(--p-faint)" : "var(--p-ink)" }}>
              {nodeState === "running" ? "Working…" : node.found}
            </p>
          )}
        </div>

        {status === "done" ? <p className="wf-done">{run.done}</p> : null}
      </div>
    </div>
  );
}
