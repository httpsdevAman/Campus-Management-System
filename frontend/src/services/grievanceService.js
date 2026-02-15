import { get, post, patch as httpPatch } from "./http";
import {
  mapBackendGrievanceToUI,
  mapUIStatusToBackend,
  mapUIPriorityToBackend,
} from "./adapters/grievanceAdapter";

function notSupported(msg) {
  const err = new Error(msg || "Not supported by the backend.");
  err.status = 501;
  err.unsupported = true;
  throw err;
}

// ── List for student / by creator ──

export async function listGrievancesForStudent() {
  const data = await get("/api/grievances/my");
  return (data || [])
    .map(mapBackendGrievanceToUI)
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

export async function listGrievancesByCreator(userId) {
  return listGrievancesForStudent(userId);
}

// ── List assigned (authority): backend returns all grievances for authority ──

export async function listAssignedGrievances() {
  const data = await get("/api/grievances");
  return (data || [])
    .map(mapBackendGrievanceToUI)
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

// ── List all (authority / admin) ──

export async function listAllGrievances() {
  const data = await get("/api/grievances");
  return (data || [])
    .map(mapBackendGrievanceToUI)
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

// ── Get by ID ──

export async function getGrievanceById(id) {
  const data = await get(`/api/grievances/${id}`);
  return mapBackendGrievanceToUI(data);
}

// ── Create ──

export async function createGrievance({
  title,
  category,
  description,
  priority,
}) {
  const result = await post("/api/grievances", {
    title: title.trim(),
    description: description.trim(),
    category,
    priority: mapUIPriorityToBackend(priority),
  });
  if (result?.grievance) {
    return mapBackendGrievanceToUI(result.grievance);
  }
  throw new Error(result?.message || "Failed to create grievance");
}

// ── Add comment: backend has no comment endpoint ──

export async function addGrievanceComment() {
  throw notSupported("Adding comments to grievances is not supported by the backend.");
}

// ── Update status ──

export async function updateGrievanceStatus({ id, status, message }) {
  const result = await httpPatch(`/api/grievances/${id}/status`, {
    status: mapUIStatusToBackend(status),
    remark: message?.trim() || `Status changed to ${status}`,
  });
  if (result?.grievance) {
    return mapBackendGrievanceToUI(result.grievance);
  }
  throw new Error(result?.message || "Failed to update status");
}

// ── Assign grievance (admin only) ──

export async function assignGrievance({ id, authorityUser }) {
  const result = await httpPatch(`/api/grievances/${id}/assign`, {
    assignedTo: authorityUser ? authorityUser.id : null,
  });
  if (result?.grievance) {
    return mapBackendGrievanceToUI(result.grievance);
  }
  throw new Error(result?.message || "Failed to assign");
}

// ── Get authority users (admin: list users with role=authority) ──

export async function getAuthorityUsers() {
  try {
    const data = await get("/api/users?role=authority");
    const list = Array.isArray(data) ? data : [];
    return list.map((u) => ({
      id: u._id || u.id,
      name: u.name || "Unknown",
      email: u.instituteEmail || u.email || "",
      role: u.role || "authority",
    }));
  } catch {
    return [];
  }
}
