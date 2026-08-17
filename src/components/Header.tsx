import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Share2, Check, Download, CheckCircle2 } from "lucide-react";
import { LOCATION_TAGLINE, ADDRESS, GOOGLE_MAPS_URL } from "../data";
import BinAbbasLogo from "./BinAbbasLogo";

export default function Header() {
  const [copied, setCopied] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      if (isStandaloneMode || isIOSStandalone) {
        setIsStandalone(true);
      }
    };
    checkStandalone();

    const handleInstalled = () => {
      setIsStandalone(true);
    };

    window.addEventListener("pwa-installed", handleInstalled);
    return () => {
      window.removeEventListener("pwa-installed", handleInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    const prompt = (window as any).deferredPrompt || (window as any).deferredPwaPrompt;

    if (prompt) {
      prompt.prompt();
      prompt.userChoice
        .then((choice: any) => {
          if (choice && choice.outcome === "accepted") {
            setIsStandalone(true);
          }
          (window as any).deferredPrompt = null;
          (window as any).deferredPwaPrompt = null;
        })
        .catch((err: any) => {
          console.warn("[PWA Install] Error prompt:", err);
        });
      return;
    }

    // In case of in-app browser (e.g. WhatsApp) -> open directly in Google Chrome
    const userAgent = window.navigator.userAgent.toLowerCase();
    const inAppRegex = /fban|fbav|instagram|snapchat|line\/|twitter|gsa\/|wv|micromessenger|whatsapp|bytedance|tiktok/i;
    if (inAppRegex.test(userAgent)) {
      const cleanUrl = window.location.href.replace(/^https?:\/\//, "");
      window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
      return;
    }

    // Fallback Chrome Intent for Android devices
    const cleanUrl = window.location.href.replace(/^https?:\/\//, "");
    window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  const handleShare = async () => {
    const shareText = `السلام علیکم!\n\nبن عباس پراپرٹیز - BIN ABBAS PROPERTIES (${LOCATION_TAGLINE})\n\nرائل پام سٹی گوجرانوالہ میں پلاٹ کی خرید و فروخت، تازہ ترین ریٹ لسٹ اور فوری معلومات حاصل کرنے کے لیے نیچے دیے گئے لنک پر کلک کریں:\n\nشناخت: binabbasproperties\nلنک: ${window.location.href}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `بن عباس پراپرٹیز - BIN ABBAS PROPERTIES`,
          text: `السلام علیکم!\n\nبن عباس پراپرٹیز - BIN ABBAS PROPERTIES (${LOCATION_TAGLINE})\n\nرائل پام سٹی گوجرانوالہ میں پلاٹ کی خرید و فروخت، تازہ ترین ریٹ لسٹ اور فوری معلومات حاصل کرنے کے لیے نیچے دیے گئے لنک پر کلک کریں:\n\nشناخت: binabbasproperties`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center text-center pb-1 w-full select-none"
      id="header-section"
    >
      {/* Top Banner Card with Luxury Light Green styling */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#eaf6f0] via-[#f4faf6] to-[#e4f3eb] rounded-3xl p-3.5 sm:p-4 border-2 border-amber-400/50 shadow-lg flex flex-col items-center justify-center">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Action Buttons: Install (Left) and Share (Right) */}
        <div className="w-full flex items-center justify-between z-20 mb-2">
          {/* 1. Install Button */}
          {!isStandalone ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              id="header-install-btn"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white font-black text-xs shadow-md border border-emerald-400 transition-all cursor-pointer hover:brightness-110"
            >
              <Download size={14} className="text-white animate-bounce" />
              <span>ایپ انسٹال کریں</span>
            </motion.button>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white/90 px-3 py-1 rounded-full border border-emerald-300 shadow-sm">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>ایپ انسٹال ہے</span>
            </span>
          )}

          {/* 2. Share Button */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            id="share-button"
            onClick={handleShare}
            className="p-2 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-950 border border-amber-400/50 shadow-sm transition-all cursor-pointer focus:outline-none"
            title="شیئر کریں"
            aria-label="ایپ شیئر کریں"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 px-1">
                <Check size={14} />
                <span>کاپی ہو گیا!</span>
              </span>
            ) : (
              <Share2 size={15} />
            )}
          </motion.button>
        </div>

        {/* Main Logo Component (Ultra-HD Guaranteed Non-Clipping) */}
        <BinAbbasLogo className="w-full max-w-[290px] sm:max-w-[310px] my-1" />

        {/* Location / Address Card (Clickable to Google Maps Bin Abbas Properties) */}
        <a 
          id="address-card"
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs mt-2.5 flex items-center justify-center gap-2.5 bg-white/95 hover:bg-emerald-50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-emerald-200 text-center shadow-sm transition-all cursor-pointer group"
          title="گوگل میپس پر بن عباس پراپرٹیز، رائل پام سٹی گوجرانوالہ کی لوکیشن اور راستہ دیکھیں"
        >
          <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700 shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
            <MapPin size={14} />
          </div>
          <div className="flex flex-col text-center">
            <span className="text-xs text-emerald-950 font-black leading-tight">
              بن عباس پراپرٹیز
            </span>
            <span className="text-[10.5px] text-slate-700 font-bold leading-tight mt-0.5">
              رائل پام سٹی، گوجرانوالہ (پام کمرشل 235)
            </span>
          </div>
        </a>

      </div>
    </motion.div>
  );
}
