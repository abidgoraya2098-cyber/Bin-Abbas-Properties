import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Building, ShieldCheck, ArrowRight, Phone, CheckCircle2, Star, Layers, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_NAME, ENGLISH_NAME, LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH, CONTACT_PHONE_DISPLAY, OWNER_NAME, ADDRESS } from "../data";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // in milliseconds (default: 4200ms = ~4.2 seconds)
}

// 🔔 Soft UI Notification Chime (High-End Crystalline Chime using Web Audio API)
function playSoftNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    
    const now = ctx.currentTime;
    // Gentle melodic harmonic triad (D5 -> A5 -> D6) with soft exponential decay
    const notes = [587.33, 880, 1174.66];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      
      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.07 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.75);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.8);
    });
  } catch (err) {
    // Silently continue if autoplay audio policy is restricted
  }
}

export default function SplashScreen({ onFinish, duration = 4200 }: SplashScreenProps) {
  const { isUrdu } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  // 4 Rotating Welcome Tips / Instructions (باری باری تبدیل ہونے والے 4 مفید پیغامات)
  const rotatingTipsUrdu = [
    "✨ خوش آمدید! بن عباس پراپرٹیز — رائل پام سٹی، گوجرانوالہ",
    "🏡 5، 10 مرلہ، 1 و 2 کنال رہائشی اور کمرشل پلاٹس کی تصدیق شدہ خرید و فروخت",
    "📊 روزانہ کے تازہ ترین ریٹس، فائل ٹرانسفر اور فوری انکوائری کی سہولت",
    "📞 رابطہ و رہنمائی: 0320.4800071 (فریاد حسن گورائیہ)"
  ];

  const rotatingTipsEnglish = [
    "✨ Welcome to Bin Abbas Properties — Royal Palm City, Gujranwala",
    "🏡 Verified 5, 10 Marla, 1 & 2 Kanal Residential & Commercial Plots",
    "📊 Live Market Rates, Transparent File Transfers & Direct Plot Inquiries",
    "📞 Direct Call & WhatsApp: 0320.4800071 (Faryad Hassan Goraya)"
  ];

  const currentTips = isUrdu ? rotatingTipsUrdu : rotatingTipsEnglish;

  useEffect(() => {
    // 1. Play Soft Professional UI Notification Sound
    playSoftNotificationChime();

    // 2. Rotate through the 4 tips during the 4.2s duration (approx ~1s each)
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % currentTips.length);
    }, duration / 4);

    // 3. Smooth Fade Out & Transition directly into main app
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearInterval(tipInterval);
      clearTimeout(closeTimer);
    };
  }, [duration, currentTips.length]);

  const handleClose = () => {
    setIsVisible(false);
    if (onFinish) {
      setTimeout(onFinish, 450); // wait for smooth exit transition
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="app-splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(5px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#031d11] via-[#073620] to-[#02130a] text-white select-none overflow-hidden touch-manipulation cursor-pointer"
          id="app-splash-screen-root"
        >
          {/* 🌟 1. Ambient Background Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.35, 0.55, 0.35]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-28 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/25 rounded-full blur-[100px]"
            />
            <motion.div 
              animate={{ 
                scale: [0.9, 1.15, 0.9],
                opacity: [0.25, 0.45, 0.25]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-400/20 rounded-full blur-[90px]"
            />
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-[110px]" />
          </div>

          {/* 🌟 2. Top Bar: Official Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="z-10 pt-2 flex items-center justify-between w-full max-w-[380px] px-1"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-900/80 border border-amber-400/40 text-amber-300 shadow-md backdrop-blur-md text-[11px] font-black">
              <Sparkles size={12} className="text-amber-400 animate-spin" style={{ animationDuration: "4s" }} />
              <span>{isUrdu ? "رائل پام سٹی، گوجرانوالہ" : "Royal Palm City, Gujranwala"}</span>
            </div>

            {/* Quick Skip Button */}
            <span className="text-[10px] text-amber-300/80 hover:text-amber-200 underline flex items-center gap-0.5 font-bold">
              <span>{isUrdu ? "ایپ کھولیں" : "Open App"}</span>
              <ArrowRight size={10} className={isUrdu ? "rotate-180" : ""} />
            </span>
          </motion.div>

          {/* 🌟 3. Center: Exactly Original Logo & Balanced Brand Name with Smooth Subtle Zoom/Pulse */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-[360px] px-2 text-center">
            
            {/* Pulsating Golden Halo Ring Behind Logo */}
            <motion.div
              animate={{ 
                scale: [0.95, 1.06, 0.95],
                opacity: [0.5, 0.85, 0.5]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-56 h-56 sm:w-60 sm:h-60 rounded-full border-2 border-amber-400/40 shadow-[0_0_45px_rgba(245,206,94,0.3)] pointer-events-none"
            />

            {/* Original Master 3D Logo (Smooth Subtle Zoom-in & Pulse Effect) */}
            <motion.div
              initial={{ scale: 0.65, opacity: 0, y: 20 }}
              animate={{ 
                scale: [0.98, 1.03, 0.98],
                opacity: 1,
                y: 0 
              }}
              transition={{ 
                scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.6 },
                y: { duration: 0.6 }
              }}
              className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-3xl p-1 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-[0_20px_50px_rgba(0,0,0,0.65)] flex items-center justify-center mb-3.5"
            >
              {/* Inner Plaque Layer */}
              <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#ffffff] via-[#f5fbf7] to-[#d6f0e0] flex items-center justify-center p-2 overflow-hidden shadow-inner relative">
                <img 
                  src="/Bin-Abbas-Properties-Logo.png" 
                  alt="Bin Abbas Properties Official Logo"
                  className="w-full h-full object-contain drop-shadow-md select-none"
                />

                {/* Shimmer Light Reflection Sweep Across the Logo */}
                <motion.div
                  initial={{ x: "-150%", opacity: 0 }}
                  animate={{ x: "200%", opacity: [0, 0.85, 0] }}
                  transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/75 to-transparent skew-x-12 pointer-events-none"
                />
              </div>
            </motion.div>

            {/* Balanced Brand Name Under Logo */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-1"
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 drop-shadow-[0_2px_10px_rgba(245,206,94,0.35)]">
                {isUrdu ? BUSINESS_NAME : ENGLISH_NAME}
              </h1>

              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-bold tracking-widest text-emerald-200 uppercase">
                <Building size={13} className="text-amber-400" />
                <span>{isUrdu ? "BIN ABBAS PROPERTIES" : "REAL ESTATE & BUILDERS"}</span>
              </div>
            </motion.div>

            {/* Verified Phone Contact Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs shadow-md border border-amber-200"
            >
              <Phone size={12} className="text-emerald-950 fill-emerald-950" />
              <span className="font-sans font-black tracking-wider">{CONTACT_PHONE_DISPLAY}</span>
            </motion.div>
          </div>

          {/* 🌟 4. Bottom: 3 to 4 Rotating Useful Tips & Animated Loading Line (Progress Bar) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="z-10 w-full max-w-[340px] flex flex-col items-center gap-2 pb-2 text-center"
          >
            {/* Dynamic Rotating Tip / Welcome Message */}
            <div className="min-h-[38px] flex items-center justify-center px-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`splash-tip-${tipIndex}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-[11.5px] sm:text-xs text-amber-200 font-bold leading-snug drop-shadow-sm flex items-center justify-center gap-1"
                >
                  <span>{currentTips[tipIndex]}</span>
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Animated Golden Loading Line (Progress Bar) */}
            <div className="w-full h-1.5 bg-emerald-950/80 rounded-full overflow-hidden border border-amber-400/40 p-0.5 shadow-inner">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_10px_#f5ce5e]"
              />
            </div>

            {/* Bottom Footer Info */}
            <div className="flex items-center justify-between w-full text-[10.5px] text-emerald-200/80 font-bold px-1 mt-0.5">
              <span className="flex items-center gap-1 text-amber-300 font-black">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>{isUrdu ? "تصدیق شدہ ادارہ" : "Verified Agency"}</span>
              </span>

              <span className="text-emerald-100 font-bold">
                {isUrdu ? `سی ای او: ${OWNER_NAME}` : "CEO: Faryad Hassan Goraya"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
