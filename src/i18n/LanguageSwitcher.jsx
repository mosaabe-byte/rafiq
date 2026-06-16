import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";

// زر تبديل اللغة — ثلاثة أزرار صغيرة
export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const langs = Object.keys(translations); // ["ar","fr","en"]

  return (
    <div className="lang-switcher">
      {langs.map((code) => (
        <button
          key={code}
          className={"lang-btn" + (lang === code ? " active" : "")}
          onClick={() => setLang(code)}
        >
          {translations[code].label}
        </button>
      ))}
    </div>
  );
}