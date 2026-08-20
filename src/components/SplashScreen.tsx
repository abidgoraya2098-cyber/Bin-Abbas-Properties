import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_NAME, ENGLISH_NAME, LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH, CONTACT_PHONE_DISPLAY } from "../data";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // 2 seconds (2000ms)
}

// 🔔 Soft Crystalline UI Notification Chime (Web Audio API)
function playSoftRevealChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    
    const now = ctx.currentTime;
    // Elegant high-end harmonic triad (D5 -> A5 -> D6)
    const notes = [587.33, 880, 1174.66];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      
      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.65);
    });
  } catch (err) {
    // Ignore autoplay audio restriction silently
  }
}

export default function SplashScreen({ onFinish, duration = 2000 }: SplashScreenProps) {
  const { isUrdu } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Play ultra-soft audio cue on reveal
    playSoftRevealChime();

    // Fast 2-second auto-transition
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onFinish) {
      setTimeout(onFinish, 300); // Quick smooth exit transition
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="luxury-2s-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fafaf9] text-slate-900 select-none overflow-hidden cursor-pointer touch-manipulation"
          id="fast-luxury-splash-screen"
        >
          {/* 🌟 SOLID MINIMALIST OFF-WHITE STUDIO BACKDROP (Zero Clutter, No Background Elements) */}

          {/* 🌟 CENTERPIECE: ULTRA-CLEAN 3D LOGO & LUXURY TYPOGRAPHY REVEAL */}
          <div className="relative flex flex-col items-center justify-center text-center px-4 w-full max-w-[340px]">
            
            {/* 3D Master Logo Reveal - Seamless Upward Lift with Crisp Depth & Glass Light Streak */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.75, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-3"
            >
              {/* Crisp Ambient Shadow */}
              <div className="relative w-full h-full p-2 flex items-center justify-center filter drop-shadow-[0_16px_28px_rgba(10,50,30,0.12)]">
                <img 
                  src="/Bin-Abbas-Properties-Logo.png" 
                  alt="Bin Abbas Properties 3D Master Logo"
                  className="w-full h-full object-contain select-none"
                />

                {/* Metallic Golden Light Streak Tracing the Curve */}
                <motion.div
                  initial={{ x: "-130%", opacity: 0 }}
                  animate={{ x: "190%", opacity: [0, 0.85, 0] }}
                  transition={{ 
                    duration: 1.1, 
                    delay: 0.35, 
                    ease: [0.25, 1, 0.5, 1] 
                  }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none"
                />
              </div>
            </motion.div>

            {/* Deep Emerald Green 'BIN ABBAS' & Golden 'PROPERTIES' Typography with Subtle Glow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.65, 
                delay: 0.45, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="space-y-0.5"
            >
              {/* Deep Emerald Green Brand Title */}
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-[#09482b] drop-shadow-[0_1px_3px_rgba(9,72,43,0.15)] font-serif">
                BIN ABBAS
              </h1>

              {/* Metallic Champagne Gold Subtitle */}
              <p className="text-xs sm:text-sm font-extrabold tracking-[0.35em] text-[#b88318] uppercase">
                PROPERTIES
              </p>
            </motion.div>

            {/* Urdu Title & Location Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="mt-2.5 space-y-0.5"
            >
              <h2 className="text-sm font-black text-[#073d25] font-sans">
                {isUrdu ? BUSINESS_NAME : "Real Estate & Builders"}
              </h2>
              <p className="text-[11px] font-bold text-slate-500 tracking-wide">
                {isUrdu ? LOCATION_TAGLINE : LOCATION_TAGLINE_ENGLISH}
              </p>
            </motion.div>

            {/* Minimalist 2-Second Hairline Progress Line */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="w-36 h-[2px] bg-slate-200/90 rounded-full overflow-hidden mt-6"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"
              />
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
