import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createContext } from "./utils.js";
import { storyblok } from "./storyblok.js";

const HEADER_MGMT_TOKEN = "x-storyblok-token";
const HEADER_SPACE_ID = "x-storyblok-space-id";

function jsonRpcError(message: string, status: number): Response {
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32600, message },
      id: null,
    }),
    {
      status,
      headers: { "content-type": "application/json" },
    },
  );
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          name: "punch-storyblok-mcp",
          status: "ok",
          mcp_endpoint: "/mcp",
          required_headers: [HEADER_MGMT_TOKEN, HEADER_SPACE_ID],
        }),
        { headers: { "content-type": "application/json" } },
      );
    }

    if (url.pathname !== "/mcp") {
      return new Response("Not Found", { status: 404 });
    }

    const managementToken = request.headers.get(HEADER_MGMT_TOKEN);
    const spaceId = request.headers.get(HEADER_SPACE_ID);

    if (!managementToken || !spaceId) {
      return jsonRpcError(
        `Missing required headers. Set ${HEADER_MGMT_TOKEN} and ${HEADER_SPACE_ID}.`,
        401,
      );
    }

    const ctx = createContext({ managementToken, spaceId });

    const server = new McpServer({
      name: "punch-storyblok-mcp",
      version: "1.0.0",
    });
    storyblok(server, ctx);

    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    try {
      await server.connect(transport);
      return await transport.handleRequest(request);
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      return jsonRpcError(`Server error: ${message}`, 500);
    }
  },
} satisfies ExportedHandler;
