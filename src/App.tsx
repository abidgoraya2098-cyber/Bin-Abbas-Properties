import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import SplashScreen from "./components/SplashScreen";
import QuickLinksList from "./components/QuickLinksList";
import FeaturedProperties from "./components/FeaturedProperties";
import PlotInquiry from "./components/PlotInquiry";
import SmartRateEstimator from "./components/SmartRateEstimator";
import AdminLoginModal from "./components/AdminLoginModal";
import NotificationModal from "./components/NotificationModal";
import AdminInboxModal from "./components/AdminInboxModal";
import PromoAdModal from "./components/PromoAdModal";
import PromoAdBanner from "./components/PromoAdBanner";
import SocietyGuide from "./components/SocietyGuide";
import FAQSection from "./components/FAQSection";
import SocialLinks from "./components/SocialLinks";
import Feedback from "./components/Feedback";
import Footer from "./components/Footer";
import FloatingActionBar from "./components/FloatingActionBar";
import { Sparkles, ArrowRightLeft, Navigation, LayoutGrid, Globe, Info, Video } from "lucide-react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import { NotificationProvider, useNotifications } from "./context/NotificationContext";
import { PromoAdProvider, usePromoAds } from "./context/PromoAdContext";
import { syncDeviceRegistration } from "./utils/cloudSync";
import { getTranslation } from "./i18n";

type ActiveTab = "links" | "inquiry" | "deals" | "society";

function MainAppContent() {
  const { language, isUrdu, dir } = useLanguage();
  const t = getTranslation(language);
  const { activeAds, openAd, hasUnseenNewAd } = usePromoAds();
  const { isAdmin, setIsLoginModalOpen } = useAdmin();
  const { setIsAdminInboxOpen } = useNotifications();

  const [activeTab, setActiveTab] = useState<ActiveTab>("links");
  const [inquiryDefaultMode, setInquiryDefaultMode] = useState<"sell" | "buy">("sell");
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine !== false : true);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // Auto-open ad popup when a new ad arrives or on initial splash finish
  useEffect(() => {
    if (!showSplashScreen && activeAds.length > 0 && hasUnseenNewAd) {
      const timer = setTimeout(() => {
        openAd(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasUnseenNewAd, activeAds.length, showSplashScreen]);

  useEffect(() => {
    // Online & Offline Event Listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check URL parameters for direct tab navigation
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (tabParam && ["links", "deals", "inquiry", "society"].includes(tabParam)) {
      setActiveTab(tabParam as ActiveTab);
    }
    const modeParam = urlParams.get("mode");
    if (modeParam === "sell" || modeParam === "buy") {
      setInquiryDefaultMode(modeParam);
    }

    // Check if opened inside WhatsApp / Facebook in-app browser
    const userAgent = window.navigator.userAgent.toLowerCase();
    const inAppRegex = /fban|fbav|instagram|snapchat|line\/|twitter|gsa\/|wv|micromessenger|whatsapp|bytedance|tiktok/i;
    if (inAppRegex.test(userAgent)) {
      setIsInAppBrowser(true);
    }

    // 📱 Register / Update Device Installation in Cloud Analytics
    syncDeviceRegistration().catch(() => {});

    // Periodic heartbeat every 45s so live online device status is accurate
    const heartbeat = setInterval(() => {
      syncDeviceRegistration().catch(() => {});
    }, 45000);

    // Request notification permission smoothly
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      setTimeout(() => {
        Notification.requestPermission().catch(() => {});
      }, 3500);
    }

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // When splash screen finishes, if there are active ads, pop up the full-screen promo modal!
  const handleSplashFinish = () => {
    setShowSplashScreen(false);
    if (activeAds.length > 0) {
      setTimeout(() => {
        openAd(0);
      }, 400);
    }
  };

  const handleOpenInChrome = () => {
    const cleanUrl = window.location.href.replace(/^https?:\/\//, "");
    window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  const handleNavigateToInquiry = (mode: "sell" | "buy") => {
    setInquiryDefaultMode(mode);
    setActiveTab("inquiry");
    const mainCard = document.getElementById("main-app-card");
    if (mainCard) {
      mainCard.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [showNotifBanner, setShowNotifBanner] = useState<boolean>(() => {
    return typeof window !== "undefined" && "Notification" in window && Notification.permission === "default";
  });

  const handleEnableNotifications = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          setShowNotifBanner(false);
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
              reg.showNotification("خوش آمدید! بن عباس پراپرٹیز پورٹل", {
                body: "آپ کے موبائل پر تمام نئی ڈیلز اور ویڈیو ایڈز کے الرٹس کامیابی سے آن ہو گئے ہیں۔",
                icon: "/icon-192.png",
                badge: "/icon.svg",
                vibrate: [200, 100, 200]
              });
            }).catch(() => {});
          }
        } else {
          setShowNotifBanner(false);
        }
      } catch {
        setShowNotifBanner(false);
      }
    }
  };

  const tabOptions = [
    { id: "inquiry", label: t.tabInquiry, icon: ArrowRightLeft },
    { id: "deals", label: t.tabDeals, icon: Sparkles },
    { id: "links", label: t.tabLinks, icon: LayoutGrid },
    { id: "society", label: t.tabSociety, icon: Navigation }
  ];

  return (
    <div 
      className={`min-h-screen bg-royal-light-green flex flex-col items-center justify-start py-2.5 px-2.5 sm:py-6 sm:px-4 selection:bg-emerald-600 selection:text-white text-slate-900 relative overflow-x-hidden pb-32 transition-all duration-200 ${
        isUrdu ? "font-sans" : "font-sans"
      }`}
      id="app-root-container"
      dir={dir}
    >
      {/* 🔔 1-Tap Notification Permission Banner for Mobile */}
      {showNotifBanner && !showSplashScreen && (
        <div className="w-full max-w-md my-2 p-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 shadow-lg border-2 border-amber-500 flex items-center justify-between gap-2 z-20 animate-bounce">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-xl bg-slate-950 text-amber-300 shrink-0">
              <Bell size={16} />
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-black leading-tight">
                {isUrdu ? "🔔 ویڈیو ایڈز اور ڈیلز کے الرٹس آن کریں" : "Enable Video Ads & Deal Alerts"}
              </h4>
              <p className="text-[10px] text-slate-800 font-semibold leading-tight">
                {isUrdu ? "موبائل سکرین پر فوری نوٹیفکیشن حاصل کریں" : "Receive instant heads-up notifications"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleEnableNotifications}
              className="py-1.5 px-3 rounded-xl bg-slate-950 text-amber-300 hover:bg-slate-900 font-black text-xs shadow transition-all cursor-pointer"
            >
              {isUrdu ? "آن کریں" : "Enable"}
            </button>
            <button
              onClick={() => setShowNotifBanner(false)}
              className="p-1 text-slate-700 hover:text-slate-950 cursor-pointer"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      {/* 🌟 4K Real Estate Motion Graphics Splash Screen */}
      {showSplashScreen && (
        <SplashScreen onFinish={handleSplashFinish} duration={2500} />
      )}

      {/* Ambient Lighting Background Orbs */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[520px] h-[360px] bg-amber-400/10 rounded-full blur-[110px]"></div>
        <div className="absolute top-[35%] -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Luxury App Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: showSplashScreen ? 0 : 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{ visibility: showSplashScreen ? "hidden" : "visible" }}
        className="relative z-10 w-full max-w-[440px] gold-luxury-card rounded-3xl p-3.5 sm:p-5 transition-all duration-300"
        id="main-app-card"
      >
        {/* WhatsApp / In-App Browser Warning Alert */}
        {isInAppBrowser && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center justify-between gap-2 shadow-md border border-emerald-400"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Info size={16} className="text-amber-300 shrink-0" />
              <p className="text-[11px] font-black leading-tight truncate">
                {t.inAppWarning}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenInChrome}
              className="bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1 cursor-pointer active:scale-95 shadow"
            >
              <Globe size={12} />
              <span>{t.openChrome}</span>
            </button>
          </motion.div>
        )}

        {/* 1. Header with Official 3D Brand Logo & Actions */}
        <Header />

        {/* 👑 Admin Direct Ad Creator Banner (Always clearly visible for Admin) */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsAdminInboxOpen(true)}
            id="admin-direct-ad-creator-banner"
            className="my-3 p-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 flex items-center justify-between gap-2 shadow-lg border-2 border-amber-600 cursor-pointer hover:brightness-105 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center shadow-md shrink-0">
                <Video size={18} />
              </div>
              <div className="text-right">
                <span className="text-xs font-black block leading-tight text-slate-950">
                  {isUrdu ? "👑 ایڈمن پورٹل: ➕ نیا ویڈیو یا تصویر ایڈ بنائیں" : "👑 Admin: ➕ Create Video / Photo Ad"}
                </span>
                <span className="text-[10px] text-slate-800 font-bold block">
                  {isUrdu ? "موبائل گیلری سے ویڈیو/تصویر منتخب کر کے شائع کریں" : "Upload photo/video from gallery & publish live"}
                </span>
              </div>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-950 text-amber-300 font-black text-xs shrink-0 shadow-md">
              {isUrdu ? "ایڈ لگائیں ➕" : "Add Ad ➕"}
            </div>
          </motion.div>
        )}

        {/* 🌟 Featured Admin Promo Video/Image Ad Banner */}
        <PromoAdBanner />

        {/* 2. Main 4-Tab Navigation Bar */}
        <div className="my-3.5" id="main-navigation-tabs">
          <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-emerald-950/10 backdrop-blur-md rounded-2xl border-2 border-amber-400/40 shadow-inner">
            {tabOptions.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  id={`tab-btn-${tab.id}`}
                  className={`py-2.5 px-1 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition-all duration-300 relative cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#094027] via-[#0d5434] to-[#094027] text-amber-300 font-black shadow-[0_4px_15px_rgba(10,50,30,0.35)] border-2 border-amber-400"
                      : "text-slate-700 hover:text-emerald-950 hover:bg-white/70 font-bold"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-amber-300 animate-pulse" : "text-emerald-900"} />
                  <span className="text-[10px] sm:text-[11px] leading-none tracking-tight block">
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-1.5 w-7 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 3. Dynamic Tab Content Area */}
        <div className="mt-2" id="tab-content-area">
          <AnimatePresence mode="wait">
            {/* TAB 1: اہم روابط (Main Hub & Quick Action Links) */}
            {activeTab === "links" && (
              <motion.div
                key={`tab-links-${language}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <QuickLinksList onNavigateToInquiry={handleNavigateToInquiry} />
                <FAQSection />
              </motion.div>
            )}

            {/* TAB 2: خرید و فروخت (Plot Demand & Rate Inquiry Form) */}
            {activeTab === "inquiry" && (
              <motion.div
                key={`tab-inquiry-${language}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PlotInquiry defaultMode={inquiryDefaultMode} />
              </motion.div>
            )}

            {/* TAB 3: پراپرٹی ڈیلز (Featured Deals, Smart Valuation & Listings) */}
            {activeTab === "deals" && (
              <motion.div
                key={`tab-deals-${language}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {/* 1. Interactive AI / Smart Rate Estimator Widget */}
                <SmartRateEstimator />

                {/* 2. Searchable Properties & Deals List */}
                <FeaturedProperties onNavigateToInquiry={handleNavigateToInquiry} />
              </motion.div>
            )}

            {/* TAB 4: سوسائٹی معلومات (Royal Palm City Society Overview & Maps) */}
            {activeTab === "society" && (
              <motion.div
                key={`tab-society-${language}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SocietyGuide />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Official Social Links Hub */}
        <SocialLinks />

        {/* 5. Customer Review & Feedback Module */}
        <Feedback />

        {/* Decorative Gold Divider Line */}
        <div className="w-full h-0.5 mt-4 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>

        {/* 6. Footer */}
        <Footer />
      </motion.div>

      {/* 🌟 Interactive Promotional Video & Photo Ad Popup Modal */}
      <PromoAdModal />

      {/* Owner / Admin Authentication PIN Modal */}
      <AdminLoginModal />

      {/* Notifications Drawer / Modal */}
      <NotificationModal />

      {/* Admin Customer Plot Ads & Inquiries Inbox with Ads Manager */}
      <AdminInboxModal />

      {/* Smooth Movable 3-Action Floating Bar (کال، واٹس ایپ، لوکیشن) */}
      <FloatingActionBar />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <NotificationProvider>
          <PromoAdProvider>
            <MainAppContent />
          </PromoAdProvider>
        </NotificationProvider>
      </AdminProvider>
    </LanguageProvider>
  );
}
