import React from "react";
import { motion } from "motion/react";
import { Play, Sparkles, Image, MessageCircle, ArrowLeft, ArrowRight, Eye, Video, FileText } from "lucide-react";
import { usePromoAds } from "../context/PromoAdContext";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";

export default function PromoAdBanner() {
  const { activeAds, openAd } = usePromoAds();
  const { isUrdu } = useLanguage();
  const { isAdmin, setIsLoginModalOpen } = useAdmin();

  if (activeAds.length === 0) return null;

  return (
    <div className="my-3 space-y-2.5" id="promo-ads-banner-section">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-lg bg-amber-400 text-slate-950">
            <Sparkles size={13} />
          </span>
          <h3 className="text-xs sm:text-sm font-black text-emerald-950">
            {isUrdu ? "خصوصی ویڈیو اور تصویر ایڈز (Featured Ads)" : "Featured Video & Image Ads"}
          </h3>
        </div>

        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
          {activeAds.length} {isUrdu ? "ایڈز لائیو" : "Active Ads"}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {activeAds.map((ad, idx) => {
          const isVideo = ad.type === "video";
          const isImage = ad.type === "image";

          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => openAd(ad)}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a4d30] via-[#083c25] to-[#042416] text-white p-3 sm:p-3.5 border-2 border-amber-400/80 shadow-[0_8px_20px_rgba(10,50,30,0.18)] cursor-pointer group select-none"
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail Preview */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-amber-300/40 bg-black/50 flex items-center justify-center">
                  {isVideo && ad.mediaUrl ? (
                    <video
                      src={ad.mediaUrl}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : isImage && ad.mediaUrl ? (
                    <img
                      src={ad.mediaUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-900 flex items-center justify-center text-amber-300">
                      <FileText size={28} />
                    </div>
                  )}

                  {/* Floating Play or Image Badge */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {isVideo ? (
                        <Play size={14} className="fill-slate-950 ml-0.5" />
                      ) : (
                        <Image size={14} />
                      )}
                    </div>
                  </div>

                  <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-black text-amber-300">
                    {isVideo ? "VIDEO" : isImage ? "PHOTO" : "NOTICE"}
                  </span>
                </div>

                {/* Content Details */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black tracking-wide">
                      {ad.price || (isUrdu ? "خصوصی ڈیل" : "Hot Deal")}
                    </span>

                    <span className="text-[9.5px] text-emerald-200 font-semibold flex items-center gap-1">
                      <Eye size={10} />
                      <span>{ad.viewCount || 1}</span>
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-white leading-tight line-clamp-1 group-hover:text-amber-200 transition-colors">
                    {isUrdu ? ad.title : (ad.titleEn || ad.title)}
                  </h4>

                  {ad.caption && (
                    <p className="text-[10.5px] text-emerald-100/90 line-clamp-2 mt-1 leading-snug font-medium">
                      {isUrdu ? ad.caption : (ad.captionEn || ad.caption)}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-emerald-700/60">
                    <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                      <MessageCircle size={11} />
                      <span>{isUrdu ? "فل سکرین دیکھیں اور خریدیں" : "View Full Screen & Buy"}</span>
                    </span>

                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      {isUrdu ? <ArrowLeft size={11} /> : <ArrowRight size={11} />}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
