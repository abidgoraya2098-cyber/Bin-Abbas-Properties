import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Building, ShieldCheck, ArrowRight, Phone, CheckCircle2, Star, Layers, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { BUSINESS_NAME, ENGLISH_NAME, LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH, CONTACT_PHONE_DISPLAY, OWNER_NAME, ADDRESS } from "../data";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number; // in milliseconds (default: 10000ms = 10s)
}

export default function SplashScreen({ onFinish, duration = 10000 }: SplashScreenProps) {
  const { isUrdu } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(Math.ceil(duration / 1000));
  const [phase, setPhase] = useState<number>(1); // 1 to 4 animation phases

  useEffect(() => {
    // 10s Countdown Timer
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Dynamic animation stages throughout the 10 seconds
    const phase2Timer = setTimeout(() => setPhase(2), 2500);
    const phase3Timer = setTimeout(() => setPhase(3), 5500);
    const phase4Timer = setTimeout(() => setPhase(4), 8000);

    // Auto close at 10s
    const mainTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(phase4Timer);
      clearTimeout(mainTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onFinish) {
      setTimeout(onFinish, 450); // wait for smooth exit transition
    }
  };

  // Phase subtitle messages in Urdu & English
  const phaseMessagesUrdu = [
    "خوش آمدید! بن عباس پراپرٹیز",
    "رائل پام سٹی کا سب سے بااعتماد اور تصدیق شدہ ادارہ",
    "پلاٹس کی فوری خرید و فروخت اور محفوظ ترین سرمایہ کاری",
    "ایپ کا ہوم پیج کھل رہا ہے..."
  ];

  const phaseMessagesEnglish = [
    "Welcome to Bin Abbas Properties!",
    "Your Most Trusted Real Estate Partner in Royal Palm City",
    "Verified Plots Buying, Selling & High-Yield Investments",
    "Opening Main Application..."
  ];

  const currentPhaseMessage = isUrdu 
    ? phaseMessagesUrdu[phase - 1] 
    : phaseMessagesEnglish[phase - 1];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cinematic-10s-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#031d11] via-[#073620] to-[#02130a] text-white select-none overflow-hidden touch-manipulation"
          id="app-cinematic-intro"
        >
          {/* 🌟 1. Dynamic Ambient Lighting & Floating Gold Particle Rays */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Top Gold Radial Beam */}
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.35, 0.65, 0.35],
                rotate: [0, 45, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-amber-400/25 rounded-full blur-[110px]"
            />
            {/* Center Emerald Luminous Aura */}
            <motion.div 
              animate={{ 
                scale: [0.9, 1.25, 0.9],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 w-88 h-88 bg-emerald-400/25 rounded-full blur-[100px]"
            />
            {/* Bottom Warm Gold Reflection */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px]" />
          </div>

          {/* 🌟 2. Top Header Bar: Countdown & Skip Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="z-20 w-full max-w-[420px] flex items-center justify-between pt-2 px-1"
          >
            {/* Live Countdown Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-amber-400/50 text-amber-300 shadow-md backdrop-blur-md text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>{timeLeft}s</span>
              <span className="text-[10px] text-emerald-200/80 font-bold">
                {isUrdu ? "اینیمیشن" : "Intro"}
              </span>
            </div>

            {/* Skip / Enter Directly Button */}
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg border border-amber-300 active:scale-95 hover:brightness-110 cursor-pointer transition-all"
            >
              <span>{isUrdu ? "ایپ کھولیں" : "Open App"}</span>
              <ArrowRight size={13} className={isUrdu ? "rotate-180" : ""} />
            </button>
          </motion.div>

          {/* 🌟 3. Center: 10-Second 3D Animated Logo Master Showcase */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-[380px] px-2 text-center">
            
            {/* Multi-Layered Pulsating Golden Orbit Rings */}
            <motion.div
              animate={{ 
                scale: [0.9, 1.12, 0.9],
                rotate: 360,
                opacity: [0.4, 0.85, 0.4]
              }}
              transition={{ 
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-amber-400/40 shadow-[0_0_60px_rgba(245,206,94,0.3)] pointer-events-none"
            />

            <motion.div
              animate={{ 
                scale: [1.1, 0.95, 1.1],
                rotate: -360,
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                rotate: { duration: 16, repeat: Infinity, ease: "linear" },
                scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-emerald-400/30 pointer-events-none"
            />

            {/* 🌟 THE 3D MASTER LOGO PLAQUE WITH CONTINUOUS 3D TILT & SHIMMER */}
            <motion.div
              initial={{ scale: 0.2, y: 40, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: [0, -6, 0],
                opacity: 1
              }}
              transition={{ 
                scale: { type: "spring", stiffness: 220, damping: 18, duration: 1 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
              className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl p-1.5 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex items-center justify-center mb-4 cursor-pointer"
              onClick={handleClose}
            >
              {/* Inner Plaque Layer */}
              <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#ffffff] via-[#f5fbf7] to-[#d3f0de] flex items-center justify-center p-2 overflow-hidden shadow-inner relative">
                
                {/* 3D Master PNG Logo */}
                <img 
                  src="/Bin-Abbas-Properties-Logo.png" 
                  alt="Bin Abbas Properties Master 3D Logo"
                  className="w-full h-full object-contain drop-shadow-md select-none"
                />

                {/* Multiple Continuous Shimmer Light Beams Sweeping Across */}
                <motion.div
                  animate={{ 
                    x: ["-180%", "240%"],
                    opacity: [0, 0.9, 0]
                  }}
                  transition={{ 
                    duration: 2.2, 
                    repeat: Infinity, 
                    repeatDelay: 1.2,
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/85 to-transparent skew-x-12 pointer-events-none"
                />
              </div>

              {/* Glowing Corner Accents */}
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047]"></div>
              <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047]"></div>
            </motion.div>

            {/* 🌟 ANIMATED BRAND TYPOGRAPHY */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-1"
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 drop-shadow-[0_2px_12px_rgba(245,206,94,0.4)]">
                {isUrdu ? BUSINESS_NAME : ENGLISH_NAME}
              </h1>

              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black tracking-widest text-emerald-200 uppercase">
                <Building size={14} className="text-amber-400" />
                <span>{isUrdu ? "BIN ABBAS PROPERTIES" : "REAL ESTATE & BUILDERS"}</span>
              </div>
            </motion.div>

            {/* 🌟 3D Embossed Mobile Phone Plaque Animation (Phase 3 highlight) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-2.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl border border-amber-200"
            >
              <Phone size={13} className="text-emerald-950 fill-emerald-950" />
              <span className="font-sans font-black tracking-wider">{CONTACT_PHONE_DISPLAY}</span>
            </motion.div>

            {/* Dynamic Stage Info Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`phase-msg-${phase}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-amber-200/90 font-bold mt-2.5 h-6 flex items-center justify-center gap-1"
              >
                <Sparkles size={12} className="text-amber-400" />
                <span>{currentPhaseMessage}</span>
              </motion.p>
            </AnimatePresence>
          </div>

          {/* 🌟 4. Bottom Section: 10-Second Progress Bar & Phase Steppers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="z-20 w-full max-w-[340px] flex flex-col items-center gap-2 pb-3"
          >
            {/* 10-Second Smooth Linear Golden Progress Bar */}
            <div className="w-full h-2 bg-emerald-950/90 rounded-full overflow-hidden border border-amber-400/40 shadow-inner p-0.5">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-[0_0_12px_#f5ce5e]"
              />
            </div>

            {/* Bottom Location & CEO Info */}
            <div className="flex items-center justify-between w-full text-[11px] text-emerald-200/90 font-bold px-1 mt-0.5">
              <span className="flex items-center gap-1 text-amber-300 font-black">
                <MapPin size={12} className="text-emerald-400" />
                <span>{isUrdu ? "رائل پام سٹی، گوجرانوالہ" : "Royal Palm City"}</span>
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
