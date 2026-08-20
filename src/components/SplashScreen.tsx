import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_NAME, ENGLISH_NAME, LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH } from "../data";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // 2 seconds
}

// 🔊 Premium Luxury Mobile App Opening Sound (Warm Velvety Bell Arpeggio)
function playLuxuryAppOpeningSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // 1. Warm Soft Bass Fundamental (C4)
    const baseOsc = ctx.createOscillator();
    const baseGain = ctx.createGain();
    baseOsc.type = "sine";
    baseOsc.frequency.setValueAtTime(261.63, now);
    baseGain.gain.setValueAtTime(0, now);
    baseGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    baseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    baseOsc.connect(baseGain);
    baseGain.connect(ctx.destination);
    baseOsc.start(now);
    baseOsc.stop(now + 0.95);

    // 2. Sweet Pentatonic Bell Arpeggio (G4 -> C5 -> E5 -> G5)
    const bellNotes = [392.00, 523.25, 659.25, 783.99];
    bellNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = 0.05 * idx;

      osc.type = "triangle"; // Warm acoustic timbre
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.06, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.9);
    });
  } catch (err) {
    // Autoplay restrictions are gracefully ignored
  }
}

export default function SplashScreen({ onFinish, duration = 2000 }: SplashScreenProps) {
  const { isUrdu } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Play the velvety luxury app launch sound
    playLuxuryAppOpeningSound();

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onFinish) {
      setTimeout(onFinish, 280);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="official-luxury-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleClose}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fafaf9] text-slate-900 select-none overflow-hidden cursor-pointer touch-manipulation"
          id="official-logo-splash"
        >
          {/* 🌟 SOLID OFF-WHITE BACKDROP - 100% OPAQUE FROM FRAME 0 (NO FLICKER / NO FLASHING) */}
          <div className="relative flex flex-col items-center justify-center text-center px-4 w-full max-w-[340px]">
            
            {/* 🌟 OFFICIAL 3D MASTER BRAND LOGO - SMOOTH LIFT & METALLIC SHIMMER */}
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-3"
            >
              {/* Crisp Ambient Studio Shadow */}
              <div className="relative w-full h-full p-2 flex items-center justify-center filter drop-shadow-[0_16px_28px_rgba(10,50,30,0.12)]">
                <img 
                  src="/Bin-Abbas-Properties-Logo.png" 
                  alt="Bin Abbas Properties Official Brand Logo"
                  className="w-full h-full object-contain select-none"
                />

                {/* Metallic Golden Light Streak Tracing the Curve */}
                <motion.div
                  initial={{ x: "-130%", opacity: 0 }}
                  animate={{ x: "190%", opacity: [0, 0.85, 0] }}
                  transition={{ 
                    duration: 1.1, 
                    delay: 0.3, 
                    ease: [0.25, 1, 0.5, 1] 
                  }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none"
                />
              </div>
            </motion.div>

            {/* Deep Emerald Green 'BIN ABBAS' & Golden 'PROPERTIES' Typography with Subtle Glow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.35, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="space-y-0.5"
            >
              {/* Deep Emerald Green Brand Title */}
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-[#064e3b] drop-shadow-[0_1px_2px_rgba(6,78,59,0.12)] font-serif">
                BIN ABBAS
              </h1>

              {/* Metallic Champagne Gold Subtitle */}
              <p className="text-xs sm:text-sm font-extrabold tracking-[0.35em] text-[#b45309] uppercase">
                PROPERTIES
              </p>
            </motion.div>

            {/* Urdu Title & Location Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.55 }}
              className="mt-2.5 space-y-0.5"
            >
              <h2 className="text-sm font-black text-[#065f46] font-sans">
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
              transition={{ duration: 0.3, delay: 0.2 }}
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
