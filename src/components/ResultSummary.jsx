import { useLang } from "../i18n/LanguageContext";
import { formatCurrency, formatNumber, formatInt } from "../utils/numberUtils";

export default function ResultSummary({ result, mode }) {
  const { t } = useLang();
  if (!result) return null;

  const anyMinApplied = result.timeline.some((seg) => seg.minApplied);
  const headlineLabel = mode === "emi" ? t.outstandingAmount : t.totalAmountPayable;

  const stats = [
    { label: t.originalPrincipal, value: formatCurrency(result.originalPrincipal) },
    { label: t.totalInterest, value: formatCurrency(result.totalInterest) },
    { label: t.totalDays, value: `${formatInt(result.totalDaysRaw)} ${t.daysShort}` },
  ];
  if (mode === "emi") {
    stats.push({ label: t.totalPaidSoFar, value: formatCurrency(result.totalPaid) });
  }

  return (
    <div className="ledger-card rounded-2xl p-5 sm:p-7">
      <div className="flex flex-col items-center text-center">
        <div className="ledger-stamp w-40 h-40 sm:w-44 sm:h-44 px-3">
          <span className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-wide opacity-80">
            {headlineLabel}
          </span>
          <span className="ledger-num text-xl sm:text-2xl font-bold mt-1 leading-tight break-all">
            {formatCurrency(result.finalPrincipal)}
          </span>
        </div>
      </div>

      <div className="ledger-divider my-5" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-xs text-ink-soft font-display">{s.label}</p>
            <p className="ledger-num text-base sm:text-lg font-semibold text-ink mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {anyMinApplied && (
        <p className="mt-4 text-xs text-rule-red bg-rule-red/5 border border-rule-red/20 rounded-lg px-3 py-2">
          ⓘ {t.minDaysNote}
        </p>
      )}
    </div>
  );
}
