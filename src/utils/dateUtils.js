// Date helpers: Indian display format (DD-MM-YYYY) and ISO <-> Date conversions
// for use with native <input type="date"> elements.

const MONTHS_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_HI = [
  "जन", "फ़र", "मार्च", "अप्रैल", "मई", "जून",
  "जुल", "अग", "सित", "अक्टू", "नव", "दिस",
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

/** Date -> "DD-MM-YYYY" (Indian numeric format). */
export function formatDateIndian(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad2(d.getUTCDate())}-${pad2(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
}

/** Date -> "3 Jul 2026" or "3 जुल 2026" — friendlier for tables/cards. */
export function formatDateFriendly(date, lang = "en") {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const months = lang === "hi" ? MONTHS_HI : MONTHS_EN;
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Date -> "YYYY-MM-DD" for native <input type="date"> value prop. */
export function toISODateInput(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/** "YYYY-MM-DD" string (from input) -> Date object at UTC midnight. */
export function fromISODateInput(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

/** Today's date at UTC midnight. */
export function todayMidnight() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}
