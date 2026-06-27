export const en = {
  appName: "Hisaab Khata",
  appTagline: "Loan Interest Ledger",

  modeTab1: "Date Range",
  modeTab2: "EMI / Partial Payments",

  // ── Shared form fields ──
  principalLabel: "Principal Amount",
  principalPlaceholder: "e.g. 10000",
  rateLabel: "Interest Rate (per month)",
  rateDefault: "2.25% (default)",
  rateAlt: "1.75%",
  rateManual: "Other",
  rateManualPlaceholder: "Enter rate %",
  startDateLabel: "Start Date",
  endDateLabel: "End Date",
  asOfDateLabel: "Calculate As Of",
  selected: "Selected",
  calculateBtn: "Calculate",
  recalculate: "Recalculate",

  // ── Mode 2 specific ──
  paymentsHeading: "Partial Payments Received",
  paymentDateLabel: "Payment Date",
  paymentAmountLabel: "Amount Paid",
  addPayment: "+ Add Payment",
  removePayment: "Remove",
  noPayments: "No partial payments added yet. Add one below, or leave empty to just track running interest.",

  // ── Results ──
  resultsHeading: "Result",
  totalAmountPayable: "Total Amount Payable",
  outstandingAmount: "Outstanding Amount (as of selected date)",
  totalInterest: "Total Interest",
  totalDays: "Total Days",
  totalPaidSoFar: "Total Paid So Far",
  originalPrincipal: "Original Principal",
  minDaysNote: "Minimum 15-day interest rule applied",
  daysShort: "days",

  breakdownHeading: "Full Breakdown (review every segment)",
  colPeriod: "Period",
  colDays: "Days",
  colOpeningPrincipal: "Opening Principal",
  colDailyInterest: "Daily Interest",
  colInterest: "Interest",
  colEvent: "Event",
  colClosing: "Closing Balance",
  eventFold: "1-Year Compounding",
  eventPayment: "Payment Received",
  eventFinal: "Final / As-of Date",
  yearEndLabel: "End of Year",
  foldExplain: "Interest of this period added to principal (compounding)",
  paymentExplain: "paid — deducted from balance",

  // ── Info / help ──
  howItWorksTitle: "How this is calculated",
  howItWorksBody:
    "Interest = Principal × Rate × Days ÷ 30 (a flat 30-day month). Any period under 15 days is still charged for a minimum of 15 days. If a loan runs for more than 365 days, the interest earned in each 365-day block is added to the principal before the next block begins (compounding). In the EMI tracker, each payment first settles interest accrued so far, then reduces the principal — the 365-day compounding clock keeps running from the original start date regardless of payments.",

  errEndBeforeStart: "End date must be on or after the start date.",
  errInvalidPrincipal: "Please enter a valid principal amount greater than 0.",
  errInvalidRate: "Please enter a valid interest rate greater than 0.",
  errInvalidDates: "Please select both a start and an end date.",
  errPaymentDateRange: "Payment dates must fall between the start date and the as-of date.",

  footerNote: "All calculations happen in your browser — nothing is uploaded anywhere.",
  languageToggle: "हिंदी",
};
