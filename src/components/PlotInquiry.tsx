import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tag, Send, ArrowRightLeft, Sparkles, Layers } from "lucide-react";
import { 
  ROYAL_PALM_BLOCKS, 
  RESIDENTIAL_PLOT_SIZES, 
  COMMERCIAL_PLOT_SIZES, 
  PLOT_FEATURES, 
  CONTACT_PHONE, 
  OWNER_NAME 
} from "../data";

export default function PlotInquiry({ defaultMode = "sell" }: { defaultMode?: "sell" | "buy" }) {
  const [activeMode, setActiveMode] = useState<"sell" | "buy">(defaultMode);
  
  // Type filter for sizes: Residential or Commercial
  const [sizeType, setSizeType] = useState<"all" | "residential" | "commercial">("residential");

  // --- SELL FORM STATE (All Optional) ---
  const [sellBlock, setSellBlock] = useState(ROYAL_PALM_BLOCKS[0].name);
  const [sellSize, setSellSize] = useState(RESIDENTIAL_PLOT_SIZES[0]);
  const [sellPlotNumber, setSellPlotNumber] = useState("");
  const [sellCategory, setSellCategory] = useState(PLOT_FEATURES[0]);
  const [sellDemand, setSellDemand] = useState("");
  const [sellFinalPrice, setSellFinalPrice] = useState("");
  const [sellOwnerName, setSellOwnerName] = useState("");
  const [sellContactPhone, setSellContactPhone] = useState("");
  const [sellNotes, setSellNotes] = useState("");

  // --- BUY FORM STATE (All Optional) ---
  const [buyBlock, setBuyBlock] = useState("کوئی بھی بلاک (Any Block)");
  const [buySize, setBuySize] = useState(RESIDENTIAL_PLOT_SIZES[0]);
  const [buyCategory, setBuyCategory] = useState(PLOT_FEATURES[0]);
  const [buyBudget, setBuyBudget] = useState("");
  const [buyBuyerName, setBuyBuyerName] = useState("");
  const [buyContactPhone, setBuyContactPhone] = useState("");
  const [buyNotes, setBuyNotes] = useState("");

  // Handler for Selling Plot WhatsApp dispatch
  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let message = `السلام علیکم! محترم فریاد حسن گورائیہ صاحب (${OWNER_NAME})،\n\n`;
    message += `میں رائل پام سٹی میں اپنا *پلاٹ برائے فروخت (Sell Plot)* درج کروانا چاہتا ہوں:\n\n`;
    message += `📍 *بلاک:* ${sellBlock}\n`;
    message += `📏 *سائز:* ${sellSize}\n`;
    
    if (sellPlotNumber.trim()) {
      message += `🔢 *پلاٹ نمبر:* ${sellPlotNumber.trim()}\n`;
    }
    if (sellCategory) {
      message += `🌟 *کیٹیگری:* ${sellCategory}\n`;
    }
    if (sellDemand.trim()) {
      message += `💰 *ڈیمانڈ قیمت:* ${sellDemand.trim()}\n`;
    }
    if (sellFinalPrice.trim()) {
      message += `🏷️ *فائنل / حتمی ریٹ:* ${sellFinalPrice.trim()}\n`;
    }
    if (sellOwnerName.trim()) {
      message += `👤 *مالک / فروخت کنندہ:* ${sellOwnerName.trim()}\n`;
    }
    if (sellContactPhone.trim()) {
      message += `📞 *رابطہ نمبر:* ${sellContactPhone.trim()}\n`;
    }
    if (sellNotes.trim()) {
      message += `📝 *اضافی تفصیلات:* ${sellNotes.trim()}\n`;
    }

    message += `\nبراہِ کرم اس پلاٹ کی موجودہ تصدیق شدہ مارکیٹ ویلیو اور فوری سودے کی رہنمائی فرمائیں۔ شکریہ!`;

    const whatsappUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Handler for Buying Plot WhatsApp dispatch
  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let message = `السلام علیکم! محترم فریاد حسن گورائیہ صاحب (${OWNER_NAME})،\n\n`;
    message += `مجھے رائل پام سٹی میں *پلاٹ کی خریداری (Buy Plot)* کے لیے تفصیلات درکار ہیں:\n\n`;
    message += `📍 *پسندیدہ بلاک:* ${buyBlock}\n`;
    message += `📏 *مطلوبہ سائز:* ${buySize}\n`;
    
    if (buyCategory) {
      message += `🌟 *ترجیحی کیٹیگری:* ${buyCategory}\n`;
    }
    if (buyBudget.trim()) {
      message += `💵 *بجٹ رینج / زیادہ سے زیادہ قیمت:* ${buyBudget.trim()}\n`;
    }
    if (buyBuyerName.trim()) {
      message += `👤 *خریدار کا نام:* ${buyBuyerName.trim()}\n`;
    }
    if (buyContactPhone.trim()) {
      message += `📞 *رابطہ نمبر:* ${buyContactPhone.trim()}\n`;
    }
    if (buyNotes.trim()) {
      message += `📝 *خصوصی فرمائش / نوٹس:* ${buyNotes.trim()}\n`;
    }

    message += `\nبراہِ کرم اس معیار کے دستیاب بہترین آپشنز اور موجودہ ریٹ لسٹ ارسال فرمائیں۔ شکریہ!`;

    const whatsappUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className="w-full my-3 bg-white/95 rounded-2xl p-3.5 sm:p-4 border-2 border-emerald-200 shadow-md text-right backdrop-blur-md" 
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
              پلاٹ خرید و فروخت فارم
            </h3>
            <p className="text-[10px] text-slate-600">
              کوائف درج کریں اور 1 کلک پر واٹس ایپ پر ارسال کریں
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm">
          تمام فیلڈز اختیاری ⚡
        </span>
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
          <span>پلاٹ فروخت کریں (Sell)</span>
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
          <span>پلاٹ خریدیں (Buy)</span>
        </button>
      </div>

      {/* Sub-Category Filter: Residential / Commercial */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
          <Layers size={13} className="text-emerald-700" />
          <span>پلاٹ کی نوعیت منتخب کریں:</span>
        </span>
        <div className="flex items-center gap-1 bg-emerald-100/70 p-1 rounded-xl border border-emerald-200">
          <button
            type="button"
            onClick={() => {
              setSizeType("residential");
              if (activeMode === "sell") setSellSize(RESIDENTIAL_PLOT_SIZES[0]);
              else setBuySize(RESIDENTIAL_PLOT_SIZES[0]);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              sizeType === "residential"
                ? "bg-emerald-700 text-white font-black shadow-sm"
                : "text-emerald-900 hover:text-emerald-950"
            }`}
          >
            رہائشی پلاٹ
          </button>
          <button
            type="button"
            onClick={() => {
              setSizeType("commercial");
              if (activeMode === "sell") setSellSize(COMMERCIAL_PLOT_SIZES[0]);
              else setBuySize(COMMERCIAL_PLOT_SIZES[0]);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              sizeType === "commercial"
                ? "bg-emerald-700 text-white font-black shadow-sm"
                : "text-emerald-900 hover:text-emerald-950"
            }`}
          >
            کمرشل پلاٹ
          </button>
        </div>
      </div>

      {/* Dynamic Form Body */}
      <AnimatePresence mode="wait">
        {/* ==================================================== */}
        {/* FORM 1: SELL PLOT (پلاٹ فروخت کریں)                   */}
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
                1. سوسائٹی بلاک کا نام:
              </label>
              <select
                value={sellBlock}
                onChange={(e) => setSellBlock(e.target.value)}
                className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-right cursor-pointer shadow-inner"
                id="sell-block-select"
              >
                {ROYAL_PALM_BLOCKS.map((b) => (
                  <option key={b.id} value={b.name} className="bg-white text-slate-900">
                    {b.name} — ({b.desc})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Plot Size Selector */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                2. پلاٹ کا سائز ({sizeType === "residential" ? "رہائشی" : "کمرشل"}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(sizeType === "residential" ? RESIDENTIAL_PLOT_SIZES : COMMERCIAL_PLOT_SIZES).map((size) => (
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

            {/* 3. Plot Number & Category in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Plot Number */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  3. پلاٹ نمبر (اختیاری):
                </label>
                <input
                  type="text"
                  value={sellPlotNumber}
                  onChange={(e) => setSellPlotNumber(e.target.value)}
                  placeholder="مثلاً: پلاٹ نمبر 145"
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
                  id="sell-plot-number-input"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  4. پلاٹ کی کیٹیگری (اختیاری):
                </label>
                <select
                  value={sellCategory}
                  onChange={(e) => setSellCategory(e.target.value)}
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-right cursor-pointer shadow-inner"
                  id="sell-category-select"
                >
                  {PLOT_FEATURES.map((feat, idx) => (
                    <option key={idx} value={feat} className="bg-white text-slate-900">
                      {feat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Demand & Final Price in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Demand Price */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  5. پلاٹ کی ڈیمانڈ (اختیاری):
                </label>
                <input
                  type="text"
                  value={sellDemand}
                  onChange={(e) => setSellDemand(e.target.value)}
                  placeholder="مثلاً: 75 لاکھ یا 1.20 کروڑ"
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
                  id="sell-demand-input"
                />
              </div>

              {/* Final Rock-bottom Price */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  6. فائنل / حتمی قیمت (اختیاری):
                </label>
                <input
                  type="text"
                  value={sellFinalPrice}
                  onChange={(e) => setSellFinalPrice(e.target.value)}
                  placeholder="مثلاً: 70 لاکھ فائنل"
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
                  id="sell-final-price-input"
                />
              </div>
            </div>

            {/* 5. Owner Name & Contact Phone (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  7. مالک کا نام (اختیاری):
                </label>
                <input
                  type="text"
                  value={sellOwnerName}
                  onChange={(e) => setSellOwnerName(e.target.value)}
                  placeholder="مثلاً: ملک عثمان"
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
                  id="sell-owner-name-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  8. موبائل / واٹس ایپ نمبر (اختیاری):
                </label>
                <input
                  type="text"
                  value={sellContactPhone}
                  onChange={(e) => setSellContactPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
                  id="sell-phone-input"
                />
              </div>
            </div>

            {/* 6. Additional Notes */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                9. اضافی تفصیل یا ریمارکس (اختیاری):
              </label>
              <textarea
                value={sellNotes}
                onChange={(e) => setSellNotes(e.target.value)}
                rows={2}
                placeholder="مثلاً: فائل کلیئر ہے، فوری رجسٹری یا پوزیشن دستیاب ہے..."
                className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
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
              <span>پلاٹ کے کوائف واٹس ایپ پر بھیجیں</span>
            </button>
          </motion.form>
        )}

        {/* ==================================================== */}
        {/* FORM 2: BUY PLOT (پلاٹ خریدیں)                        */}
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
                1. من پسند بلاک کا انتخاب (اختیاری):
              </label>
              <select
                value={buyBlock}
                onChange={(e) => setBuyBlock(e.target.value)}
                className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-right cursor-pointer shadow-inner"
                id="buy-block-select"
              >
                <option value="کوئی بھی بلاک (Any Block)" className="bg-white text-slate-900">
                  کسی بھی اچھے بلاک میں دستیاب ہو
                </option>
                {ROYAL_PALM_BLOCKS.map((b) => (
                  <option key={b.id} value={b.name} className="bg-white text-slate-900">
                    {b.name} — ({b.desc})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Desired Plot Size */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                2. مطلوبہ پلاٹ سائز ({sizeType === "residential" ? "رہائشی" : "کمرشل"}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(sizeType === "residential" ? RESIDENTIAL_PLOT_SIZES : COMMERCIAL_PLOT_SIZES).map((size) => (
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
              {/* Preferred Category */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  3. ترجیحی کیٹیگری (اختیاری):
                </label>
                <select
                  value={buyCategory}
                  onChange={(e) => setBuyCategory(e.target.value)}
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-right cursor-pointer shadow-inner"
                  id="buy-category-select"
                >
                  {PLOT_FEATURES.map((feat, idx) => (
                    <option key={idx} value={feat} className="bg-white text-slate-900">
                      {feat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget / Price Limit */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  4. متوقع بجٹ کی حد (اختیاری):
                </label>
                <input
                  type="text"
                  value={buyBudget}
                  onChange={(e) => setBuyBudget(e.target.value)}
                  placeholder="مثلاً: 50 سے 60 لاکھ تک"
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
                  id="buy-budget-input"
                />
              </div>
            </div>

            {/* 4. Buyer Name & Contact Phone (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  5. آپ کا نام (اختیاری):
                </label>
                <input
                  type="text"
                  value={buyBuyerName}
                  onChange={(e) => setBuyBuyerName(e.target.value)}
                  placeholder="مثلاً: چوہدری کاشف"
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
                  id="buy-name-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  6. رابطہ نمبر / واٹس ایپ (اختیاری):
                </label>
                <input
                  type="text"
                  value={buyContactPhone}
                  onChange={(e) => setBuyContactPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
                  id="buy-phone-input"
                />
              </div>
            </div>

            {/* 5. Special Notes / Request */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                7. کوئی خاص فرمائش یا پیغام (اختیاری):
              </label>
              <textarea
                value={buyNotes}
                onChange={(e) => setBuyNotes(e.target.value)}
                rows={2}
                placeholder="مثلاً: مجھے فوری گھر بنانے کے لیے پلاٹ چاہیے، پارک فیسنگ ترجیح ہے..."
                className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right shadow-inner"
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
              <span>پلاٹ خریداری انکوائری واٹس ایپ پر بھیجیں</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
