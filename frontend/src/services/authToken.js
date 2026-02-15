const STORAGE_KEY = "campus_auth_token";

let token = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

export function getToken() {
  return token;
}

export function setToken(t) {
  token = t ?? null;
  if (typeof localStorage !== "undefined") {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  }
}

export function clearToken() {
  setToken(null);
}
