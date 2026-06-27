import { useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import PrincipalInput from "./PrincipalInput";
import RateSelector from "./RateSelector";
import DateField from "./DateField";
import ResultSummary from "./ResultSummary";
import BreakdownTable from "./BreakdownTable";
import InfoNote from "./InfoNote";
import { calculateLoan } from "../utils/interestEngine";
import { parseNumberInput } from "../utils/numberUtils";
import { fromISODateInput, toISODateInput, todayMidnight } from "../utils/dateUtils";

export default function DateRangeMode() {
  const { t } = useLang();

  const [principal, setPrincipal] = useState("10000");
  const [rateChoice, setRateChoice] = useState("2.25");
  const [manualRate, setManualRate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(() => toISODateInput(todayMidnight()));

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const effectiveRate = rateChoice === "manual" ? parseNumberInput(manualRate) : parseFloat(rateChoice);

  function handleCalculate() {
    setError("");
    const p = parseNumberInput(principal);
    if (!p || p <= 0) return setError(t.errInvalidPrincipal);
    if (!effectiveRate || effectiveRate <= 0) return setError(t.errInvalidRate);
    if (!startDate || !endDate) return setError(t.errInvalidDates);

    const sd = fromISODateInput(startDate);
    const ed = fromISODateInput(endDate);
    if (ed < sd) return setError(t.errEndBeforeStart);

    try {
      const r = calculateLoan({ startDate: sd, endDate: ed, principal: p, ratePercent: effectiveRate });
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
          <DateField id="start-date" label={t.startDateLabel} value={startDate} onChange={setStartDate} max={endDate || undefined} />
          <DateField
            id="end-date"
            label={t.endDateLabel}
            value={endDate}
            onChange={setEndDate}
            min={startDate || undefined}
          />
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
          <ResultSummary result={result} mode="range" />
          <BreakdownTable result={result} />
        </>
      )}

      <InfoNote />
    </div>
  );
}
