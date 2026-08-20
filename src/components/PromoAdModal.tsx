import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  MessageCircle, 
  Phone, 
  Share2, 
  Sparkles, 
  MapPin, 
  Tag, 
  Play, 
  Pause,
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX,
  Eye,
  FileText
} from "lucide-react";
import { usePromoAds } from "../context/PromoAdContext";
import { useLanguage } from "../context/LanguageContext";
import { CONTACT_PHONE, OWNER_NAME } from "../data";

export default function PromoAdModal() {
  const { 
    activeAds, 
    currentAdIndex, 
    currentAd, 
    isAdPopupOpen, 
    closeAdPopup, 
    nextAd, 
    prevAd, 
    goToAdIndex,
    isPaused,
    setIsPaused 
  } = usePromoAds();

  const { isUrdu } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  if (!isAdPopupOpen || !currentAd || activeAds.length === 0) return null;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultMsg = isUrdu
      ? `السلام علیکم فریاد حسن گورائیہ صاحب (${OWNER_NAME})!\n\nمیں نے بن عباس پراپرٹیز ایپ پر یہ ایڈ دیکھا ہے:\n📌 *${currentAd.title}*\n${currentAd.price ? `💰 قیمت: ${currentAd.price}\n` : ""}${currentAd.location ? `📍 مقام: ${currentAd.location}\n` : ""}\nمجھے یہ پراپرٹی خریدنی ہے / مزید معلومات درکار ہیں۔ براہ کرم رہنمائی فرمائیں۔`
      : `Hello Faryad Hassan Goraya (${OWNER_NAME}),\n\nI saw this ad on Bin Abbas Properties app:\n📌 *${currentAd.titleEn || currentAd.title}*\n${currentAd.price ? `💰 Price: ${currentAd.priceEn || currentAd.price}\n` : ""}\nI am interested in buying/getting details. Please guide me.`;

    const messageText = currentAd.whatsAppMessage || defaultMsg;
    const url = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(messageText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:+${CONTACT_PHONE}`, "_self");
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `🌟 *${currentAd.title}*\n${currentAd.price ? `💰 ${currentAd.price}\n` : ""}${currentAd.location ? `📍 ${currentAd.location}\n` : ""}\n📲 بن عباس پراپرٹیز رائل پام سٹی ایپ پر لائیو ایڈ دیکھیں! رابطہ: 0320.4800071`;
    
    if (navigator.share) {
      navigator.share({
        title: currentAd.title,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isVideo = currentAd.type === "video";
  const isImage = currentAd.type === "image";
  const isTextOnly = currentAd.type === "text_only" || (!currentAd.mediaUrl && !isVideo && !isImage);

  return (
    <AnimatePresence>
      {isAdPopupOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl select-none"
          id="promo-ad-fullscreen-overlay"
          onPointerDown={() => setIsPaused(true)}
          onPointerUp={() => setIsPaused(false)}
        >
          <motion.div
            key={`promo-modal-${currentAd.id}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[440px] sm:max-w-md h-[92vh] max-h-[820px] bg-gradient-to-b from-slate-950 via-slate-900 to-[#041a10] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-2 border-amber-400 flex flex-col justify-between"
            id="promo-ad-fullscreen-card"
          >
            {/* 🌟 1. TOP STORY SEGMENTED PROGRESS BARS (MULTIPLE ADS AUTO ROTATE) */}
            <div className="absolute top-0 inset-x-0 z-30 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex flex-col gap-2">
              {/* Progress Bars */}
              {activeAds.length > 1 && (
                <div className="flex items-center gap-1.5 w-full">
                  {activeAds.map((ad, idx) => (
                    <div
                      key={`progress-${ad.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToAdIndex(idx);
                      }}
                      className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden cursor-pointer"
                    >
                      <div
                        className={`h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-300 ${
                          idx < currentAdIndex
                            ? "w-full"
                            : idx === currentAdIndex
                            ? isPaused
                              ? "w-1/2"
                              : "w-full animate-[progress_6s_linear]"
                            : "w-0"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Header Controls (Logo Tag + Multi-Ad Counter + Close Button) */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-md border border-amber-300">
                    <Sparkles size={12} className="text-slate-950" />
                    <span>{isUrdu ? "خصوصی پروموشنل ایڈ" : "Featured Ad"}</span>
                  </div>

                  {activeAds.length > 1 && (
                    <span className="text-[10px] text-amber-200 font-bold bg-black/50 px-2 py-0.5 rounded-full border border-white/20">
                      {currentAdIndex + 1} / {activeAds.length}
                    </span>
                  )}
                </div>

                {/* (X) CLOSE BUTTON - Persists until user closes */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeAdPopup();
                  }}
                  id="promo-ad-close-btn"
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/30 hover:border-amber-400 transition-all cursor-pointer shadow-lg active:scale-90"
                  title={isUrdu ? "ایڈ بند کریں" : "Close"}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 🌟 2. FULL MEDIA DISPLAY AREA (FULL SCREEN VIDEO OR IMAGE OR TEXT BANNER) */}
            <div className="relative w-full flex-1 overflow-hidden flex items-center justify-center bg-black">
              {isVideo && currentAd.mediaUrl ? (
                currentAd.mediaUrl.includes("youtube.com") || currentAd.mediaUrl.includes("youtu.be") ? (
                  <iframe
                    src={
                      currentAd.mediaUrl.includes("watch?v=")
                        ? `${currentAd.mediaUrl.replace("watch?v=", "embed/")}?autoplay=1&mute=1&loop=1`
                        : `${currentAd.mediaUrl.replace("youtu.be/", "youtube.com/embed/")}?autoplay=1&mute=1&loop=1`
                    }
                    title={currentAd.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={currentAd.mediaUrl}
                    poster={currentAd.thumbnailUrl}
                    controls
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover sm:object-contain"
                  />
                )
              ) : isImage && currentAd.mediaUrl ? (
                <img
                  src={currentAd.mediaUrl}
                  alt={currentAd.title}
                  className="w-full h-full object-cover sm:object-contain"
                />
              ) : (
                /* Text-Only Luxury Announcement Card */
                <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#0a4d30] via-[#063822] to-[#032415] text-white">
                  <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mb-4 text-amber-300 shadow-xl">
                    <FileText size={32} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-amber-300 mb-2">
                    {isUrdu ? "بن عباس پراپرٹیز خصوصی آفر" : "Bin Abbas Properties Special Offer"}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black leading-snug text-white max-w-xs">
                    {isUrdu ? currentAd.title : (currentAd.titleEn || currentAd.title)}
                  </h2>
                  {currentAd.price && (
                    <div className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-lg border border-amber-300">
                      {currentAd.price}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Left / Right Buttons (When multiple ads exist) */}
              {activeAds.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevAd();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm cursor-pointer z-20"
                    title="Previous Ad"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextAd();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm cursor-pointer z-20"
                    title="Next Ad"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* 🌟 3. BOTTOM FLOATING AD DETAILS & PROMINENT WHATSAPP BUY BUTTON */}
            <div className="relative z-30 bg-gradient-to-t from-black via-black/95 to-black/60 p-4 sm:p-5 pt-3 text-white flex flex-col gap-2.5 border-t border-amber-400/40">
              {/* Title & Price Header */}
              <div className="flex items-start justify-between gap-2 text-right">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow">
                    {isUrdu ? currentAd.title : (currentAd.titleEn || currentAd.title)}
                  </h2>

                  {currentAd.location && (
                    <div className="flex items-center gap-1 text-xs text-amber-200 mt-0.5 font-bold">
                      <MapPin size={12} className="text-amber-400 shrink-0" />
                      <span className="truncate">{isUrdu ? currentAd.location : (currentAd.locationEn || currentAd.location)}</span>
                    </div>
                  )}
                </div>

                {currentAd.price && (
                  <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md border border-amber-300 shrink-0">
                    {isUrdu ? currentAd.price : (currentAd.priceEn || currentAd.price)}
                  </div>
                )}
              </div>

              {/* Optional Caption & Details */}
              {currentAd.caption && (
                <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 max-h-20 overflow-y-auto">
                  <p className="text-[11px] sm:text-xs text-emerald-100 leading-relaxed font-semibold text-right whitespace-pre-line">
                    {isUrdu ? currentAd.caption : (currentAd.captionEn || currentAd.caption)}
                  </p>
                </div>
              )}

              {/* 🌟 PROMINENT WHATSAPP ACTION BUTTON: "ابھی خریدنے کے لیے رابطہ کریں" */}
              <div className="pt-1 flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsAppClick}
                  id="promo-ad-whatsapp-buy-btn"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#20ba59] to-[#128C7E] hover:brightness-110 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(37,211,102,0.45)] border border-emerald-300 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle size={15} className="fill-white" />
                  </div>
                  <span>{isUrdu ? "🟢 ابھی خریدنے کے لیے واٹس ایپ پر رابطہ کریں" : "🟢 Contact on WhatsApp to Buy Now"}</span>
                </motion.button>

                {/* Secondary Direct Call & Share Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCallClick}
                    className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone size={13} className="text-amber-300" />
                    <span>{isUrdu ? "فوری کال کریں" : "Call Directly"}</span>
                  </button>

                  <button
                    onClick={handleShareClick}
                    className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-300">{isUrdu ? "لنک کاپی ہو گیا" : "Copied"}</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={13} className="text-amber-300" />
                        <span>{isUrdu ? "ایڈ شیئر کریں" : "Share Ad"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
