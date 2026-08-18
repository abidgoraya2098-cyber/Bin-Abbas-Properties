import React from "react";
import { motion } from "motion/react";
import { Home, MessageCircle, Phone, ArrowLeft, ArrowRight, Key } from "lucide-react";
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
    <div className="space-y-2.5 my-3 sm:my-4" id="quick-links-section">
      <div className="text-center" id="instruction-title">
        <p className="text-xs sm:text-sm font-black text-emerald-900 tracking-wide">
          {t.linksTitle}
        </p>
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
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl font-bold transition-all duration-300 cursor-pointer ${
                isWhatsApp
                  ? "bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 border-2 border-amber-300 shadow-md text-white hover:brightness-105"
                  : "bg-white hover:bg-emerald-50/70 border-2 border-emerald-200 hover:border-emerald-500 shadow-sm text-slate-900 backdrop-blur-md"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`p-2.5 rounded-xl shrink-0 shadow-inner ${
                    isWhatsApp
                      ? "bg-emerald-900/60 text-amber-300 border border-emerald-400"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {getIcon(link.iconName)}
                </span>
                <div className={isUrdu ? "text-right" : "text-left"}>
                  <div
                    className={`text-sm sm:text-base font-black leading-tight tracking-wide ${
                      isWhatsApp ? "text-amber-200" : "text-slate-900"
                    }`}
                  >
                    {currentTitle}
                  </div>
                  <div
                    className={`text-[10.5px] sm:text-[11px] font-medium mt-0.5 ${
                      isWhatsApp ? "text-emerald-100" : "text-slate-600"
                    }`}
                  >
                    {currentSubtitle}
                  </div>
                </div>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isWhatsApp
                    ? "bg-emerald-900/60 border-amber-300 text-amber-200"
                    : "bg-emerald-100/80 border-emerald-300 text-emerald-800"
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
