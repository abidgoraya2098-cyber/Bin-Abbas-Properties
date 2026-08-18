import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Star, ExternalLink, Send, CheckCircle2, Heart } from "lucide-react";
import { CONTACT_PHONE, GOOGLE_MAPS_URL, OWNER_NAME, OWNER_NAME_ENGLISH } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../i18n";

interface RatingLevel {
  stars: number;
  emoji: string;
  labelUrdu: string;
  labelEnglish: string;
}

const RATING_LEVELS: RatingLevel[] = [
  { stars: 1, emoji: "😞", labelUrdu: "بہت برا", labelEnglish: "Very Bad" },
  { stars: 2, emoji: "😐", labelUrdu: "مناسب", labelEnglish: "Fair" },
  { stars: 3, emoji: "🙂", labelUrdu: "اچھا", labelEnglish: "Good" },
  { stars: 4, emoji: "😊", labelUrdu: "بہت اچھا", labelEnglish: "Very Good" },
  { stars: 5, emoji: "😍", labelUrdu: "شاندار اور بہترین!", labelEnglish: "Outstanding & Excellent!" },
];

export default function Feedback() {
  const { language, isUrdu } = useLanguage();
  const t = getTranslation(language);

  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const activeLevel = RATING_LEVELS.find((l) => l.stars === (hoverRating || rating)) || RATING_LEVELS[4];
  const activeLabel = isUrdu ? activeLevel.labelUrdu : activeLevel.labelEnglish;

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const starIcons = "⭐".repeat(rating);
    let message = isUrdu
      ? `السلام علیکم! محترم فریاد حسن گورائیہ صاحب (${OWNER_NAME})،\n\nمیں نے بن عباس پراپرٹیز ایپ پر اپنا ریویو (Review & Feedback) دیا ہے:\n\n`
      : `Hello Mr. ${OWNER_NAME_ENGLISH},\n\nI have submitted my review & feedback on Bin Abbas Properties app:\n\n`;

    if (userName.trim()) {
      message += isUrdu ? `👤 *نام:* ${userName.trim()}\n` : `👤 *Name:* ${userName.trim()}\n`;
    }
    message += isUrdu 
      ? `⭐ *درجہ بندی:* ${starIcons} (${activeLabel} ${activeLevel.emoji})\n` 
      : `⭐ *Rating:* ${starIcons} (${activeLabel} ${activeLevel.emoji})\n`;

    if (comment.trim()) {
      message += isUrdu ? `✍️ *تبصرہ:* ${comment.trim()}\n` : `✍️ *Feedback:* ${comment.trim()}\n`;
    } else {
      message += isUrdu ? `✍️ *تبصرہ:* بہترین خدمات!\n` : `✍️ *Feedback:* Excellent services!\n`;
    }

    message += isUrdu ? `\nشکریہ!` : `\nThank you!`;

    const whatsappUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
      setComment("");
      setUserName("");
      setRating(5);
    }, 2800);
  };

  return (
    <div className="mt-4 pt-3.5 border-t border-emerald-200 text-center" id="feedback-module">
      {/* Feedback Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 hover:brightness-105 text-white font-black text-xs sm:text-sm shadow-md transition-all duration-200 cursor-pointer focus:outline-none border border-amber-300"
        id="feedback-trigger-btn"
      >
        <MessageSquare size={16} className="text-amber-300" />
        <span>{t.feedbackTriggerBtn}</span>
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            id="feedback-modal-root"
            dir={isUrdu ? "rtl" : "ltr"}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              id="feedback-backdrop"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 360 }}
              className={`relative w-full max-w-[390px] bg-white rounded-3xl p-5 shadow-2xl border-2 border-emerald-300 overflow-hidden z-10 text-slate-900 my-auto ${isUrdu ? "text-right" : "text-left"}`}
              id="feedback-modal-body"
            >
              {/* Top Luxury Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`absolute top-3.5 p-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 ${isUrdu ? "left-3.5" : "right-3.5"}`}
                id="feedback-close-btn"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {!isSubmitted ? (
                <form onSubmit={handleSubmitWhatsApp} className="space-y-3.5 mt-1" id="feedback-form">
                  {/* Modal Header */}
                  <div className="text-center pt-1">
                    <div className="w-11 h-11 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto mb-1.5 text-amber-600 shadow-inner">
                      <Star size={22} className="fill-amber-500 text-amber-500" />
                    </div>
                    <h3 className="text-base font-black text-emerald-950">
                      {t.feedbackModalTitle}
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {t.feedbackModalSubtitle}
                    </p>
                  </div>

                  {/* Star Rating Interactive Selector */}
                  <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-center">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5" dir="ltr">
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const isFilled = (hoverRating || rating) >= starValue;
                        return (
                          <button
                            key={starValue}
                            type="button"
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 rounded-lg transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                            aria-label={`${starValue} Stars`}
                          >
                            <Star
                              size={28}
                              className={`transition-colors duration-150 ${
                                isFilled
                                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                                  : "text-slate-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Label & Emoji */}
                    <div className="text-xs font-black text-emerald-900 flex items-center justify-center gap-1.5">
                      <span className="text-base">{activeLevel.emoji}</span>
                      <span>{activeLabel}</span>
                    </div>
                  </div>

                  {/* User Name Input (Optional) */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      {t.feedbackNameLabel}
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={isUrdu ? "مثلاً: احمد رضا" : "e.g. Ahmad Raza"}
                      className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                    />
                  </div>

                  {/* Comment Box */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      {t.feedbackCommentLabel}
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      placeholder={isUrdu ? "اپنی قیمتی رائے یہاں لکھیں..." : "Write your thoughts here..."}
                      className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                    />
                  </div>

                  {/* Action Buttons: WhatsApp & Google Review */}
                  <div className="space-y-2 pt-1">
                    {/* Submit on WhatsApp */}
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-emerald-500"
                    >
                      <Send size={15} />
                      <span>{t.feedbackSubmitBtn}</span>
                    </button>

                    {/* Google Map Review Button */}
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-xl transition-all border border-emerald-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <ExternalLink size={13} className="text-emerald-700" />
                      <span>{t.feedbackGoogleReviewBtn}</span>
                    </a>
                  </div>
                </form>
              ) : (
                /* Success Animation State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-2.5"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300 shadow-inner">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h4 className="text-base font-black text-emerald-950">
                    {t.feedbackThankTitle}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed px-4">
                    {t.feedbackThankDesc}
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-1 text-emerald-800 font-bold text-xs">
                    <Heart size={14} className="fill-emerald-600 text-emerald-600" />
                    <span>{t.feedbackStayBlessed}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
