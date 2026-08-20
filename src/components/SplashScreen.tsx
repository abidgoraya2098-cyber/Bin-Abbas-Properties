import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_NAME, ENGLISH_NAME, LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH, CONTACT_PHONE_DISPLAY } from "../data";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // 2 seconds
}

// 🔊 Premium Velvet Bell Arpeggio (Pure Web Audio API Chime)
function playLuxuryBellChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Warm Low Velvet Fundamental (C4)
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

    // Warm Acoustic Bell Arpeggio (G4 -> C5 -> E5 -> G5)
    const notes = [392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = 0.05 * idx;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.065, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.9);
    });
  } catch (err) {
    // Gracefully handle browser autoplay restrictions
  }
}

export default function SplashScreen({ onFinish, duration = 2000 }: SplashScreenProps) {
  const { isUrdu } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Play warm luxury bell chime on launch
    playLuxuryBellChime();

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
          key="pure-animated-logo-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleClose}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fafaf9] text-slate-900 select-none overflow-hidden cursor-pointer touch-manipulation"
          id="pure-animated-logo-splash"
        >
          {/* 🌟 100% PURE VECTOR ANIMATED LOGO EMBLEM (NO STATIC PHOTO/PICTURE FILE) */}
          <div className="relative flex flex-col items-center justify-center text-center px-4 w-full max-w-[350px]">
            
            {/* Animated Vector Logo Architecture & Typography */}
            <svg 
              viewBox="0 0 400 340" 
              className="w-72 sm:w-80 h-auto filter drop-shadow-[0_12px_24px_rgba(10,50,30,0.12)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 3D Metallic Gold Gradient */}
                <linearGradient id="animGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="20%" stopColor="#fff1b3" />
                  <stop offset="45%" stopColor="#f5d061" />
                  <stop offset="70%" stopColor="#c9971e" />
                  <stop offset="90%" stopColor="#8a600a" />
                  <stop offset="100%" stopColor="#ffe699" />
                </linearGradient>

                <linearGradient id="animGoldBevel" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#ffea9f" />
                  <stop offset="70%" stopColor="#c59828" />
                  <stop offset="100%" stopColor="#734f07" />
                </linearGradient>

                {/* Building Pearl Facet */}
                <linearGradient id="animBldgFront" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f4fbf7" />
                  <stop offset="100%" stopColor="#dcf0e4" />
                </linearGradient>

                {/* Building Gold Side Shadow */}
                <linearGradient id="animGoldSide" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#b88318" />
                  <stop offset="50%" stopColor="#785308" />
                  <stop offset="100%" stopColor="#452c02" />
                </linearGradient>

                {/* Badge Gradients */}
                <linearGradient id="animBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#fff6c8" />
                  <stop offset="60%" stopColor="#e5b236" />
                  <stop offset="90%" stopColor="#ab7b10" />
                  <stop offset="100%" stopColor="#f8d66e" />
                </linearGradient>

                <linearGradient id="animBadgeInner" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0a4d30" />
                  <stop offset="50%" stopColor="#063822" />
                  <stop offset="100%" stopColor="#032415" />
                </linearGradient>

                <linearGradient id="animPhoneGoldText" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#fff3b8" />
                  <stop offset="75%" stopColor="#eec34b" />
                  <stop offset="100%" stopColor="#bc8a15" />
                </linearGradient>
              </defs>

              {/* 1. Grand Moorish Outer Arch (Animated Stroke Draw) */}
              <g transform="translate(200, 110) scale(0.65)">
                
                {/* Arch Body */}
                <motion.path 
                  d="M -150 145 V -15 C -150 -105, -90 -175, 0 -205 C 90 -175, 150 -105, 150 -15 V 145 L 120 145 V -15 C 120 -90, 65 -150, 0 -175 C -65 -150, -120 -90, -120 -15 V 145 Z" 
                  fill="url(#animGold3D)"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Arch Inner Golden Bevel Trim Line */}
                <motion.path 
                  d="M -105 145 V -12 C -105 -72, -55 -128, 0 -152 C 55 -128, 105 -72, 105 -12 V 145" 
                  fill="none" 
                  stroke="url(#animGoldBevel)" 
                  strokeWidth="4.5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                />

                {/* Left Skyscraper Tower (Rising Upward) */}
                <motion.g
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <polygon points="-100,135 -100,-35 -48,-78 -48,135" fill="url(#animBldgFront)" />
                  <polygon points="-48,-78 -26,-62 -26,135 -48,135" fill="url(#animGoldSide)" />
                  {/* Windows */}
                  <g fill="#0b4a2e" opacity="0.85">
                    <rect x="-90" y="-10" width="14" height="32" rx="1.5" />
                    <rect x="-90" y="36" width="14" height="32" rx="1.5" />
                    <rect x="-90" y="82" width="14" height="32" rx="1.5" />
                    <rect x="-68" y="-24" width="14" height="32" rx="1.5" />
                    <rect x="-68" y="22" width="14" height="32" rx="1.5" />
                    <rect x="-68" y="68" width="14" height="32" rx="1.5" />
                  </g>
                </motion.g>

                {/* Center Grand Skyscraper Tower (Rising Upward) */}
                <motion.g
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <polygon points="-22,135 -22,-120 22,-162 25,-158 25,135" fill="url(#animBldgFront)" />
                  <polygon points="25,-158 54,-135 54,135 25,135" fill="url(#animGoldSide)" />
                  {/* Windows */}
                  <g fill="#0b4a2e" opacity="0.88">
                    <rect x="-14" y="-85" width="12" height="24" rx="1.5" />
                    <rect x="-14" y="-50" width="12" height="24" rx="1.5" />
                    <rect x="-14" y="-15" width="12" height="24" rx="1.5" />
                    <rect x="-14" y="20" width="12" height="24" rx="1.5" />
                    <rect x="-14" y="55" width="12" height="24" rx="1.5" />
                    <rect x="-14" y="90" width="12" height="24" rx="1.5" />
                    <rect x="4" y="-102" width="12" height="24" rx="1.5" />
                    <rect x="4" y="-67" width="12" height="24" rx="1.5" />
                    <rect x="4" y="-32" width="12" height="24" rx="1.5" />
                    <rect x="4" y="3" width="12" height="24" rx="1.5" />
                    <rect x="4" y="38" width="12" height="24" rx="1.5" />
                    <rect x="4" y="73" width="12" height="24" rx="1.5" />
                  </g>
                </motion.g>

                {/* Right Tower (Rising Upward) */}
                <motion.g
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <polygon points="60,135 60,-60 105,-34 105,135" fill="url(#animGold3D)" />
                  <polygon points="105,-34 118,-24 118,135 105,135" fill="url(#animGoldSide)" />
                  <g stroke="#083823" strokeWidth="3.5" strokeLinecap="round" opacity="0.9">
                    <line x1="68" y1="-26" x2="96" y2="-10" />
                    <line x1="68" y1="-5" x2="96" y2="11" />
                    <line x1="68" y1="16" x2="96" y2="32" />
                    <line x1="68" y1="37" x2="96" y2="53" />
                    <line x1="68" y1="58" x2="96" y2="74" />
                    <line x1="68" y1="79" x2="96" y2="95" />
                    <line x1="68" y1="100" x2="96" y2="116" />
                  </g>
                </motion.g>

                {/* Grand Golden Dome */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.45, ease: "backOut" }}
                >
                  <path d="M -65 145 C -65 75, 65 75, 65 145 Z" fill="url(#animGold3D)" />
                  <path d="M -50 145 C -50 88, 50 88, 50 145 Z" fill="none" stroke="url(#animGoldBevel)" strokeWidth="2.5" opacity="0.85" />
                  <path d="M 0 75 V 46" stroke="url(#animGold3D)" strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="0" cy="42" r="4" fill="#ffffff" />
                </motion.g>

                {/* Base Curved Platform */}
                <motion.path 
                  d="M -195 158 Q 0 132 195 158" 
                  fill="none" 
                  stroke="url(#animGold3D)" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                />
              </g>

              {/* 2. ENGLISH BRAND TITLE (Vector Typography) */}
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <text 
                  x="200" 
                  y="228" 
                  textAnchor="middle" 
                  fontFamily="'Cinzel', 'Georgia', serif" 
                  fontSize="25" 
                  fontWeight="900" 
                  letterSpacing="3.5"
                  fill="#0a4d30"
                >
                  BIN ABBAS
                </text>

                <text 
                  x="200" 
                  y="250" 
                  textAnchor="middle" 
                  fontFamily="'Segoe UI', -apple-system, sans-serif" 
                  fontSize="12" 
                  fontWeight="800" 
                  letterSpacing="8"
                  fill="#b88318"
                >
                  PROPERTIES
                </text>
              </motion.g>

              {/* 3. URDU CALLIGRAPHY: بن عباس پراپرٹیز */}
              <motion.text 
                x="200" 
                y="288" 
                textAnchor="middle" 
                fontFamily="'Noto Sans Arabic', serif" 
                fontSize="24" 
                fontWeight="900"
                fill="#073d25"
                direction="rtl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                بن عباس پراپرٹیز
              </motion.text>

              {/* 4. LOCATION TAGLINE */}
              <motion.text 
                x="200" 
                y="312" 
                textAnchor="middle" 
                fontFamily="'Noto Sans Arabic', sans-serif" 
                fontSize="11.5" 
                fontWeight="bold"
                fill="#7a5509"
                direction="rtl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.65 }}
              >
                رائل پام سٹی، گوجرانوالہ
              </motion.text>

              {/* 5. 3D MOBILE NUMBER BADGE (0320.4800071) */}
              <motion.g 
                transform="translate(200, 332) scale(0.68)"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <rect 
                  x="-175" 
                  y="-20" 
                  width="350" 
                  height="40" 
                  rx="20" 
                  fill="url(#animBadgeGrad)" 
                  stroke="url(#animGold3D)" 
                  strokeWidth="1.5" 
                />
                
                <rect 
                  x="-171" 
                  y="-16" 
                  width="342" 
                  height="32" 
                  rx="16" 
                  fill="url(#animBadgeInner)" 
                  stroke="#c59828" 
                  strokeWidth="1" 
                />

                <text 
                  x="0" 
                  y="7" 
                  textAnchor="middle" 
                  fontFamily="'Trebuchet MS', 'Arial Black', sans-serif" 
                  fontSize="20" 
                  fontWeight="900" 
                  letterSpacing="2"
                  fill="url(#animPhoneGoldText)"
                >
                  0320.4800071
                </text>
              </motion.g>
            </svg>

            {/* Hairline 2-Second Progress Line */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="w-32 h-[2px] bg-slate-200/90 rounded-full overflow-hidden mt-4"
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
