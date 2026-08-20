import React from "react";
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
  Check, 
  ExternalLink,
  Eye
} from "lucide-react";
import { usePromoAds } from "../context/PromoAdContext";
import { useLanguage } from "../context/LanguageContext";
import { CONTACT_PHONE, OWNER_NAME } from "../data";

export default function PromoAdModal() {
  const { selectedAd, isAdPopupOpen, closeAdPopup } = usePromoAds();
  const { isUrdu } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  if (!selectedAd) return null;

  const handleWhatsAppClick = () => {
    const defaultMsg = isUrdu
      ? `السلام علیکم فریاد حسن گورائیہ صاحب (${OWNER_NAME})!\n\nمیں نے بن عباس پراپرٹیز ایپ پر یہ ایڈ دیکھا ہے:\n📌 *${selectedAd.title}*\n💰 قیمت: ${selectedAd.price || "معلومات درکار"}\n📍 مقام: ${selectedAd.location || "رائل پام سٹی"}\n\nمجھے یہ پراپرٹی خریدنی ہے / مزید معلومات درکار ہیں۔ کیا آپ مجھے مزید تفصیلات فراہم کر سکتے ہیں؟`
      : `Hello Faryad Hassan Goraya (${OWNER_NAME}),\n\nI saw this ad on Bin Abbas Properties app:\n📌 *${selectedAd.titleEn || selectedAd.title}*\n💰 Price: ${selectedAd.priceEn || selectedAd.price}\n\nI am interested in buying/getting more details. Please share available information.`;

    const messageText = selectedAd.whatsAppMessage || defaultMsg;
    const url = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(messageText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCallClick = () => {
    window.open(`tel:+${CONTACT_PHONE}`, "_self");
  };

  const handleShareClick = () => {
    const shareText = `🌟 *${selectedAd.title}*\n💰 ${selectedAd.price || ""}\n📍 ${selectedAd.location || ""}\n\n📲 بن عباس پراپرٹیز رائل پام سٹی ایپ پر مزید دیکھیں! رابطہ: 0320.4800071`;
    
    if (navigator.share) {
      navigator.share({
        title: selectedAd.title,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isVideo = selectedAd.type === "video";

  return (
    <AnimatePresence>
      {isAdPopupOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          id="promo-ad-popup-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 my-auto text-slate-900"
            id="promo-ad-popup-card"
          >
            {/* Top Glowing Header Bar */}
            <div className="bg-gradient-to-r from-[#0a4d30] via-[#063822] to-[#032415] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-amber-400/40">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  <Sparkles size={16} />
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                    {isUrdu ? "خصوصی پروموشنل ایڈ" : "Special Featured Ad"}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white leading-tight">
                    {isUrdu ? selectedAd.title : (selectedAd.titleEn || selectedAd.title)}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeAdPopup}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isUrdu ? "بند کریں" : "Close"}
              >
                <X size={18} />
              </button>
            </div>

            {/* Media Display Area (Video Player or High-Res Image) */}
            <div className="relative w-full bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
              {isVideo ? (
                selectedAd.mediaUrl.includes("youtube.com") || selectedAd.mediaUrl.includes("youtu.be") ? (
                  <iframe
                    src={
                      selectedAd.mediaUrl.includes("watch?v=")
                        ? selectedAd.mediaUrl.replace("watch?v=", "embed/")
                        : selectedAd.mediaUrl.replace("youtu.be/", "youtube.com/embed/")
                    }
                    title={selectedAd.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedAd.mediaUrl}
                    poster={selectedAd.thumbnailUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <img
                  src={selectedAd.mediaUrl}
                  alt={selectedAd.title}
                  className="w-full h-full object-cover sm:object-contain hover:scale-105 transition-transform duration-500"
                />
              )}

              {/* Badge Overlay */}
              <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-300/60 text-amber-300 text-[10px] font-black flex items-center gap-1">
                {isVideo ? <Play size={10} className="fill-amber-300" /> : <Tag size={10} />}
                <span>{isVideo ? (isUrdu ? "ویڈیو ایڈ" : "Video Ad") : (isUrdu ? "تصویر ایڈ" : "Image Ad")}</span>
              </div>
            </div>

            {/* Content & Caption Section */}
            <div className="p-4 sm:p-5 space-y-3.5 bg-gradient-to-b from-white to-[#f4faf6]">
              {/* Title & Price Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#064e3b] leading-snug">
                    {isUrdu ? selectedAd.title : (selectedAd.titleEn || selectedAd.title)}
                  </h2>
                  {selectedAd.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-bold">
                      <MapPin size={13} className="text-emerald-700 shrink-0" />
                      <span>{isUrdu ? selectedAd.location : (selectedAd.locationEn || selectedAd.location)}</span>
                    </div>
                  )}
                </div>

                {selectedAd.price && (
                  <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md border border-amber-500">
                    {isUrdu ? selectedAd.price : (selectedAd.priceEn || selectedAd.price)}
                  </div>
                )}
              </div>

              {/* Caption / Description */}
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80">
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold whitespace-pre-line text-right">
                  {isUrdu ? selectedAd.caption : (selectedAd.captionEn || selectedAd.caption)}
                </p>
              </div>

              {/* 🌟 PROMINENT WHATSAPP ACTION BUTTON: "ابھی خریدنے کے لیے رابطہ کریں" */}
              <div className="pt-1 flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppClick}
                  id="promo-ad-whatsapp-buy-btn"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#20ba59] to-[#128C7E] hover:brightness-105 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(37,211,102,0.35)] border border-emerald-400 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle size={17} className="fill-white" />
                  </div>
                  <span>{isUrdu ? "🟢 ابھی خریدنے کے لیے واٹس ایپ پر رابطہ کریں" : "🟢 Contact on WhatsApp to Buy Now"}</span>
                </motion.button>

                {/* Secondary Action Buttons (Direct Call & Share) */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCallClick}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Phone size={13} className="text-emerald-700" />
                    <span>{isUrdu ? "فوری کال کریں" : "Call Directly"}</span>
                  </button>

                  <button
                    onClick={handleShareClick}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 text-slate-800 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span className="text-emerald-700">{isUrdu ? "لنک کاپی ہو گیا" : "Copied"}</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={13} className="text-amber-700" />
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
