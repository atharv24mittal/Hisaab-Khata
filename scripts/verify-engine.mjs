// Quick standalone verification against the user's exact worked examples.
// Run with: node --experimental-vm-modules verify.mjs   (or just node verify.mjs since it's plain JS)
import { calculateLoan } from "../src/utils/interestEngine.js";

function approxEqual(a, b, eps = 0.0001) {
  return Math.abs(a - b) < eps;
}

function check(label, actual, expected) {
  const ok = approxEqual(actual, expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: got ${actual}, expected ${expected}`);
  if (!ok) process.exitCode = 1;
}

console.log("=== Example A: 10,000 @ 2.25%, 20 days (no min-15 trigger) ===");
{
  const r = calculateLoan({
    startDate: "2026-01-01",
    endDate: "2026-01-21", // 20 days later
    principal: 10000,
    ratePercent: 2.25,
  });
  check("totalInterest", round(r.totalInterest), 150);
  check("finalPrincipal", round(r.finalPrincipal), 10150);
}

console.log("\n=== Example B: min-15-day rule, 3rd Jul 2026 -> 5th Jul 2026 ===");
{
  const r = calculateLoan({
    startDate: "2026-07-03",
    endDate: "2026-07-05", // raw diff = 2 days, should bump to 15
    principal: 10000,
    ratePercent: 2.25,
  });
  console.log("rawDays in timeline:", r.timeline[0].rawDays, "effectiveDays:", r.timeline[0].effectiveDays);
  check("effectiveDays", r.timeline[0].effectiveDays, 15);
  check("interest (15 days @ 7.5/day)", round(r.totalInterest), 112.5);
}

console.log("\n=== Example C: Compound interest, 3rd Jul 2023 -> 5th Jul 2026 ===");
{
  const r = calculateLoan({
    startDate: "2023-07-03",
    endDate: "2026-07-05",
    principal: 10000,
    ratePercent: 2.25,
  });
  const folds = r.timeline.filter((t) => t.type === "fold");
  console.log(
    "Fold dates & resulting principal:",
    folds.map((f) => `${f.segmentEndDate.toISOString().slice(0, 10)} -> ${round(f.closingPrincipal)}`)
  );
  check("Fold #1 date is 2024-07-02", folds[0].segmentEndDate.toISOString().slice(0, 10) === "2024-07-02" ? 1 : 0, 1);
  check("Principal after fold #1", round(folds[0].closingPrincipal), 12737.5);
  check("Daily interest right after fold #1", round6(dailyAfterFold(folds[0].closingPrincipal)), 9.553125);
}

console.log("\n=== Example D: EMI tracker, 10,000 @ 2.25%, pay 5000 after 31 days, then +35 days ===");
{
  const r = calculateLoan({
    startDate: "2026-01-01",
    endDate: "2026-01-01" /* placeholder, replaced below */,
    principal: 10000,
    ratePercent: 2.25,
    payments: [{ date: "2026-02-01", amount: 5000 }], // 31 days after 2026-01-01
  });
}
{
  const start = "2026-01-01";
  const payDate = addDaysStr(start, 31); // 2026-02-01
  const endDate = addDaysStr(payDate, 35); // 35 days after the payment
  const r = calculateLoan({
    startDate: start,
    endDate,
    principal: 10000,
    ratePercent: 2.25,
    payments: [{ date: payDate, amount: 5000 }],
  });
  const seg1 = r.timeline[0];
  const seg2 = r.timeline[1];
  console.log("Segment 1 (31 days):", { days: seg1.rawDays, interest: round(seg1.interest), amountBefore: round(seg1.amountBeforeAdjustment), closing: round(seg1.closingPrincipal) });
  console.log("Segment 2 (35 days):", { days: seg2.rawDays, dailyAtStart: round6(seg2.dailyInterestAtStart), interest: round6(seg2.interest), closing: round6(seg2.closingPrincipal) });

  check("Seg1 days", seg1.rawDays, 31);
  check("Seg1 interest", round(seg1.interest), 232.5);
  check("Seg1 amountBeforeAdjustment (before payment)", round(seg1.amountBeforeAdjustment), 10232.5);
  check("Seg1 closing principal (after -5000)", round(seg1.closingPrincipal), 5232.5);
  check("Seg2 daily interest at start", round6(seg2.dailyInterestAtStart), 3.926625);
  check("Seg2 interest (35 days)", round6(seg2.interest), 137.431875);
  check("Seg2 closing principal (no further payment)", round6(seg2.closingPrincipal), 5369.931875);
}

console.log("\n=== Example E: same as D, but next payment after 378 days -> compounding kicks in mid-segment ===");
{
  const start = "2026-01-01";
  const payDate1 = addDaysStr(start, 31);
  const payDate2 = addDaysStr(payDate1, 378);
  const r = calculateLoan({
    startDate: start,
    endDate: payDate2,
    principal: 10000,
    ratePercent: 2.25,
    payments: [
      { date: payDate1, amount: 5000 },
      { date: payDate2, amount: 1 }, // tiny payment just to force a boundary at payDate2 for inspection
    ],
  });
  console.log(
    "Timeline types/dates:",
    r.timeline.map((t) => `${t.type}@${t.segmentEndDate.toISOString().slice(0, 10)} (days=${t.rawDays})`)
  );
  const foldEntry = r.timeline.find((t) => t.type === "fold");
  check("A fold occurs within the 378-day second segment", foldEntry ? 1 : 0, 1);
}

function round(n) {
  return Math.round(n * 100) / 100;
}
function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}
function dailyAfterFold(principal) {
  return (principal * 2.25) / 100 / 30;
}
function addDaysStr(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
