import { useLang } from "../i18n/LanguageContext";
import { formatCurrency, formatNumber, formatInt } from "../utils/numberUtils";
import { formatDateFriendly } from "../utils/dateUtils";

function eventBadge(entry, t) {
  if (entry.type === "fold") {
    return { text: t.eventFold, cls: "bg-stamp/10 text-stamp border-stamp/30" };
  }
  if (entry.type === "payment") {
    return { text: t.eventPayment, cls: "bg-brass/10 text-brass border-brass/30" };
  }
  return { text: t.eventFinal, cls: "bg-rule-red/10 text-rule-red border-rule-red/30" };
}

export default function BreakdownTable({ result }) {
  const { t, lang } = useLang();
  if (!result) return null;

  // Precompute each fold's year number once (mobile and desktop blocks both
  // render from this same array, so the counter can't double-increment).
  let yearCounter = 0;
  const rows = result.timeline.map((entry) => {
    if (entry.type === "fold") yearCounter += 1;
    return { entry, yearNumber: yearCounter };
  });

  return (
    <div className="ledger-card rounded-2xl p-4 sm:p-6 mt-6">
      <h3 className="font-display font-semibold text-lg text-ink mb-1">{t.breakdownHeading}</h3>

      {/* Mobile: stacked cards. Desktop: table. */}
      <div className="mt-3 space-y-3 sm:hidden">
        {rows.map(({ entry, yearNumber }, i) => {
          const badge = eventBadge(entry, t);
          return (
            <div key={i} className="rounded-xl border border-ink-soft/15 p-3.5 bg-paper">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-ink-soft">
                  {formatDateFriendly(entry.segmentStartDate, lang)} → {formatDateFriendly(entry.segmentEndDate, lang)}
                </span>
                <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full border ${badge.cls}`}>
                  {entry.type === "fold" ? `${t.yearEndLabel} ${yearNumber}` : badge.text}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-sm">
                <span className="text-ink-soft">{t.colDays}</span>
                <span className="ledger-num text-right">
                  {formatInt(entry.effectiveDays)}
                  {entry.minApplied && <span className="text-rule-red"> *</span>}
                </span>
                <span className="text-ink-soft">{t.colOpeningPrincipal}</span>
                <span className="ledger-num text-right">{formatNumber(entry.openingPrincipal)}</span>
                <span className="text-ink-soft">{t.colInterest}</span>
                <span className="ledger-num text-right">{formatNumber(entry.interest)}</span>
                {entry.type === "payment" && (
                  <>
                    <span className="text-ink-soft">{t.paymentAmountLabel}</span>
                    <span className="ledger-num text-right text-brass">− {formatNumber(entry.paymentAmount)}</span>
                  </>
                )}
                <span className="text-ink-soft font-medium">{t.colClosing}</span>
                <span className="ledger-num text-right font-semibold">{formatNumber(entry.closingPrincipal)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto mt-3">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-rule-red/30 text-left">
              <th className="py-2 pr-3 font-display font-semibold text-ink-soft">{t.colPeriod}</th>
              <th className="py-2 pr-3 font-display font-semibold text-ink-soft text-right">{t.colDays}</th>
              <th className="py-2 pr-3 font-display font-semibold text-ink-soft text-right">{t.colOpeningPrincipal}</th>
              <th className="py-2 pr-3 font-display font-semibold text-ink-soft text-right">{t.colDailyInterest}</th>
              <th className="py-2 pr-3 font-display font-semibold text-ink-soft text-right">{t.colInterest}</th>
              <th className="py-2 pr-3 font-display font-semibold text-ink-soft">{t.colEvent}</th>
              <th className="py-2 pl-3 font-display font-semibold text-ink-soft text-right">{t.colClosing}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ entry, yearNumber }, i) => {
              const badge = eventBadge(entry, t);
              return (
                <tr key={i} className="border-b border-rule-blue/25 align-top hover:bg-rule-red/[0.03]">
                  <td className="py-2.5 pr-3 whitespace-nowrap text-ink-soft">
                    {formatDateFriendly(entry.segmentStartDate, lang)}
                    <br />→ {formatDateFriendly(entry.segmentEndDate, lang)}
                  </td>
                  <td className="py-2.5 pr-3 text-right ledger-num">
                    {formatInt(entry.effectiveDays)}
                    {entry.minApplied && <span className="text-rule-red" title={t.minDaysNote}> *</span>}
                  </td>
                  <td className="py-2.5 pr-3 text-right ledger-num">{formatNumber(entry.openingPrincipal)}</td>
                  <td className="py-2.5 pr-3 text-right ledger-num text-ink-soft">{formatNumber(entry.dailyInterestAtStart)}</td>
                  <td className="py-2.5 pr-3 text-right ledger-num">{formatNumber(entry.interest)}</td>
                  <td className="py-2.5 pr-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${badge.cls}`}>
                      {entry.type === "fold" ? `${t.yearEndLabel} ${yearNumber}` : badge.text}
                    </span>
                    {entry.type === "payment" && (
                      <span className="block text-xs text-brass mt-1 ledger-num">
                        − {formatNumber(entry.paymentAmount)} {t.paymentExplain}
                      </span>
                    )}
                    {entry.type === "fold" && (
                      <span className="block text-xs text-stamp mt-1">{t.foldExplain}</span>
                    )}
                  </td>
                  <td className="py-2.5 pl-3 text-right ledger-num font-semibold">{formatNumber(entry.closingPrincipal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
