import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_NAME, ENGLISH_NAME, LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH } from "../data";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // 2 seconds
}

// 🔊 High-End App Launch & Page Opening Sound (Smooth Spatial Whoosh + Crystal Chime Swell)
function playAppOpeningSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // 1. Smooth Gentle Air Whoosh / Page Open Swell (Low-pass filtered noise/sine sweep)
    const whooshOsc = ctx.createOscillator();
    const whooshGain = ctx.createGain();
    const whooshFilter = ctx.createBiquadFilter();

    whooshOsc.type = "sine";
    whooshOsc.frequency.setValueAtTime(140, now);
    whooshOsc.frequency.exponentialRampToValueAtTime(420, now + 0.35);

    whooshFilter.type = "lowpass";
    whooshFilter.frequency.setValueAtTime(300, now);
    whooshFilter.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

    whooshGain.gain.setValueAtTime(0, now);
    whooshGain.gain.linearRampToValueAtTime(0.09, now + 0.08);
    whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    whooshOsc.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(ctx.destination);

    whooshOsc.start(now);
    whooshOsc.stop(now + 0.5);

    // 2. Crystal Sparkle Chime Chord (F#5, A#5, C#6, F#6 - Royal Luxury Major Chord)
    const chordFrequencies = [739.99, 932.33, 1108.73, 1479.98];

    chordFrequencies.forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(freq, now + 0.08 + idx * 0.04);

      chimeGain.gain.setValueAtTime(0, now + 0.08 + idx * 0.04);
      chimeGain.gain.linearRampToValueAtTime(0.07, now + 0.08 + idx * 0.04 + 0.02);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08 + idx * 0.04 + 0.85);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chimeOsc.start(now + 0.08 + idx * 0.04);
      chimeOsc.stop(now + 0.08 + idx * 0.04 + 0.9);
    });
  } catch (err) {
    // Autoplay restrictions are gracefully ignored
  }
}

export default function SplashScreen({ onFinish, duration = 2000 }: SplashScreenProps) {
  const { isUrdu } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Play the immersive app opening / page reveal sound
    playAppOpeningSound();

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
          key="pure-vector-logo-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fafaf9] text-slate-900 select-none overflow-hidden cursor-pointer touch-manipulation"
          id="pure-animated-vector-splash"
        >
          {/* 🌟 PURE VECTOR MOTION GRAPHICS LOGO (NO STATIC PICTURE/IMAGE FILE) */}
          <div className="relative flex flex-col items-center justify-center text-center px-4 w-full max-w-[360px]">
            
            {/* Dynamic Vector Architecture & Emblem Animation */}
            <div className="relative w-48 h-44 sm:w-52 sm:h-48 flex items-center justify-center mb-2">
              <svg 
                viewBox="0 0 200 180" 
                className="w-full h-full drop-shadow-[0_12px_24px_rgba(6,78,59,0.14)]"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Luxury Gold Linear Gradient */}
                  <linearGradient id="goldArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="35%" stopColor="#d97706" />
                    <stop offset="70%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>

                  {/* Emerald Tower Gradient */}
                  <linearGradient id="emeraldTowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="50%" stopColor="#065f46" />
                    <stop offset="100%" stopColor="#064e3b" />
                  </linearGradient>

                  {/* Golden Tower Gradient */}
                  <linearGradient id="goldTowerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>

                {/* 1. Grand Outer Islamic Gold Arch (Animated Stroke Draw) */}
                <motion.path
                  d="M 25,150 A 75,75 0 0,1 175,150"
                  stroke="url(#goldArchGrad)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* 2. Inner Golden Halo Curve */}
                <motion.path
                  d="M 40,150 A 60,60 0 0,1 160,150"
                  stroke="url(#goldArchGrad)"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                />

                {/* 3. Modern Center Skyscraper Tower (Rising Upward) */}
                <motion.rect
                  x="88"
                  y="45"
                  width="24"
                  height="105"
                  rx="3"
                  fill="url(#emeraldTowerGrad)"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Center Tower Spire / Golden Dome Tip */}
                <motion.polygon
                  points="100,28 88,46 112,46"
                  fill="url(#goldTowerGrad)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.55, ease: "backOut" }}
                />

                {/* 4. Left Modern Tower (Rising Upward) */}
                <motion.rect
                  x="60"
                  y="70"
                  width="22"
                  height="80"
                  rx="3"
                  fill="url(#goldTowerGrad)"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Left Tower Angular Roof */}
                <motion.polygon
                  points="60,70 82,56 82,70"
                  fill="#fef08a"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                />

                {/* 5. Right Modern Tower (Rising Upward) */}
                <motion.rect
                  x="118"
                  y="65"
                  width="22"
                  height="85"
                  rx="3"
                  fill="url(#goldTowerGrad)"
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.65, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Right Tower Angular Roof */}
                <motion.polygon
                  points="118,65 118,50 140,65"
                  fill="#fef08a"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.65 }}
                />

                {/* 6. Tower Architectural Window Grid Lines */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                >
                  <line x1="93" y1="60" x2="107" y2="60" />
                  <line x1="93" y1="78" x2="107" y2="78" />
                  <line x1="93" y1="96" x2="107" y2="96" />
                  <line x1="93" y1="114" x2="107" y2="114" />
                  <line x1="93" y1="132" x2="107" y2="132" />

                  <line x1="65" y1="85" x2="77" y2="85" />
                  <line x1="65" y1="105" x2="77" y2="105" />
                  <line x1="65" y1="125" x2="77" y2="125" />

                  <line x1="123" y1="80" x2="135" y2="80" />
                  <line x1="123" y1="100" x2="135" y2="100" />
                  <line x1="123" y1="120" x2="135" y2="120" />
                </motion.g>

                {/* 7. Solid Metallic Foundation Base Line */}
                <motion.line
                  x1="18"
                  y1="150"
                  x2="182"
                  y2="150"
                  stroke="url(#goldArchGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                />

                {/* 8. Glowing Star / Sun Emblem at Crescent Apex */}
                <motion.circle
                  cx="100"
                  cy="20"
                  r="4"
                  fill="#fef08a"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ 
                    scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
                    delay: 0.7 
                  }}
                />
              </svg>
            </div>

            {/* 🌟 VECTOR ANIMATED BRAND TYPOGRAPHY */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-0.5"
            >
              {/* Deep Emerald Green 'BIN ABBAS' */}
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-[#064e3b] drop-shadow-sm font-serif">
                BIN ABBAS
              </h1>

              {/* Metallic Champagne Gold 'PROPERTIES' */}
              <p className="text-xs sm:text-sm font-extrabold tracking-[0.35em] text-[#b45309] uppercase">
                PROPERTIES
              </p>
            </motion.div>

            {/* Urdu Title & Location Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.6 }}
              className="mt-2 space-y-0.5"
            >
              <h2 className="text-sm font-black text-[#065f46] font-sans">
                {isUrdu ? BUSINESS_NAME : "Real Estate & Builders"}
              </h2>
              <p className="text-[11px] font-bold text-slate-500 tracking-wide">
                {isUrdu ? LOCATION_TAGLINE : LOCATION_TAGLINE_ENGLISH}
              </p>
            </motion.div>

            {/* Smooth 2-Second Hairline Loading Line */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="w-32 h-[2px] bg-slate-200/90 rounded-full overflow-hidden mt-5"
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
