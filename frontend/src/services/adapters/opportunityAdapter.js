export function mapBackendOpportunityToUI(o) {
  if (!o) return null;
  return {
    id: o._id,
    title: o.title || "",
    type: o.type || "",
    description: o.description || "",
    requirements: o.requirements || [],
    deadline: o.deadline || "",
    location: o.location || "",
    stipend: o.stipend || "",
    postedBy: o.postedBy
      ? {
          id: o.postedBy._id || o.postedBy,
          name: o.postedBy.name || "Unknown",
        }
      : null,
    createdAt: o.createdAt || "",
    updatedAt: o.updatedAt || "",
    applications: [],
  };
}

export function mapBackendApplicationToUI(app) {
  if (!app) return null;
  return {
    id: app._id,
    at: app.createdAt || "",
    student: app.student
      ? {
          id: app.student._id || app.student,
          name: app.student.name || "Unknown",
          email: app.student.instituteEmail || "",
        }
      : null,
    note: app.statementOfPurpose || "",
    status: (app.status || "pending").toUpperCase(),
    decidedAt: app.updatedAt || null,
  };
}

export function mapUICreateToBackend(payload) {
  return {
    title: payload.title,
    description: payload.description,
    type: payload.type,
    deadline: payload.deadline,
  };
}
