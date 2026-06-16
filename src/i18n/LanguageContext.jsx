import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

// صندوق اللغة — يحمل اللغة الحالية ويشاركها مع كل الشاشات
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // اقرأ اللغة المحفوظة، أو ابدأ بالعربية
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("rafiq_lang") || "ar";
  });

  // حين تتغيّر اللغة: احفظها، واضبط اتجاه الصفحة (RTL/LTR)
  useEffect(() => {
    localStorage.setItem("rafiq_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = translations[lang].dir;
  }, [lang]);

  // دالة الترجمة: t("home.title") تعيد النص باللغة الحالية
  const t = (key) => {
    const parts = key.split(".");
    let value = translations[lang];
    for (const part of parts) {
      value = value?.[part];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: translations[lang].dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

// خطّاف سهل: useLanguage() يعطيك t و lang و setLang
export function useLanguage() {
  return useContext(LanguageContext);
}