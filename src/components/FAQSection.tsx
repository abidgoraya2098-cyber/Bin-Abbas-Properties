import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { FAQS } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../i18n";

export default function FAQSection() {
  const { language, isUrdu } = useLanguage();
  const t = getTranslation(language);

  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div 
      className={`w-full my-3 bg-white/95 rounded-2xl p-3.5 sm:p-4 border-2 border-emerald-200 shadow-md backdrop-blur-md ${isUrdu ? "text-right" : "text-left"}`} 
      id="faqs-section"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <HelpCircle size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-emerald-950">
              {t.faqsTitle}
            </h3>
            <p className="text-[10px] text-slate-600">
              {t.faqsSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="space-y-2 mt-3.5">
        {FAQS.map((faq) => {
          const isOpen = openFaqId === faq.id;
          const currentQuestion = isUrdu ? faq.question : (faq.questionEn || faq.question);
          const currentAnswer = isUrdu ? faq.answer : (faq.answerEn || faq.answer);

          return (
            <div
              key={faq.id}
              className="rounded-xl border border-emerald-200 overflow-hidden bg-emerald-50/50 shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className={`w-full p-3 flex items-center justify-between gap-2 hover:bg-emerald-100/60 transition-colors cursor-pointer ${isUrdu ? "text-right" : "text-left"}`}
              >
                <span className="text-xs font-black text-emerald-950 leading-relaxed">
                  {currentQuestion}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-emerald-800 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-3 pt-1 text-[11px] text-slate-700 leading-relaxed border-t border-emerald-200/60 bg-white/90 ${isUrdu ? "text-right" : "text-left"}`}>
                      {currentAnswer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
