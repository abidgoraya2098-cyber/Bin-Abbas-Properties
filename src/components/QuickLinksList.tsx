import React from "react";
import { motion } from "motion/react";
import { Home, MessageCircle, Phone, ArrowLeft, ArrowRight, Key, Sparkles, ShieldCheck } from "lucide-react";
import { QUICK_LINKS } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../i18n";

interface QuickLinksListProps {
  onNavigateToInquiry?: (mode: "sell" | "buy") => void;
}

export default function QuickLinksList({ onNavigateToInquiry }: QuickLinksListProps) {
  const { language, isUrdu } = useLanguage();
  const t = getTranslation(language);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Rupee":
        return (
          <span className="font-sans font-black text-xs tracking-tight select-none leading-none text-emerald-800">
            Rs.
          </span>
        );
      case "Home":
        return <Home className="w-5 h-5 text-emerald-800" />;
      case "Key":
        return <Key className="w-5 h-5 text-emerald-800" />;
      case "Phone":
        return <Phone className="w-5 h-5 text-emerald-800" />;
      case "WhatsApp":
        return (
          <div className="relative w-5 h-5 flex items-center justify-center" id="whatsapp-icon-wrapper">
            <MessageCircle className="w-5 h-5 fill-white text-white" />
            <Phone 
              className="w-2.5 h-2.5 absolute text-[#0d6e46] fill-[#0d6e46]" 
              style={{ transform: "scaleX(-1) rotate(-10deg)" }} 
            />
          </div>
        );
      default:
        return <MessageCircle className="w-5 h-5 text-emerald-800" />;
    }
  };

  const handleLinkClick = (e: React.MouseEvent, linkId: string) => {
    if (linkId === "sell" && onNavigateToInquiry) {
      e.preventDefault();
      onNavigateToInquiry("sell");
    } else if (linkId === "buy" && onNavigateToInquiry) {
      e.preventDefault();
      onNavigateToInquiry("buy");
    }
  };

  return (
    <div className="space-y-3 my-3 sm:my-4" id="quick-links-section">
      <div className="flex items-center justify-center gap-1.5" id="instruction-title">
        <Sparkles size={14} className="text-amber-500" />
        <p className="text-xs sm:text-sm font-black text-emerald-950 tracking-wide uppercase">
          {t.linksTitle}
        </p>
        <Sparkles size={14} className="text-amber-500" />
      </div>

      <div className="flex flex-col gap-2.5" id="links-container">
        {QUICK_LINKS.map((link, index) => {
          const isWhatsApp = link.id === "whatsapp";
          const currentTitle = isUrdu ? link.title : (link.titleEn || link.title);
          const currentSubtitle = isUrdu ? link.subtitle : (link.subtitleEn || link.subtitle);
          const currentUrl = isUrdu ? link.url : (link.urlEn || link.url);

          return (
            <motion.a
              key={link.id}
              id={`link-button-${link.id}`}
              href={currentUrl}
              target={isWhatsApp ? "_blank" : undefined}
              rel={isWhatsApp ? "noopener noreferrer" : undefined}
              onClick={(e) => handleLinkClick(e, link.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              className={`relative overflow-hidden flex items-center justify-between p-3.5 sm:p-4 rounded-2xl font-bold transition-all duration-300 cursor-pointer ${
                isWhatsApp
                  ? "bg-gradient-to-r from-[#0d4f32] via-[#093c25] to-[#042416] border-2 border-amber-400 shadow-[0_10px_30px_rgba(4,36,22,0.25)] text-white hover:brightness-110"
                  : "bg-white hover:bg-emerald-50/80 border-2 border-emerald-200/90 hover:border-amber-400 shadow-[0_8px_20px_rgba(6,35,20,0.06)] text-slate-900 backdrop-blur-md"
              }`}
            >
              {isWhatsApp && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>
              )}

              <div className="flex items-center gap-3">
                <span
                  className={`p-2.5 rounded-xl shrink-0 shadow-md ${
                    isWhatsApp
                      ? "bg-emerald-950 text-amber-300 border border-amber-400/70"
                      : "bg-emerald-100/90 text-emerald-800 border border-emerald-300"
                  }`}
                >
                  {getIcon(link.iconName)}
                </span>
                <div className={isUrdu ? "text-right" : "text-left"}>
                  <div
                    className={`text-sm sm:text-base font-black leading-tight tracking-wide ${
                      isWhatsApp ? "text-amber-300" : "text-slate-900"
                    }`}
                  >
                    {currentTitle}
                  </div>
                  <div
                    className={`text-[10.5px] sm:text-[11px] font-semibold mt-0.5 ${
                      isWhatsApp ? "text-emerald-100/90" : "text-slate-600"
                    }`}
                  >
                    {currentSubtitle}
                  </div>
                </div>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105 ${
                  isWhatsApp
                    ? "bg-amber-400 border-amber-300 text-slate-950 font-black shadow-amber-400/30"
                    : "bg-emerald-100/90 border-emerald-300 text-emerald-800"
                }`}
              >
                {isUrdu ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
