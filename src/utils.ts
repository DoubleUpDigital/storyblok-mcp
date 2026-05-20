export const CDN_BASE = "https://api.storyblok.com/v2/cdn";
export const SPACES_BASE = "https://mapi.storyblok.com/v1/spaces";

export interface SbApi {
  get(url: string, config?: { headers?: Record<string, string> }): Promise<{ data: any }>;
  post(url: string, body?: unknown, config?: { headers?: Record<string, string> }): Promise<{ data: any }>;
  put(url: string, body?: unknown, config?: { headers?: Record<string, string> }): Promise<{ data: any }>;
  delete(url: string, config?: { headers?: Record<string, string> }): Promise<{ data: any }>;
}

export interface SbContext {
  managementToken: string;
  publicToken: string;
  spaceId: string;
  managementBase: string;
  api: SbApi;
}

class HttpError extends Error {
  constructor(message: string, public status: number, public bodyText: string) {
    super(message);
  }
}

async function handle(r: Response): Promise<{ data: any }> {
  const text = await r.text();
  let data: any;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!r.ok) {
    const detail = typeof data === "string" ? data : JSON.stringify(data);
    throw new HttpError(`HTTP ${r.status} ${r.statusText}: ${detail}`, r.status, text);
  }
  return { data };
}

const api: SbApi = {
  async get(url, config) {
    const r = await fetch(url, { method: "GET", headers: config?.headers });
    return handle(r);
  },
  async post(url, body, config) {
    const headers = body != null
      ? { "Content-Type": "application/json", ...(config?.headers ?? {}) }
      : config?.headers;
    const r = await fetch(url, {
      method: "POST",
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });
    return handle(r);
  },
  async put(url, body, config) {
    const headers = body != null
      ? { "Content-Type": "application/json", ...(config?.headers ?? {}) }
      : config?.headers;
    const r = await fetch(url, {
      method: "PUT",
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });
    return handle(r);
  },
  async delete(url, config) {
    const r = await fetch(url, { method: "DELETE", headers: config?.headers });
    return handle(r);
  },
};

export function createContext(opts: {
  managementToken: string;
  publicToken: string;
  spaceId: string;
}): SbContext {
  return {
    ...opts,
    managementBase: `https://mapi.storyblok.com/v1/spaces/${opts.spaceId}`,
    api,
  };
}

export function getHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
}

export function buildURL(base: string, path: string) {
  return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

export function toQuery(params: Record<string, any>) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return q ? `?${q}` : "";
}
