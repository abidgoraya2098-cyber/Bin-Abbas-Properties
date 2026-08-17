import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import QuickLinksList from "./components/QuickLinksList";
import FeaturedProperties from "./components/FeaturedProperties";
import PlotInquiry from "./components/PlotInquiry";
import SocietyGuide from "./components/SocietyGuide";
import FAQSection from "./components/FAQSection";
import SocialLinks from "./components/SocialLinks";
import Feedback from "./components/Feedback";
import Footer from "./components/Footer";
import FloatingActionBar from "./components/FloatingActionBar";
import { Sparkles, ArrowRightLeft, Navigation, LayoutGrid, Globe, Info } from "lucide-react";

type ActiveTab = "links" | "inquiry" | "deals" | "society";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("links");
  const [inquiryDefaultMode, setInquiryDefaultMode] = useState<"sell" | "buy">("sell");
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    document.title = "Bin Abbas Properties - بن عباس پراپرٹیز | رائل پام سٹی گوجرانوالہ";
    
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
  }, []);

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

  const tabOptions = [
    { id: "links", label: "اہم روابط", icon: LayoutGrid },
    { id: "inquiry", label: "خرید و فروخت", icon: ArrowRightLeft },
    { id: "deals", label: "پراپرٹی ڈیلز", icon: Sparkles },
    { id: "society", label: "سوسائٹی گائیڈ", icon: Navigation }
  ];

  return (
    <div 
      className="min-h-screen bg-royal-light-green flex flex-col items-center justify-start py-2.5 px-2.5 sm:py-6 sm:px-4 selection:bg-emerald-600 selection:text-white text-slate-900 relative overflow-x-hidden pb-32"
      id="app-root-container"
      dir="rtl"
    >
      {/* Ambient Lighting Background Orbs */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[520px] h-[360px] bg-amber-400/10 rounded-full blur-[110px]"></div>
        <div className="absolute top-[35%] -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Luxury App Card Container */}
      <div 
        className="relative z-10 w-full max-w-[440px] gold-luxury-card rounded-3xl p-3.5 sm:p-5 transition-all duration-300"
        id="main-app-card"
      >
        {/* WhatsApp / In-App Browser Warning Alert */}
        {isInAppBrowser && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-right flex items-center justify-between gap-2 shadow-md border border-emerald-400"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Info size={16} className="text-amber-300 shrink-0" />
              <p className="text-[11px] font-black leading-tight truncate">
                ایپ انسٹال کرنے کے لیے گوگل کروم میں کھولیں
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenInChrome}
              className="bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1 cursor-pointer active:scale-95 shadow"
            >
              <Globe size={12} />
              <span>کروم میں کھولیں</span>
            </button>
          </motion.div>
        )}

        {/* 1. Seamless Luxury Header & Logo */}
        <Header />

        {/* 2. Modern 4 Navigation Tab Buttons */}
        <div className="mt-3.5" id="app-nav-buttons-container">
          <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-emerald-50/90 rounded-2xl border-2 border-emerald-200 shadow-inner">
            {tabOptions.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 cursor-pointer text-center ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white font-black shadow-md border border-amber-300 scale-[1.02]"
                      : "text-emerald-950 hover:text-emerald-900 hover:bg-emerald-100/70"
                  }`}
                  id={`nav-tab-${tab.id}`}
                >
                  <Icon 
                    size={16} 
                    className={`mb-1 transition-transform duration-200 ${
                      isActive ? "text-amber-300 scale-110" : "text-emerald-700"
                    }`} 
                  />
                  <span className="leading-tight truncate w-full">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Active Tab Content with Smooth Transitions */}
        <div className="mt-2.5" id="tab-content-wrapper">
          <AnimatePresence mode="wait">
            {/* TAB 1: اہم روابط (Main WhatsApp Quick Links & FAQs) */}
            {activeTab === "links" && (
              <motion.div
                key="tab-links"
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
                key="tab-inquiry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PlotInquiry defaultMode={inquiryDefaultMode} />
              </motion.div>
            )}

            {/* TAB 3: پراپرٹی ڈیلز (Featured Deals & Listings) */}
            {activeTab === "deals" && (
              <motion.div
                key="tab-deals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FeaturedProperties />
              </motion.div>
            )}

            {/* TAB 4: سوسائٹی معلومات (Royal Palm City Society Overview & Maps) */}
            {activeTab === "society" && (
              <motion.div
                key="tab-society"
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
      </div>

      {/* Smooth Movable 3-Action Floating Bar (کال، واٹس ایپ، لوکیشن) */}
      <FloatingActionBar />
    </div>
  );
}
