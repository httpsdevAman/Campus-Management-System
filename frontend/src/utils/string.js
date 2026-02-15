/** Get up to 2 initials from a name. */
export function initials(name) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Safe lowercase — handles null/undefined. */
export function safeLower(str) {
  return (str || "").toLowerCase();
}
