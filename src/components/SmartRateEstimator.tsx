import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Calculator, TrendingUp, Sparkles, MessageCircle, ChevronDown, Check } from "lucide-react";
import { 
  ROYAL_PALM_BLOCKS, 
  RESIDENTIAL_PLOT_SIZES_URDU, 
  RESIDENTIAL_PLOT_SIZES_ENGLISH,
  COMMERCIAL_PLOT_SIZES_URDU,
  COMMERCIAL_PLOT_SIZES_ENGLISH,
  PLOT_FEATURES_URDU,
  PLOT_FEATURES_ENGLISH,
  CONTACT_PHONE
} from "../data";
import { useLanguage } from "../context/LanguageContext";
import { estimateRoyalPalmPrice } from "../utils/rateEstimator";

export default function SmartRateEstimator() {
  const { isUrdu } = useLanguage();

  const residentialSizes = isUrdu ? RESIDENTIAL_PLOT_SIZES_URDU : RESIDENTIAL_PLOT_SIZES_ENGLISH;
  const commercialSizes = isUrdu ? COMMERCIAL_PLOT_SIZES_URDU : COMMERCIAL_PLOT_SIZES_ENGLISH;
  const plotFeatures = isUrdu ? PLOT_FEATURES_URDU : PLOT_FEATURES_ENGLISH;

  const [plotType, setPlotType] = useState<"residential" | "commercial">("residential");
  const [selectedBlock, setSelectedBlock] = useState(ROYAL_PALM_BLOCKS[0].name);
  const [selectedSize, setSelectedSize] = useState(residentialSizes[0]);
  const [selectedCategory, setSelectedCategory] = useState(plotFeatures[0]);

  // Handle plotType switch
  const handleTypeSwitch = (type: "residential" | "commercial") => {
    setPlotType(type);
    if (type === "commercial") {
      setSelectedSize(commercialSizes[0]);
      setSelectedBlock("پام کمرشل");
    } else {
      setSelectedSize(residentialSizes[0]);
      setSelectedBlock(ROYAL_PALM_BLOCKS[0].name);
    }
  };

  // Calculate live estimation
  const estimation = useMemo(() => {
    return estimateRoyalPalmPrice({
      block: selectedBlock,
      size: selectedSize,
      category: selectedCategory,
      isCommercial: plotType === "commercial"
    }, isUrdu);
  }, [selectedBlock, selectedSize, selectedCategory, plotType, isUrdu]);

  const handleInquireEstimate = () => {
    const text = isUrdu
      ? `السلام علیکم! فریاد حسن گورائیہ صاحب،\n\nمیں نے بن عباس ایپ پر رائل پام سٹی کے ریٹ کا تخمینہ لگایا ہے:\n\n📍 *بلاک:* ${selectedBlock}\n📏 *سائز:* ${selectedSize}\n🌟 *کیٹیگری:* ${selectedCategory}\n💰 *تخمینہ شدہ ریٹ:* ${estimation.formattedMin} سے ${estimation.formattedMax}\n\nبراہِ کرم اس لوکیشن میں دستیاب فائنل پلاٹس اور تصدیق شدہ ریٹ لسٹ بتائیں۔ شکریہ!`
      : `Hello Mr. Faryad Hassan Goraya,\n\nI calculated an estimated valuation on your app:\n\n📍 Block: ${selectedBlock}\n📏 Size: ${selectedSize}\n🌟 Category: ${selectedCategory}\n💰 Estimated Price: ${estimation.formattedMin} to ${estimation.formattedMax}\n\nPlease share current available options and final deal details. Thank you!`;

    const url = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`w-full my-3 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 border-2 border-amber-400/80 shadow-xl select-none ${
        isUrdu ? "text-right" : "text-left"
      }`}
      id="smart-rate-estimator-widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-amber-400 text-emerald-950 shadow-md">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-amber-300">
              {isUrdu ? "سمارٹ مارکیٹ ریٹ و تخمینہ کار" : "Smart Market Rate & Price Estimator"}
            </h3>
            <p className="text-[10px] text-emerald-200 font-semibold">
              {isUrdu ? "رائل پام سٹی کے تصدیق شدہ مارکیٹ ریٹس پر مبنی فوری ویلیویشن" : "Live Market Valuation for Royal Palm City Plots"}
            </p>
          </div>
        </div>
        <span className="text-[9.5px] font-black bg-amber-400 text-slate-950 px-2 py-1 rounded-full shadow">
          {isUrdu ? "AI تخمینہ ⚡" : "AI Valuation ⚡"}
        </span>
      </div>

      {/* Selectors */}
      <div className="space-y-2.5 mt-3">
        {/* Type Toggle: Residential vs Commercial */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-emerald-900/80 rounded-xl border border-emerald-700">
          <button
            type="button"
            onClick={() => handleTypeSwitch("residential")}
            className={`py-1.5 px-2 rounded-lg font-black text-xs transition-all cursor-pointer ${
              plotType === "residential"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            {isUrdu ? "رہائشی پلاٹس" : "Residential"}
          </button>
          <button
            type="button"
            onClick={() => handleTypeSwitch("commercial")}
            className={`py-1.5 px-2 rounded-lg font-black text-xs transition-all cursor-pointer ${
              plotType === "commercial"
                ? "bg-amber-400 text-emerald-950 shadow-md"
                : "text-emerald-200 hover:text-white"
            }`}
          >
            {isUrdu ? "کمرشل پلاٹس" : "Commercial"}
          </button>
        </div>

        {/* Block & Size Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Block Selector */}
          <div>
            <label className="block text-[10px] text-emerald-200 font-bold mb-1">
              {isUrdu ? "1. بلاک منتخب کریں:" : "1. Select Block:"}
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className={`w-full bg-emerald-900/90 border border-emerald-700 rounded-xl px-2.5 py-1.5 text-xs font-black text-amber-200 focus:outline-none focus:border-amber-400 cursor-pointer ${
                isUrdu ? "text-right" : "text-left"
              }`}
            >
              {ROYAL_PALM_BLOCKS.map((b) => (
                <option key={b.id} value={b.name} className="bg-emerald-950 text-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Size Selector */}
          <div>
            <label className="block text-[10px] text-emerald-200 font-bold mb-1">
              {isUrdu ? "2. پلاٹ کا سائز:" : "2. Plot Size:"}
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className={`w-full bg-emerald-900/90 border border-emerald-700 rounded-xl px-2.5 py-1.5 text-xs font-black text-amber-200 focus:outline-none focus:border-amber-400 cursor-pointer ${
                isUrdu ? "text-right" : "text-left"
              }`}
            >
              {(plotType === "commercial" ? commercialSizes : residentialSizes).map((s, idx) => (
                <option key={idx} value={s} className="bg-emerald-950 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-[10px] text-emerald-200 font-bold mb-1">
            {isUrdu ? "3. پلاٹ کیٹیگری / فیچر:" : "3. Plot Category / Location Feature:"}
          </label>
          <div className="grid grid-cols-3 gap-1">
            {plotFeatures.slice(0, 3).map((feat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCategory(feat)}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all truncate ${
                  selectedCategory === feat
                    ? "bg-amber-400/20 text-amber-300 border-amber-400 font-black shadow-inner"
                    : "bg-emerald-900/40 text-emerald-300 border-emerald-700 hover:border-emerald-500"
                }`}
              >
                {feat.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Estimation Output Card */}
      <motion.div
        key={`${selectedBlock}-${selectedSize}-${selectedCategory}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-800/40 to-amber-500/15 border-2 border-amber-400/60 shadow-inner"
      >
        <div className="flex items-center justify-between text-xs font-bold text-emerald-200">
          <span>{isUrdu ? "تخمینہ شدہ کل قیمت:" : "Estimated Price Range:"}</span>
          <span className="text-[10px] text-amber-300 font-black bg-emerald-950/70 px-2 py-0.5 rounded-md border border-amber-400/30">
            {isUrdu ? estimation.demandLabelUrdu : estimation.demandLabelEnglish}
          </span>
        </div>

        <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1 font-serif tracking-wide">
          {estimation.formattedMin} ~ {estimation.formattedMax}
        </div>

        <div className="text-[11px] text-emerald-100 font-semibold mt-1">
          {isUrdu ? estimation.insightsUrdu : estimation.insightsEnglish}
        </div>

        {/* WhatsApp Inquiry for this Valuation */}
        <button
          type="button"
          onClick={handleInquireEstimate}
          className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black text-xs shadow-md border border-emerald-400 flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
        >
          <MessageCircle size={14} className="fill-white" />
          <span>{isUrdu ? "اس تخمینہ پر بن عباس پراپرٹیز سے ڈیل کریں" : "Inquire with Bin Abbas Properties"}</span>
        </button>
      </motion.div>
    </div>
  );
}
