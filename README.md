# Punch Storyblok MCP

Remote MCP server for Storyblok, running on Cloudflare Workers. Used by the [punch-storyblok-nextjs plugin](https://github.com/DoubleUpDigital/claude-plugins) in our internal Claude Code marketplace.

Forked from [`ArjunCodess/storyblok-mcp`](https://github.com/ArjunCodess/storyblok-mcp) (MIT). The original is a Node stdio MCP server with ~115 tools covering Storyblok's Management + CDN APIs. This fork ports it to:

- **Web Standards transport** via `WebStandardStreamableHTTPServerTransport` (works on Workers, Deno, Bun, Node 18+)
- **Stateless mode** — no Durable Objects, one server instance per request
- **Per-teammate auth** via request headers, so no shared Storyblok tokens live on the server

## Deployed at

`https://punch-storyblok-mcp.justin-e86.workers.dev/mcp`

(Account: Justin@doubleupdigital.com — `e86b8a49708c1237052c4062a9114576`)

## How it works

Every request must include three headers:

| Header | Purpose |
|---|---|
| `X-Storyblok-Token` | Storyblok Personal Access Token from [app.storyblok.com → My Account](https://app.storyblok.com/#/me/account) |
| `X-Storyblok-Public-Token` | Public CDN token for the target space |
| `X-Storyblok-Space-Id` | Numeric space ID |

The Worker passes these through to Storyblok on every API call. Teammates supply their own tokens via env vars (`STORYBLOK_MANAGEMENT_TOKEN`, `STORYBLOK_PUBLIC_TOKEN`, `STORYBLOK_SPACE_ID`) — see the plugin README for setup.

`GET /health` returns server status without requiring auth.

## What's dropped from the upstream

- `generate_alt`, `generate_meta`, `auto_tag_story` — these required `@ai-sdk/google` (Gemini) which is incompatible with Workers and unused by our team. Add back later if needed.
- All `process.env` reads — replaced with per-request context.
- `axios` — replaced with native `fetch`.

## Development

```bash
npm install
npx wrangler dev           # local dev server at http://localhost:8787
npx wrangler deploy        # deploy to Cloudflare
npx wrangler tail          # stream production logs
```

## Adding new tools

Tools are registered in [`src/storyblok.ts`](src/storyblok.ts) via `server.tool(name, schema, handler)`. The handler receives the destructured context (`api`, `managementBase`, `managementToken`, `publicToken`, `spaceId`) from the function's closure.

```ts
server.tool('my_new_tool', {
  id: z.string(),
}, async ({ id }) => {
  try {
    const res = await api.get(buildURL(managementBase, `path/${id}`), {
      headers: getHeaders(managementToken),
    });
    return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
  } catch (error: any) {
    return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
  }
});
```

After adding a tool, `npx wrangler deploy` and run `/plugin marketplace update punch` in Claude Code to pick up the change.

## Syncing from upstream

```bash
git fetch upstream
git merge upstream/main      # resolve conflicts in storyblok.ts as needed
```

Note: the upstream is still a stdio Node server. When merging, expect conflicts in `src/storyblok.ts` (axios vs api), `src/utils.ts` (env vars vs context), and `src/index.ts` (which we replaced with `src/worker.ts`).

## License

MIT, inherited from upstream. See [LICENSE](LICENSE).
