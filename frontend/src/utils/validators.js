/** Returns error string or null. */
export function validateUrl(value) {
  if (!value) return null; // optional
  if (!/^https?:\/\/.+/i.test(value)) {
    return "Must start with http:// or https://";
  }
  return null;
}

/** Returns error string or null. */
export function validatePhone(value) {
  if (!value) return null; // optional
  // allow digits, spaces, dashes, plus, parens
  if (!/^[+\d\s\-()]{6,20}$/.test(value)) {
    return "Enter a valid phone number";
  }
  return null;
}

/** Returns error string or null. */
export function validateRequired(value, label = "This field") {
  if (!value || !value.trim()) return `${label} is required`;
  return null;
}
