import { get, post, put } from "./http";
import {
  mapBackendOpportunityToUI,
  mapBackendApplicationToUI,
  mapUICreateToBackend,
} from "./adapters/opportunityAdapter";

// ── List all ──

export async function listAllOpportunities() {
  const data = await get("/api/opportunities");
  return (data || [])
    .map(mapBackendOpportunityToUI)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

// ── List for faculty (filter client-side) ──

export async function listOpportunitiesForFaculty(facultyId) {
  const data = await get("/api/opportunities");
  return (data || [])
    .map(mapBackendOpportunityToUI)
    .filter((o) => o.postedBy?.id === facultyId)
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

// ── Get by ID ──

export async function getOpportunityById(id) {
  const data = await get("/api/opportunities");
  const opp = (data || []).find((o) => o._id === id);
  if (!opp) throw new Error("Opportunity not found");
  const mapped = mapBackendOpportunityToUI(opp);
  try {
    const apps = await get(`/api/opportunities/${id}/applicants`);
    mapped.applications = (apps || []).map(mapBackendApplicationToUI);
  } catch {
    mapped.applications = [];
  }
  return mapped;
}

// ── Create ──

export async function createOpportunity({
  title,
  type,
  description,
  requirements,
  deadline,
}) {
  const result = await post(
    "/api/opportunities",
    mapUICreateToBackend({ title, type, description, deadline })
  );
  return mapBackendOpportunityToUI(result);
}

// ── Update ──

export async function updateOpportunity({
  id,
  title,
  type,
  description,
  requirements,
  deadline,
}) {
  const result = await put(`/api/opportunities/${id}`, {
    title,
    description,
    type,
    deadline,
  });
  return mapBackendOpportunityToUI(result);
}

// ── Apply ──

export async function applyToOpportunity({ id, note }) {
  await post(`/api/opportunities/apply/${id}`, {
    statementOfPurpose: note?.trim() || "",
  });
  return getOpportunityById(id);
}

// ── Update application status ──

export async function updateApplicationStatus({ oppId, appId, status }) {
  await put(`/api/opportunities/application/${appId}`, {
    status: status.toLowerCase(),
  });
  return getOpportunityById(oppId);
}
