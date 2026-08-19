import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  MessageCircle, 
  Check, 
  PlusCircle, 
  X, 
  Send, 
  Trash2, 
  Search, 
  ShieldCheck, 
  Filter, 
  ArrowRightLeft,
  Lock
} from "lucide-react";
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
import { useAdmin } from "../context/AdminContext";
import { useNotifications } from "../context/NotificationContext";
import { getTranslation } from "../i18n";

interface FeaturedPropertiesProps {
  onNavigateToInquiry?: (mode: "sell" | "buy") => void;
}

export default function FeaturedProperties({ onNavigateToInquiry }: FeaturedPropertiesProps) {
  const { language, isUrdu } = useLanguage();
  const t = getTranslation(language);
  const { isAdmin, setIsLoginModalOpen } = useAdmin();
  const { broadcastPublicDeal } = useNotifications();

  const residentialSizes = isUrdu ? RESIDENTIAL_PLOT_SIZES_URDU : RESIDENTIAL_PLOT_SIZES_ENGLISH;
  const commercialSizes = isUrdu ? COMMERCIAL_PLOT_SIZES_URDU : COMMERCIAL_PLOT_SIZES_ENGLISH;
  const plotFeatures = isUrdu ? PLOT_FEATURES_URDU : PLOT_FEATURES_ENGLISH;

  const [filter, setFilter] = useState<"all" | "residential" | "commercial" | "demand" | "rent">("all");
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customDeals, setCustomDeals] = useState<PropertyListing[]>([]);

  // Load custom deals from localStorage
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

  // Form State for Add Custom Deal (Admin / Owner only)
  const [newCategory, setNewCategory] = useState<"residential" | "commercial" | "rent" | "demand">("residential");
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

    const titleFinal = newTitle.trim() || `${newSize} Deal (${newBlock})`;
    const priceFinal = newPriceNote.trim() || (isUrdu ? "تازہ ترین ریٹ کے لیے رابطہ کریں" : "Contact for latest price");

    const newDealItem: PropertyListing = {
      id: `custom-deal-${Date.now()}`,
      title: titleFinal,
      titleEn: titleFinal,
      category: newCategory,
      tag: isUrdu ? "✨ تصدیق شدہ پیشکش" : "✨ Verified Offer",
      tagEn: "✨ Verified Offer",
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

    // Broadcast live notification to all users
    broadcastPublicDeal(titleFinal, newBlock, newSize, newCategory === "demand");

    // Also send WhatsApp record
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

    // Reset Form
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewPlotNumber("");
    setNewPriceNote("");
    setNewClientName("");
    setNewClientPhone("");
    setNewRemarks("");
  };

  const handleDeleteDeal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customDeals.filter((item) => item.id !== id);
    saveCustomDeals(updated);
  };

  // Combine custom added deals with existing catalog
  const allPropertyListings = useMemo(() => {
    return [...customDeals, ...FEATURED_PROPERTIES];
  }, [customDeals]);

  // Comprehensive Search & Filter Logic
  const filteredProperties = useMemo(() => {
    return allPropertyListings.filter((item) => {
      // 1. Category Filter
      if (filter !== "all" && item.category !== filter) {
        return false;
      }

      // 2. Block Dropdown Filter
      if (selectedBlockFilter !== "all") {
        const itemBlock = (item.block + " " + (item.blockEn || "")).toLowerCase();
        if (!itemBlock.includes(selectedBlockFilter.toLowerCase())) {
          return false;
        }
      }

      // 3. Text Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const searchable = [
          item.title,
          item.titleEn || "",
          item.block,
          item.blockEn || "",
          item.size,
          item.sizeEn || "",
          item.tag,
          item.priceNote,
          item.features.join(" ")
        ].join(" ").toLowerCase();

        if (!searchable.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [allPropertyListings, filter, selectedBlockFilter, searchQuery]);

  const handleInquireProperty = (prop: PropertyListing) => {
    const titleText = isUrdu ? prop.title : (prop.titleEn || prop.title);
    const blockText = isUrdu ? prop.block : (prop.blockEn || prop.block);
    const sizeText = isUrdu ? prop.size : (prop.sizeEn || prop.size);

    const isDemand = prop.category === "demand";

    const text = isUrdu 
      ? `السلام علیکم! فریاد حسن گورائیہ صاحب،\n\nمجھے اس ${isDemand ? "خریدار ڈیمانڈ" : "پراپرٹی ڈیل"} میں دلچسپی ہے:\n\n🏡 *${titleText}*\n📍 لوکیشن: ${blockText}\n📏 سائز: ${sizeText}\n\nبراہِ کرم اس کی دستیابی اور موجودہ فائنل ریٹ بتائیں۔ شکریہ!`
      : `Hello Mr. ${OWNER_NAME_ENGLISH},\n\nI am interested in this ${isDemand ? "buyer demand" : "property deal"}:\n\n🏡 *${titleText}*\n📍 Location: ${blockText}\n📏 Size: ${sizeText}\n\nPlease share its availability and latest final rate. Thank you!`;

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
          {filteredProperties.length} {isUrdu ? "ڈیلز دستیاب" : "Deals"}
        </span>
      </div>

      {/* Admin Mode Bar if Logged In */}
      {isAdmin ? (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border-2 border-amber-400 text-amber-950 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-700 shrink-0" />
            <span className="text-xs font-black">
              {isUrdu ? `👑 ایڈمن موڈ فعال: ${OWNER_NAME}` : `👑 Admin Mode Active: ${OWNER_NAME}`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow cursor-pointer transition-colors"
          >
            <PlusCircle size={14} />
            <span>{isUrdu ? "+ نئی ڈیل شامل کریں" : "+ Add Deal"}</span>
          </button>
        </div>
      ) : (
        /* Action Prompt for regular clients */
        <div className="mt-3">
          <button
            type="button"
            onClick={() => onNavigateToInquiry && onNavigateToInquiry("sell")}
            className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 font-black text-xs border border-emerald-300 flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <ArrowRightLeft size={14} className="text-emerald-700" />
            <span>{isUrdu ? "اپنا پلاٹ فروخت یا خرید کے لیے بھیجیں (100% پرائیویٹ)" : "Submit Your Plot For Sale / Purchase (100% Private)"}</span>
          </button>
        </div>
      )}

      {/* Instant Search Bar */}
      <div className="mt-3 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isUrdu ? "🔍 بلاک، سائز یا پلاٹ تلاش کریں (مثلاً: بلاک B، 10 مرلہ)..." : "🔍 Search block, size or plot (e.g. Block B, 10 Marla)..."}
          className={`w-full bg-emerald-50/70 border-2 border-emerald-200 rounded-xl py-2 px-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-inner ${
            isUrdu ? "text-right pl-8" : "text-left pr-8"
          }`}
        />
        {searchQuery.trim() && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className={`absolute top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer ${
              isUrdu ? "left-2.5" : "right-2.5"
            }`}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Block Filter Dropdown */}
      <div className="mt-2 flex items-center gap-2">
        <label className="text-[10.5px] font-bold text-slate-600 shrink-0">
          {isUrdu ? "بلاک منتخب کریں:" : "Filter Block:"}
        </label>
        <select
          value={selectedBlockFilter}
          onChange={(e) => setSelectedBlockFilter(e.target.value)}
          className={`w-full bg-white border border-emerald-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer ${
            isUrdu ? "text-right" : "text-left"
          }`}
        >
          <option value="all">{isUrdu ? "تمام بلاکس (All Blocks)" : "All Blocks"}</option>
          {ROYAL_PALM_BLOCKS.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Tabs (Category) */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1" id="property-category-tabs">
        {[
          { id: "all", label: t.filterAll },
          { id: "residential", label: t.filterResidential },
          { id: "commercial", label: t.filterCommercial },
          { id: "demand", label: t.filterDemand },
          { id: "rent", label: t.filterRent }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-[10.5px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
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
          {filteredProperties.length > 0 ? (
            filteredProperties.map((prop, idx) => {
              const isCustom = prop.id.startsWith("custom-deal-");
              const isDemand = prop.category === "demand";
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
                  transition={{ duration: 0.22, delay: idx * 0.03 }}
                  className={`p-3.5 rounded-2xl border-2 transition-all duration-300 shadow-sm flex flex-col justify-between gap-3 backdrop-blur-sm ${
                    isDemand
                      ? "bg-purple-50/70 border-purple-300 hover:border-purple-500"
                      : isCustom
                      ? "bg-amber-50/50 border-amber-300 hover:border-amber-500"
                      : "bg-white hover:bg-emerald-50/40 border-emerald-200 hover:border-emerald-400"
                  }`}
                >
                  <div>
                    {/* Top Row: Title + Tag */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-emerald-100">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-black text-emerald-950 leading-tight">
                          {currentTitle}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          📍 {currentBlock}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border shadow-xs ${
                            isDemand
                              ? "bg-purple-100 text-purple-900 border-purple-300"
                              : "bg-emerald-100 text-emerald-900 border-emerald-300"
                          }`}
                        >
                          {currentTag}
                        </span>

                        {/* Admin Delete Button */}
                        {isAdmin && isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteDeal(prop.id, e)}
                            title={isUrdu ? "ڈیل ڈیلیٹ کریں" : "Delete Deal"}
                            className="p-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer border border-red-300"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Size + Rate */}
                    <div className="grid grid-cols-2 gap-2 mt-2.5 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-semibold">
                          {t.sizeText}
                        </span>
                        <span className="text-xs font-black text-emerald-900">
                          {currentSize}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-semibold">
                          {t.rateText}
                        </span>
                        <span className="text-xs font-black text-amber-800">
                          {currentPriceNote}
                        </span>
                      </div>
                    </div>

                    {/* Features Badges */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {currentFeatures.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="text-[9.5px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action: WhatsApp Contact */}
                  <div className="pt-2 border-t border-emerald-100/70">
                    <button
                      type="button"
                      onClick={() => handleInquireProperty(prop)}
                      className={`w-full py-2 px-3 rounded-xl text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:brightness-110 cursor-pointer border ${
                        isDemand
                          ? "bg-gradient-to-r from-purple-700 to-indigo-700 border-purple-500"
                          : "bg-gradient-to-r from-[#25D366] to-[#128C7E] border-emerald-500"
                      }`}
                    >
                      <MessageCircle size={14} className="fill-white" />
                      <span>
                        {isDemand
                          ? isUrdu ? "اس خریدار ڈیمانڈ کے لیے رابطہ کریں" : "Contact for Buyer Demand"
                          : t.inquireDealBtn}
                      </span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            /* No Results Found Fallback */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 text-center bg-emerald-50/60 rounded-2xl border-2 border-dashed border-emerald-300 space-y-2.5"
            >
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                {isUrdu
                  ? "آپ کی تلاش سے مطابقت رکھنے والا پلاٹ فی الحال لسٹ میں موجود نہیں ہے۔"
                  : "No matching plot found for your search criteria."}
              </p>
              <p className="text-[11px] text-emerald-900 font-semibold">
                {isUrdu
                  ? "ہم سے رابطہ کریں، ہم آپ کے لیے مطلوبہ بلاک اور سائز کا پلاٹ فوری تلاش کر کے فراہم کریں گے!"
                  : "Contact us directly and we will find your desired plot in this block immediately!"}
              </p>
              <a
                href={`https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent("السلام علیکم! مجھے رائل پام سٹی میں مخصوص پلاٹ تلاش کروانا ہے۔")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-700 text-white font-black text-xs shadow hover:bg-emerald-800 transition-colors"
              >
                <MessageCircle size={13} className="fill-white" />
                <span>{isUrdu ? "بن عباس پراپرٹیز سے معلوم کریں" : "Inquire with Bin Abbas Properties"}</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal: Add New Verbal / Custom Deal (Admin Only) */}
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

              {/* Modal Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <PlusCircle size={20} className="text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-emerald-950">
                    {t.addDealModalTitle}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    {t.addDealModalSubtitle}
                  </p>
                </div>
              </div>

              {/* Add Deal Form */}
              <form onSubmit={handleAddDealSubmit} className="space-y-3">
                {/* 1. Category */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    {t.customCategoryLabel}
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: "residential", label: t.residential },
                      { id: "commercial", label: t.commercial },
                      { id: "demand", label: isUrdu ? "ڈیمانڈ" : "Demand" },
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
                        className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer border text-center ${
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
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Size & Plot Number */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      {t.customSizeLabel}
                    </label>
                    <select
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer ${isUrdu ? "text-right" : "text-left"}`}
                    >
                      {(newCategory === "commercial" ? commercialSizes : residentialSizes).map((s, idx) => (
                        <option key={idx} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      {t.customPlotNoLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.plotNoPlaceholder}
                      value={newPlotNumber}
                      onChange={(e) => setNewPlotNumber(e.target.value)}
                      className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white ${isUrdu ? "text-right" : "text-left"}`}
                    />
                  </div>
                </div>

                {/* 4. Demand / Rate */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    {t.customRateLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={isUrdu ? "مثلاً: 75 لاکھ یا مارکیٹ ریٹ" : "e.g. 75 Lacs"}
                    value={newPriceNote}
                    onChange={(e) => setNewPriceNote(e.target.value)}
                    className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white ${isUrdu ? "text-right" : "text-left"}`}
                  />
                </div>

                {/* 5. Custom Title */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    {t.customTitleLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.customTitlePlaceholder}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full bg-emerald-50/60 border-2 border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white ${isUrdu ? "text-right" : "text-left"}`}
                  />
                </div>

                {/* 6. Features Chips */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    {t.customFeaturesLabel}
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {plotFeatures.map((feat, fIdx) => {
                      const isSelected = newSelectedFeatures.includes(feat);
                      return (
                        <button
                          key={fIdx}
                          type="button"
                          onClick={() => toggleFeature(feat)}
                          className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
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

                {/* 7. Client Name & Phone (Office Use) */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
                      {t.customClientNameLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.ownerNamePlaceholder}
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold ${isUrdu ? "text-right" : "text-left"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
                      {t.customClientPhoneLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.phonePlaceholder}
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold ${isUrdu ? "text-right" : "text-left"}`}
                    />
                  </div>
                </div>

                {/* 8. Remarks */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 mb-1">
                    {t.customRemarksLabel}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={isUrdu ? "کوئی خاص دفتری یاددہانی یا تفصیل..." : "Office notes..."}
                    value={newRemarks}
                    onChange={(e) => setNewRemarks(e.target.value)}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold resize-none ${isUrdu ? "text-right" : "text-left"}`}
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="pt-3 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white font-black text-xs rounded-xl shadow-md border border-amber-300 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>{t.customSubmitBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
