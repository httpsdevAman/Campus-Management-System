import { API_BASE_URL, DEFAULT_HEADERS } from "../config/api";
import { getToken } from "./authToken";

const TIMEOUT_MS = 10000;

export async function request(path, { method = "GET", body, headers = {} } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const reqHeaders = { ...DEFAULT_HEADERS, ...headers };
  const token = getToken();
  if (token) reqHeaders.Authorization = `Bearer ${token}`;

  const opts = {
    method,
    headers: reqHeaders,
    credentials: "include",
    signal: controller.signal,
  };

  if (body instanceof FormData) {
    delete opts.headers["Content-Type"];
    opts.body = body;
  } else if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, opts);
    clearTimeout(timer);

    let data = null;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      data = await res.json();
    }

    if (!res.ok) {
      const err = new Error(data?.message || `HTTP ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (e) {
    clearTimeout(timer);
    if (e.name === "AbortError") {
      const err = new Error("Request timed out");
      err.status = 408;
      throw err;
    }
    throw e;
  }
}

export const get = (path, opts) => request(path, { ...opts, method: "GET" });
export const post = (path, body, opts) => request(path, { ...opts, method: "POST", body });
export const put = (path, body, opts) => request(path, { ...opts, method: "PUT", body });
export const patch = (path, body, opts) => request(path, { ...opts, method: "PATCH", body });
export const del = (path, opts) => request(path, { ...opts, method: "DELETE" });
