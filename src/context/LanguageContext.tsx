import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ur" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isUrdu: boolean;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default is STRICTLY Urdu ("ur")
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("bin_abbas_lang");
      return saved === "en" ? "en" : "ur";
    } catch {
      return "ur";
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("bin_abbas_lang", lang);
    } catch (e) {
      console.warn("Could not save language preference:", e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "ur" ? "en" : "ur");
  };

  const isUrdu = language === "ur";
  const dir = isUrdu ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    if (language === "en") {
      document.title = "Bin Abbas Properties - Royal Palm City Gujranwala";
    } else {
      document.title = "Bin Abbas Properties - بن عباس پراپرٹیز | رائل پام سٹی گوجرانوالہ";
    }
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isUrdu, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
