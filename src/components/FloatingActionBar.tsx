import React from "react";
import { motion } from "motion/react";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { CONTACT_PHONE, GOOGLE_MAPS_URL } from "../data";

export default function FloatingActionBar() {
  const directCallUrl = `tel:+${CONTACT_PHONE}`;
  const directWhatsAppUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! فریاد حسن گورائیہ صاحب، مجھے بن عباس پراپرٹیز سے متعلق معلومات درکار ہیں۔")}`;

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: -350, bottom: 20 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.02 }}
      className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:max-w-[400px] sm:mx-auto z-40 touch-none"
      id="floating-mobile-action-bar"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-2xl p-2 pb-2.5 border-2 border-emerald-300 shadow-[0_16px_40px_rgba(10,60,35,0.18)] flex flex-col gap-1.5 select-none">
        
        {/* Drag Handle Bar */}
        <div className="flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing py-0.5" title="اوپر نیچے موو کریں">
          <div className="w-10 h-1 bg-emerald-300 rounded-full"></div>
        </div>

        {/* 3 Core Action Buttons */}
        <div className="flex items-center justify-around gap-2 text-center">
          {/* 1. Direct Phone Call */}
          <a
            href={directCallUrl}
            id="floating-call-btn"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 transition-colors text-slate-900 border border-emerald-200 active:scale-95 shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-300">
              <Phone size={12} className="text-emerald-800" />
            </div>
            <span className="text-xs font-black text-emerald-950">کال کریں</span>
          </a>

          {/* 2. Direct WhatsApp */}
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="floating-whatsapp-btn"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 text-white shadow-md active:scale-95 border border-emerald-500"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
              <MessageCircle size={13} className="fill-white" />
            </div>
            <span className="text-xs font-black text-white">واٹس ایپ</span>
          </a>

          {/* 3. Office Location Map */}
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="floating-map-btn"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 transition-colors text-slate-900 border border-emerald-200 active:scale-95 shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-300">
              <MapPin size={12} className="text-emerald-800" />
            </div>
            <span className="text-xs font-black text-emerald-950">لوکیشن</span>
          </a>
        </div>

      </div>
    </motion.div>
  );
}
