import React from "react";
import { DEVELOPER_NAME, DEVELOPER_ENGLISH_NAME, BUSINESS_NAME, ENGLISH_NAME, SUBTITLE, SUBTITLE_ENGLISH, LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH } from "../data";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { getTranslation } from "../i18n";

export default function Footer() {
  const { language, isUrdu } = useLanguage();
  const { isAdmin, setIsLoginModalOpen } = useAdmin();
  const t = getTranslation(language);
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="mt-4 pt-3.5 pb-1 text-center border-t border-emerald-200/90 select-none"
      id="app-footer"
    >
      <div 
        className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-950 bg-emerald-100/90 px-3 py-0.5 rounded-full border border-emerald-300 shadow-xs mb-1" 
        id="footer-developer-badge"
      >
        <ShieldCheck size={13} className="text-emerald-700" />
        <span>
          {isUrdu 
            ? `تیار کردہ و جملہ حقوق محفوظ: ${DEVELOPER_NAME}` 
            : `Developed & Secured by: ${DEVELOPER_ENGLISH_NAME}`}
        </span>
      </div>
      <div className="text-[10.5px] text-slate-700 font-bold mt-0.5" id="footer-copyright">
        © {currentYear} {isUrdu ? BUSINESS_NAME : ENGLISH_NAME} - {isUrdu ? SUBTITLE : SUBTITLE_ENGLISH}
      </div>
      <div className="text-[9.5px] text-emerald-800 font-semibold mt-0.5">
        {isUrdu ? LOCATION_TAGLINE : LOCATION_TAGLINE_ENGLISH}
      </div>

      {/* Discrete Admin / Owner Login Link */}
      <div className="mt-1.5">
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(true)}
          className="text-[10px] text-slate-500 hover:text-emerald-800 font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <ShieldCheck size={11} className={isAdmin ? "text-amber-600" : "text-slate-400"} />
          <span>
            {isAdmin 
              ? (isUrdu ? `👑 ایڈمن موڈ لاگ ان ہے` : `👑 Admin Active`) 
              : (isUrdu ? `ایڈمن / اونر لاگ ان` : `Owner Login`)}
          </span>
        </button>
      </div>
    </footer>
  );
}
