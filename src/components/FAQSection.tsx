import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { FAQS } from "../data";

export default function FAQSection() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="w-full my-3 bg-white/95 rounded-2xl p-3.5 sm:p-4 border-2 border-emerald-200 shadow-md text-right backdrop-blur-md" id="faqs-section">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <HelpCircle size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-emerald-950">
              اکثر پوچھے جانے والے سوالات
            </h3>
            <p className="text-[10px] text-slate-600">
              رائل پام سٹی اور بن عباس پراپرٹیز سے متعلق رہنما معلومات
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="space-y-2 mt-3.5">
        {FAQS.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-xl border border-emerald-200 overflow-hidden bg-emerald-50/50 shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-3 text-right flex items-center justify-between gap-2 hover:bg-emerald-100/60 transition-colors cursor-pointer"
              >
                <span className="text-xs font-black text-emerald-950 leading-relaxed">
                  {faq.question}
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
                    <div className="p-3 pt-1 text-[11px] text-slate-700 leading-relaxed border-t border-emerald-200/60 bg-white/90">
                      {faq.answer}
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
