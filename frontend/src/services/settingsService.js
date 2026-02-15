// Settings: stored in localStorage only (no backend /api/settings).

const STORAGE_KEY = "cms_settings";

const DEFAULTS = {
  branding: {
    instituteName: "IIT Mandi",
    appName: "Campus CMS",
    lightLogoPath: "/iitmandilightlogo.png",
    darkLogoPath: "/iitmandidarklogo.png",
    accentColor: "indigo",
  },
  academic: {
    currentSemester: "Spring 2026",
    academicYear: "2025-26",
    registrationStart: "2026-01-05",
    registrationEnd: "2026-02-07",
    defaultCreditLimit: 24,
  },
  calendar: {
    pinnedNotice: "",
  },
  userPolicy: {
    registrationEnabled: true,
    allowedEmailDomain: "iitmandi.ac.in",
    defaultRole: "student",
    sessionTimeoutMinutes: 60,
  },
  grievance: {
    slaLow: 14,
    slaMedium: 7,
    slaHigh: 3,
    escalationEnabled: true,
    autoCloseAfterDays: 30,
    categories: ["Hostel", "Infrastructure", "Academic", "IT", "Mess", "Transport", "Other"],
  },
  opportunities: {
    requireApproval: false,
    autoExpireDays: 60,
    allowedTypes: ["Internship", "Hackathon", "Project", "Scholarship", "Workshop"],
  },
};

function getStored() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
  } catch {
    /* ignore */
  }
  const copy = JSON.parse(JSON.stringify(DEFAULTS));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  return copy;
}

export function getDefaults() {
  return JSON.parse(JSON.stringify(DEFAULTS));
}

export async function getSettings() {
  return getStored();
}

export async function updateSettings(patch) {
  const current = getStored();
  const merged = { ...current };
  for (const key of Object.keys(patch)) {
    if (
      typeof patch[key] === "object" &&
      !Array.isArray(patch[key]) &&
      patch[key] !== null
    ) {
      merged[key] = { ...current[key], ...patch[key] };
    } else {
      merged[key] = patch[key];
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

export async function resetSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaults()));
  return getDefaults();
}
