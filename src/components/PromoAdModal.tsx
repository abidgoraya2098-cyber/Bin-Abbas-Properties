import React, { useState, useEffect, useRef } from "react";
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
  FileText,
  Maximize,
  Maximize2
} from "lucide-react";
import { usePromoAds } from "../context/PromoAdContext";
import { useLanguage } from "../context/LanguageContext";
import { CONTACT_PHONE, OWNER_NAME } from "../data";
import { getMediaBlob } from "../utils/mediaStorage";

function getEmbedVideoUrl(url: string): { isEmbed: boolean; embedUrl: string } {
  if (!url) return { isEmbed: false, embedUrl: "" };
  const clean = url.trim();

  // YouTube Shorts: https://youtube.com/shorts/VIDEO_ID
  if (clean.includes("youtube.com/shorts/")) {
    const id = clean.split("shorts/")[1]?.split("?")[0]?.split("&")[0];
    if (id) {
      return {
        isEmbed: true,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&loop=1&playlist=${id}&rel=0`
      };
    }
  }

  // YouTube standard: https://www.youtube.com/watch?v=VIDEO_ID
  if (clean.includes("youtube.com/watch")) {
    const id = clean.split("v=")[1]?.split("&")[0];
    if (id) {
      return {
        isEmbed: true,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&loop=1&playlist=${id}&rel=0`
      };
    }
  }

  // YouTube short url: https://youtu.be/VIDEO_ID
  if (clean.includes("youtu.be/")) {
    const id = clean.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
    if (id) {
      return {
        isEmbed: true,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&loop=1&playlist=${id}&rel=0`
      };
    }
  }

  // Google Drive: https://drive.google.com/file/d/VIDEO_ID/view
  if (clean.includes("drive.google.com/file/d/")) {
    const id = clean.split("/d/")[1]?.split("/")[0];
    if (id) {
      return {
        isEmbed: true,
        embedUrl: `https://drive.google.com/file/d/${id}/preview`
      };
    }
  }

  return { isEmbed: false, embedUrl: clean };
}

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

  const { isUrdu, dir } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [resolvedMediaUrl, setResolvedMediaUrl] = useState<string>("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Resolve media from IndexedDB if stored as blob ID
  useEffect(() => {
    let isMounted = true;
    if (!currentAd) {
      setResolvedMediaUrl("");
      return;
    }

    const source = currentAd.mediaUrl || currentAd.thumbnailUrl || "";
    if (source.startsWith("redis:") || source.startsWith("media-")) {
      getMediaBlob(source).then((url) => {
        if (isMounted && url) {
          setResolvedMediaUrl(url);
        } else if (isMounted) {
          setResolvedMediaUrl(currentAd.thumbnailUrl || source);
        }
      });
    } else {
      setResolvedMediaUrl(source);
    }

    return () => {
      isMounted = false;
    };
  }, [currentAd]);

  // Attempt video play with full sound enabled by default
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(() => {
        // If mobile browser policy requires user gesture for sound, fallback to muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [resolvedMediaUrl, currentAdIndex]);

  if (!isAdPopupOpen || !currentAd || activeAds.length === 0) return null;

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleVideoEnded = () => {
    if (activeAds.length > 1) {
      nextAd();
    }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultMsg = isUrdu
      ? `السلام علیکم فریاد حسن گورائیہ صاحب (${OWNER_NAME})!\n\nمیں نے بن عباس پراپرٹیز ایپ پر یہ ایڈ دیکھا ہے:\n📌 *${currentAd.title}*\n${currentAd.price ? `💰 قیمت / ڈیمانڈ: ${currentAd.price}\n` : ""}${currentAd.location ? `📍 مقام / بلاک: ${currentAd.location}\n` : ""}\nمجھے یہ پراپرٹی خریدنی ہے / مزید تفصیلات درکار ہیں۔ براہ کرم رہنمائی فرمائیں۔`
      : `Hello Faryad Hassan Goraya (${OWNER_NAME}),\n\nI saw this ad on Bin Abbas Properties app:\n📌 *${currentAd.titleEn || currentAd.title}*\n${currentAd.price ? `💰 Price: ${currentAd.priceEn || currentAd.price}\n` : ""}${currentAd.location ? `📍 Location: ${currentAd.locationEn || currentAd.location}\n` : ""}\nI am interested in buying/getting details. Please guide me.`;

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

  const isVideo = currentAd.type === "video" || (resolvedMediaUrl && (resolvedMediaUrl.includes("youtu") || resolvedMediaUrl.includes(".mp4") || resolvedMediaUrl.startsWith("data:video")));
  const isImage = currentAd.type === "image" && !isVideo;
  const { isEmbed, embedUrl } = getEmbedVideoUrl(resolvedMediaUrl);
  const isTextOnly = !isVideo && !isImage;

  return (
    <AnimatePresence>
      {isAdPopupOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/92 backdrop-blur-2xl select-none"
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
            className="relative w-full max-w-[460px] sm:max-w-md max-h-[94vh] bg-gradient-to-b from-slate-950 via-slate-900 to-[#041a10] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-2 border-amber-400 flex flex-col"
            id="promo-ad-fullscreen-card"
          >
            {/* 🌟 1. TOP STORY PROGRESS & HEADER CONTROLS */}
            <div className="relative z-30 p-3 pb-2 bg-gradient-to-b from-black/90 via-black/70 to-transparent flex flex-col gap-2 shrink-0">
              {/* Progress Bars (For Multiple Ads) */}
              {activeAds.length > 1 && (
                <div className="flex items-center gap-1.5 w-full">
                  {activeAds.map((ad, idx) => (
                    <div
                      key={`progress-${ad.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToAdIndex(idx);
                      }}
                      className="flex-1 h-1.5 rounded-full bg-white/30 overflow-hidden cursor-pointer"
                    >
                      <div
                        className={`h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-300 ${
                          idx < currentAdIndex
                            ? "w-full"
                            : idx === currentAdIndex
                            ? isPaused
                              ? "w-1/2"
                              : "w-full animate-[progress_15s_linear]"
                            : "w-0"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Header Bar */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-md border border-amber-300">
                    <Sparkles size={12} className="text-slate-950" />
                    <span>{isUrdu ? "خصوصی لائیو ایڈ" : "Featured Ad"}</span>
                  </div>

                  {activeAds.length > 1 && (
                    <span className="text-[10px] text-amber-200 font-bold bg-black/60 px-2 py-0.5 rounded-full border border-white/20">
                      {currentAdIndex + 1} / {activeAds.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Sound Toggle Button (For Video Ads) */}
                  {isVideo && (
                    <button
                      type="button"
                      onClick={toggleSound}
                      className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 border shadow-md transition-all cursor-pointer ${
                        isMuted 
                          ? "bg-red-950/80 text-red-200 border-red-500" 
                          : "bg-emerald-600 text-white border-emerald-400 animate-pulse"
                      }`}
                      title={isMuted ? "آواز آن کریں" : "آواز بند کریں"}
                    >
                      {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      <span className="text-[10px]">{isMuted ? (isUrdu ? "آواز کھولیں 🔊" : "Unmute") : (isUrdu ? "آواز بند کریں 🔇" : "Mute Sound")}</span>
                    </button>
                  )}

                  {/* (X) CLOSE BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeAdPopup();
                    }}
                    id="promo-ad-close-btn"
                    className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/40 hover:border-amber-400 transition-all cursor-pointer shadow-lg active:scale-90"
                    title={isUrdu ? "ایڈ بند کریں" : "Close"}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* 🌟 2. MEDIA DISPLAY AREA (OPTIMAL 44vh HEIGHT - NEVER OVERFLOWS) */}
            <div className="relative w-full h-[40vh] sm:h-[45vh] min-h-[220px] max-h-[340px] bg-black flex items-center justify-center shrink-0 overflow-hidden">
              {isVideo && (resolvedMediaUrl || currentAd.thumbnailUrl) ? (
                isEmbed ? (
                  <iframe
                    src={embedUrl}
                    title={currentAd.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : resolvedMediaUrl ? (
                  <video
                    ref={videoRef}
                    src={resolvedMediaUrl}
                    poster={currentAd.thumbnailUrl}
                    controls
                    autoPlay
                    playsInline
                    loop={activeAds.length === 1}
                    muted={isMuted}
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-contain cursor-pointer"
                  />
                ) : currentAd.thumbnailUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <img
                      src={currentAd.thumbnailUrl}
                      alt={currentAd.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl animate-pulse">
                        <Play size={28} className="fill-slate-950 ml-1" />
                      </div>
                    </div>
                  </div>
                ) : null
              ) : isImage && resolvedMediaUrl ? (
                <img
                  src={resolvedMediaUrl}
                  alt={currentAd.title}
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                /* Text Announcement Banner */
                <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#0a4d30] via-[#063822] to-[#032415] text-white">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mb-3 text-amber-300 shadow-xl">
                    <FileText size={28} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 mb-1">
                    {isUrdu ? "بن عباس پراپرٹیز خصوصی پیشکش" : "Bin Abbas Properties Special Offer"}
                  </span>
                </div>
              )}

              {/* Tap to Unmute Overlay Hint for Video */}
              {isVideo && isMuted && !isEmbed && (
                <div 
                  onClick={toggleSound}
                  className="absolute bottom-3 inset-x-3 z-20 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400 text-amber-300 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-pulse"
                >
                  <Volume2 size={16} className="text-amber-400 animate-bounce" />
                  <span>{isUrdu ? "🔊 ویڈیو کی آواز کھولنے کے لیے یہاں ٹیپ کریں" : "Tap here to unmute sound"}</span>
                </div>
              )}

              {/* Navigation Left / Right Buttons */}
              {activeAds.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevAd();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/30 backdrop-blur-sm cursor-pointer z-20"
                    title="Previous Ad"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextAd();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/30 backdrop-blur-sm cursor-pointer z-20"
                    title="Next Ad"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* 🌟 3. URDU DETAILS & WHATSAPP ACTION CARD (100% PROMINENT & SCROLLABLE) */}
            <div 
              className="relative z-30 bg-gradient-to-b from-slate-950 via-slate-900 to-[#02180e] p-4 sm:p-5 text-white flex-1 overflow-y-auto flex flex-col justify-between gap-3 border-t-2 border-amber-400/50"
              dir={dir}
            >
              <div className="space-y-2.5">
                {/* 📌 Title / Headings */}
                <div className="space-y-1 text-right">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400/90 block">
                    {isUrdu ? "📌 ایڈ کے مکمل کوائف و تفصیلات:" : "📌 Property Details:"}
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-amber-300 leading-snug font-sans drop-shadow">
                    {isUrdu ? currentAd.title : (currentAd.titleEn || currentAd.title)}
                  </h2>
                </div>

                {/* 💰 Price Demand & 📍 Location Badges Row */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
                  {currentAd.price ? (
                    <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md border border-amber-300 flex items-center gap-1.5">
                      <span>💰</span>
                      <span>{isUrdu ? `ڈیمانڈ: ${currentAd.price}` : `Price: ${currentAd.priceEn || currentAd.price}`}</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/40">
                      {isUrdu ? "خصوصی ریٹ / رابطہ کریں" : "Special Rate"}
                    </div>
                  )}

                  {currentAd.location && (
                    <div className="flex items-center gap-1 text-xs text-emerald-200 font-bold bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                      <MapPin size={13} className="text-amber-400 shrink-0" />
                      <span>{isUrdu ? currentAd.location : (currentAd.locationEn || currentAd.location)}</span>
                    </div>
                  )}
                </div>

                {/* 📝 Extra Details / Caption (If Available) */}
                {currentAd.caption && (
                  <div className="bg-slate-900/80 p-3 rounded-2xl border border-amber-400/20 text-right">
                    <p className="text-xs text-slate-200 leading-relaxed font-semibold font-sans whitespace-pre-line">
                      {isUrdu ? currentAd.caption : (currentAd.captionEn || currentAd.caption)}
                    </p>
                  </div>
                )}
              </div>

              {/* 🌟 4. PROMINENT WHATSAPP BUY & CALL BUTTONS */}
              <div className="pt-2 flex flex-col gap-2 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsAppClick}
                  id="promo-ad-whatsapp-buy-btn"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#20ba59] to-[#128C7E] hover:brightness-110 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(37,211,102,0.45)] border border-emerald-300 cursor-pointer"
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
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone size={13} className="text-amber-300" />
                    <span>{isUrdu ? "فوری کال کریں" : "Call Directly"}</span>
                  </button>

                  <button
                    onClick={handleShareClick}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
