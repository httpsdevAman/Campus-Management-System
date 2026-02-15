export const ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  AUTHORITY: "authority",
  ADMIN: "admin",
};

export const ROLE_DASHBOARDS = {
  [ROLES.STUDENT]: "/student/dashboard",
  [ROLES.FACULTY]: "/faculty/dashboard",
  [ROLES.AUTHORITY]: "/authority/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
};
