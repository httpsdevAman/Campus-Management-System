import { ROLES } from "./roles";

const navConfig = {
  [ROLES.STUDENT]: [
    { label: "Dashboard", path: "/student/dashboard", icon: "grid" },
    { label: "Courses", path: "/student/courses", icon: "book" },
    { label: "Grievances", path: "/student/grievances", icon: "flag" },
    { label: "Opportunities", path: "/student/opportunities", icon: "briefcase" },
  ],
  [ROLES.FACULTY]: [
    { label: "Dashboard", path: "/faculty/dashboard", icon: "grid" },
    { label: "Courses", path: "/faculty/courses", icon: "book" },
    { label: "Grievances", path: "/faculty/grievances", icon: "flag" },
    { label: "Opportunities", path: "/faculty/opportunities", icon: "briefcase" },
  ],
  [ROLES.AUTHORITY]: [
    { label: "Dashboard", path: "/authority/dashboard", icon: "grid" },
    { label: "Grievances", path: "/authority/grievances", icon: "flag" },
    
  ],
  [ROLES.ADMIN]: [
    { label: "Dashboard", path: "/admin/dashboard", icon: "grid" },
    { label: "Users", path: "/admin/users", icon: "users" },
    { label: "Grievances", path: "/admin/grievances", icon: "flag" },
    { label: "Courses", path: "/admin/courses", icon: "book" },
  ],
};

export default navConfig;
