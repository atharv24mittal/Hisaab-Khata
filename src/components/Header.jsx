import { useLang } from "../i18n/LanguageContext";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const { t } = useLang();
  return (
    <header className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight">{t.appName}</h1>
        <p className="text-xs sm:text-sm text-ink-soft font-display mt-0.5">{t.appTagline}</p>
      </div>
      <LanguageToggle />
    </header>
  );
}
