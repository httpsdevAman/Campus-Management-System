// Profile: backend GET /api/auth/me for basic info; extended profile in localStorage.

import { get } from "./http";

const STORAGE_KEY = "cms_profiles";

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function buildDefaultProfile(user) {
  const base = {
    fullName: user.name,
    instituteEmail: user.email,
    personalEmail: "",
    role: user.role,
    phone: "",
    department: "",
    bio: "",
    studentId: user.studentId || "",
    employeeId: user.employeeId || "",
    linkedinUrl: "",
    githubUrl: "",
    leetcodeUrl: "",
    memberSince: new Date().toISOString(),
  };

  switch (user.role) {
    case "student":
      return {
        ...base,
        department: "Computer Science & Engineering",
        rollNo: "",
        semester: "",
        program: "BTech",
        bio: "Undergraduate student at IIT Mandi.",
      };
    case "faculty":
      return {
        ...base,
        department: "Computer Science & Engineering",
        designation: "",
        officeRoom: "",
        bio: "Faculty member at IIT Mandi.",
      };
    case "authority":
      return {
        ...base,
        department: "Academic Affairs",
        designation: "",
        officeRoom: "",
        bio: "Authority at IIT Mandi.",
      };
    case "admin":
      return {
        ...base,
        department: "IT & Systems",
        designation: "",
        bio: "System administrator at IIT Mandi.",
      };
    default:
      return base;
  }
}

export async function getProfile(user) {
  let backendUser = null;
  try {
    const data = await get("/api/auth/me");
    backendUser = data?.user || null;
  } catch {
    // not logged in or API error
  }

  const store = readStore();
  const userId = user?.id || user?._id;

  if (store[userId]) {
    if (backendUser) {
      store[userId] = {
        ...store[userId],
        name: backendUser.name || store[userId].name,
        email: backendUser.instituteEmail || store[userId].email,
        department: backendUser.department || store[userId].department,
        role: backendUser.role || store[userId].role,
        studentId: backendUser.studentId ?? store[userId].studentId,
        employeeId: backendUser.employeeId ?? store[userId].employeeId,
      };
      writeStore(store);
    }
    return store[userId];
  }

  const baseUser = backendUser
    ? {
        id: backendUser._id,
        name: backendUser.name,
        email: backendUser.instituteEmail,
        role: backendUser.role,
        studentId: backendUser.studentId,
        employeeId: backendUser.employeeId,
      }
    : user;
  const profile = buildDefaultProfile(baseUser);
  store[userId] = profile;
  writeStore(store);
  return profile;
}

export async function updateProfile(userId, patch) {
  const store = readStore();
  const current = store[userId];
  if (!current) throw new Error("Profile not found");
  const updated = { ...current, ...patch };
  store[userId] = updated;
  writeStore(store);
  return updated;
}

export async function resetProfile(userId, user) {
  const store = readStore();
  const current = store[userId];
  const fresh = buildDefaultProfile(user);
  // Preserve studentId/employeeId from backend (not user-editable)
  if (current) {
    if (current.studentId) fresh.studentId = current.studentId;
    if (current.employeeId) fresh.employeeId = current.employeeId;
  }
  store[userId] = fresh;
  writeStore(store);
  return fresh;
}
