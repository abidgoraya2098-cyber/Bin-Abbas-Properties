import React from "react";
import { motion } from "motion/react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { SOCIAL_LINKS } from "../data";

export default function SocialLinks() {
  const getIcon = (id: string) => {
    switch (id) {
      case "facebook":
        return <Facebook className="w-5 h-5 fill-current" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      case "tiktok":
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.15 2.25 1.95 3.68 2.27v3.9c-1.39-.02-2.77-.38-3.99-1.07-.48-.27-.92-.61-1.31-.99-.04 2.85-.01 5.7-.02 8.55-.07 1.62-.64 3.23-1.63 4.51-1.11 1.45-2.76 2.45-4.54 2.78-1.74.34-3.58.11-5.18-.63-1.61-.75-2.97-2.06-3.76-3.69-.87-1.78-.96-3.89-.25-5.74.67-1.72 2.01-3.15 3.69-3.93 1.34-.63 2.83-.84 4.29-.62v3.97c-.96-.13-1.95.05-2.78.58-.87.54-1.46 1.48-1.57 2.49-.12 1.09.28 2.21 1.03 3.01.76.81 1.86 1.25 2.97 1.18 1.1-.04 2.14-.64 2.68-1.6.43-.76.54-1.65.52-2.52.01-4.04-.01-8.08-.01-12.12z"/>
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 pt-3.5 border-t border-emerald-200 select-none" id="social-links-section">
      <div className="text-center mb-3">
        <h3 className="text-[10px] font-black text-emerald-950 tracking-wider uppercase mb-0.5">
          ہمارے آفیشل سوشل میڈیا اکاؤنٹس
        </h3>
        <p className="text-xs font-bold text-slate-600">
          پیجز وزٹ کرنے کے لیے آئیکون دبائیں
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-3.5" id="social-buttons-container">
        {SOCIAL_LINKS.map((social) => (
          <motion.a
            key={social.id}
            id={`social-btn-${social.id}`}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            whileHover={{ scale: 1.12, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-300 shadow-sm border cursor-pointer ${social.colorClass}`}
          >
            {getIcon(social.id)}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
