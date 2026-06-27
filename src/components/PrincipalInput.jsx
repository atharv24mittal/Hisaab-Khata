import { useLang } from "../i18n/LanguageContext";
import { formatNumber, parseNumberInput } from "../utils/numberUtils";

export default function PrincipalInput({ value, onChange, id = "principal" }) {
  const { t } = useLang();
  const numeric = parseNumberInput(value);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-soft mb-2 font-display">
        {t.principalLabel}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft font-medium">₹</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.principalPlaceholder}
          className="w-full rounded-lg border border-ink-soft/25 bg-paper-card pl-7 pr-3 py-2.5 text-base ledger-num focus:outline-none focus:ring-2 focus:ring-brass/50 focus:border-brass"
        />
      </div>
      {value && numeric > 0 && (
        <p className="mt-1.5 text-xs text-ink-soft">
          ₹<span className="ledger-num font-medium text-ink">{formatNumber(numeric)}</span>
        </p>
      )}
    </div>
  );
}
