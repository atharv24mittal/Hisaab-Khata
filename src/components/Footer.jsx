import { useLang } from "../i18n/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-10 mb-6 text-center text-xs text-ink-soft">
      <p>{t.footerNote}</p>
    </footer>
  );
}
