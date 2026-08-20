import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Share2, Check, Download, CheckCircle2, Globe, ShieldCheck, Lock, Bell, Video, PlusCircle } from "lucide-react";
import { LOCATION_TAGLINE, LOCATION_TAGLINE_ENGLISH, ADDRESS, ADDRESS_ENGLISH, GOOGLE_MAPS_URL } from "../data";
import BinAbbasLogo from "./BinAbbasLogo";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";
import { useNotifications } from "../context/NotificationContext";
import { usePromoAds } from "../context/PromoAdContext";
import { getTranslation } from "../i18n";

export default function Header() {
  const { language, isUrdu, toggleLanguage } = useLanguage();
  const { isAdmin, setIsLoginModalOpen } = useAdmin();
  const { unreadCount, setIsNotificationModalOpen, adminUnreadInquiriesCount, setIsAdminInboxOpen } = useNotifications();
  const { hasUnseenNewAd } = usePromoAds();
  const t = getTranslation(language);

  const totalUnreadCount = unreadCount + (hasUnseenNewAd ? 1 : 0);

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
    const shareText = isUrdu
      ? `السلام علیکم!\n\nبن عباس پراپرٹیز - BIN ABBAS PROPERTIES (${LOCATION_TAGLINE})\n\nرائل پام سٹی گوجرانوالہ میں پلاٹ کی خرید و فروخت، تازہ ترین ریٹ لسٹ اور فوری معلومات حاصل کرنے کے لیے نیچے دیے گئے لنک پر کلک کریں:\n\nشناخت: binabbasproperties\nلنک: ${window.location.href}`
      : `Hello!\n\nBIN ABBAS PROPERTIES (${LOCATION_TAGLINE_ENGLISH})\n\nClick the link below for buying, selling, latest price lists and real estate consultations in Royal Palm City Gujranwala:\n\nLink: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: isUrdu ? `بن عباس پراپرٹیز - BIN ABBAS PROPERTIES` : `BIN ABBAS PROPERTIES - Royal Palm City`,
          text: shareText,
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

        {/* Action Buttons: Left Controls (Language + Notifications + Create Ad) & Right Controls (Install, Share, Admin) */}
        <div className="w-full flex flex-wrap items-center justify-between z-20 mb-2 gap-1.5">
          {/* Left Cluster: Quick Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* 1. 🌐 Bilingual Language Switcher Button (Urdu <-> English) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              id="header-language-toggle-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs border border-amber-400/70 shadow-xs transition-all cursor-pointer select-none"
              title={isUrdu ? "Switch App to English" : "ایپ کو اردو میں تبدیل کریں"}
              aria-label="Language Switcher"
            >
              <Globe size={13} className="text-emerald-700 shrink-0" />
              <span className="font-sans font-black tracking-wide leading-none">{t.langToggle}</span>
            </motion.button>

            {/* 2. 🔔 Notification Bell Button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              id="notification-bell-btn"
              onClick={() => setIsNotificationModalOpen(true)}
              className="p-2 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-950 border border-amber-400/60 shadow-xs transition-all cursor-pointer relative focus:outline-none"
              title={isUrdu ? "نوٹیفکیشنز دیکھیں" : "Notifications"}
              aria-label="Notifications"
            >
              <Bell size={15} />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm animate-bounce">
                  {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                </span>
              )}
            </motion.button>

            {/* 👑 3. ➕ Create Ad / Admin Ads Button (Highly Visible Gold Button) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="header-create-ad-btn"
              onClick={() => {
                if (isAdmin) {
                  setIsAdminInboxOpen(true);
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs shadow-md border border-amber-500 hover:brightness-105 transition-all cursor-pointer"
              title={isUrdu ? "ویڈیو یا تصویر ایڈ لگائیں" : "Create Video / Photo Ad"}
              aria-label="Create Ad"
            >
              <Video size={13} className="text-slate-950" />
              <span className="font-black tracking-tight">{isUrdu ? "➕ ایڈ لگائیں" : "➕ Create Ad"}</span>
            </motion.button>
          </div>

          {/* Right Cluster: Actions & Owner Portal */}
          <div className="flex items-center gap-1.5">
            {/* 3. Install Button (Hidden when standalone) */}
            {!isStandalone && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                id="header-install-btn"
                onClick={handleInstallClick}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white font-black text-[11px] shadow-xs border border-amber-300 transition-all cursor-pointer hover:brightness-110"
              >
                <Download size={12} className="text-amber-300 animate-bounce" />
                <span>{t.installApp}</span>
              </motion.button>
            )}

            {/* 4. Share Button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              id="share-button"
              onClick={handleShare}
              className="p-2 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 hover:text-emerald-950 border border-amber-400/60 shadow-xs transition-all cursor-pointer focus:outline-none"
              title={t.shareApp}
              aria-label={t.shareApp}
            >
              {copied ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 px-0.5">
                  <Check size={14} />
                  <span>{t.copied}</span>
                </span>
              ) : (
                <Share2 size={15} />
              )}
            </motion.button>

            {/* 5. Admin / Owner Portal Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              id="admin-login-header-btn"
              onClick={() => setIsLoginModalOpen(true)}
              className={`p-2 rounded-full border shadow-xs transition-all cursor-pointer relative focus:outline-none ${
                isAdmin
                  ? "bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-300"
                  : "bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-amber-300"
              }`}
              title={isAdmin ? (isUrdu ? "👑 ایڈمن موڈ فعال ہے" : "👑 Admin Mode Active") : (isUrdu ? "مالک / ایڈمن لاگ ان" : "Owner / Admin Login")}
              aria-label="Admin Login"
            >
              <ShieldCheck size={15} className={isAdmin ? "text-slate-950" : "text-amber-700"} />
              {isAdmin && adminUnreadInquiriesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                  {adminUnreadInquiriesCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Main Logo Component (Official 3D Brand Logo) */}
        <BinAbbasLogo className="w-full max-w-[290px] sm:max-w-[310px] my-1" />

        {/* Location / Address Card */}
        <a 
          id="address-card"
          href={GOOGLE_MAPS_URL}
          onClick={(e) => {
            e.preventDefault();
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
            const mapsTarget = isIOS 
              ? `https://maps.apple.com/?q=Palm+Commercial+Royal+Palm+City+Gujranwala` 
              : GOOGLE_MAPS_URL;
            window.open(mapsTarget, "_blank", "noopener,noreferrer") || (window.location.href = mapsTarget);
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs mt-2.5 flex items-center justify-center gap-2.5 bg-white/95 hover:bg-emerald-50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-emerald-200 text-center shadow-sm transition-all cursor-pointer group"
          title="Google Maps: Bin Abbas Properties"
        >
          <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-700 shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
            <MapPin size={14} />
          </div>
          <div className="flex flex-col text-center">
            <span className="text-xs text-emerald-950 font-black leading-tight">
              {isUrdu ? "بن عباس پراپرٹیز" : "BIN ABBAS PROPERTIES"}
            </span>
            <span className="text-[10.5px] text-slate-700 font-bold leading-tight mt-0.5">
              {isUrdu ? "رائل پام سٹی، گوجرانوالہ (پام کمرشل 235)" : "Royal Palm City, Gujranwala (Palm Commercial 235)"}
            </span>
          </div>
        </a>

      </div>
    </motion.div>
  );
}
