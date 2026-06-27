// Indian numbering system formatting helpers (e.g. 12,73,750.00 instead of 1,273,750.00)

const inrFormatter2 = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrFormatter0 = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const inrCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "12,737.50" — Indian digit grouping, 2 decimals, no currency symbol. */
export function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return inrFormatter2.format(n);
}

/** "12,737" — Indian digit grouping, no decimals (for whole-day counts etc). */
export function formatInt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return inrFormatter0.format(Math.round(n));
}

/** "₹12,737.50" */
export function formatCurrency(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return inrCurrencyFormatter.format(n);
}

/** Parse a free-typed number string (allow commas) into a float. */
export function parseNumberInput(str) {
  if (typeof str !== "string") return Number(str) || 0;
  const cleaned = str.replace(/,/g, "").trim();
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}
