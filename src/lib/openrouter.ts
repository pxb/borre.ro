/* One call to a model through OpenRouter (2026-10-09, Pedro: OpenRouter, not a
   single provider's API). Server only. The key is OPENROUTER_API_KEY, a key
   made for this site with a credit limit on it; without it every caller gets
   null and carries on without the AI part.

   Requests only go to providers that don't keep or train on the data
   (provider.data_collection: deny). With a schema, the answer must match it:
   providers that can't do structured output are skipped (require_parameters);
   if none can, we ask again for plain JSON and parse it ourselves. */

// Trimmed: a key pasted with a space or line break would fail every call.
const KEY = (process.env.OPENROUTER_API_KEY ?? "").trim();
const URL = "https://openrouter.ai/api/v1/chat/completions";

export const aiOn = () => Boolean(KEY);

type Ask = {
  model: string;
  system: string;
  user: string;
  schema?: { name: string; schema: Record<string, unknown> };
  maxTokens?: number;
  // "none" turns thinking off; thinking counts against maxTokens.
  effort?: "none" | "low" | "medium" | "high";
  timeoutMs?: number;
};

export type Answer = { text: string; model: string; cost?: number; tokensIn?: number; tokensOut?: number };

async function call(a: Ask, structured: boolean): Promise<Response> {
  return fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://borre.ro",
      "X-Title": "borre.ro",
    },
    body: JSON.stringify({
      model: a.model,
      max_tokens: a.maxTokens ?? 4000,
      messages: [
        { role: "system", content: a.system },
        { role: "user", content: a.user },
      ],
      reasoning: a.effort === "none" ? { effort: "none" } : { effort: a.effort ?? "low", exclude: true },
      provider: { data_collection: "deny", ...(structured ? { require_parameters: true } : {}) },
      ...(a.schema
        ? structured
          ? { response_format: { type: "json_schema", json_schema: { name: a.schema.name, strict: true, schema: a.schema.schema } } }
          : { response_format: { type: "json_object" } }
        : {}),
      usage: { include: true },
    }),
    signal: AbortSignal.timeout(a.timeoutMs ?? 45_000),
    cache: "no-store",
  });
}

/** The model's text, or null when off, out of credit, failed or refused. */
export async function ask(a: Ask): Promise<Answer | null> {
  if (!KEY) return null;
  try {
    let res = await call(a, true);
    // No provider for this model can do structured output: ask for plain JSON.
    if (a.schema && (res.status === 400 || res.status === 404)) res = await call(a, false);
    // Failures are logged by status and OpenRouter's own message only, never
    // the prompt or the answer, so the logs hold nothing a visitor typed.
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(JSON.stringify({ event: "openrouter-error", status: res.status, model: a.model, error: body.slice(0, 300) }));
      return null;
    }
    const d = await res.json();
    const text: string = d?.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) {
      console.warn(JSON.stringify({ event: "openrouter-empty", model: a.model, finish: d?.choices?.[0]?.finish_reason, tokensOut: d?.usage?.completion_tokens }));
      return null;
    }
    return {
      text,
      model: d?.model ?? a.model,
      cost: d?.usage?.cost,
      tokensIn: d?.usage?.prompt_tokens,
      tokensOut: d?.usage?.completion_tokens,
    };
  } catch (e) {
    console.warn(JSON.stringify({ event: "openrouter-failed", model: a.model, error: e instanceof Error ? e.name : "unknown" }));
    return null;
  }
}

/** Parses a JSON answer, tolerating a fenced block around it. */
export function parseJson<T>(text: string): T | null {
  const t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  try {
    return JSON.parse(t) as T;
  } catch {
    const i = t.indexOf("{");
    const j = t.lastIndexOf("}");
    if (i < 0 || j <= i) return null;
    try {
      return JSON.parse(t.slice(i, j + 1)) as T;
    } catch {
      return null;
    }
  }
}
