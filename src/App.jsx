import { useEffect, useState } from "react";
import { LanguageProvider, useLang } from "./i18n/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ModeTabs from "./components/ModeTabs";
import DateRangeMode from "./components/DateRangeMode";
import EmiTrackerMode from "./components/EmiTrackerMode";

function AppShell() {
  const { lang } = useLang();
  const [mode, setMode] = useState("range");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <Header />
        <div className="mb-5">
          <ModeTabs mode={mode} setMode={setMode} />
        </div>
        {mode === "range" ? <DateRangeMode /> : <EmiTrackerMode />}
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
