const TYPE_MAP = {
  assignment: "DEADLINE",
  opportunity: "DEADLINE",
  exam: "DEADLINE",
  holiday: "EVENT",
  custom: "EVENT",
  global: "EVENT",
};

const COLOR_MAP = {
  assignment: "rose",
  opportunity: "violet",
  exam: "amber",
  holiday: "emerald",
  custom: "blue",
  global: "violet",
};

const EVENT_TYPE_TO_BACKEND = {
  EVENT: "global",
  DEADLINE: "assignment",
};

export function mapBackendCalendarToUI(e) {
  if (!e) return null;
  const dateVal = e.startDate || e.dueDate || e.deadline;
  const dateStr = dateVal
    ? new Date(dateVal).toISOString().split("T")[0]
    : "";
  return {
    id: e._id,
    title: e.title || "",
    date: dateStr,
    type: TYPE_MAP[e.eventType] || "EVENT",
    color: COLOR_MAP[e.eventType] || "violet",
    description: e.description || (e.eventType === "opportunity" ? `Opportunity: ${e.type || ""}` : ""),
    eventType: e.eventType || "custom",
    courseId: e.course?._id || e.course || null,
    startDate: e.startDate || dateVal || "",
    endDate: e.endDate || dateVal || "",
    __source: e.__source,
  };
}

export function mapUICreateToBackend(payload) {
  const startDate = payload.date || payload.startDate;
  return {
    title: payload.title,
    description: payload.description || "",
    eventType: payload.eventType || EVENT_TYPE_TO_BACKEND[payload.type] || "global",
    startDate,
    endDate: payload.endDate || startDate,
    course: payload.courseId || undefined,
  };
}
