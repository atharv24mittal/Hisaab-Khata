import { useLang } from "../i18n/LanguageContext";

export default function RateSelector({ rateChoice, setRateChoice, manualRate, setManualRate }) {
  const { t } = useLang();

  const options = [
    { id: "2.25", label: t.rateDefault },
    { id: "1.75", label: t.rateAlt },
    { id: "manual", label: t.rateManual },
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-ink-soft mb-2 font-display">
        {t.rateLabel}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setRateChoice(opt.id)}
            aria-pressed={rateChoice === opt.id}
            className={[
              "px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors",
              rateChoice === opt.id
                ? "border-brass bg-brass text-paper-card"
                : "border-ink-soft/25 bg-paper-card text-ink hover:border-brass/60",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {rateChoice === "manual" && (
        <div className="mt-2.5 flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={manualRate}
            onChange={(e) => setManualRate(e.target.value)}
            placeholder={t.rateManualPlaceholder}
            className="w-36 ledger-num rounded-lg border border-ink-soft/25 bg-paper-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass/50 focus:border-brass"
          />
          <span className="text-sm text-ink-soft">% / {t.daysShort === "days" ? "month" : "माह"}</span>
        </div>
      )}
    </div>
  );
}
