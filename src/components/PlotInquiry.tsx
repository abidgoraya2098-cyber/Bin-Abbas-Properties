import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tag, Send, ArrowRightLeft, Sparkles, Layers } from "lucide-react";
import { 
  ROYAL_PALM_BLOCKS, 
  RESIDENTIAL_PLOT_SIZES_URDU,
  RESIDENTIAL_PLOT_SIZES_ENGLISH,
  COMMERCIAL_PLOT_SIZES_URDU,
  COMMERCIAL_PLOT_SIZES_ENGLISH,
  PLOT_FEATURES_URDU,
  PLOT_FEATURES_ENGLISH,
  CONTACT_PHONE, 
  OWNER_NAME,
  OWNER_NAME_ENGLISH
} from "../data";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../i18n";

export default function PlotInquiry({ defaultMode = "sell" }: { defaultMode?: "sell" | "buy" }) {
  const { language, isUrdu } = useLanguage();
  const t = getTranslation(language);

  const [activeMode, setActiveMode] = useState<"sell" | "buy">(defaultMode);
  
  // Type filter for sizes: Residential or Commercial
  const [sizeType, setSizeType] = useState<"residential" | "commercial">("residential");

  const residentialSizes = isUrdu ? RESIDENTIAL_PLOT_SIZES_URDU : RESIDENTIAL_PLOT_SIZES_ENGLISH;
  const commercialSizes = isUrdu ? COMMERCIAL_PLOT_SIZES_URDU : COMMERCIAL_PLOT_SIZES_ENGLISH;
  const plotFeatures = isUrdu ? PLOT_FEATURES_URDU : PLOT_FEATURES_ENGLISH;

  // --- SELL FORM STATE ---
  const [sellBlock, setSellBlock] = useState(ROYAL_PALM_BLOCKS[0].name);
  const [sellSize, setSellSize] = useState(residentialSizes[0]);
  const [sellPlotNumber, setSellPlotNumber] = useState("");
  const [sellCategory, setSellCategory] = useState(plotFeatures[0]);
  const [sellDemand, setSellDemand] = useState("");
  const [sellFinalPrice, setSellFinalPrice] = useState("");
  const [sellOwnerName, setSellOwnerName] = useState("");
  const [sellContactPhone, setSellContactPhone] = useState("");
  const [sellNotes, setSellNotes] = useState("");

  // --- BUY FORM STATE ---
  const [buyBlock, setBuyBlock] = useState(isUrdu ? "کوئی بھی بلاک (Any Block)" : "Any Good Block");
  const [buySize, setBuySize] = useState(residentialSizes[0]);
  const [buyCategory, setBuyCategory] = useState(plotFeatures[0]);
  const [buyBudget, setBuyBudget] = useState("");
  const [buyBuyerName, setBuyBuyerName] = useState("");
  const [buyContactPhone, setBuyContactPhone] = useState("");
  const [buyNotes, setBuyNotes] = useState("");

  // Handler for Selling Plot WhatsApp dispatch
  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let message = isUrdu 
      ? `السلام علیکم! محترم فریاد حسن گورائیہ صاحب (${OWNER_NAME})،\n\nمیں رائل پام سٹی میں اپنا *پلاٹ برائے فروخت (Sell Plot)* درج کروانا چاہتا ہوں:\n\n`
      : `Hello Mr. ${OWNER_NAME_ENGLISH},\n\nI would like to submit my plot for sale (*Sell Plot Details*):\n\n`;

    message += isUrdu ? `📍 *بلاک:* ${sellBlock}\n` : `📍 *Block:* ${sellBlock}\n`;
    message += isUrdu ? `📏 *سائز:* ${sellSize}\n` : `📏 *Size:* ${sellSize}\n`;
    
    if (sellPlotNumber.trim()) {
      message += isUrdu ? `🔢 *پلاٹ نمبر:* ${sellPlotNumber.trim()}\n` : `🔢 *Plot #:* ${sellPlotNumber.trim()}\n`;
    }
    if (sellCategory) {
      message += isUrdu ? `🌟 *کیٹیگری:* ${sellCategory}\n` : `🌟 *Category:* ${sellCategory}\n`;
    }
    if (sellDemand.trim()) {
      message += isUrdu ? `💰 *ڈیمانڈ قیمت:* ${sellDemand.trim()}\n` : `💰 *Demand Price:* ${sellDemand.trim()}\n`;
    }
    if (sellFinalPrice.trim()) {
      message += isUrdu ? `🏷️ *فائنل / حتمی ریٹ:* ${sellFinalPrice.trim()}\n` : `🏷️ *Final Price:* ${sellFinalPrice.trim()}\n`;
    }
    if (sellOwnerName.trim()) {
      message += isUrdu ? `👤 *مالک / فروخت کنندہ:* ${sellOwnerName.trim()}\n` : `👤 *Owner Name:* ${sellOwnerName.trim()}\n`;
    }
    if (sellContactPhone.trim()) {
      message += isUrdu ? `📞 *رابطہ نمبر:* ${sellContactPhone.trim()}\n` : `📞 *Contact Phone:* ${sellContactPhone.trim()}\n`;
    }
    if (sellNotes.trim()) {
      message += isUrdu ? `📝 *اضافی تفصیلات:* ${sellNotes.trim()}\n` : `📝 *Notes:* ${sellNotes.trim()}\n`;
    }

    message += isUrdu 
      ? `\nبراہِ کرم اس پلاٹ کی موجودہ تصدیق شدہ مارکیٹ ویلیو اور فوری سودے کی رہنمائی فرمائیں۔ شکریہ!`
      : `\nPlease provide current verified market rates and quick sale assistance for this plot. Thank you!`;

    const whatsappUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Handler for Buying Plot WhatsApp dispatch
  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let message = isUrdu 
      ? `السلام علیکم! محترم فریاد حسن گورائیہ صاحب (${OWNER_NAME})،\n\nمجھے رائل پام سٹی میں *پلاٹ کی خریداری (Buy Plot)* کے لیے تفصیلات درکار ہیں:\n\n`
      : `Hello Mr. ${OWNER_NAME_ENGLISH},\n\nI am looking to buy a plot (*Buy Plot Inquiry*) in Royal Palm City:\n\n`;

    message += isUrdu ? `📍 *پسندیدہ بلاک:* ${buyBlock}\n` : `📍 *Preferred Block:* ${buyBlock}\n`;
    message += isUrdu ? `📏 *مطلوبہ سائز:* ${buySize}\n` : `📏 *Desired Size:* ${buySize}\n`;
    
    if (buyCategory) {
      message += isUrdu ? `🌟 *ترجیحی کیٹیگری:* ${buyCategory}\n` : `🌟 *Category:* ${buyCategory}\n`;
    }
    if (buyBudget.trim()) {
      message += isUrdu ? `💵 *بجٹ رینج / زیادہ سے زیادہ قیمت:* ${buyBudget.trim()}\n` : `💵 *Budget Limit:* ${buyBudget.trim()}\n`;
    }
    if (buyBuyerName.trim()) {
      message += isUrdu ? `👤 *خریدار کا نام:* ${buyBuyerName.trim()}\n` : `👤 *Buyer Name:* ${buyBuyerName.trim()}\n`;
    }
    if (buyContactPhone.trim()) {
      message += isUrdu ? `📞 *رابطہ نمبر:* ${buyContactPhone.trim()}\n` : `📞 *Contact Phone:* ${buyContactPhone.trim()}\n`;
    }
    if (buyNotes.trim()) {
      message += isUrdu ? `📝 *خصوصی فرمائش / نوٹس:* ${buyNotes.trim()}\n` : `📝 *Notes:* ${buyNotes.trim()}\n`;
    }

    message += isUrdu 
      ? `\nبراہِ کرم اس معیار کے دستیاب بہترین آپشنز اور موجودہ ریٹ لسٹ ارسال فرمائیں۔ شکریہ!`
      : `\nPlease share matching available plot options and current price list. Thank you!`;

    const whatsappUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className={`w-full my-3 bg-white/95 rounded-2xl p-3.5 sm:p-4 border-2 border-emerald-200 shadow-md backdrop-blur-md ${isUrdu ? "text-right" : "text-left"}`}
      id="plot-inquiry-section"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <ArrowRightLeft size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-emerald-950">
              {t.inquiryTitle}
            </h3>
            <p className="text-[10px] text-slate-600">
              {t.inquirySubtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm">
          {t.allFieldsOptional}
        </span>
      </div>

      {/* 100% Privacy & Dealer Direct Guarantee Banner */}
      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/40 text-emerald-950 flex items-start gap-2">
        <span className="text-sm leading-none shrink-0 mt-0.5">🔒</span>
        <p className="text-[10px] sm:text-[10.5px] font-bold leading-relaxed text-emerald-900">
          {t.privacyNotice}
        </p>
      </div>

      {/* Main Switcher: پلاٹ فروخت کریں vs پلاٹ خریدیں */}
      <div className="grid grid-cols-2 gap-2 mt-3 p-1.5 bg-emerald-50/90 rounded-2xl border border-emerald-200 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveMode("sell")}
          className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeMode === "sell"
              ? "bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white shadow-md border border-amber-300"
              : "text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/70"
          }`}
          id="mode-sell-btn"
        >
          <Tag size={14} className={activeMode === "sell" ? "text-amber-300" : "text-emerald-700"} />
          <span>{t.sellModeBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("buy")}
          className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeMode === "buy"
              ? "bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white shadow-md border border-amber-300"
              : "text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/70"
          }`}
          id="mode-buy-btn"
        >
          <Sparkles size={14} className={activeMode === "buy" ? "text-amber-300" : "text-emerald-700"} />
          <span>{t.buyModeBtn}</span>
        </button>
      </div>

      {/* Sub-Category Filter: Residential / Commercial */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
          <Layers size={13} className="text-emerald-700" />
          <span>{t.plotTypeLabel}</span>
        </span>
        <div className="flex items-center gap-1 bg-emerald-100/70 p-1 rounded-xl border border-emerald-200">
          <button
            type="button"
            onClick={() => {
              setSizeType("residential");
              if (activeMode === "sell") setSellSize(residentialSizes[0]);
              else setBuySize(residentialSizes[0]);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              sizeType === "residential"
                ? "bg-emerald-700 text-white font-black shadow-sm"
                : "text-emerald-900 hover:text-emerald-950"
            }`}
          >
            {t.residential}
          </button>
          <button
            type="button"
            onClick={() => {
              setSizeType("commercial");
              if (activeMode === "sell") setSellSize(commercialSizes[0]);
              else setBuySize(commercialSizes[0]);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              sizeType === "commercial"
                ? "bg-emerald-700 text-white font-black shadow-sm"
                : "text-emerald-900 hover:text-emerald-950"
            }`}
          >
            {t.commercial}
          </button>
        </div>
      </div>

      {/* Dynamic Form Body */}
      <AnimatePresence mode="wait">
        {/* ==================================================== */}
        {/* FORM 1: SELL PLOT                                    */}
        {/* ==================================================== */}
        {activeMode === "sell" && (
          <motion.form
            key="sell-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSellSubmit}
            className="space-y-3 mt-3"
            id="sell-plot-form"
          >
            {/* 1. Block Selector */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                {t.blockLabelSell}
              </label>
              <select
                value={sellBlock}
                onChange={(e) => setSellBlock(e.target.value)}
                className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                id="sell-block-select"
              >
                {ROYAL_PALM_BLOCKS.map((b) => (
                  <option key={b.id} value={isUrdu ? b.name : (b.nameEn || b.name)} className="bg-white text-slate-900">
                    {isUrdu ? `${b.name} — (${b.desc})` : `${b.nameEn || b.name} — (${b.descEn || b.desc})`}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Plot Size Selector */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                {t.sizeLabel} ({sizeType === "residential" ? t.residential : t.commercial})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(sizeType === "residential" ? residentialSizes : commercialSizes).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSellSize(size)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border truncate ${
                      sellSize === size
                        ? "bg-gradient-to-r from-emerald-700 to-emerald-600 text-white border-emerald-700 font-black shadow-md scale-[1.02]"
                        : "bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:border-emerald-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Plot Number & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.plotNoLabel}
                </label>
                <input
                  type="text"
                  value={sellPlotNumber}
                  onChange={(e) => setSellPlotNumber(e.target.value)}
                  placeholder={t.plotNoPlaceholder}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="sell-plot-number-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.categoryLabelSell}
                </label>
                <select
                  value={sellCategory}
                  onChange={(e) => setSellCategory(e.target.value)}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="sell-category-select"
                >
                  {plotFeatures.map((feat, idx) => (
                    <option key={idx} value={feat} className="bg-white text-slate-900">
                      {feat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Demand & Final Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.demandLabel}
                </label>
                <input
                  type="text"
                  value={sellDemand}
                  onChange={(e) => setSellDemand(e.target.value)}
                  placeholder={t.demandPlaceholder}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="sell-demand-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.finalPriceLabel}
                </label>
                <input
                  type="text"
                  value={sellFinalPrice}
                  onChange={(e) => setSellFinalPrice(e.target.value)}
                  placeholder={t.finalPricePlaceholder}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="sell-final-price-input"
                />
              </div>
            </div>

            {/* 5. Owner Name & Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.ownerNameLabel}
                </label>
                <input
                  type="text"
                  value={sellOwnerName}
                  onChange={(e) => setSellOwnerName(e.target.value)}
                  placeholder={t.ownerNamePlaceholder}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="sell-owner-name-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="text"
                  value={sellContactPhone}
                  onChange={(e) => setSellContactPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="sell-phone-input"
                />
              </div>
            </div>

            {/* 6. Additional Notes */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                {t.notesLabelSell}
              </label>
              <textarea
                value={sellNotes}
                onChange={(e) => setSellNotes(e.target.value)}
                rows={2}
                placeholder={t.notesPlaceholderSell}
                className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                id="sell-notes-textarea"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-emerald-500 mt-2"
              id="submit-sell-btn"
            >
              <Send size={15} />
              <span>{t.submitSellBtn}</span>
            </button>
          </motion.form>
        )}

        {/* ==================================================== */}
        {/* FORM 2: BUY PLOT                                     */}
        {/* ==================================================== */}
        {activeMode === "buy" && (
          <motion.form
            key="buy-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleBuySubmit}
            className="space-y-3 mt-3"
            id="buy-plot-form"
          >
            {/* 1. Preferred Block */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                {t.blockLabelBuy}
              </label>
              <select
                value={buyBlock}
                onChange={(e) => setBuyBlock(e.target.value)}
                className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                id="buy-block-select"
              >
                <option value={t.anyBlockOption} className="bg-white text-slate-900">
                  {t.anyBlockOption}
                </option>
                {ROYAL_PALM_BLOCKS.map((b) => (
                  <option key={b.id} value={isUrdu ? b.name : (b.nameEn || b.name)} className="bg-white text-slate-900">
                    {isUrdu ? `${b.name} — (${b.desc})` : `${b.nameEn || b.name} — (${b.descEn || b.desc})`}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Desired Plot Size */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                {t.sizeLabel} ({sizeType === "residential" ? t.residential : t.commercial})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(sizeType === "residential" ? residentialSizes : commercialSizes).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setBuySize(size)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border truncate ${
                      buySize === size
                        ? "bg-gradient-to-r from-emerald-700 to-emerald-600 text-white border-emerald-700 font-black shadow-md scale-[1.02]"
                        : "bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:border-emerald-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Preferred Category & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.categoryLabelBuy}
                </label>
                <select
                  value={buyCategory}
                  onChange={(e) => setBuyCategory(e.target.value)}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="buy-category-select"
                >
                  {plotFeatures.map((feat, idx) => (
                    <option key={idx} value={feat} className="bg-white text-slate-900">
                      {feat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.budgetLabel}
                </label>
                <input
                  type="text"
                  value={buyBudget}
                  onChange={(e) => setBuyBudget(e.target.value)}
                  placeholder={t.budgetPlaceholder}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="buy-budget-input"
                />
              </div>
            </div>

            {/* 4. Buyer Name & Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.buyerNameLabel}
                </label>
                <input
                  type="text"
                  value={buyBuyerName}
                  onChange={(e) => setBuyBuyerName(e.target.value)}
                  placeholder={t.buyerNamePlaceholder}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="buy-name-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="text"
                  value={buyContactPhone}
                  onChange={(e) => setBuyContactPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                  id="buy-phone-input"
                />
              </div>
            </div>

            {/* 5. Special Notes / Request */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                {t.notesLabelBuy}
              </label>
              <textarea
                value={buyNotes}
                onChange={(e) => setBuyNotes(e.target.value)}
                rows={2}
                placeholder={t.notesPlaceholderBuy}
                className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${isUrdu ? "text-right" : "text-left"}`}
                id="buy-notes-textarea"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-emerald-500 mt-2"
              id="submit-buy-btn"
            >
              <Send size={15} />
              <span>{t.submitBuyBtn}</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
