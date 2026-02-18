import React from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
];

const STORAGE_KEY = "sisvet_lang";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.split("-")[0] || "es";
  const effectiveLang = LANGUAGES.some((l) => l.code === currentLang) ? currentLang : "es";

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  return (
    <div className="language-switcher d-flex align-items-center gap-1" role="group" aria-label="Idioma / Language">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={`language-switcher-btn ${effectiveLang === code ? "active" : ""}`}
          onClick={() => handleChange(code)}
          title={code === "es" ? "Español" : code === "en" ? "English" : "Português"}
          aria-pressed={effectiveLang === code}
          aria-label={code === "es" ? "Español" : code === "en" ? "English" : "Português"}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
