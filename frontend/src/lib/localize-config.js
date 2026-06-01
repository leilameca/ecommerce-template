export function getLocalizedText(value, language) {
  if (!value) return "";
  if (typeof value === "object" && !Array.isArray(value)) {
    return value[language] || value.en || "";
  }
  return String(value);
}
