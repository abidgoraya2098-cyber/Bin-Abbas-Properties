import React from "react";
import { motion, useDragControls } from "motion/react";
import { Phone, MessageCircle, MapPin, Video, Inbox, LogOut, PlusCircle, Sparkles } from "lucide-react";
import { CONTACT_PHONE, GOOGLE_MAPS_URL } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { useNotifications } from "../context/NotificationContext";
import { getTranslation } from "../i18n";

export default function FloatingActionBar() {
  const { language, isUrdu } = useLanguage();
  const { isAdmin, logout } = useAdmin();
  const { setIsAdminInboxOpen, inquiries } = useNotifications();
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
    // Universal mobile & desktop handler to ensure Google Maps always opens exact Palm Commercial office
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const mapsTarget = isIOS 
      ? `https://maps.apple.com/?q=Palm+Commercial+Royal+Palm+City+Gujranwala` 
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
      className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:max-w-[420px] sm:mx-auto z-40"
      id="floating-mobile-action-bar"
    >
      <div className={`backdrop-blur-2xl rounded-2xl p-2 pb-2.5 shadow-[0_16px_40px_rgba(10,60,35,0.22)] flex flex-col gap-1.5 select-none ${
        isAdmin 
          ? "bg-slate-950/95 border-2 border-amber-400" 
          : "bg-white/95 border-2 border-emerald-300"
      }`}>
        
        {/* Dedicated Drag Handle Bar (Drags only when touching this handle) */}
        <div 
          onPointerDown={(e) => dragControls.start(e)}
          className="w-full flex items-center justify-center py-1 cursor-grab active:cursor-grabbing touch-none"
          title={isUrdu ? "بار کو اوپر یا نیچے کریں" : "Drag bar"}
        >
          <div className={`w-12 h-1 rounded-full ${isAdmin ? "bg-amber-400" : "bg-emerald-400/80"}`}></div>
        </div>

        {/* ========================================================= */}
        {/* 👑 ADMIN FLOATING CONTROLS (Only visible when Admin is Logged In) */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* 👑 ADMIN FLOATING CONTROLS (Only visible when Admin is Logged In) */}
        {/* ========================================================= */}
        {isAdmin ? (
          <div className="grid grid-cols-3 gap-2 text-center w-full">
            {/* 1. 🎬 ➕ Create Ad Button */}
            <button
              type="button"
              onClick={() => setIsAdminInboxOpen(true)}
              id="admin-floating-create-ad-btn"
              title={isUrdu ? "گیلری سے ویڈیو یا تصویر ایڈ لگائیں" : "Create Video or Photo Ad"}
              className="w-full h-[58px] flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 text-slate-950 shadow-md active:scale-95 border border-amber-600 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1 leading-none">
                <Video size={13} className="text-slate-950 shrink-0" />
                <span className="text-[12px] sm:text-[13px] font-black text-slate-950 whitespace-nowrap">
                  {isUrdu ? "نیا ایڈ" : "New Ad"}
                </span>
              </div>
              <span className="text-[9.5px] text-slate-950 font-black leading-tight mt-0.5 whitespace-nowrap truncate">
                {isUrdu ? "ویڈیو / تصویر" : "Photo/Video"}
              </span>
            </button>

            {/* 2. 📩 Customer Leads Inbox */}
            <button
              type="button"
              onClick={() => setIsAdminInboxOpen(true)}
              id="admin-floating-leads-btn"
              title={isUrdu ? "کسٹمر انکوائریز دیکھیں" : "Customer Leads"}
              className="w-full h-[58px] flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-gradient-to-b from-emerald-900 to-emerald-950 hover:brightness-110 text-white shadow-md active:scale-95 border border-emerald-600 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1 leading-none">
                <Inbox size={13} className="text-amber-300 shrink-0" />
                <span className="text-[12px] sm:text-[13px] font-black text-amber-300 whitespace-nowrap">
                  {isUrdu ? "کسٹمر لیڈز" : "Leads"}
                </span>
              </div>
              <span className="text-[9.5px] text-emerald-200 font-bold leading-tight mt-0.5 whitespace-nowrap truncate">
                {inquiries.length} {isUrdu ? "انکوائریز" : "Leads"}
              </span>
            </button>

            {/* 3. 🔒 Admin Logout */}
            <button
              type="button"
              onClick={logout}
              id="admin-floating-logout-btn"
              title={isUrdu ? "ایڈمن لاگ آؤٹ کریں" : "Logout Admin"}
              className="w-full h-[58px] flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-gradient-to-b from-red-900 to-red-950 hover:brightness-110 text-white shadow-md active:scale-95 border border-red-700 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-1 leading-none">
                <LogOut size={13} className="text-red-300 shrink-0" />
                <span className="text-[12px] sm:text-[13px] font-black text-red-200 whitespace-nowrap">
                  {isUrdu ? "لاگ آؤٹ" : "Logout"}
                </span>
              </div>
              <span className="text-[9.5px] font-bold text-red-300/80 leading-tight mt-0.5 whitespace-nowrap truncate">
                {isUrdu ? "ایڈمن سیشن" : "Session"}
              </span>
            </button>
          </div>
        ) : (
          /* ========================================================= */
          /* 👤 PUBLIC USER FLOATING CONTROLS (Call, WhatsApp, Maps)    */
          /* ========================================================= */
          <div className="grid grid-cols-3 gap-2 text-center w-full">
            {/* 1. Direct Phone Call */}
            <a
              href={directCallUrl}
              id="floating-call-btn"
              title="Direct Phone Call"
              className="w-full h-[58px] flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-gradient-to-b from-emerald-900 to-emerald-950 hover:from-emerald-800 hover:to-emerald-900 text-amber-300 border border-amber-400/40 active:scale-95 shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center justify-center gap-1 leading-none">
                <Phone size={13} className="text-amber-300 shrink-0" />
                <span className="text-[12px] sm:text-[13px] font-black text-amber-300 whitespace-nowrap">
                  {t.floatCall}
                </span>
              </div>
              <span className="text-[9.5px] text-emerald-200/90 font-bold leading-tight mt-0.5 whitespace-nowrap truncate">
                {t.floatCallSub}
              </span>
            </a>

            {/* 2. Direct WhatsApp */}
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="floating-whatsapp-btn"
              title="Direct WhatsApp Chat"
              className="w-full h-[58px] flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white shadow-[0_2px_12px_rgba(16,185,129,0.35)] active:scale-95 border border-amber-300/60 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-center gap-1 leading-none">
                <MessageCircle size={13} className="text-amber-300 fill-amber-300 shrink-0" />
                <span className="text-[12px] sm:text-[13px] font-black text-white whitespace-nowrap">
                  {t.floatWhatsApp}
                </span>
              </div>
              <span className="text-[9.5px] text-amber-200 font-bold leading-tight mt-0.5 whitespace-nowrap truncate">
                {t.floatWhatsAppSub}
              </span>
            </a>

            {/* 3. Office Location Map (Google Maps) */}
            <a
              href={GOOGLE_MAPS_URL}
              onClick={handleLocationClick}
              target="_blank"
              rel="noopener noreferrer"
              id="floating-map-btn"
              title="Google Maps Location"
              className="w-full h-[58px] flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-gradient-to-b from-emerald-900 to-emerald-950 hover:from-emerald-800 hover:to-emerald-900 text-amber-300 border border-amber-400/40 active:scale-95 shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center justify-center gap-1 leading-none">
                <MapPin size={13} className="text-amber-300 shrink-0" />
                <span className="text-[12px] sm:text-[13px] font-black text-amber-300 whitespace-nowrap">
                  {t.floatLocation}
                </span>
              </div>
              <span className="text-[9.5px] text-emerald-200/90 font-bold leading-tight mt-0.5 whitespace-nowrap truncate">
                {t.floatLocationSub}
              </span>
            </a>
          </div>
        )}

      </div>
    </motion.div>
  );
}
