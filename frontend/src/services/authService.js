import { get, post } from "./http";
import { setToken, clearToken } from "./authToken";

export async function login(email, password) {
  const data = await post("/api/auth/login", { email, password });
  if (data?.token) setToken(data.token);
  return data;
}

export async function register(email, password) {
  const data = await post("/api/auth/register", { email, password });
  if (data?.token) setToken(data.token);
  return data;
}

export async function me() {
  const data = await get("/api/auth/me");
  return data?.user || null;
}

export async function checkToken() {
  return get("/api/auth");
}

export async function logout() {
  clearToken();
  return get("/api/auth/logout");
}
