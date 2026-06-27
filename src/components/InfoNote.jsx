import { useState } from "react";
import { useLang } from "../i18n/LanguageContext";

export default function InfoNote() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="ledger-card rounded-2xl p-4 sm:p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-ink">{t.howItWorksTitle}</span>
        <span className={`text-rule-red transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && <p className="mt-3 text-sm text-ink-soft leading-relaxed">{t.howItWorksBody}</p>}
    </div>
  );
}
