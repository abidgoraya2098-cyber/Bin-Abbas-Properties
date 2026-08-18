import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Star, ExternalLink, Send, CheckCircle2, Heart } from "lucide-react";
import { CONTACT_PHONE, GOOGLE_MAPS_URL } from "../data";

interface RatingLevel {
  stars: number;
  emoji: string;
  label: string;
}

const RATING_LEVELS: RatingLevel[] = [
  { stars: 1, emoji: "😞", label: "بہت برا" },
  { stars: 2, emoji: "😐", label: "مناسب" },
  { stars: 3, emoji: "🙂", label: "اچھا" },
  { stars: 4, emoji: "😊", label: "بہت اچھا" },
  { stars: 5, emoji: "😍", label: "شاندار اور بہترین!" },
];

export default function Feedback() {
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

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const starIcons = "⭐".repeat(rating);
    const nameLine = userName.trim() ? `👤 نام: ${userName.trim()}\n` : "";
    const commentLine = comment.trim() ? `✍️ تبصرہ: ${comment.trim()}\n` : "✍️ تبصرہ: کوئی اضافی تبصرہ نہیں لکھا گیا۔\n";

    const message = `السلام علیکم! فریاد حسن گورائیہ صاحب،\n\nمیں نے بن عباس پراپرٹیز ایپ پر اپنی رائے (Review & Feedback) دی ہے:\n\n${nameLine}⭐ درجہ بندی: ${starIcons} (${activeLevel.label} ${activeLevel.emoji})\n${commentLine}\nشکریہ!`;

    const whatsappUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp reliably
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
        <span>اپنی رائے و ریویو (Feedback) دیں</span>
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            id="feedback-modal-root"
            dir="rtl"
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
              className="relative w-full max-w-[390px] bg-white rounded-3xl p-5 shadow-2xl border-2 border-emerald-300 text-right overflow-hidden z-10 text-slate-900 my-auto"
              id="feedback-modal-body"
            >
              {/* Top Luxury Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-3.5 left-3.5 p-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
                id="feedback-close-btn"
                aria-label="بند کریں"
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
                      آپ کا تجربہ کیسا رہا؟
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      بن عباس پراپرٹیز کی خدمات کے بارے میں اپنی رائے دیں
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
                      <span>{activeLevel.label}</span>
                    </div>
                  </div>

                  {/* User Name Input (Optional) */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      آپ کا نام (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="مثلاً: احمد رضا"
                      className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
                    />
                  </div>

                  {/* Comment Box */}
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      کوئی تجویز یا تبصرہ (اختیاری):
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      placeholder="اپنی قیمتی رائے یہاں لکھیں..."
                      className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
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
                      <span>رائے واٹس ایپ پر بھیجیں</span>
                    </button>

                    {/* Google Map Review Button */}
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-xl transition-all border border-emerald-300 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <ExternalLink size={13} className="text-emerald-700" />
                      <span>گوگل میپس پر 5-اسٹار ریویو دیں</span>
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
                    آپ کی قیمتی رائے کا بہت شکریہ!
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed px-4">
                    بن عباس پراپرٹیز آپ کے اعتماد اور تعاون کی تہہ دل سے مشکور ہے۔
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-1 text-emerald-800 font-bold text-xs">
                    <Heart size={14} className="fill-emerald-600 text-emerald-600" />
                    <span>خوش رہیں!</span>
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
