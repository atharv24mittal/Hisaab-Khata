import { useLang } from "../i18n/LanguageContext";
import { formatDateIndian } from "../utils/dateUtils";

export default function DateField({ label, value, onChange, min, max, id }) {
  const { t } = useLang();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-soft mb-2 font-display">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ink-soft/25 bg-paper-card px-3 py-2.5 text-base ledger-num focus:outline-none focus:ring-2 focus:ring-brass/50 focus:border-brass"
      />
      {value && (
        <p className="mt-1.5 text-xs text-ink-soft">
          {t.selected}: <span className="ledger-num font-medium text-ink">{formatDateIndian(value)}</span>
        </p>
      )}
    </div>
  );
}
