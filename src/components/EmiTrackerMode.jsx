import { useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import PrincipalInput from "./PrincipalInput";
import RateSelector from "./RateSelector";
import DateField from "./DateField";
import PaymentRow from "./PaymentRow";
import ResultSummary from "./ResultSummary";
import BreakdownTable from "./BreakdownTable";
import InfoNote from "./InfoNote";
import { calculateLoan } from "../utils/interestEngine";
import { parseNumberInput } from "../utils/numberUtils";
import { fromISODateInput, toISODateInput, todayMidnight } from "../utils/dateUtils";

let rowId = 0;
function newRow(date = "") {
  rowId += 1;
  return { id: rowId, date, amount: "" };
}

export default function EmiTrackerMode() {
  const { t } = useLang();

  const [principal, setPrincipal] = useState("");
  const [rateChoice, setRateChoice] = useState("2.25");
  const [manualRate, setManualRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [asOfDate, setAsOfDate] = useState(() => toISODateInput(todayMidnight()));
  const [payments, setPayments] = useState([newRow()]);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const effectiveRate = rateChoice === "manual" ? parseNumberInput(manualRate) : parseFloat(rateChoice);

  function addPayment() {
    setPayments((rows) => [...rows, newRow()]);
  }
  function updatePayment(id, next) {
    setPayments((rows) => rows.map((r) => (r.id === id ? next : r)));
  }
  function removePayment(id) {
    setPayments((rows) => rows.filter((r) => r.id !== id));
  }

  function handleCalculate() {
    setError("");
    const p = parseNumberInput(principal);
    if (!p || p <= 0) return setError(t.errInvalidPrincipal);
    if (!effectiveRate || effectiveRate <= 0) return setError(t.errInvalidRate);
    if (!startDate || !asOfDate) return setError(t.errInvalidDates);

    const sd = fromISODateInput(startDate);
    const ad = fromISODateInput(asOfDate);
    if (ad < sd) return setError(t.errEndBeforeStart);

    const validPayments = payments.filter((r) => r.date && parseNumberInput(r.amount) > 0);
    for (const r of validPayments) {
      const pd = fromISODateInput(r.date);
      if (pd < sd || pd > ad) return setError(t.errPaymentDateRange);
    }

    try {
      const r = calculateLoan({
        startDate: sd,
        endDate: ad,
        principal: p,
        ratePercent: effectiveRate,
        payments: validPayments.map((row) => ({ date: fromISODateInput(row.date), amount: parseNumberInput(row.amount) })),
      });
      setResult(r);
    } catch {
      setError(t.errEndBeforeStart);
    }
  }

  return (
    <div className="space-y-5">
      <div className="ledger-card rounded-2xl p-4 sm:p-6 space-y-4">
        <PrincipalInput value={principal} onChange={setPrincipal} />
        <RateSelector
          rateChoice={rateChoice}
          setRateChoice={setRateChoice}
          manualRate={manualRate}
          setManualRate={setManualRate}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateField id="emi-start" label={t.startDateLabel} value={startDate} onChange={setStartDate} max={asOfDate || undefined} />
          <DateField
            id="emi-asof"
            label={t.asOfDateLabel}
            value={asOfDate}
            onChange={setAsOfDate}
            min={startDate || undefined}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-ink-soft font-display">{t.paymentsHeading}</label>
            <button type="button" onClick={addPayment} className="text-sm font-semibold text-brass hover:underline">
              {t.addPayment}
            </button>
          </div>

          {payments.length === 0 ? (
            <p className="text-sm text-ink-soft italic">{t.noPayments}</p>
          ) : (
            <div className="space-y-3">
              {payments.map((row, i) => (
                <PaymentRow
                  key={row.id}
                  index={i}
                  payment={row}
                  onChange={(next) => updatePayment(row.id, next)}
                  onRemove={() => removePayment(row.id)}
                  min={startDate || undefined}
                  max={asOfDate || undefined}
                />
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-rule-red bg-rule-red/5 border border-rule-red/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full sm:w-auto rounded-lg bg-rule-red text-paper-card font-display font-semibold px-6 py-3 text-base shadow hover:bg-rule-red/90 active:scale-[0.99] transition-all"
        >
          {result ? t.recalculate : t.calculateBtn}
        </button>
      </div>

      {result && (
        <>
          <ResultSummary result={result} mode="emi" />
          <BreakdownTable result={result} />
        </>
      )}

      <InfoNote />
    </div>
  );
}
