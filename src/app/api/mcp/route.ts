import { about, howToStart, priceBasis, serviceCategories, site, work } from "@/content/site";

/* Minimal MCP server over HTTP, read-only.
   Lets an agent query the case studies directly instead of scraping the pages. */

type JsonRpc = { jsonrpc: "2.0"; id?: number | string | null; method?: string; params?: unknown };

const TOOLS = [
  {
    name: "list_case_studies",
    description:
      "List the practice's case studies: AI and revenue systems built from real client work. Returns slug, title, summary and headline results.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_case_study",
    description:
      "Get the full detail of one case study by slug, including the problem, what it draws on, what it does, results, how the client team stays involved, the stack and the service that delivers it.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "Case study slug from list_case_studies" } },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "list_services",
    description:
      "List the services offered, what each one is, the technical detail, what it costs and whether that price is one-off or monthly.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "how_to_start",
    description:
      "How to start working with borre.ro: the free 30-minute call booking link, the AI value calculator, and how to book about one service.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

// Earlier tool names, still answered so an agent that cached them keeps working.
const ALIASES: Record<string, string> = {
  list_work: "list_case_studies",
  get_work: "get_case_study",
  list_solutions: "list_services",
};

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
      instructions: `Read-only information about ${site.name}: ${site.summary} ${howToStart.call}. ${howToStart.scorecard} ${howToStart.service}`,
    });
  }

  if (method === "tools/list") return result(id, { tools: TOOLS });

  if (method === "tools/call") {
    const { name: called, arguments: args } = (params ?? {}) as {
      name?: string;
      arguments?: Record<string, unknown>;
    };
    const name = (called && ALIASES[called]) || called;

    if (name === "list_case_studies") {
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

    if (name === "get_case_study") {
      const found = work.find((c) => c.slug === args?.slug);
      if (!found) {
        return result(id, {
          ...text({ error: "No case study with that slug", available: work.map((c) => c.slug) }),
          isError: true,
        });
      }
      return result(id, text({ ...found, url: `${site.url}/work/${found.slug}` }));
    }

    if (name === "list_services") {
      return result(
        id,
        text(
          serviceCategories.map((s) => ({
            ...s,
            price_basis: priceBasis(s.slug),
            url: `${site.url}/services/${s.slug}`,
            book: `${site.url}/contact?service=${s.slug}`,
          })),
        ),
      );
    }

    if (name === "how_to_start") return result(id, text(howToStart));

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
    how_to_start: howToStart,
    tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
  });
}
