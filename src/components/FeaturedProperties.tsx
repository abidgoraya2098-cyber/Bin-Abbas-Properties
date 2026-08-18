import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageCircle, Check, PlusCircle, X, Send, Trash2, Tag, Layers, MapPin, DollarSign, User, Phone, FileText } from "lucide-react";
import { FEATURED_PROPERTIES, ROYAL_PALM_BLOCKS, RESIDENTIAL_PLOT_SIZES, COMMERCIAL_PLOT_SIZES, PLOT_FEATURES, CONTACT_PHONE, OWNER_NAME } from "../data";
import { PropertyListing } from "../types";

export default function FeaturedProperties() {
  const [filter, setFilter] = useState<"all" | "residential" | "commercial" | "rent">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customDeals, setCustomDeals] = useState<PropertyListing[]>([]);

  // Load custom added verbal/office deals from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bin_abbas_custom_deals");
      if (saved) {
        setCustomDeals(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load custom deals:", e);
    }
  }, []);

  // Save custom deals to localStorage
  const saveCustomDeals = (deals: PropertyListing[]) => {
    setCustomDeals(deals);
    try {
      localStorage.setItem("bin_abbas_custom_deals", JSON.stringify(deals));
    } catch (e) {
      console.warn("Could not save custom deals:", e);
    }
  };

  // --- NEW DEAL FORM STATE (All Optional) ---
  const [newCategory, setNewCategory] = useState<"residential" | "commercial" | "rent">("residential");
  const [newBlock, setNewBlock] = useState(ROYAL_PALM_BLOCKS[0].name);
  const [newSize, setNewSize] = useState(RESIDENTIAL_PLOT_SIZES[0]);
  const [newTitle, setNewTitle] = useState("");
  const [newPlotNumber, setNewPlotNumber] = useState("");
  const [newPriceNote, setNewPriceNote] = useState("");
  const [newSelectedFeatures, setNewSelectedFeatures] = useState<string[]>(["فوری پوزیشن"]);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newRemarks, setNewRemarks] = useState("");

  const toggleFeature = (feat: string) => {
    if (newSelectedFeatures.includes(feat)) {
      setNewSelectedFeatures(newSelectedFeatures.filter((f) => f !== feat));
    } else {
      setNewSelectedFeatures([...newSelectedFeatures, feat]);
    }
  };

  const handleAddDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titleFinal = newTitle.trim() || `${newSize} پرائم ڈیل (${newBlock})`;
    const priceFinal = newPriceNote.trim() || "تازہ ترین ریٹ کے لیے رابطہ کریں";

    const newDealItem: PropertyListing = {
      id: `custom-deal-${Date.now()}`,
      title: titleFinal,
      category: newCategory,
      tag: "✨ نیا اندراج",
      size: newPlotNumber.trim() ? `${newSize} (نمبر: ${newPlotNumber.trim()})` : newSize,
      block: newBlock,
      priceNote: priceFinal,
      features: newSelectedFeatures.length > 0 ? newSelectedFeatures : ["تصدیق شدہ موقع"],
      isHot: true
    };

    const updated = [newDealItem, ...customDeals];
    saveCustomDeals(updated);

    // Also offer 1-tap WhatsApp message creation
    let message = `السلام علیکم! محترم فریاد حسن گورائیہ صاحب (${OWNER_NAME})،\n\n`;
    message += `نئی پراپرٹی ڈیل کا دفتری اندراج:\n\n`;
    message += `🏡 *عنوان:* ${titleFinal}\n`;
    message += `📍 *بلاک:* ${newBlock}\n`;
    message += `📏 *سائز:* ${newSize}\n`;
    if (newPlotNumber.trim()) message += `🔢 *پلاٹ نمبر:* ${newPlotNumber.trim()}\n`;
    if (newPriceNote.trim()) message += `💰 *ڈیمانڈ / قیمت:* ${newPriceNote.trim()}\n`;
    if (newClientName.trim()) message += `👤 *کلائنٹ / فروخت کنندہ:* ${newClientName.trim()}\n`;
    if (newClientPhone.trim()) message += `📞 *رابطہ:* ${newClientPhone.trim()}\n`;
    if (newRemarks.trim()) message += `📝 *نوٹس:* ${newRemarks.trim()}\n`;

    const whatsappUrl = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Reset Form and close
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewPlotNumber("");
    setNewPriceNote("");
    setNewClientName("");
    setNewClientPhone("");
    setNewRemarks("");
  };

  const handleDeleteCustomDeal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customDeals.filter((item) => item.id !== id);
    saveCustomDeals(updated);
  };

  // Combine custom added deals with existing catalog
  const allPropertyListings = [...customDeals, ...FEATURED_PROPERTIES];

  const filteredProperties = allPropertyListings.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  const handleInquireProperty = (prop: PropertyListing) => {
    const text = `السلام علیکم! فریاد حسن گورائیہ صاحب،\n\nمجھے اس پراپرٹی کی تفصیلات اور تازہ ترین ریٹ میں دلچسپی ہے:\n\n🏡 *${prop.title}*\n📍 لوکیشن: ${prop.block}\n📏 سائز: ${prop.size}\n\nبراہِ کرم اس کی دستیابی اور موجودہ فائنل ریٹ بتائیں۔ شکریہ!`;
    const url = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full my-3 bg-white/95 rounded-2xl p-3.5 sm:p-4 border-2 border-emerald-200 shadow-md text-right backdrop-blur-md" id="featured-properties-section">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-emerald-950">
              تازہ ترین پراپرٹی ڈیلز
            </h3>
            <p className="text-[10px] text-slate-600">
              رائل پام سٹی کی تصدیق شدہ پیشکش
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm">
          فوری دستیاب 💎
        </span>
      </div>

      {/* Add New Custom Deal Action Button */}
      <div className="mt-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md border border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105"
          id="add-custom-deal-trigger-btn"
        >
          <PlusCircle size={16} className="text-amber-300" />
          <span>+ نئی ڈیل / زبانی کسٹمر پلاٹ درج کریں</span>
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1" id="property-category-tabs">
        {[
          { id: "all", label: "تمام ڈیلز (All)" },
          { id: "residential", label: "رہائشی (Residential)" },
          { id: "commercial", label: "کمرشل (Commercial)" },
          { id: "rent", label: "برائے کرایہ (Rent)" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
              filter === tab.id
                ? "bg-gradient-to-r from-emerald-700 to-emerald-600 text-white border-emerald-700 shadow-sm font-black"
                : "bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-400 hover:text-emerald-950"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Properties List */}
      <div className="space-y-3 mt-3.5" id="property-cards-list">
        <AnimatePresence mode="popLayout">
          {filteredProperties.map((prop, idx) => {
            const isCustom = prop.id.startsWith("custom-deal-");
            return (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22, delay: idx * 0.04 }}
                className={`p-3.5 rounded-2xl border-2 transition-all duration-300 shadow-sm flex flex-col justify-between gap-3 backdrop-blur-sm ${
                  isCustom
                    ? "bg-amber-50/50 border-amber-300 hover:border-amber-500"
                    : "bg-emerald-50/40 border-emerald-200 hover:border-emerald-500"
                }`}
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        isCustom 
                          ? "bg-amber-200 text-amber-950 border-amber-400"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}>
                        {prop.tag}
                      </span>
                      {isCustom && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300">
                          محفوظ شدہ اندراج
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-emerald-900 font-bold bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                        {prop.block}
                      </span>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomDeal(prop.id, e)}
                          title="یہ اندراج حذف کریں"
                          className="p-1 rounded-md text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {prop.title}
                  </h4>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-200/60">
                    <div>
                      <span className="text-[10px] text-slate-500 block">پلاٹ سائز:</span>
                      <span className="text-xs font-black text-slate-900">{prop.size}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-slate-500 block">ریٹ / ڈیمانڈ:</span>
                      <span className="text-[11px] font-black text-emerald-800">{prop.priceNote}</span>
                    </div>
                  </div>

                  {/* Features Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {prop.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[9px] font-semibold bg-white text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"
                      >
                        <Check size={10} className="text-emerald-600" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inquire Action Button */}
                <button
                  type="button"
                  onClick={() => handleInquireProperty(prop)}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-105 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-500"
                >
                  <MessageCircle size={14} className="fill-white" />
                  <span>اس ڈیل کے لیے واٹس ایپ پر رابطہ کریں</span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal: Add New Verbal / Custom Deal (All Optional) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            id="add-deal-modal-root"
            dir="rtl"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-[420px] bg-white rounded-3xl p-5 shadow-2xl border-2 border-emerald-300 text-right overflow-hidden z-10 text-slate-900 my-auto max-h-[90vh] overflow-y-auto"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-3.5 left-3.5 p-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
                aria-label="بند کریں"
              >
                <X size={16} />
              </button>

              <form onSubmit={handleAddDealSubmit} className="space-y-3 mt-1">
                {/* Header */}
                <div className="text-center pb-2 border-b border-emerald-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1 border border-emerald-300">
                    <PlusCircle size={20} />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-emerald-950">
                    نئی پراپرٹی ڈیل / زبانی کسٹمر اندراج
                  </h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    دفتری یا زبانی کسٹمر کے کوائف درج کریں (تمام فیلڈز اختیاری ہیں)
                  </p>
                </div>

                {/* 1. Category Switcher */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    1. پراپرٹی کی کیٹیگری:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "residential", label: "رہائشی" },
                      { id: "commercial", label: "کمرشل" },
                      { id: "rent", label: "برائے کرایہ" }
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setNewCategory(c.id as any);
                          if (c.id === "commercial") setNewSize(COMMERCIAL_PLOT_SIZES[0]);
                          else setNewSize(RESIDENTIAL_PLOT_SIZES[0]);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          newCategory === c.id
                            ? "bg-emerald-700 text-white font-black border-emerald-700 shadow-sm"
                            : "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Block Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    2. سوسائٹی بلاک (اختیاری):
                  </label>
                  <select
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white text-right cursor-pointer"
                  >
                    {ROYAL_PALM_BLOCKS.map((b) => (
                      <option key={b.id} value={b.name} className="bg-white text-slate-900">
                        {b.name} — ({b.desc})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Size Buttons */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    3. پلاٹ کا سائز (اختیاری):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(newCategory === "commercial" ? COMMERCIAL_PLOT_SIZES : RESIDENTIAL_PLOT_SIZES).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setNewSize(size)}
                        className={`py-1.5 px-2 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer border truncate ${
                          newSize === size
                            ? "bg-emerald-700 text-white font-black border-emerald-700 shadow-sm"
                            : "bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:border-emerald-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Title & Plot Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      4. پلاٹ نمبر (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={newPlotNumber}
                      onChange={(e) => setNewPlotNumber(e.target.value)}
                      placeholder="مثلاً: 210"
                      className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      5. ڈیمانڈ / ریٹ (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={newPriceNote}
                      onChange={(e) => setNewPriceNote(e.target.value)}
                      placeholder="مثلاً: 85 لاکھ فائنل"
                      className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right"
                    />
                  </div>
                </div>

                {/* 5. Custom Title (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    6. ڈیل کا عنوان / نام (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثلاً: 5 مرلہ پرائم کارنر پلاٹ برائے فروخت"
                    className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right"
                  />
                </div>

                {/* 6. Feature Tags Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    7. نمایاں خصوصیات منتخب کریں (اختیاری):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PLOT_FEATURES.map((feat) => {
                      const isSelected = newSelectedFeatures.includes(feat);
                      return (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => toggleFeature(feat)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-700 text-white border-emerald-700"
                              : "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {feat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 7. Client Info (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      8. کسٹمر / فروخت کنندہ کا نام (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="مثلاً: چوہدری فاروق"
                      className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      9. رابطہ فون نمبر (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right"
                    />
                  </div>
                </div>

                {/* 8. Remarks */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    10. اضافی نوٹس (اختیاری):
                  </label>
                  <textarea
                    value={newRemarks}
                    onChange={(e) => setNewRemarks(e.target.value)}
                    rows={2}
                    placeholder="فائل کی حالت، فوری پوزیشن یا دیگر تفصیل..."
                    className="w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl p-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white text-right"
                  />
                </div>

                {/* Submit Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 hover:brightness-105 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-emerald-600"
                  >
                    <Send size={15} />
                    <span>یہ ڈیل لسٹ میں شامل کریں اور واٹس ایپ پر بھیجیں</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl transition-all border border-emerald-200 cursor-pointer text-center"
                  >
                    منسوخ کریں
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
