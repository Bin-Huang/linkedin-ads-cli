import type { Credentials } from "./auth.js";

const BASE_URL = "https://api.linkedin.com/rest";
const API_VERSION = "202603";

interface CallOptions {
  creds: Credentials;
  path: string;
  params?: Record<string, string>;
}

export async function callApi(opts: CallOptions): Promise<unknown> {
  const url = new URL(`${BASE_URL}/${opts.path}`);
  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${opts.creds.access_token}`,
      "LinkedIn-Version": API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { rawResponse: text };
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as Record<string, unknown>).message)
        : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
