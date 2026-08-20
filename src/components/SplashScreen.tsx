import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_NAME, ENGLISH_NAME, LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH, CONTACT_PHONE_DISPLAY } from "../data";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // 2.5 seconds (2500ms)
}

// 🔊 Premium Soft Velvet Bell Chime (Web Audio API)
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

export default function SplashScreen({ onFinish, duration = 2500 }: SplashScreenProps) {
  const { isUrdu } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  // 12 Animated Floating Gold Particles
  const particles = [
    { id: 1, x: "20%", y: "30%", size: 4, delay: 0.1, duration: 2.2 },
    { id: 2, x: "75%", y: "25%", size: 6, delay: 0.3, duration: 2.5 },
    { id: 3, x: "15%", y: "65%", size: 5, delay: 0.2, duration: 2.1 },
    { id: 4, x: "82%", y: "60%", size: 4, delay: 0.4, duration: 2.4 },
    { id: 5, x: "30%", y: "18%", size: 5, delay: 0.5, duration: 2.6 },
    { id: 6, x: "70%", y: "15%", size: 3, delay: 0.2, duration: 2.3 },
    { id: 7, x: "25%", y: "80%", size: 4, delay: 0.6, duration: 2.0 },
    { id: 8, x: "80%", y: "78%", size: 5, delay: 0.3, duration: 2.5 },
    { id: 9, x: "50%", y: "12%", size: 6, delay: 0.1, duration: 2.7 },
    { id: 10, x: "10%", y: "45%", size: 3, delay: 0.4, duration: 2.2 },
    { id: 11, x: "90%", y: "40%", size: 4, delay: 0.5, duration: 2.4 },
    { id: 12, x: "50%", y: "85%", size: 5, delay: 0.2, duration: 2.3 },
  ];

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
      setTimeout(onFinish, 300);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="clean-4k-video-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(5px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleClose}
          className="fixed inset-0 z-[99999] w-screen h-screen flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#f0f9f4] via-[#e6f4ec] to-[#d8ece0] text-slate-900 select-none overflow-hidden cursor-pointer touch-manipulation"
          id="clean-4k-splash-screen"
        >
          {/* 🌟 1. MINIMAL PASTEL MINT-GREEN BACKGROUND WITH DYNAMIC GOLD PARTICLE GLOW */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top Amber-Gold Radial Light */}
            <motion.div 
              animate={{ 
                scale: [1, 1.18, 1],
                opacity: [0.3, 0.55, 0.3]
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-36 left-1/2 -translate-x-1/2 w-[580px] h-[580px] bg-amber-300/30 rounded-full blur-[130px]" 
            />
            {/* Bottom Mint-Emerald Ambient Glow */}
            <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[580px] h-[580px] bg-emerald-400/25 rounded-full blur-[130px]" />

            {/* 🌟 Floating Gold Sparkle Particles */}
            {particles.map((p) => (
              <motion.div
                key={`particle-${p.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: [0.2, 0.85, 0.2],
                  y: [-5, -25, -5],
                  scale: [1, 1.25, 1]
                }}
                transition={{ 
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut"
                }}
                style={{
                  left: p.x,
                  top: p.y,
                  width: `${p.size}px`,
                  height: `${p.size}px`
                }}
                className="absolute rounded-full bg-gradient-to-r from-amber-300 to-amber-500 shadow-[0_0_8px_#fde047] pointer-events-none"
              />
            ))}
          </div>

          {/* Top Safe Area Spacing */}
          <div className="w-full h-2"></div>

          {/* 🌟 2. 4K RESOLUTION CENTERED GOLDEN ARCH LOGO OF 'BIN ABBAS PROPERTIES' WITH MODERN BUILDINGS INSIDE */}
          <motion.div 
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[420px] sm:max-w-[460px] flex flex-col items-center justify-center my-auto px-2"
          >
            <svg 
              viewBox="0 0 600 520" 
              className="w-full h-auto max-h-[75vh] filter drop-shadow-[0_20px_40px_rgba(10,50,30,0.16)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 3D Metallic Champagne Gold Gradient */}
                <linearGradient id="vidGold3D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="18%" stopColor="#fff1b3" />
                  <stop offset="45%" stopColor="#f5d061" />
                  <stop offset="70%" stopColor="#c9971e" />
                  <stop offset="90%" stopColor="#8a600a" />
                  <stop offset="100%" stopColor="#ffe699" />
                </linearGradient>

                <linearGradient id="vidGoldBevel" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#ffea9f" />
                  <stop offset="70%" stopColor="#c59828" />
                  <stop offset="100%" stopColor="#734f07" />
                </linearGradient>

                {/* Modern Building Facets */}
                <linearGradient id="vidBldgFront" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f4fbf7" />
                  <stop offset="100%" stopColor="#dcf0e4" />
                </linearGradient>

                <linearGradient id="vidGoldSide" x1="0%" y1="0%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#b88318" />
                  <stop offset="50%" stopColor="#785308" />
                  <stop offset="100%" stopColor="#452c02" />
                </linearGradient>

                {/* Contact Badge Gradients */}
                <linearGradient id="vidBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#fff6c8" />
                  <stop offset="60%" stopColor="#e5b236" />
                  <stop offset="90%" stopColor="#ab7b10" />
                  <stop offset="100%" stopColor="#f8d66e" />
                </linearGradient>

                <linearGradient id="vidBadgeInner" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0a4d30" />
                  <stop offset="50%" stopColor="#063822" />
                  <stop offset="100%" stopColor="#032415" />
                </linearGradient>

                <linearGradient id="vidPhoneGoldText" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fff3b8" />
                  <stop offset="70%" stopColor="#eec34b" />
                  <stop offset="100%" stopColor="#bc8a15" />
                </linearGradient>

                <filter id="vidDropShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0a4328" floodOpacity="0.2" />
                </filter>
              </defs>

              {/* 🌟 1. CENTERED GOLDEN ARCH LOGO WITH MODERN BUILDINGS INSIDE */}
              <g filter="url(#vidDropShadow)" transform="translate(300, 120) scale(0.55)">
                
                {/* Metallic Golden Arch */}
                <motion.path 
                  d="M -150 145 V -15 C -150 -105, -90 -175, 0 -205 C 90 -175, 150 -105, 150 -15 V 145 L 120 145 V -15 C 120 -90, 65 -150, 0 -175 C -65 -150, -120 -90, -120 -15 V 145 Z" 
                  fill="url(#vidGold3D)"
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Arch Inner Golden Bevel Trim */}
                <motion.path 
                  d="M -105 145 V -12 C -105 -72, -55 -128, 0 -152 C 55 -128, 105 -72, 105 -12 V 145" 
                  fill="none" 
                  stroke="url(#vidGoldBevel)" 
                  strokeWidth="4.5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                />

                {/* Left Skyscraper Tower */}
                <motion.g
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <polygon points="-100,135 -100,-35 -48,-78 -48,135" fill="url(#vidBldgFront)" />
                  <polygon points="-48,-78 -26,-62 -26,135 -48,135" fill="url(#vidGoldSide)" />
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

                {/* Center Grand Skyscraper Tower */}
                <motion.g
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <polygon points="-22,135 -22,-120 22,-162 25,-158 25,135" fill="url(#vidBldgFront)" />
                  <polygon points="25,-158 54,-135 54,135 25,135" fill="url(#vidGoldSide)" />
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

                {/* Right Tower */}
                <motion.g
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <polygon points="60,135 60,-60 105,-34 105,135" fill="url(#vidGold3D)" />
                  <polygon points="105,-34 118,-24 118,135 105,135" fill="url(#vidGoldSide)" />
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
                  <path d="M -65 145 C -65 75, 65 75, 65 145 Z" fill="url(#vidGold3D)" />
                  <path d="M -50 145 C -50 88, 50 88, 50 145 Z" fill="none" stroke="url(#vidGoldBevel)" strokeWidth="2.5" opacity="0.85" />
                  <path d="M 0 75 V 46" stroke="url(#vidGold3D)" strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="0" cy="42" r="4" fill="#ffffff" />
                </motion.g>

                {/* Base Curved Platform */}
                <motion.path 
                  d="M -195 158 Q 0 132 195 158" 
                  fill="none" 
                  stroke="url(#vidGold3D)" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                />
              </g>

              {/* 🌟 2. 'BIN ABBAS PROPERTIES' BRAND TYPOGRAPHY */}
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <text 
                  x="300" 
                  y="250" 
                  textAnchor="middle" 
                  fontFamily="'Cinzel', 'Georgia', serif" 
                  fontSize="34" 
                  fontWeight="900" 
                  letterSpacing="4.5"
                  fill="#0a4d30"
                >
                  BIN ABBAS
                </text>

                <text 
                  x="300" 
                  y="280" 
                  textAnchor="middle" 
                  fontFamily="'Segoe UI', -apple-system, sans-serif" 
                  fontSize="15" 
                  fontWeight="800" 
                  letterSpacing="10"
                  fill="#b88318"
                >
                  PROPERTIES
                </text>
              </motion.g>

              {/* 🌟 3. URDU CALLIGRAPHY: بن عباس پراپرٹیز */}
              <motion.text 
                x="300" 
                y="336" 
                textAnchor="middle" 
                fontFamily="'Noto Sans Arabic', 'Jameel Noori Nastaleeq', serif" 
                fontSize="36" 
                fontWeight="900"
                fill="#073d25"
                direction="rtl"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                بن عباس پراپرٹیز
              </motion.text>

              {/* 🌟 4. ADDRESS: رائل پام سٹی، گوجرانوالہ */}
              <motion.text 
                x="300" 
                y="370" 
                textAnchor="middle" 
                fontFamily="'Noto Sans Arabic', sans-serif" 
                fontSize="16" 
                fontWeight="bold"
                fill="#7a5509"
                direction="rtl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.65 }}
              >
                رائل پام سٹی، گوجرانوالہ
              </motion.text>

              {/* 🌟 5. PROMINENTLY & CLEARLY DISPLAYED CONTACT NUMBER: 03204800071 */}
              <motion.g 
                transform="translate(300, 436)"
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Outer 3D Gold Rim Plaque */}
                <rect 
                  x="-185" 
                  y="-25" 
                  width="370" 
                  height="50" 
                  rx="25" 
                  fill="url(#vidBadgeGrad)" 
                  stroke="url(#vidGold3D)" 
                  strokeWidth="2" 
                />
                
                {/* Inner Royal Deep Emerald Inset */}
                <rect 
                  x="-181" 
                  y="-21" 
                  width="362" 
                  height="42" 
                  rx="21" 
                  fill="url(#vidBadgeInner)" 
                  stroke="#c59828" 
                  strokeWidth="1.2" 
                />

                {/* 3D Phone Icon */}
                <g transform="translate(-140, 0) scale(0.85)">
                  <circle cx="0" cy="0" r="14" fill="url(#vidGold3D)" />
                  <path 
                    d="M -5 -6 C -6 -5, -6 -3, -4 0 C -2 3, 0 5, 3 6 C 5 7, 7 6, 8 4 L 6.5 2 C 6 1.5, 5 1.5, 4.5 2 L 3.5 2.8 C 2.5 2.2, 1.8 1.5, 1.2 0.5 L 2 -0.5 C 2.5 -1, 2.5 -2, 2 -2.5 L 0 -4.5 C -0.5 -5, -1.5 -5, -2 -4.5 Z" 
                    fill="#042617" 
                  />
                </g>

                {/* Prominently & Clearly Displayed Contact Number */}
                <text 
                  x="14" 
                  y="8" 
                  textAnchor="middle" 
                  fontFamily="'Trebuchet MS', 'Arial Black', sans-serif" 
                  fontSize="24" 
                  fontWeight="900" 
                  letterSpacing="3"
                  fill="url(#vidPhoneGoldText)"
                >
                  03204800071
                </text>
              </motion.g>

              {/* Bottom Decorative Golden Arc */}
              <path d="M 180 488 Q 300 478 420 488" fill="none" stroke="url(#vidGold3D)" strokeWidth="2" opacity="0.85" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Bottom Minimalist 2.5-Second Hairline Progress Line */}
          <div className="relative z-10 w-full flex flex-col items-center pb-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="w-36 h-[2.5px] bg-emerald-200/80 rounded-full overflow-hidden shadow-inner"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600 shadow-[0_0_8px_#f5ce5e]"
              />
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
