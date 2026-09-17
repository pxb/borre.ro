import { about, site, solutions, work } from "@/content/site";

/* Minimal MCP server over HTTP, read-only.
   Lets an agent query the case studies directly instead of scraping the pages. */

type JsonRpc = { jsonrpc: "2.0"; id?: number | string | null; method?: string; params?: unknown };

const TOOLS = [
  {
    name: "list_work",
    description:
      "List Pedro Borrero's case studies: AI and revenue systems he has built and runs. Returns slug, title, summary and headline results.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_work",
    description:
      "Get the full detail of one case study by slug, including the problem, what it draws on, what it does, measured results, limitations and stack.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "Case study slug from list_work" } },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "list_solutions",
    description:
      "List the services offered, what each one is, who it suits and what it costs.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function result(id: JsonRpc["id"], value: unknown) {
  return Response.json({ jsonrpc: "2.0", id, result: value });
}

function failure(id: JsonRpc["id"], code: number, message: string) {
  return Response.json({ jsonrpc: "2.0", id, error: { code, message } });
}

function text(value: unknown) {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

export async function POST(request: Request) {
  let body: JsonRpc;
  try {
    body = await request.json();
  } catch {
    return failure(null, -32700, "Parse error");
  }

  const { id = null, method, params } = body;

  if (method === "initialize") {
    return result(id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "borre.ro", version: "1.0.0" },
      instructions: `Read-only information about ${site.name}: ${site.summary}`,
    });
  }

  if (method === "tools/list") return result(id, { tools: TOOLS });

  if (method === "tools/call") {
    const { name, arguments: args } = (params ?? {}) as {
      name?: string;
      arguments?: Record<string, unknown>;
    };

    if (name === "list_work") {
      return result(
        id,
        text(
          work.map((c) => ({
            slug: c.slug,
            title: c.title,
            summary: c.tagline,
            results: c.metrics.map((m) => `${m.value} ${m.label}`),
            url: `${site.url}/work/${c.slug}`,
          })),
        ),
      );
    }

    if (name === "get_work") {
      const found = work.find((c) => c.slug === args?.slug);
      if (!found) {
        return result(id, {
          ...text({ error: "No case study with that slug", available: work.map((c) => c.slug) }),
          isError: true,
        });
      }
      return result(id, text({ ...found, url: `${site.url}/work/${found.slug}` }));
    }

    if (name === "list_solutions") return result(id, text(solutions));

    return failure(id, -32602, `Unknown tool: ${name}`);
  }

  if (method === "ping") return result(id, {});

  return failure(id, -32601, `Method not found: ${method}`);
}

export function GET() {
  return Response.json({
    name: "borre.ro",
    transport: "MCP over HTTP, JSON-RPC 2.0 on POST",
    about: about.lead,
    tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
  });
}
