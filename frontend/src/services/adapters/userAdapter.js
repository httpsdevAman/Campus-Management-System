export function mapBackendUserToUI(u) {
  if (!u) return null;
  return {
    id: u._id,
    name: u.name || "",
    email: u.instituteEmail || u.email || "",
    role: u.role || "",
    department: u.department || "",
    studentId: u.studentId || "",
    employeeId: u.employeeId || "",
    status: u.status || "ACTIVE",
    meta: u.meta || {},
    audit: u.audit || [],
    createdAt: u.createdAt || "",
    updatedAt: u.updatedAt || "",
  };
}
