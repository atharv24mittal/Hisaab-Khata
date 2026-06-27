import { useLang } from "../i18n/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLanguage } = useLang();

  return (
    <div
      className="inline-flex rounded-full border border-rule-red/40 bg-paper-card p-1 shadow-sm"
      role="group"
      aria-label="Language / भाषा"
    >
      {[
        { code: "en", label: "EN" },
        { code: "hi", label: "हिं" },
      ].map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => setLanguage(opt.code)}
          aria-pressed={lang === opt.code}
          className={[
            "px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors",
            lang === opt.code
              ? "bg-brass text-paper-card shadow-inner"
              : "text-ink-soft hover:text-ink",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
