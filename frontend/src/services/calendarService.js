import { get, post, put, del } from "./http";
import {
  mapBackendCalendarToUI,
  mapUICreateToBackend,
} from "./adapters/calendarAdapter";

// ── List global events (and assignment deadlines from backend) ──

export async function listGlobalEvents() {
  const data = await get("/api/calendar");
  return (data || []).map(mapBackendCalendarToUI);
}

// ── Create (admin) ──

export async function createGlobalEvent({
  title,
  date,
  type,
  color,
  description,
}) {
  const result = await post(
    "/api/calendar/admin",
    mapUICreateToBackend({ title, date, description, type })
  );
  return mapBackendCalendarToUI(result);
}

// ── Update (admin) ──

export async function updateGlobalEvent(id, patch) {
  const backendPatch = {};
  if (patch.title !== undefined) backendPatch.title = patch.title;
  if (patch.description !== undefined) backendPatch.description = patch.description;
  if (patch.date !== undefined) {
    backendPatch.startDate = patch.date;
    backendPatch.endDate = patch.date;
  }
  const result = await put(`/api/calendar/admin/${id}`, backendPatch);
  return mapBackendCalendarToUI(result);
}

// ── Delete (admin) ──

export async function deleteGlobalEvent(id) {
  await del(`/api/calendar/${id}`);
}

// ── Assignment deadlines (from backend calendar; filtered by eventType) ──

export async function getAssignmentDeadlinesForStudent() {
  const data = await get("/api/calendar");
  return (data || [])
    .filter((e) => e.eventType === "assignment")
    .map(mapBackendCalendarToUI);
}

export async function getAssignmentDeadlinesForFaculty() {
  const data = await get("/api/calendar");
  return (data || [])
    .filter((e) => e.eventType === "assignment")
    .map(mapBackendCalendarToUI);
}
