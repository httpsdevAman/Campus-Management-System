// Backend enum: Submitted | Under Review | In Progress | Resolved | Closed
// UI uses same semantic keys for consistency with progress bar and badges.

const STATUS_TO_UI = {
  "Submitted": "SUBMITTED",
  "Under Review": "UNDER_REVIEW",
  "In Progress": "IN_PROGRESS",
  "Resolved": "RESOLVED",
  "Closed": "CLOSED",
  "Pending": "SUBMITTED",
  "Rejected": "CLOSED",
  "In Review": "UNDER_REVIEW",
};

const STATUS_TO_BACKEND = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const PRIORITY_TO_UI = {
  "Low": "LOW",
  "Medium": "MEDIUM",
  "High": "HIGH",
  "Urgent": "URGENT",
};

const PRIORITY_TO_BACKEND = {
  "LOW": "Low",
  "MEDIUM": "Medium",
  "HIGH": "High",
  "URGENT": "Urgent",
};

export function mapBackendGrievanceToUI(g) {
  if (!g) return null;
  return {
    id: g._id,
    title: g.title || "",
    category: g.category || "",
    description: g.description || "",
    status: STATUS_TO_UI[g.status] || g.status || "SUBMITTED",
    priority: PRIORITY_TO_UI[g.priority] || g.priority || "LOW",
    location: g.location || "",
    isAnonymous: g.isAnonymous || false,
    createdBy: g.submittedBy
      ? {
          id: g.submittedBy._id || g.submittedBy,
          name: g.submittedBy.name || "Unknown",
          role: g.submittedBy.role || "",
          email: g.submittedBy.instituteEmail || "",
        }
      : null,
    assignedTo: g.assignedTo
      ? {
          id: g.assignedTo._id || g.assignedTo,
          name: g.assignedTo.name || g.assignedTo.employeeId || g.assignedTo.instituteEmail || "Assigned authority",
          email: g.assignedTo.instituteEmail || "",
          role: g.assignedTo.role || "",
        }
      : null,
    createdAt: g.createdAt || "",
    updatedAt: g.updatedAt || "",
    updates: (g.remarks || [])
      .map((r, i) => ({
        id: r._id || `remark_${i}`,
        at: r.createdAt || "",
        by: r.addedBy
          ? {
              id: r.addedBy._id || r.addedBy,
              name: r.addedBy.name || "Unknown",
              role: r.addedBy.role || "",
            }
          : { id: "", name: "System", role: "" },
        type: "STATUS_CHANGE",
        message: r.remark || "",
      }))
      .reverse(),
  };
}

export function mapUIStatusToBackend(status) {
  return STATUS_TO_BACKEND[status] || status;
}

export function mapUIPriorityToBackend(priority) {
  return PRIORITY_TO_BACKEND[priority] || priority;
}
