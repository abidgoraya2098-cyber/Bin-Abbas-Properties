import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Phone, CheckCircle2, MapPin } from "lucide-react";
import { OWNER_NAME, BUSINESS_NAME, ENGLISH_NAME, ADDRESS, CONTACT_PHONE } from "../data";

export default function BinAbbasLogo({ 
  className = "w-full max-w-[320px]",
  variant = "full" 
}: { 
  className?: string;
  variant?: "full" | "iconOnly";
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === "iconOnly") {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <img 
          src="/bin_abbas_logo.jpg" 
          alt="Bin Abbas Properties 3D Icon" 
          className="w-full h-full object-contain rounded-2xl drop-shadow-md"
        />
      </div>
    );
  }

  return (
    <>
      {/* Official Luxury Brand Logo Card */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className={`relative flex flex-col items-center text-center select-none cursor-pointer transition-all duration-300 ${className}`} 
        id="bin-abbas-logo-box"
        title="مکمل ایچ ڈی لوگو دیکھنے کے لیے کلک کریں"
      >
        <div className="w-full flex items-center justify-center py-1">
          <div className="w-full rounded-2xl overflow-hidden shadow-md border-2 border-amber-400/60 bg-emerald-950">
            <img
              src="/bin_abbas_logo.jpg"
              alt="بن عباس پراپرٹیز - رائل پام سٹی گوجرانوالہ"
              className="w-full h-auto object-cover max-h-[160px] sm:max-h-[175px] block select-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Ultra-HD Full-Screen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
            id="logo-hd-modal-root"
            dir="rtl"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            {/* Modal Plaque Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 25 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[430px] bg-gradient-to-b from-[#ffffff] via-[#f4faf6] to-[#def2e6] rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-amber-400 text-center overflow-hidden z-10 my-auto"
              id="logo-hd-modal-body"
            >
              {/* Top Luxury Gold Accent Line */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3.5 left-3.5 p-2 rounded-full bg-white/90 text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-300 shadow-sm"
                aria-label="بند کریں"
              >
                <X size={18} />
              </button>

              {/* Verified Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs shadow-xs mb-2">
                <CheckCircle2 size={14} className="text-emerald-700" />
                <span>تصدیق شدہ آفیشل برانڈ لوگو</span>
              </div>

              {/* Logo Presentation in Modal */}
              <div className="p-1 rounded-2xl overflow-hidden bg-emerald-950 border-2 border-amber-400 shadow-md my-2">
                <img
                  src="/bin_abbas_logo.jpg"
                  alt="بن عباس پراپرٹیز - مکمل لوگو"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>

              {/* Business Info & Tagline */}
              <div className="mt-3 space-y-1">
                <h3 className="text-base font-black text-emerald-950">
                  {BUSINESS_NAME} ({ENGLISH_NAME})
                </h3>
                <p className="text-xs text-slate-700 font-semibold flex items-center justify-center gap-1">
                  <MapPin size={13} className="text-emerald-700" />
                  <span>{ADDRESS}</span>
                </p>
                <p className="text-[11px] text-emerald-800 font-bold">
                  سی ای او و چیف ایگزیکٹو: {OWNER_NAME}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-200">
                <a
                  href={`https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! عابد عباس صاحب، مجھے بن عباس پراپرٹیز سے متعلق معلومات درکار ہیں۔")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 border border-emerald-500"
                >
                  <MessageCircle size={14} className="fill-white" />
                  <span>واٹس ایپ رابطہ</span>
                </a>

                <a
                  href={`tel:+${CONTACT_PHONE}`}
                  className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 border border-emerald-600"
                >
                  <Phone size={14} />
                  <span>براہِ راست کال</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
