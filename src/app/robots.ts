import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The agent-facing summary and MCP server are named here too (#564).
    rules: [{ userAgent: "*", allow: ["/", "/llms.txt", "/api/mcp"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
