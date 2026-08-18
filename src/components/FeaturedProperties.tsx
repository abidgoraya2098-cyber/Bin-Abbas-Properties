import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageCircle, Check, PlusCircle, X, Send, Trash2 } from "lucide-react";
import { 
  FEATURED_PROPERTIES, 
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
import { PropertyListing } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../i18n";

export default function FeaturedProperties() {
  const { language, isUrdu } = useLanguage();
  const t = getTranslation(language);

  const residentialSizes = isUrdu ? RESIDENTIAL_PLOT_SIZES_URDU : RESIDENTIAL_PLOT_SIZES_ENGLISH;
  const commercialSizes = isUrdu ? COMMERCIAL_PLOT_SIZES_URDU : COMMERCIAL_PLOT_SIZES_ENGLISH;
  const plotFeatures = isUrdu ? PLOT_FEATURES_URDU : PLOT_FEATURES_ENGLISH;

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
  const [newSize, setNewSize] = useState(residentialSizes[0]);
  const [newTitle, setNewTitle] = useState("");
  const [newPlotNumber, setNewPlotNumber] = useState("");
  const [newPriceNote, setNewPriceNote] = useState("");
  const [newSelectedFeatures, setNewSelectedFeatures] = useState<string[]>([plotFeatures[0]]);
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

    const titleFinal = newTitle.trim() || `${newSize} Prime Deal (${newBlock})`;
    const priceFinal = newPriceNote.trim() || (isUrdu ? "تازہ ترین ریٹ کے لیے رابطہ کریں" : "Contact for latest price");

    const newDealItem: PropertyListing = {
      id: `custom-deal-${Date.now()}`,
      title: titleFinal,
      titleEn: titleFinal,
      category: newCategory,
      tag: isUrdu ? "✨ نیا اندراج" : "✨ New Entry",
      tagEn: "✨ New Entry",
      size: newPlotNumber.trim() ? `${newSize} (# ${newPlotNumber.trim()})` : newSize,
      sizeEn: newPlotNumber.trim() ? `${newSize} (# ${newPlotNumber.trim()})` : newSize,
      block: newBlock,
      blockEn: newBlock,
      priceNote: priceFinal,
      priceNoteEn: priceFinal,
      features: newSelectedFeatures.length > 0 ? newSelectedFeatures : [isUrdu ? "تصدیق شدہ موقع" : "Verified Spot"],
      featuresEn: newSelectedFeatures.length > 0 ? newSelectedFeatures : ["Verified Spot"],
      isHot: true
    };

    const updated = [newDealItem, ...customDeals];
    saveCustomDeals(updated);

    // Also offer 1-tap WhatsApp message creation
    let message = isUrdu 
      ? `السلام علیکم! محترم فریاد حسن گورائیہ صاحب (${OWNER_NAME})،\n\nنئی پراپرٹی ڈیل کا دفتری اندراج:\n\n`
      : `Hello Mr. ${OWNER_NAME_ENGLISH},\n\nNew Property Deal Record:\n\n`;

    message += `🏡 *${isUrdu ? "عنوان" : "Title"}:* ${titleFinal}\n`;
    message += `📍 *${isUrdu ? "بلاک" : "Block"}:* ${newBlock}\n`;
    message += `📏 *${isUrdu ? "سائز" : "Size"}:* ${newSize}\n`;
    if (newPlotNumber.trim()) message += `🔢 *${isUrdu ? "پلاٹ نمبر" : "Plot #"}:* ${newPlotNumber.trim()}\n`;
    if (newPriceNote.trim()) message += `💰 *${isUrdu ? "ڈیمانڈ / قیمت" : "Price"}:* ${newPriceNote.trim()}\n`;
    if (newClientName.trim()) message += `👤 *${isUrdu ? "کلائنٹ / فروخت کنندہ" : "Client"}:* ${newClientName.trim()}\n`;
    if (newClientPhone.trim()) message += `📞 *${isUrdu ? "رابطہ" : "Contact"}:* ${newClientPhone.trim()}\n`;
    if (newRemarks.trim()) message += `📝 *${isUrdu ? "نوٹس" : "Notes"}:* ${newRemarks.trim()}\n`;

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
    const titleText = isUrdu ? prop.title : (prop.titleEn || prop.title);
    const blockText = isUrdu ? prop.block : (prop.blockEn || prop.block);
    const sizeText = isUrdu ? prop.size : (prop.sizeEn || prop.size);

    const text = isUrdu 
      ? `السلام علیکم! فریاد حسن گورائیہ صاحب،\n\nمجھے اس پراپرٹی کی تفصیلات اور تازہ ترین ریٹ میں دلچسپی ہے:\n\n🏡 *${titleText}*\n📍 لوکیشن: ${blockText}\n📏 سائز: ${sizeText}\n\nبراہِ کرم اس کی دستیابی اور موجودہ فائنل ریٹ بتائیں۔ شکریہ!`
      : `Hello Mr. ${OWNER_NAME_ENGLISH},\n\nI am interested in this property deal:\n\n🏡 *${titleText}*\n📍 Location: ${blockText}\n📏 Size: ${sizeText}\n\nPlease share its availability and latest final rate. Thank you!`;

    const url = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className={`w-full my-3 bg-white/95 rounded-2xl p-3.5 sm:p-4 border-2 border-emerald-200 shadow-md backdrop-blur-md ${isUrdu ? "text-right" : "text-left"}`}
      id="featured-properties-section"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-emerald-950">
              {t.dealsTitle}
            </h3>
            <p className="text-[10px] text-slate-600">
              {t.dealsSubtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm">
          {t.dealsAvailableBadge}
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
          <span>{t.addCustomDealBtn}</span>
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1" id="property-category-tabs">
        {[
          { id: "all", label: t.filterAll },
          { id: "residential", label: t.filterResidential },
          { id: "commercial", label: t.filterCommercial },
          { id: "rent", label: t.filterRent }
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
            const currentTitle = isUrdu ? prop.title : (prop.titleEn || prop.title);
            const currentTag = isUrdu ? prop.tag : (prop.tagEn || prop.tag);
            const currentSize = isUrdu ? prop.size : (prop.sizeEn || prop.size);
            const currentBlock = isUrdu ? prop.block : (prop.blockEn || prop.block);
            const currentPriceNote = isUrdu ? prop.priceNote : (prop.priceNoteEn || prop.priceNote);
            const currentFeatures = isUrdu ? prop.features : (prop.featuresEn || prop.features);

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
                        {currentTag}
                      </span>
                      {isCustom && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300">
                          {t.customSavedBadge}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-emerald-900 font-bold bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                        {currentBlock}
                      </span>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomDeal(prop.id, e)}
                          title="Delete"
                          className="p-1 rounded-md text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {currentTitle}
                  </h4>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-200/60">
                    <div>
                      <span className="text-[10px] text-slate-500 block">{t.sizeText}</span>
                      <span className="text-xs font-black text-slate-900">{currentSize}</span>
                    </div>
                    <div className={isUrdu ? "text-left" : "text-right"}>
                      <span className="text-[10px] text-slate-500 block">{t.rateText}</span>
                      <span className="text-[11px] font-black text-emerald-800">{currentPriceNote}</span>
                    </div>
                  </div>

                  {/* Features Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentFeatures.map((feat, fIdx) => (
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
                  <span>{t.inquireDealBtn}</span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal: Add New Verbal / Custom Deal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            id="add-deal-modal-root"
            dir={isUrdu ? "rtl" : "ltr"}
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
              className={`relative w-full max-w-[420px] bg-white rounded-3xl p-5 shadow-2xl border-2 border-emerald-300 overflow-hidden z-10 text-slate-900 my-auto max-h-[90vh] overflow-y-auto ${isUrdu ? "text-right" : "text-left"}`}
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className={`absolute top-3.5 p-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 ${isUrdu ? "left-3.5" : "right-3.5"}`}
                aria-label="Close"
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
                    {t.addDealModalTitle}
                  </h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {t.addDealModalSubtitle}
                  </p>
                </div>

                {/* 1. Category Switcher */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    {t.customCategoryLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "residential", label: t.residential },
                      { id: "commercial", label: t.commercial },
                      { id: "rent", label: t.filterRent }
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setNewCategory(c.id as any);
                          if (c.id === "commercial") setNewSize(commercialSizes[0]);
                          else setNewSize(residentialSizes[0]);
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
                    {t.customBlockLabel}
                  </label>
                  <select
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer ${isUrdu ? "text-right" : "text-left"}`}
                  >
                    {ROYAL_PALM_BLOCKS.map((b) => (
                      <option key={b.id} value={isUrdu ? b.name : (b.nameEn || b.name)} className="bg-white text-slate-900">
                        {isUrdu ? `${b.name} — (${b.desc})` : `${b.nameEn || b.name} — (${b.descEn || b.desc})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Size Buttons */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    {t.customSizeLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(newCategory === "commercial" ? commercialSizes : residentialSizes).map((size) => (
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
                      {t.customPlotNoLabel}
                    </label>
                    <input
                      type="text"
                      value={newPlotNumber}
                      onChange={(e) => setNewPlotNumber(e.target.value)}
                      placeholder={t.plotNoPlaceholder}
                      className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white ${isUrdu ? "text-right" : "text-left"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      {t.customRateLabel}
                    </label>
                    <input
                      type="text"
                      value={newPriceNote}
                      onChange={(e) => setNewPriceNote(e.target.value)}
                      placeholder={t.demandPlaceholder}
                      className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white ${isUrdu ? "text-right" : "text-left"}`}
                    />
                  </div>
                </div>

                {/* 5. Custom Title */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    {t.customTitleLabel}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t.customTitlePlaceholder}
                    className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white ${isUrdu ? "text-right" : "text-left"}`}
                  />
                </div>

                {/* 6. Feature Tags Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    {t.customFeaturesLabel}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {plotFeatures.map((feat) => {
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

                {/* 7. Client Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      {t.customClientNameLabel}
                    </label>
                    <input
                      type="text"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder={t.ownerNamePlaceholder}
                      className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white ${isUrdu ? "text-right" : "text-left"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      {t.customClientPhoneLabel}
                    </label>
                    <input
                      type="text"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white ${isUrdu ? "text-right" : "text-left"}`}
                    />
                  </div>
                </div>

                {/* 8. Remarks */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    {t.customRemarksLabel}
                  </label>
                  <textarea
                    value={newRemarks}
                    onChange={(e) => setNewRemarks(e.target.value)}
                    rows={2}
                    placeholder={t.notesPlaceholderSell}
                    className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl p-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white ${isUrdu ? "text-right" : "text-left"}`}
                  />
                </div>

                {/* Submit Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 hover:brightness-105 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-emerald-600"
                  >
                    <Send size={15} />
                    <span>{t.customSubmitBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl transition-all border border-emerald-200 cursor-pointer text-center"
                  >
                    {t.cancelBtn}
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
