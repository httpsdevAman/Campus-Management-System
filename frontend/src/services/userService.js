// User management: backend has no admin user list/update endpoints.
// All operations call API; they will fail until backend adds /api/users.

import { get, put, patch } from "./http";

export async function getUsersCount() {
  try {
    const data = await get("/api/users/count");
    return data?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function listUsers() {
  try {
    const data = await get("/api/users");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getUserById(id) {
  const data = await get(`/api/users/${id}`);
  if (!data) throw new Error("User not found");
  return data;
}

export async function updateUser({ id, patch: patchData }) {
  const data = await put(`/api/users/${id}`, patchData);
  if (!data) throw new Error("User not found");
  return data;
}

export async function changeUserRole({ id, role }) {
  const data = await patch(`/api/users/${id}/role`, { role });
  if (!data) throw new Error("User not found");
  return data;
}

export async function changeUserStatus({ id, status }) {
  const data = await patch(`/api/users/${id}/status`, { status });
  if (!data) throw new Error("User not found");
  return data;
}

export async function resetUserPassword({ id }) {
  await patch(`/api/users/${id}/reset-password`);
  return { message: "Password reset requested" };
}

export async function deleteUser({ id, by }) {
  if (id === by?.id) throw new Error("Cannot delete yourself");
  await patch(`/api/users/${id}`, { status: "DELETED" });
  return { message: "User deleted" };
}
