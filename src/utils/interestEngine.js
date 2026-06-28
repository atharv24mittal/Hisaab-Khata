// ─────────────────────────────────────────────────────────────────────────
// Loan Interest Calculation Engine
//
// Rules implemented (per spec):
//  1. Interest = principal × (monthlyRate / 100) × days / 30   (flat 30-day month)
//  2. Minimum 15 days interest is a WHOLE-LOAN-level floor: it only ever
//     matters when the entire loan (start date → final/as-of date) spans
//     under 15 days in total. If the loan runs 15 days or longer overall,
//     this floor never applies anywhere — no individual gap between two
//     events (a payment, a compounding fold, etc.) ever gets padded on
//     its own, no matter how short that particular gap is. When the floor
//     does apply (whole loan < 15 days), it is applied exactly once, by
//     extending the final segment so the total reaches 15 days.
//  3. Every 365 days (from the loan start date, or from the most recent
//     compounding fold or payment), the interest accrued over that block
//     is folded into the principal ("compound interest after 1 year").
//     The new, larger principal is used for every subsequent day's interest.
//  4. Partial payments (Mode 2 / EMI tracker) settle interest accrued up
//     to the payment date, then reduce the principal by the payment
//     amount, and restart the 365-day compounding clock from that date.
//
// The engine produces a full chronological "timeline" of every accrual
// segment (fold / payment / final) so the UI can show a complete,
// auditable breakdown — exactly what was asked for ("mention everything
// in summary to review", "mention the amount after each year").
// ─────────────────────────────────────────────────────────────────────────

export const MIN_DAYS = 15;
export const YEAR_DAYS = 365;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Normalize any Date/string to a UTC-midnight Date (avoids DST/timezone drift). */
export function toMidnight(d) {
  const x = new Date(d);
  const norm = new Date(Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()));
  return norm;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function daysBetween(d1, d2) {
  return Math.round((d2.getTime() - d1.getTime()) / DAY_MS);
}

/** Daily interest amount for a given principal & monthly rate (%). */
export function dailyInterestAmount(principal, ratePercent) {
  return (principal * ratePercent) / 100 / 30;
}

/**
 * Run the full simulation.
 *
 * @param {Object} params
 * @param {Date|string} params.startDate
 * @param {Date|string} params.endDate     - "as of" / final date
 * @param {number} params.principal        - original principal
 * @param {number} params.ratePercent       - monthly rate, e.g. 2.25
 * @param {Array<{date:Date|string, amount:number}>} [params.payments] - Mode 2 only
 *
 * @returns {{
 *   timeline: Array<Object>,
 *   finalPrincipal: number,
 *   totalInterest: number,
 *   totalPaid: number,
 *   originalPrincipal: number,
 *   totalDaysRaw: number,
 *   startDate: Date,
 *   endDate: Date,
 * }}
 */
export function calculateLoan({ startDate, endDate, principal, ratePercent, payments = [] }) {
  const start = toMidnight(startDate);
  const end = toMidnight(endDate);
  const origPrincipal = Number(principal);

  if (end < start) {
    throw new Error("END_BEFORE_START");
  }

  const sortedPayments = [...payments]
    .filter((p) => p && p.date && Number(p.amount) > 0)
    .map((p) => ({ date: toMidnight(p.date), amount: Number(p.amount) }))
    .sort((a, b) => a.date - b.date);

  // Whole-loan-level 15-day floor check (see rule #2 above). Computed once,
  // up front, against the actual total span of the loan — never against
  // any individual sub-segment.
  const totalDaysRaw = daysBetween(start, end);
  const needsFloor = totalDaysRaw > 0 && totalDaysRaw < MIN_DAYS;
  const floorShortfall = needsFloor ? MIN_DAYS - totalDaysRaw : 0;

  let currentPrincipal = origPrincipal;
  let segmentStart = start;
  let yearAnchor = start; // resets on a compounding fold AND on a payment
  let paymentIdx = 0;

  const timeline = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let safety = 0;

  while (segmentStart < end && safety < 5000) {
    safety++;

    const nextFold = addDays(yearAnchor, YEAR_DAYS);
    const nextPayment = paymentIdx < sortedPayments.length ? sortedPayments[paymentIdx].date : null;

    // Candidate boundary dates strictly after segmentStart, capped at `end`.
    const candidates = [end];
    if (nextFold > segmentStart && nextFold < end) candidates.push(nextFold);
    if (nextPayment && nextPayment > segmentStart && nextPayment <= end) candidates.push(nextPayment);

    const nextDateMs = Math.min(...candidates.map((d) => d.getTime()));
    const nextDate = new Date(nextDateMs);

    const isFold = nextFold.getTime() === nextDateMs;
    const isPayment = !isFold && nextPayment && nextPayment.getTime() === nextDateMs;
    const isFinal = nextDate.getTime() === end.getTime();

    const rawDays = daysBetween(segmentStart, nextDate);

    // The 15-day floor, if it applies at all (whole loan < 15 days), is
    // added entirely to the FINAL segment so the loan's total comes out
    // to exactly 15 days. Every other segment — and every segment at all,
    // when the loan runs 15+ days overall — just uses its own real days.
    let effectiveDays = rawDays;
    let minApplied = false;
    if (needsFloor && isFinal) {
      effectiveDays = rawDays + floorShortfall;
      minApplied = true;
    }

    const interest = currentPrincipal * (ratePercent / 100) * (effectiveDays / 30);
    const openingPrincipal = currentPrincipal;
    const closingBeforeAdjustment = openingPrincipal + interest;

    let type = "final";
    if (isFold) type = "fold";
    else if (isPayment) type = "payment";

    const entry = {
      type, // 'fold' | 'payment' | 'final'
      segmentStartDate: new Date(segmentStart),
      segmentEndDate: new Date(nextDate),
      rawDays,
      effectiveDays,
      minApplied,
      openingPrincipal,
      ratePercent,
      dailyInterestAtStart: dailyInterestAmount(openingPrincipal, ratePercent),
      interest,
      amountBeforeAdjustment: closingBeforeAdjustment,
      paymentAmount: isPayment ? sortedPayments[paymentIdx].amount : 0,
      closingPrincipal: closingBeforeAdjustment,
    };

    totalInterest += interest;

    if (isFold) {
      currentPrincipal = closingBeforeAdjustment;
      entry.closingPrincipal = currentPrincipal;
      yearAnchor = nextDate;
      segmentStart = nextDate;
    } else if (isPayment) {
      const pay = sortedPayments[paymentIdx];
      currentPrincipal = closingBeforeAdjustment - pay.amount;
      entry.closingPrincipal = currentPrincipal;
      totalPaid += pay.amount;
      segmentStart = nextDate;
      yearAnchor = nextDate; // compounding clock restarts from this payment date
      paymentIdx++;
    } else {
      // final boundary
      currentPrincipal = closingBeforeAdjustment;
      entry.closingPrincipal = currentPrincipal;
      segmentStart = nextDate;
    }

    timeline.push(entry);

    if (isFinal) break;
  }

  return {
    timeline,
    finalPrincipal: currentPrincipal,
    totalInterest,
    totalPaid,
    originalPrincipal: origPrincipal,
    totalDaysRaw,
    startDate: start,
    endDate: end,
  };
}
