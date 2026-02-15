const cache = new Map();

export async function checkEndpoint(path) {
  if (cache.has(path)) return cache.get(path);
  try {
    const res = await fetch(path, { method: "HEAD", credentials: "include" });
    const available = res.status !== 404 && res.status !== 501;
    cache.set(path, available);
    return available;
  } catch {
    cache.set(path, false);
    return false;
  }
}

export function clearCache() {
  cache.clear();
}
