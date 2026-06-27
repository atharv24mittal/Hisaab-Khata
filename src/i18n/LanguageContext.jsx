import { createContext, useContext, useMemo, useState } from "react";
import { en } from "./en";
import { hi } from "./hi";

const dictionaries = { en, hi };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = typeof window !== "undefined" ? window.localStorage?.getItem("hk-lang") : null;
    return saved === "hi" || saved === "en" ? saved : "hi";
  });

  const setLanguage = (next) => {
    setLang(next);
    try {
      window.localStorage?.setItem("hk-lang", next);
    } catch {
      /* ignore storage errors (e.g. private browsing) */
    }
  };

  const t = useMemo(() => dictionaries[lang], [lang]);

  const value = useMemo(() => ({ lang, setLanguage, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
