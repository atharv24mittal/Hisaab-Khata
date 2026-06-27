import { useLang } from "../i18n/LanguageContext";

export default function ModeTabs({ mode, setMode }) {
  const { t } = useLang();

  const tabs = [
    { id: "range", label: t.modeTab1 },
    { id: "emi", label: t.modeTab2 },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:inline-flex sm:gap-1 rounded-xl bg-paper-card border border-rule-red/20 p-1.5 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setMode(tab.id)}
          aria-pressed={mode === tab.id}
          className={[
            "relative px-4 py-2.5 sm:py-2 rounded-lg text-sm sm:text-[0.95rem] font-semibold font-display transition-all",
            mode === tab.id
              ? "bg-rule-red text-paper-card shadow"
              : "text-ink-soft hover:text-ink hover:bg-rule-red/5",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
