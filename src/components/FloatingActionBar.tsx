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
        {isAdmin ? (
          <div className="flex items-center justify-around gap-2 text-center">
            {/* 1. 🎬 ➕ Create Ad Button (Primary Golden Action) */}
            <button
              type="button"
              onClick={() => setIsAdminInboxOpen(true)}
              id="admin-floating-create-ad-btn"
              title={isUrdu ? "گیلری سے ویڈیو یا تصویر ایڈ لگائیں" : "Create Video or Photo Ad"}
              className="flex-[1.4] flex flex-col items-center justify-center py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 shadow-lg active:scale-95 border-2 border-amber-300 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-amber-300 shadow-sm">
                  <Video size={13} />
                </div>
                <span className="text-xs font-black text-slate-950">
                  {isUrdu ? "➕ ایڈ لگائیں" : "➕ Create Ad"}
                </span>
              </div>
              <span className="text-[9px] text-slate-900 font-extrabold mt-0.5">
                {isUrdu ? "گیلری سے ویڈیو/تصویر" : "Photo / Video Ad"}
              </span>
            </button>

            {/* 2. 📩 Customer Leads Inbox */}
            <button
              type="button"
              onClick={() => setIsAdminInboxOpen(true)}
              id="admin-floating-leads-btn"
              title={isUrdu ? "کسٹمر انکوائریز دیکھیں" : "Customer Leads"}
              className="flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white shadow-md active:scale-95 border border-emerald-500 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-emerald-800 flex items-center justify-center text-amber-300">
                  <Inbox size={12} />
                </div>
                <span className="text-xs font-black text-amber-300">
                  {isUrdu ? "کسٹمر لیڈز" : "Leads"}
                </span>
              </div>
              <span className="text-[9px] text-emerald-200 font-bold mt-0.5">
                {inquiries.length} {isUrdu ? "انکوائریز" : "Inquiries"}
              </span>
            </button>

            {/* 3. 🔒 Admin Logout */}
            <button
              type="button"
              onClick={logout}
              id="admin-floating-logout-btn"
              title={isUrdu ? "ایڈمن لاگ آؤٹ کریں" : "Logout Admin"}
              className="flex-shrink-0 flex flex-col items-center justify-center py-2 px-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 shadow-sm active:scale-95 border border-red-700/60 cursor-pointer"
            >
              <LogOut size={14} className="text-red-400 mb-0.5" />
              <span className="text-[9px] font-black text-red-300">
                {isUrdu ? "لاگ آؤٹ" : "Logout"}
              </span>
            </button>
          </div>
        ) : (
          /* ========================================================= */
          /* 👤 PUBLIC USER FLOATING CONTROLS (Call, WhatsApp, Maps)    */
          /* ========================================================= */
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

            {/* 3. Office Location Map (Google Maps) */}
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
        )}

      </div>
    </motion.div>
  );
}
