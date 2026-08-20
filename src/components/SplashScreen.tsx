import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_NAME, ENGLISH_NAME, LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH, CONTACT_PHONE_DISPLAY } from "../data";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // in milliseconds (default: 1900ms)
}

export default function SplashScreen({ onFinish, duration = 1900 }: SplashScreenProps) {
  const { isUrdu } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onFinish) {
      setTimeout(onFinish, 450); // wait for exit animation
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="app-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#062617] via-[#0b3d26] to-[#041c10] text-white select-none overflow-hidden cursor-pointer touch-manipulation"
          id="app-intro-splash-screen"
        >
          {/* Ambient Glowing Background Orbs & Radial Beams */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top Gold Radial Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.35, 0.55, 0.35]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/25 rounded-full blur-[90px]"
            />
            {/* Center Emerald Energy Beam */}
            <motion.div 
              animate={{ 
                scale: [0.9, 1.15, 0.9],
                opacity: [0.25, 0.45, 0.25]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-400/20 rounded-full blur-[100px]"
            />
            {/* Bottom Dark Luxury Glow */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-[110px]" />
          </div>

          {/* Top Pill / Official Tagline */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="z-10 pt-2"
          >
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 shadow-lg backdrop-blur-md text-[11px] font-black">
              <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: "4s" }} />
              <span>{isUrdu ? "رائل پام سٹی، گوجرانوالہ" : "Royal Palm City, Gujranwala"}</span>
            </div>
          </motion.div>

          {/* Center: Animated 3D Master Logo Plaque */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-[340px] px-2 text-center">
            
            {/* Pulsating Golden Halo Ring Behind Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.95, 1.08, 0.95],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-56 h-56 rounded-full border-2 border-amber-400/40 shadow-[0_0_50px_rgba(245,206,94,0.35)] pointer-events-none"
            />

            {/* 3D App Icon / Master Plaque with Scale & Shimmer Animation */}
            <motion.div
              initial={{ scale: 0.3, y: 30, opacity: 0, rotateX: 25 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 280, 
                damping: 22, 
                duration: 0.7 
              }}
              className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-3xl p-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-center mb-4"
            >
              {/* Inner Glossy Layer */}
              <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#ffffff] via-[#f4faf6] to-[#d6f0e0] flex items-center justify-center p-2.5 overflow-hidden shadow-inner relative">
                <img 
                  src="/Bin-Abbas-Properties-Logo.png" 
                  alt="Bin Abbas Properties Logo"
                  className="w-full h-full object-contain drop-shadow-md select-none"
                />

                {/* Shimmer Light Reflection Sweep Across the Logo */}
                <motion.div
                  initial={{ x: "-150%", opacity: 0 }}
                  animate={{ x: "200%", opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 pointer-events-none"
                />
              </div>
            </motion.div>

            {/* Animated Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="space-y-1"
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 drop-shadow-[0_2px_10px_rgba(245,206,94,0.3)]">
                {isUrdu ? BUSINESS_NAME : ENGLISH_NAME}
              </h1>

              <p className="text-xs sm:text-sm font-bold tracking-widest text-emerald-200 uppercase">
                {isUrdu ? "BIN ABBAS PROPERTIES" : "REAL ESTATE & BUILDERS"}
              </p>
            </motion.div>

            {/* Sub-tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.65 }}
              className="text-[11px] text-amber-200/90 font-medium mt-1.5"
            >
              {isUrdu 
                ? "پلاٹس کی خرید و فروخت اور محفوظ سرمایہ کاری کا بااعتماد ادارہ" 
                : "Your Trusted Partner for Buying, Selling & Investment"}
            </motion.p>
          </div>

          {/* Bottom Bar: Loading Pulse & Tap to Enter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="z-10 w-full max-w-[280px] flex flex-col items-center gap-2.5 pb-3"
          >
            {/* Elegant Golden Progress Bar */}
            <div className="w-full h-1 bg-emerald-950/80 rounded-full overflow-hidden border border-amber-400/30">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_10px_#f5ce5e]"
              />
            </div>

            {/* Quick Tap Hint */}
            <div className="flex items-center justify-between w-full text-[10.5px] text-emerald-200/80 font-bold px-1">
              <span className="flex items-center gap-1 text-amber-300/90">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>{CONTACT_PHONE_DISPLAY}</span>
              </span>

              <span className="text-[10px] text-amber-300/80 hover:text-amber-200 underline flex items-center gap-0.5">
                <span>{isUrdu ? "شروع کریں" : "Enter"}</span>
                <ArrowRight size={10} className={isUrdu ? "rotate-180" : ""} />
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
