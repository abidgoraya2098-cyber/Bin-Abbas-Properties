import React from "react";
import { motion, useDragControls } from "motion/react";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { CONTACT_PHONE, GOOGLE_MAPS_URL } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../i18n";

export default function FloatingActionBar() {
  const { language, isUrdu } = useLanguage();
  const t = getTranslation(language);
  const dragControls = useDragControls();

  const directCallUrl = `tel:+${CONTACT_PHONE}`;
  const directWhatsAppUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
    isUrdu 
      ? "السلام علیکم! فریاد حسن گورائیہ صاحب، مجھے بن عباس پراپرٹیز سے متعلق معلومات درکار ہیں۔"
      : "Hello Mr. Faryad Hassan Goraya, I need information regarding Bin Abbas Properties in Royal Palm City."
  )}`;

  const handleLocationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Universal mobile & desktop handler to ensure Google Maps always opens
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const mapsTarget = isIOS 
      ? `https://maps.apple.com/?q=Royal+Palm+City+Gujranwala` 
      : GOOGLE_MAPS_URL;
      
    window.open(mapsTarget, "_blank", "noopener,noreferrer") || (window.location.href = mapsTarget);
  };

  return (
    <motion.div
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: -350, bottom: 20 }}
      dragElastic={0.1}
      className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:max-w-[400px] sm:mx-auto z-40"
      id="floating-mobile-action-bar"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-2xl p-2 pb-2.5 border-2 border-emerald-300 shadow-[0_16px_40px_rgba(10,60,35,0.18)] flex flex-col gap-1.5 select-none">
        
        {/* Dedicated Drag Handle Bar (Drags only when touching this handle) */}
        <div 
          onPointerDown={(e) => dragControls.start(e)}
          className="flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing py-1 touch-none" 
          title={isUrdu ? "بار کو اوپر یا نیچے کریں" : "Drag bar"}
        >
          <div className="w-12 h-1 bg-emerald-400/80 rounded-full"></div>
        </div>

        {/* 3 Core Action Buttons */}
        <div className="flex items-center justify-around gap-2 text-center">
          {/* 1. Direct Phone Call */}
          <a
            href={directCallUrl}
            id="floating-call-btn"
            title="Direct Phone Call"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 transition-colors text-slate-900 border border-emerald-200 active:scale-95 shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-300">
                <Phone size={12} className="text-emerald-800" />
              </div>
              <span className="text-xs font-black text-emerald-950">{t.floatCall}</span>
            </div>
            <span className="text-[9px] text-emerald-800 font-bold mt-0.5">{t.floatCallSub}</span>
          </a>

          {/* 2. Direct WhatsApp */}
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="floating-whatsapp-btn"
            title="Direct WhatsApp Chat"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 text-white shadow-md active:scale-95 border border-emerald-500 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                <MessageCircle size={13} className="fill-white" />
              </div>
              <span className="text-xs font-black text-white">{t.floatWhatsApp}</span>
            </div>
            <span className="text-[9px] text-emerald-100 font-bold mt-0.5">{t.floatWhatsAppSub}</span>
          </a>

          {/* 3. Office Location Map (100% Reliable Click & Tap Handler) */}
          <a
            href={GOOGLE_MAPS_URL}
            onClick={handleLocationClick}
            target="_blank"
            rel="noopener noreferrer"
            id="floating-map-btn"
            title="Google Maps Location"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 transition-colors text-slate-900 border border-emerald-200 active:scale-95 shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-300">
                <MapPin size={12} className="text-emerald-800" />
              </div>
              <span className="text-xs font-black text-emerald-950">{t.floatLocation}</span>
            </div>
            <span className="text-[9px] text-slate-600 font-bold mt-0.5">{t.floatLocationSub}</span>
          </a>
        </div>

      </div>
    </motion.div>
  );
}
