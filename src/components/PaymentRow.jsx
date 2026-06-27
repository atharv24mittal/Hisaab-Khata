import { useLang } from "../i18n/LanguageContext";
import { formatDateIndian } from "../utils/dateUtils";
import { formatNumber, parseNumberInput } from "../utils/numberUtils";

export default function PaymentRow({ index, payment, onChange, onRemove, min, max }) {
  const { t } = useLang();
  const amountNum = parseNumberInput(payment.amount);

  return (
    <div className="rounded-xl border border-ink-soft/15 bg-paper p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-ink-soft font-display">#{index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-medium text-rule-red hover:underline"
        >
          {t.removePayment}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-ink-soft mb-1">{t.paymentDateLabel}</label>
          <input
            type="date"
            value={payment.date}
            min={min}
            max={max}
            onChange={(e) => onChange({ ...payment, date: e.target.value })}
            className="w-full rounded-lg border border-ink-soft/25 bg-paper-card px-3 py-2 text-sm ledger-num focus:outline-none focus:ring-2 focus:ring-brass/50 focus:border-brass"
          />
          {payment.date && (
            <p className="mt-1 text-xs text-ink-soft ledger-num">{formatDateIndian(payment.date)}</p>
          )}
        </div>
        <div>
          <label className="block text-xs text-ink-soft mb-1">{t.paymentAmountLabel}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft text-sm">₹</span>
            <input
              type="text"
              inputMode="decimal"
              value={payment.amount}
              onChange={(e) => onChange({ ...payment, amount: e.target.value })}
              className="w-full rounded-lg border border-ink-soft/25 bg-paper-card pl-7 pr-3 py-2 text-sm ledger-num focus:outline-none focus:ring-2 focus:ring-brass/50 focus:border-brass"
            />
          </div>
          {amountNum > 0 && <p className="mt-1 text-xs text-ink-soft ledger-num">₹{formatNumber(amountNum)}</p>}
        </div>
      </div>
    </div>
  );
}
