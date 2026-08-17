import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Star, WifiOff, RefreshCw, CheckCircle2, Info, X, Smartphone, Globe, Sparkles } from "lucide-react";
import { BUSINESS_NAME } from "../data";
import BinAbbasLogo from "./BinAbbasLogo";

interface InstallAppProps {
  externalModalOpen?: boolean;
  onCloseExternalModal?: () => void;
}

export default function InstallApp({ externalModalOpen = false, onCloseExternalModal }: InstallAppProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showBottomPopupToast, setShowBottomPopupToast] = useState(false);

  // Sync external modal trigger if opened from floating bottom bar
  useEffect(() => {
    if (externalModalOpen) {
      handleDirectInstall();
    }
  }, [externalModalOpen]);

  const handleCloseModal = () => {
    setShowInstallModal(false);
    if (onCloseExternalModal) onCloseExternalModal();
  };

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    // Detect In-App Browsers (WhatsApp, Facebook, Instagram, LinkedIn, Line, Telegram, WeChat, TikTok)
    const inAppRegex = /fban|fbav|instagram|snapchat|line\/|twitter|gsa\/|wv|micromessenger|whatsapp|bytedance|tiktok/i;
    if (inAppRegex.test(userAgent)) {
      setIsInAppBrowser(true);
    }

    // Detect iOS (iPhone / iPad)
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIosDevice);

    // Check if prompt was captured globally
    const syncPrompt = () => {
      const p = (window as any).deferredPwaPrompt;
      if (p) {
        setDeferredPrompt(p);
      }
    };
    syncPrompt();

    // Check standalone PWA mode
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      if (isStandaloneMode || isIOSStandalone) {
        setIsStandalone(true);
      }
    };
    checkStandalone();

    // Show bottom pop-up banner after 1.5 seconds if not already installed
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setShowBottomPopupToast(true);
      }
    }, 1500);

    const handleBeforeInstallPrompt = (e: Event) => {
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
      setShowBottomPopupToast(true);
      console.log("Captured beforeinstallprompt event inside React");
    };

    const handlePromptReady = (e: any) => {
      if (e?.detail) {
        setDeferredPrompt(e.detail);
      } else {
        syncPrompt();
      }
      setShowBottomPopupToast(true);
    };

    const handleAppInstalled = () => {
      console.log("App was installed successfully!");
      setIsStandalone(true);
      setShowBottomPopupToast(false);
      handleCloseModal();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("pwapromptready", handlePromptReady);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("pwapromptready", handlePromptReady);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Main Direct Install Trigger (Triggers Google Chrome's Native Dialog)
  const handleDirectInstall = () => {
    const activePrompt = (window as any).deferredPwaPrompt || deferredPrompt;

    if (isInAppBrowser) {
      handleOpenInChrome();
      return;
    }

    if (activePrompt) {
      setIsInstalling(true);
      try {
        activePrompt.prompt();
        activePrompt.userChoice
          .then((choiceResult: any) => {
            if (choiceResult && choiceResult.outcome === "accepted") {
              setIsStandalone(true);
              setShowBottomPopupToast(false);
              handleCloseModal();
            }
            setDeferredPrompt(null);
            (window as any).deferredPwaPrompt = null;
            setIsInstalling(false);
          })
          .catch(() => {
            setIsInstalling(false);
            setShowInstallModal(true);
          });
        return;
      } catch (err) {
        setIsInstalling(false);
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleOpenInChrome = () => {
    const cleanUrl = window.location.href.replace(/^https?:\/\//, "");
    const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intentUrl;
  };

  // 1. If Offline
  if (!isOnline) {
    return (
      <div className="w-full mt-3 animate-pulse" id="pwa-offline-container">
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between gap-2 text-right">
          <div className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">آف لائن موڈ</h4>
              <p className="text-[10px] text-amber-800">تازہ ریٹس کے لیے انٹرنیٹ درکار ہے۔</p>
            </div>
          </div>
          <button
            onClick={() => setIsOnline(navigator.onLine)}
            className="bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={10} className="animate-spin" />
            <span>ری لوڈ</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. If already installed in standalone mode
  if (isStandalone) {
    return (
      <div className="w-full mt-3" id="pwa-installed-success">
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 text-center flex items-center justify-center gap-2 text-emerald-900 text-xs font-bold shadow-sm">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Real Estate ایپ کامیابی سے انسٹال ہے! (Installed)</span>
        </div>
      </div>
    );
  }

  const activePrompt = (window as any).deferredPwaPrompt || deferredPrompt;

  return (
    <div className="w-full mt-3.5" id="pwa-install-container">
      {/* WhatsApp In-App Browser Warning Alert */}
      {isInAppBrowser && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-right flex items-center justify-between gap-2 shadow-sm"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Info size={16} className="text-amber-600 shrink-0" />
            <p className="text-[10px] sm:text-[11px] font-bold text-amber-950 leading-tight truncate">
              براہِ راست انسٹال کرنے کے لیے گوگل کروم میں کھولیں
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenInChrome}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
          >
            <Globe size={11} />
            <span>کروم میں کھولیں</span>
          </button>
        </motion.div>
      )}

      {/* Main Play Store Style Install Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#063321] via-[#09472e] to-[#063321] border-2 border-amber-400/50 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2 shadow-md hover:border-amber-400 transition-all duration-300 text-white"
        id="playstore-banner"
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* App Icon */}
            <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md border border-amber-400/60 bg-[#02130c] flex items-center justify-center p-0.5">
              <BinAbbasLogo variant="iconOnly" className="w-full h-full" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            {/* App Info */}
            <div className="text-right min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-white leading-tight truncate">
                {BUSINESS_NAME}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-extrabold text-amber-300 font-sans tracking-wide">Real Estate</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={8} fill="currentColor" className="stroke-none" />
                  ))}
                </div>
                <span className="text-[9px] text-emerald-200 font-bold">(موبائل ایپ)</span>
              </div>
            </div>
          </div>

          {/* Action Button - Directly Invokes Google's Native Install Dialog */}
          <button
            onClick={handleDirectInstall}
            disabled={isInstalling}
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg cursor-pointer select-none focus:outline-none shrink-0 border border-amber-300"
            id="install-action-button"
          >
            <Download size={15} className={isInstalling ? "animate-spin" : "animate-bounce text-slate-950"} />
            <span>{isInstalling ? "انسٹال ہو رہی ہے..." : "ایپ انسٹال کریں"}</span>
          </button>
        </div>
      </motion.div>

      {/* AUTOMATIC GOOGLE TRANSLATE STYLE BOTTOM POP-UP TOAST BANNER */}
      <AnimatePresence>
        {showBottomPopupToast && !isStandalone && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-16 inset-x-3 sm:bottom-20 sm:max-w-[390px] sm:mx-auto z-50"
            id="google-translate-style-install-banner"
          >
            <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-2xl border border-amber-400/60 flex items-center justify-between gap-2.5 backdrop-blur-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-amber-400/40 p-0.5 shrink-0 flex items-center justify-center">
                  <BinAbbasLogo variant="iconOnly" className="w-full h-full" />
                </div>
                <div className="text-right min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-300 font-sans truncate">Real Estate ایپ</span>
                    <span className="text-[9px] bg-emerald-500 text-slate-950 font-extrabold px-1 rounded">آفیشل</span>
                  </div>
                  <p className="text-[10px] text-slate-300 truncate mt-0.5">
                    موبائل ہوم اسکرین پر شامل کریں
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDirectInstall}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
                >
                  <Download size={13} />
                  <span>انسٹال</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowBottomPopupToast(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback / iOS Guide Modal (Shown only if native prompt is blocked or on Safari) */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm" id="install-guide-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl max-w-[390px] w-full p-5 shadow-2xl border-2 border-emerald-600/30 text-slate-900 text-right relative overflow-hidden dir-rtl max-h-[90vh] overflow-y-auto"
              id="install-modal-content"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-3 left-3 p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
                id="close-install-modal-btn"
              >
                <X size={16} />
              </button>

              {/* Header Info */}
              <div className="flex items-center gap-3 mb-4 mt-1">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border border-amber-400/60 bg-[#02130c] shrink-0 flex items-center justify-center p-1">
                  <BinAbbasLogo variant="iconOnly" className="w-full h-full" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {BUSINESS_NAME}
                  </h3>
                  <p className="text-[11px] text-emerald-800 font-extrabold tracking-wide font-sans">
                    Real Estate • موبائل ایپ
                  </p>
                </div>
              </div>

              {/* IPHONE (IOS) SAFARI GUIDE */}
              {isIOS ? (
                <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs flex flex-col gap-2.5 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                    <Smartphone size={18} className="text-emerald-700 shrink-0" />
                    <span>آئی فون (Safari) پر فوری انسٹالیشن:</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-inner">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                      <p className="text-[11px] text-slate-800">
                        سفاری کے نیچے <b>Share (شیئر ↗)</b> بٹن دبائیں۔
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                      <p className="text-[11px] text-slate-800">
                        <b>"Add to Home Screen" (+)</b> منتخب کریں۔
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                      <p className="text-[11px] text-slate-800">
                        <b>"Add"</b> دبائیں۔ ایپ <b>"Real Estate"</b> نام کے ساتھ انسٹال ہو جائے گی!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* ANDROID MANUAL FALLBACK */
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-600/30 text-slate-900 text-xs flex flex-col gap-2.5 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                    <Smartphone size={18} className="text-emerald-700 shrink-0" />
                    <span>کروم مینو سے انسٹال کرنے کا طریقہ (10 سیکنڈ):</span>
                  </div>
                  
                  <div className="p-3.5 bg-white rounded-2xl border border-emerald-600/20 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">1</span>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        گوگل کروم کے اوپر دائیں کونے میں <b>تین نقطوں (⋮)</b> پر کلک کریں۔
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">2</span>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        مینو میں سے <span className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-black">"Install app"</span> یا <span className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-950 font-black">"Add to Home screen"</span> منتخب کریں۔
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">3</span>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        <b>"Install"</b> پر کلک کریں — ایپ فوراً آپ کے موبائل پر لوگو اور <b>Real Estate</b> نام کے ساتھ انسٹال ہو جائے گی!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  بند کریں (Close)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
