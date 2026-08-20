import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Inbox, 
  X, 
  Phone, 
  MessageCircle, 
  Share2, 
  Trash2, 
  CheckCircle, 
  Globe, 
  Tag, 
  Calendar, 
  User, 
  MapPin, 
  Coins,
  Video,
  Image,
  PlusCircle,
  Sparkles,
  Eye,
  ToggleLeft,
  ToggleRight,
  Upload,
  Play
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { usePromoAds } from "../context/PromoAdContext";
import { useLanguage } from "../context/LanguageContext";
import { CustomerInquiryRecord, PropertyListing, PromoAdItem } from "../types";
import { OWNER_NAME, CONTACT_PHONE } from "../data";

export default function AdminInboxModal() {
  const { 
    inquiries, 
    isAdminInboxOpen, 
    setIsAdminInboxOpen, 
    updateInquiryStatus, 
    deleteInquiry,
    broadcastPublicDeal 
  } = useNotifications();

  const { 
    ads, 
    addPromoAd, 
    deletePromoAd, 
    toggleAdActive, 
    openAd 
  } = usePromoAds();

  const { isUrdu } = useLanguage();
  const [activeTab, setActiveTab] = useState<"leads" | "ads">("leads");
  const [filterType, setFilterType] = useState<"all" | "sell" | "buy">("all");

  // New Ad Form State
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [adType, setAdType] = useState<"image" | "video">("image");
  const [adMediaUrl, setAdMediaUrl] = useState("");
  const [adThumbnailUrl, setAdThumbnailUrl] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [adCaption, setAdCaption] = useState("");
  const [adPrice, setAdPrice] = useState("");
  const [adLocation, setAdLocation] = useState("پام کمرشل 235، رائل پام سٹی، گوجرانوالہ");
  const [adWhatsAppMsg, setAdWhatsAppMsg] = useState("");
  const [isAdHot, setIsAdHot] = useState(true);

  // Handle Image File Upload (Compressed Base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setAdMediaUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adMediaUrl.trim()) {
      alert(isUrdu ? "برائے مہربانی ایڈ کا عنوان اور تصویر/ویڈیو کا لنک فراہم کریں۔" : "Please provide title and image/video url.");
      return;
    }

    addPromoAd({
      type: adType,
      mediaUrl: adMediaUrl.trim(),
      thumbnailUrl: adThumbnailUrl.trim() || undefined,
      title: adTitle.trim(),
      titleEn: adTitle.trim(),
      caption: adCaption.trim() || "رائل پام سٹی گوجرانوالہ میں شاندار موقع۔ برائے فوری رابطہ بن عباس پراپرٹیز۔",
      captionEn: adCaption.trim(),
      price: adPrice.trim() || "خصوصی ڈیل",
      priceEn: adPrice.trim() || "Special Deal",
      location: adLocation.trim(),
      locationEn: adLocation.trim(),
      whatsAppMessage: adWhatsAppMsg.trim() || undefined,
      isActive: true,
      isHot: isAdHot
    });

    alert(isUrdu 
      ? "✅ نیا ویڈیو/تصویر ایڈ کامیابی کے ساتھ ایپ پر شائع کر دیا گیا ہے اور تمام صارفین کو پش نوٹیفکیشن بھیج دیا گیا ہے!" 
      : "✅ New promotional ad has been published and broadcast to all users!");

    // Reset Form
    setAdTitle("");
    setAdMediaUrl("");
    setAdThumbnailUrl("");
    setAdCaption("");
    setAdPrice("");
    setAdWhatsAppMsg("");
    setIsCreateAdOpen(false);
  };

  // Publish a customer lead directly to public deals
  const handlePublishToPublic = (inq: CustomerInquiryRecord) => {
    try {
      const existing = localStorage.getItem("bin_abbas_custom_deals");
      const currentDeals: PropertyListing[] = existing ? JSON.parse(existing) : [];

      const isDemand = inq.type === "buy";
      const title = isDemand 
        ? `${inq.size} خریدار ڈیمانڈ (${inq.block})` 
        : `${inq.size} پلاٹ برائے فروخت (${inq.block})`;

      const newListing: PropertyListing = {
        id: `custom-deal-${Date.now()}`,
        title,
        titleEn: title,
        category: isDemand ? "demand" : "residential",
        tag: isDemand ? "خریدار موجود 🎯" : "تازہ ترین پیشکش ✨",
        tagEn: isDemand ? "Buyer Waiting 🎯" : "Fresh Offer ✨",
        size: inq.size,
        sizeEn: inq.size,
        block: inq.block,
        blockEn: inq.block,
        priceNote: inq.priceOrBudget || (isUrdu ? "مارکیٹ ریٹ" : "Market Rate"),
        priceNoteEn: inq.priceOrBudget || "Market Rate",
        features: [inq.category || "تصدیق شدہ موقع", "فوری سودا دستیاب"],
        featuresEn: [inq.category || "Verified Spot", "Instant Deal Ready"],
        isHot: true
      };

      const updated = [newListing, ...currentDeals];
      localStorage.setItem("bin_abbas_custom_deals", JSON.stringify(updated));

      // Mark inquiry as published
      updateInquiryStatus(inq.id, "published");

      // Broadcast public notification to all app users
      broadcastPublicDeal(title, inq.block, inq.size, isDemand);

      alert(isUrdu 
        ? "✅ یہ ایڈ کامیابی کے ساتھ تمام صارفین کے لیے پبلک لسٹنگز میں شائع کر دی گئی ہے اور تمام صارفین کو نوٹیفکیشن بھیج دیا گیا ہے!" 
        : "✅ This deal has been published to public listings and broadcast to all users!");
    } catch (e) {
      console.warn("Could not publish deal:", e);
    }
  };

  const handleWhatsAppClient = (inq: CustomerInquiryRecord) => {
    if (!inq.clientPhone) return;
    const cleanPhone = inq.clientPhone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? `92${cleanPhone.substring(1)}` : cleanPhone;

    const text = isUrdu
      ? `السلام علیکم محترم ${inq.clientName || ""} صاحب،\n\nمیں فریاد حسن گورائیہ (${OWNER_NAME} - بن عباس پراپرٹیز) بات کر رہا ہوں۔ آپ نے رائل پام سٹی میں ${inq.type === "sell" ? "پلاٹ فروخت" : "پلاٹ خریداری"} کے لیے کوائف جمع کروائے تھے (${inq.size} - ${inq.block})۔ کیا ہم اس پر تفصیل سے بات کر سکتے ہیں؟`
      : `Hello ${inq.clientName || ""},\n\nThis is Faryad Hassan Goraya (Bin Abbas Properties) regarding your plot submission (${inq.size} - ${inq.block}) in Royal Palm City.`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    updateInquiryStatus(inq.id, "contacted");
  };

  const handleCallClient = (inq: CustomerInquiryRecord) => {
    if (!inq.clientPhone) return;
    window.open(`tel:${inq.clientPhone}`, "_self");
    updateInquiryStatus(inq.id, "contacted");
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filterType === "all") return true;
    return inq.type === filterType;
  });

  return (
    <AnimatePresence>
      {isAdminInboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
          id="admin-inbox-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 my-auto text-slate-900"
            id="admin-inbox-modal-card"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-4 flex items-center justify-between border-b border-amber-400/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-md">
                  <Inbox size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-amber-300 leading-tight">
                    {isUrdu ? "ایڈمن و آنر کنٹرول سنٹر" : "Admin & Owner Control Center"}
                  </h3>
                  <p className="text-[11px] text-emerald-200 font-medium">
                    {isUrdu ? `${OWNER_NAME} (بن عباس پراپرٹیز)` : `${OWNER_NAME} - Bin Abbas Properties`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAdminInboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={isUrdu ? "بند کریں" : "Close"}
              >
                <X size={18} />
              </button>
            </div>

            {/* Top Navigation Tabs */}
            <div className="flex items-center bg-emerald-50/90 border-b border-emerald-200 p-1.5 gap-1.5">
              <button
                onClick={() => setActiveTab("leads")}
                className={`flex-1 py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "leads"
                    ? "bg-emerald-800 text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-emerald-100/70"
                }`}
              >
                <Inbox size={14} />
                <span>{isUrdu ? "📩 کسٹمر انکوائریز" : "Customer Leads"} ({inquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("ads")}
                className={`flex-1 py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "ads"
                    ? "bg-amber-500 text-slate-950 shadow-md border border-amber-600"
                    : "bg-white text-slate-700 hover:bg-amber-50"
                }`}
              >
                <Video size={14} />
                <span>{isUrdu ? "🎬 ویڈیو و تصویر ایڈز" : "Video/Photo Ads"} ({ads.length})</span>
              </button>
            </div>

            {/* TAB 1: CUSTOMER LEADS */}
            {activeTab === "leads" && (
              <>
                {/* Filter Pills */}
                <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFilterType("all")}
                      className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                        filterType === "all"
                          ? "bg-emerald-800 text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isUrdu ? "تمام" : "All"} ({inquiries.length})
                    </button>
                    <button
                      onClick={() => setFilterType("sell")}
                      className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                        filterType === "sell"
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isUrdu ? "فروخت" : "Sell"} ({inquiries.filter((i) => i.type === "sell").length})
                    </button>
                    <button
                      onClick={() => setFilterType("buy")}
                      className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                        filterType === "buy"
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isUrdu ? "خریداری ڈیمانڈ" : "Buy"} ({inquiries.filter((i) => i.type === "buy").length})
                    </button>
                  </div>
                </div>

                {/* Inquiries List */}
                <div className="p-3 sm:p-4 max-h-[60vh] overflow-y-auto space-y-3">
                  {filteredInquiries.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <Inbox size={40} className="mx-auto mb-2 opacity-40 text-emerald-800" />
                      <p className="text-sm font-bold">
                        {isUrdu ? "فی الوقت کوئی نیا کسٹمر اندراج موجود نہیں ہے۔" : "No customer inquiries found."}
                      </p>
                    </div>
                  ) : (
                    filteredInquiries.map((inq) => {
                      const isSell = inq.type === "sell";
                      const isNew = inq.status === "new";

                      return (
                        <div
                          key={inq.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                            isNew 
                              ? "bg-emerald-50/90 border-emerald-400 shadow-md ring-1 ring-emerald-300"
                              : "bg-white border-slate-200 shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  isSell 
                                    ? "bg-emerald-800 text-white" 
                                    : "bg-amber-400 text-slate-950 font-black"
                                }`}
                              >
                                {isSell ? (isUrdu ? "فروخت کا اندراج" : "Sell Inquiry") : (isUrdu ? "خریداری ڈیمانڈ" : "Buy Request")}
                              </span>

                              {isNew && (
                                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                                  NEW
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                              <Calendar size={11} />
                              <span>{inq.dateFormatted}</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2.5 text-xs">
                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                              <span className="text-[10px] text-slate-500 block">{isUrdu ? "سائز و بلاک" : "Size & Block"}</span>
                              <span className="font-black text-slate-900">{inq.size} - {inq.block}</span>
                            </div>

                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                              <span className="text-[10px] text-slate-500 block">{isUrdu ? "ڈیمانڈ / بجٹ" : "Price / Budget"}</span>
                              <span className="font-black text-emerald-800">{inq.priceOrBudget || "غیر معینہ"}</span>
                            </div>

                            <div className="bg-white p-2 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                              <span className="text-[10px] text-slate-500 block">{isUrdu ? "کلائنٹ کا نام" : "Client"}</span>
                              <span className="font-bold text-slate-900">{inq.clientName || "نامعلوم"}</span>
                            </div>
                          </div>

                          {inq.notes && (
                            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 mb-3">
                              <span className="font-bold text-slate-900">{isUrdu ? "تفصیل: " : "Notes: "}</span>
                              {inq.notes}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                              {inq.clientPhone && (
                                <>
                                  <button
                                    onClick={() => handleWhatsAppClient(inq)}
                                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-xs font-black flex items-center gap-1 shadow-sm hover:brightness-105 cursor-pointer"
                                    title="WhatsApp Client"
                                  >
                                    <MessageCircle size={13} className="fill-white" />
                                    <span>{isUrdu ? "واٹس ایپ" : "WhatsApp"}</span>
                                  </button>

                                  <button
                                    onClick={() => handleCallClient(inq)}
                                    className="px-2.5 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-black flex items-center gap-1 shadow-sm hover:bg-emerald-900 cursor-pointer"
                                    title="Call Client"
                                  >
                                    <Phone size={13} />
                                    <span>{isUrdu ? "کال" : "Call"}</span>
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => handlePublishToPublic(inq)}
                                disabled={inq.status === "published"}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm cursor-pointer ${
                                  inq.status === "published"
                                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                    : "bg-amber-400 text-slate-950 hover:bg-amber-500"
                                }`}
                              >
                                <Globe size={13} />
                                <span>{inq.status === "published" ? (isUrdu ? "شائع شدہ" : "Published") : (isUrdu ? "پبلک ایڈ بنائیں" : "Publish")}</span>
                              </button>
                            </div>

                            <button
                              onClick={() => deleteInquiry(inq.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* TAB 2: PROMOTIONAL VIDEO & PHOTO ADS MANAGER */}
            {activeTab === "ads" && (
              <div className="p-3 sm:p-4 max-h-[65vh] overflow-y-auto space-y-3.5">
                {/* Header Action to Toggle Create Form */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950">
                    {isUrdu ? "📺 فعال ویڈیو اور تصویر ایڈز کی لسٹ" : "Live Video & Image Ads"} ({ads.length})
                  </span>

                  <button
                    onClick={() => setIsCreateAdOpen(!isCreateAdOpen)}
                    className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <PlusCircle size={14} />
                    <span>{isCreateAdOpen ? (isUrdu ? "فارم بند کریں" : "Close Form") : (isUrdu ? "نیا ایڈ لگائیں" : "Add New Ad")}</span>
                  </button>
                </div>

                {/* Create New Ad Form */}
                <AnimatePresence>
                  {isCreateAdOpen && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCreateAdSubmit}
                      className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/80 to-emerald-50/80 border-2 border-amber-400 space-y-3 overflow-hidden"
                    >
                      <h4 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5 border-b border-amber-300 pb-2">
                        <Sparkles size={15} className="text-amber-600" />
                        <span>{isUrdu ? "نیا ویڈیو یا تصویر ایڈ شائع کریں" : "Create New Video or Image Ad"}</span>
                      </h4>

                      {/* Ad Type Selector */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAdType("image")}
                          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                            adType === "image"
                              ? "bg-emerald-800 text-white border-emerald-900 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          <Image size={14} />
                          <span>{isUrdu ? "📷 تصویر ایڈ (Image)" : "Image Ad"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAdType("video")}
                          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                            adType === "video"
                              ? "bg-amber-500 text-slate-950 border-amber-600 shadow-sm font-black"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          <Video size={14} />
                          <span>{isUrdu ? "🎥 ویڈیو ایڈ (Video)" : "Video Ad"}</span>
                        </button>
                      </div>

                      {/* Media URL / Upload */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-800 block">
                          {adType === "video" 
                            ? (isUrdu ? "ویڈیو کا لنک (MP4 یا YouTube لنک):" : "Video URL (MP4 / YouTube Link):") 
                            : (isUrdu ? "تصویر کا لنک یا موبائل سے اپ لوڈ کریں:" : "Image URL or Upload from Device:")}
                        </label>
                        
                        <input
                          type="url"
                          required
                          value={adMediaUrl}
                          onChange={(e) => setAdMediaUrl(e.target.value)}
                          placeholder={adType === "video" ? "https://.../video.mp4 یا youtube لنک" : "https://.../image.jpg"}
                          className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
                        />

                        {adType === "image" && (
                          <div className="flex items-center gap-2 pt-1">
                            <label className="py-1.5 px-3 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-[11px] font-bold text-emerald-900 flex items-center gap-1.5 cursor-pointer shadow-sm">
                              <Upload size={12} />
                              <span>{isUrdu ? "موبائل/کمپیوٹر سے تصویر منتخب کریں" : "Upload Image File"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileUpload}
                                className="hidden"
                              />
                            </label>
                            {adMediaUrl.startsWith("data:image") && (
                              <span className="text-[10px] text-emerald-700 font-bold">✓ تصویر لوڈ ہو گئی</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-800 block">
                          {isUrdu ? "ایڈ کا عنوان (Title):" : "Ad Title:"}
                        </label>
                        <input
                          type="text"
                          required
                          value={adTitle}
                          onChange={(e) => setAdTitle(e.target.value)}
                          placeholder={isUrdu ? "مثلاً: شاندار 10 مرلہ برانڈ نیو بنگلہ (بلاک B)" : "e.g. 10 Marla Brand New Villa"}
                          className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
                        />
                      </div>

                      {/* Price & Location */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-800 block">
                            {isUrdu ? "قیمت / ڈیمانڈ (Price):" : "Demand Price:"}
                          </label>
                          <input
                            type="text"
                            value={adPrice}
                            onChange={(e) => setAdPrice(e.target.value)}
                            placeholder={isUrdu ? "ڈیمانڈ: 3 کروڑ 50 لاکھ" : "3.5 Crore PKR"}
                            className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-800 block">
                            {isUrdu ? "لوکیشن (Location):" : "Location:"}
                          </label>
                          <input
                            type="text"
                            value={adLocation}
                            onChange={(e) => setAdLocation(e.target.value)}
                            placeholder="پام کمرشل 235 / بلاک A"
                            className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                          />
                        </div>
                      </div>

                      {/* Caption / Description */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-800 block">
                          {isUrdu ? "کیپشن اور مکمل تفصیل (Caption):" : "Caption & Full Description:"}
                        </label>
                        <textarea
                          rows={3}
                          value={adCaption}
                          onChange={(e) => setAdCaption(e.target.value)}
                          placeholder={isUrdu ? "5 بیڈ رومز، لگژری کچن، پرائم لوکیشن، فوری سودا دستیاب..." : "Details..."}
                          className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
                        />
                      </div>

                      {/* WhatsApp Custom Text */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-800 block">
                          {isUrdu ? "واٹس ایپ میسج ٹیکسٹ (اختیاری):" : "Custom WhatsApp Message (Optional):"}
                        </label>
                        <input
                          type="text"
                          value={adWhatsAppMsg}
                          onChange={(e) => setAdWhatsAppMsg(e.target.value)}
                          placeholder={isUrdu ? "السلام علیکم! میں یہ پراپرٹی خریدنا چاہتا ہوں۔" : "Hello, I want to buy this plot."}
                          className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md border border-amber-400 cursor-pointer"
                      >
                        <Sparkles size={16} className="text-amber-300" />
                        <span>{isUrdu ? "🚀 ایڈ شائع کریں اور تمام صارفین کو نوٹیفکیشن بھیجیں" : "Publish Ad & Broadcast Notification"}</span>
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Existing Ads List */}
                <div className="space-y-2.5">
                  {ads.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <Video size={36} className="mx-auto mb-2 opacity-40 text-amber-500" />
                      <p className="text-xs font-bold">{isUrdu ? "کوئی ایڈ موجود نہیں ہے۔ نیا ایڈ شامل کریں۔" : "No promo ads created yet."}</p>
                    </div>
                  ) : (
                    ads.map((ad) => {
                      const isVideo = ad.type === "video";
                      const displayImg = isVideo
                        ? ad.thumbnailUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80"
                        : ad.mediaUrl;

                      return (
                        <div
                          key={ad.id}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            ad.isActive 
                              ? "bg-white border-emerald-300 shadow-sm" 
                              : "bg-slate-100 border-slate-200 opacity-60"
                          }`}
                        >
                          {/* Thumbnail */}
                          <div 
                            onClick={() => openAd(ad)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900 cursor-pointer group"
                            title="Click to Preview"
                          >
                            <img src={displayImg} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              {isVideo ? <Play size={14} className="text-white fill-white" /> : <Eye size={14} className="text-white" />}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 text-right">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[9px] font-black px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                {isVideo ? "ویڈیو ایڈ" : "تصویر ایڈ"}
                              </span>
                              <span className="text-[9px] text-slate-500 font-bold">{ad.viewCount || 1} ویوز</span>
                            </div>
                            <h4 className="text-xs font-black text-slate-900 truncate">{ad.title}</h4>
                            <p className="text-[10.5px] text-emerald-800 font-bold">{ad.price || "ڈیل"}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => toggleAdActive(ad.id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                              title={ad.isActive ? "غیر فعال کریں" : "فعال کریں"}
                            >
                              {ad.isActive ? <ToggleRight size={22} className="text-emerald-700" /> : <ToggleLeft size={22} className="text-slate-400" />}
                            </button>

                            <button
                              onClick={() => openAd(ad)}
                              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors cursor-pointer"
                              title="Preview Ad Popup"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => deletePromoAd(ad.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Ad"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
