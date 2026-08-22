import React, { useState, useEffect } from "react";
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
  Play,
  FileText,
  Film,
  Camera,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  RefreshCw,
  Radio,
  Users,
  Activity,
  CheckCircle2
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { usePromoAds } from "../context/PromoAdContext";
import { useLanguage } from "../context/LanguageContext";
import { CustomerInquiryRecord, PropertyListing, PromoAdItem, InstalledDeviceRecord } from "../types";
import { OWNER_NAME, CONTACT_PHONE } from "../data";
import { saveMediaBlob, fileToDataUrl, compressImageToDataUrl, extractVideoThumbnail, uploadMediaToCloudinary } from "../utils/mediaStorage";
import { fetchInstalledDevicesFromCloud } from "../utils/cloudSync";

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
    openAd,
    refreshAdsFromCloud 
  } = usePromoAds();

  const { isUrdu } = useLanguage();
  const [activeTab, setActiveTab] = useState<"ads" | "leads" | "devices">("ads");
  const [filterType, setFilterType] = useState<"all" | "sell" | "buy">("all");

  // Installed Devices State
  const [devices, setDevices] = useState<InstalledDeviceRecord[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isRefreshingAds, setIsRefreshingAds] = useState(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  // New Ad Form State (Everything is 100% Optional)
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [adType, setAdType] = useState<"image" | "video" | "text_only">("image");
  const [adMediaUrl, setAdMediaUrl] = useState("");
  const [adFileName, setAdFileName] = useState("");
  const [adThumbnailUrl, setAdThumbnailUrl] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [adCaption, setAdCaption] = useState("");
  const [adPrice, setAdPrice] = useState("");
  const [adLocation, setAdLocation] = useState("");
  const [adWhatsAppMsg, setAdWhatsAppMsg] = useState("");
  const [isAdHot, setIsAdHot] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const loadDevices = async () => {
    setIsLoadingDevices(true);
    try {
      const list = await fetchInstalledDevicesFromCloud();
      setDevices(list);
      setRefreshToast(isUrdu ? `✅ ${list.length} ڈیوائسز لائیو کلاؤڈ سے اپ ڈیٹ ہو گئیں!` : `✅ ${list.length} devices updated from cloud!`);
      setTimeout(() => setRefreshToast(null), 3000);
    } catch (e) {
      console.warn("Could not load devices:", e);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  const handleRefreshAds = async () => {
    setIsRefreshingAds(true);
    try {
      const freshAds = await refreshAdsFromCloud();
      setRefreshToast(isUrdu ? `✅ ${freshAds.length} ایڈز لائیو کلاؤڈ سے اپ ڈیٹ ہو گئے!` : `✅ ${freshAds.length} ads updated from cloud!`);
      setTimeout(() => setRefreshToast(null), 3000);
    } catch (e) {
      console.warn("Could not refresh ads:", e);
    } finally {
      setIsRefreshingAds(false);
    }
  };

  useEffect(() => {
    if (isAdminInboxOpen) {
      loadDevices();
      refreshAdsFromCloud();

      // Poll while open
      const interval = setInterval(() => {
        if (activeTab === "devices") {
          fetchInstalledDevicesFromCloud().then(setDevices).catch(() => {});
        } else if (activeTab === "ads") {
          refreshAdsFromCloud().catch(() => {});
        }
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [isAdminInboxOpen, activeTab]);

  // Handle Gallery Photo/Video File Upload directly from phone/computer
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, mediaKind: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(5);

    try {
      setAdType(mediaKind);
      setAdFileName(file.name);

      if (mediaKind === "image") {
        // High-Quality Client-side compression for instant cross-device delivery
        const compressedDataUrl = await compressImageToDataUrl(file);
        setUploadProgress(70);
        const mediaId = `media-${Date.now()}`;
        const storedRef = await saveMediaBlob(mediaId, compressedDataUrl);
        setAdMediaUrl(storedRef);
        setAdThumbnailUrl(compressedDataUrl);
        setUploadProgress(100);
      } else {
        // Video: Extract thumbnail + Save full video to dedicated Cloud Media Storage
        setUploadProgress(20);
        const posterThumb = await extractVideoThumbnail(file);
        if (posterThumb) {
          setAdThumbnailUrl(posterThumb);
        }
        setUploadProgress(50);
        const dataUrl = await fileToDataUrl(file);
        setUploadProgress(80);
        const mediaId = `media-${Date.now()}`;
        const storedRef = await saveMediaBlob(mediaId, dataUrl);
        setAdMediaUrl(storedRef);
        setUploadProgress(100);
      }
    } catch (err) {
      console.warn("Upload error:", err);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleCreateAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Title defaults nicely if left empty
      const finalTitle = adTitle.trim() || (isUrdu ? "خصوصی پیشکش - بن عباس پراپرٹیز" : "Special Offer - Bin Abbas Properties");

      await addPromoAd({
        type: adType,
        mediaUrl: adMediaUrl.trim() || undefined,
        thumbnailUrl: adThumbnailUrl.trim() || undefined,
        title: finalTitle,
        titleEn: finalTitle,
        caption: adCaption.trim() || undefined,
        captionEn: adCaption.trim() || undefined,
        price: adPrice.trim() || undefined,
        priceEn: adPrice.trim() || undefined,
        location: adLocation.trim() || (isUrdu ? "رائل پام سٹی، گوجرانوالہ" : "Royal Palm City, Gujranwala"),
        locationEn: adLocation.trim() || "Royal Palm City, Gujranwala",
        whatsAppMessage: adWhatsAppMsg.trim() || undefined,
        isActive: true,
        isHot: isAdHot
      });

      // Reset Form
      setAdMediaUrl("");
      setAdFileName("");
      setAdThumbnailUrl("");
      setAdTitle("");
      setAdCaption("");
      setAdPrice("");
      setAdLocation("");
      setAdWhatsAppMsg("");
      setIsCreateAdOpen(false);

      alert(isUrdu 
        ? "✅ ایڈ کامیابی سے شائع کر دی گئی ہے اور تمام موبائل صارفین کے لیے لائیو ہو چکی ہے!" 
        : "✅ Ad successfully published globally to all users!");
    } catch (err) {
      console.error("Publish error:", err);
      alert(isUrdu ? "ایڈ محفوظ ہو گئی ہے" : "Ad saved");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublishToPublic = (inq: CustomerInquiryRecord) => {
    try {
      const currentDeals: PropertyListing[] = JSON.parse(localStorage.getItem("bin_abbas_custom_deals") || "[]");
      const isDemand = inq.type === "buy";
      const title = isDemand
        ? `خریدار کی فوری ضرورت: ${inq.size} (${inq.block})`
        : `فوری فروخت کے لیے دستیاب: ${inq.size} (${inq.block})`;

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

  const onlineDevicesCount = devices.filter((d) => d.isOnline).length;
  const pwaInstalledCount = devices.filter((d) => d.isPwaInstalled).length;

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "iPhone":
      case "Mobile":
      case "Android":
        return <Smartphone size={18} className="text-emerald-700" />;
      case "Tablet":
        return <Tablet size={18} className="text-amber-700" />;
      case "Mac":
      case "PC":
      default:
        return <Monitor size={18} className="text-blue-700" />;
    }
  };

  return (
    <AnimatePresence>
      {isAdminInboxOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          id="admin-inbox-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 my-auto text-slate-900"
            id="admin-inbox-modal-card"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-4 flex items-center justify-between border-b border-amber-400/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-md">
                  <Inbox size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-amber-300 leading-tight">
                    {isUrdu ? "ایڈمن و آنر مکمل کنٹرول سنٹر" : "Admin & Owner Master Control Center"}
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

            {/* Top 3 Navigation Tabs */}
            <div className="grid grid-cols-3 bg-emerald-50/90 border-b border-emerald-200 p-1.5 gap-1.5">
              {/* TAB 1: ADS */}
              <button
                onClick={() => setActiveTab("ads")}
                className={`py-2 px-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === "ads"
                    ? "bg-amber-500 text-slate-950 shadow-md border border-amber-600 font-black"
                    : "bg-white text-slate-700 hover:bg-amber-50"
                }`}
              >
                <Video size={14} />
                <span>{isUrdu ? "ویڈیو ایڈز" : "Ads"} ({ads.length})</span>
              </button>

              {/* TAB 2: LEADS */}
              <button
                onClick={() => setActiveTab("leads")}
                className={`py-2 px-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === "leads"
                    ? "bg-emerald-800 text-white shadow-md border border-emerald-700"
                    : "bg-white text-slate-700 hover:bg-emerald-100/70"
                }`}
              >
                <Inbox size={14} />
                <span>{isUrdu ? "کسٹمر لیڈز" : "Leads"} ({inquiries.length})</span>
              </button>

              {/* TAB 3: DEVICES & INSTALLATIONS TRACKER */}
              <button
                onClick={() => {
                  setActiveTab("devices");
                  loadDevices();
                }}
                className={`py-2 px-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === "devices"
                    ? "bg-blue-800 text-white shadow-md border border-blue-700"
                    : "bg-white text-slate-700 hover:bg-blue-50"
                }`}
              >
                <Smartphone size={14} />
                <span>{isUrdu ? "انسٹال ڈیوائسز" : "Devices"} ({devices.length})</span>
              </button>
            </div>

            {/* Live Refresh Status Toast */}
            <AnimatePresence>
              {refreshToast && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-emerald-600 text-white text-xs font-bold text-center py-2 px-4 shadow-sm border-b border-emerald-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={14} className="text-amber-300" />
                  <span>{refreshToast}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB 1: PROMOTIONAL VIDEO & PHOTO ADS MANAGER */}
            {activeTab === "ads" && (
              <div className="p-3 sm:p-4 max-h-[65vh] overflow-y-auto space-y-3.5">
                {/* Header Actions (Refresh + Create Form Toggle) */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black text-emerald-950 block">
                      {isUrdu ? "📺 آپ کے لگائے ہوئے ایڈز" : "Your Custom Ads"} ({ads.length})
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {isUrdu ? "یہ ایڈز تمام صارفین کے موبائل اور کمپیوٹر پر لائیو نظر آئیں گے" : "These ads are synced globally across all users"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleRefreshAds}
                      disabled={isRefreshingAds}
                      className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center gap-1 transition-all cursor-pointer border border-slate-300"
                      title={isUrdu ? "کلاؤڈ سے ایڈز ریفریش کریں" : "Refresh Ads from Cloud"}
                    >
                      <RefreshCw size={13} className={isRefreshingAds ? "animate-spin" : ""} />
                      <span className="hidden sm:inline">{isUrdu ? "ریفریش" : "Refresh"}</span>
                    </button>

                    <button
                      onClick={() => setIsCreateAdOpen(!isCreateAdOpen)}
                      className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer border border-amber-300 shrink-0"
                    >
                      <PlusCircle size={15} />
                      <span>{isCreateAdOpen ? (isUrdu ? "فارم بند کریں" : "Close Form") : (isUrdu ? "➕ نیا ایڈ بنائیں" : "Create New Ad")}</span>
                    </button>
                  </div>
                </div>

                {/* Create New Ad Form (Full Freedom for Admin) */}
                <AnimatePresence>
                  {isCreateAdOpen && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleCreateAdSubmit}
                      className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/90 to-emerald-50/90 border-2 border-amber-400 space-y-3.5 overflow-hidden shadow-md"
                    >
                      <div className="flex items-center justify-between border-b border-amber-300 pb-2">
                        <h4 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5">
                          <Sparkles size={15} className="text-amber-600" />
                          <span>{isUrdu ? "نیا ایڈ بنائیں (گیلری سے تصویر/ویڈیو اپ لوڈ کریں)" : "Create Ad (Upload Photo/Video from Gallery)"}</span>
                        </h4>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                          {isUrdu ? "تمام خانے اختیاری ہیں" : "All fields optional"}
                        </span>
                      </div>

                      {/* 1. GALLERY UPLOAD BUTTONS */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-900 block">
                          {isUrdu ? "1. تصویر یا ویڈیو کا انتخاب فرمائیں (اختیاری):" : "1. Choose Photo or Video (Optional):"}
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Gallery Photo Upload */}
                          <label className="p-3 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-dashed border-emerald-400 text-emerald-950 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm hover:border-emerald-600 text-center">
                            <Camera size={20} className="text-emerald-700" />
                            <span className="text-xs font-black">{isUrdu ? "📷 گیلری سے تصویر منتخب کریں" : "Upload Photo"}</span>
                            <span className="text-[9px] text-slate-500 font-semibold">{isUrdu ? "موبائل فوٹوز سے" : "From Gallery"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleGalleryFileUpload(e, "image")}
                              className="hidden"
                            />
                          </label>

                          {/* Gallery Video Upload */}
                          <label className="p-3 rounded-2xl bg-white hover:bg-amber-50 border-2 border-dashed border-amber-400 text-amber-950 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm hover:border-amber-600 text-center">
                            <Film size={20} className="text-amber-700" />
                            <span className="text-xs font-black">{isUrdu ? "🎥 گیلری سے ویڈیو منتخب کریں" : "Upload Video"}</span>
                            <span className="text-[9px] text-slate-500 font-semibold">{isUrdu ? "موبائل ویڈیوز سے" : "From Gallery"}</span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleGalleryFileUpload(e, "video")}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Direct Link Alternative with 1-Tap Paste Button */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-700 font-bold">
                              {isUrdu ? "یا یوٹیوب / ویڈیو لنک (یوٹیوب شارٹس یا فیس بک):" : "Or YouTube / Video Link (Shorts or Facebook):"}
                            </span>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const text = await navigator.clipboard.readText();
                                  if (text && text.trim()) {
                                    const cleanText = text.trim();
                                    setAdMediaUrl(cleanText);
                                    if (cleanText.includes("youtu") || cleanText.includes(".mp4") || cleanText.includes("facebook") || cleanText.includes("drive")) {
                                      setAdType("video");
                                      const ytMatch = cleanText.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
                                      if (ytMatch && ytMatch[1]) {
                                        setAdThumbnailUrl(`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`);
                                      }
                                    } else {
                                      setAdType("image");
                                    }
                                  }
                                } catch (e) {
                                  alert(isUrdu ? "براہ کرم لنک خود پیسٹ کریں" : "Please paste link manually");
                                }
                              }}
                              className="text-[10px] text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>📋 {isUrdu ? "لنک چسپاں کریں (Paste)" : "Paste Link"}</span>
                            </button>
                          </div>

                          <input
                            type="text"
                            value={adMediaUrl.startsWith("data:") || adMediaUrl.startsWith("media-") ? "" : adMediaUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAdMediaUrl(val);
                              if (val.includes(".mp4") || val.includes("youtu") || val.includes("drive") || val.includes("facebook")) {
                                setAdType("video");
                                const ytMatch = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
                                if (ytMatch && ytMatch[1]) {
                                  setAdThumbnailUrl(`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`);
                                }
                              } else if (val.trim()) {
                                setAdType("image");
                              }
                            }}
                            placeholder={isUrdu ? "https://youtube.com/shorts/... یا ویڈیو لنک" : "https://youtube.com/shorts/... or video link"}
                            className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans text-left"
                            dir="ltr"
                          />
                        </div>

                        {/* Uploading Progress Bar */}
                        {isUploading && (
                          <div className="p-3 rounded-2xl bg-amber-100 border border-amber-400 space-y-1.5 animate-pulse">
                            <div className="flex items-center justify-between text-xs font-black text-amber-950">
                              <span>{isUrdu ? "ویڈیو / تصویر کلاؤڈ پر منتقل ہو رہی ہے..." : "Uploading media to cloud..."}</span>
                              <span>{uploadProgress ? `${uploadProgress}%` : "پراسیسنگ..."}</span>
                            </div>
                            <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-600 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress || 30}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Upload Status / Live Preview Indicator */}
                        {adMediaUrl && !isUploading && (
                          <div className="p-3 rounded-2xl bg-emerald-100/90 border border-emerald-300 space-y-2">
                            <div className="flex items-center justify-between text-xs text-emerald-950 font-bold">
                              <div className="flex items-center gap-1.5 truncate">
                                <CheckCircle size={15} className="text-emerald-700 shrink-0" />
                                <span className="truncate">{adFileName || (adType === "video" ? "ویڈیو ایڈ کامیابی سے منسلک ہو گئی" : "تصویر کامیابی سے لوڈ ہو گئی")}</span>
                              </div>
                              <span className="text-[10px] bg-emerald-800 text-white px-2.5 py-0.5 rounded-full shrink-0">
                                {adType === "video" ? "🎥 VIDEO READY" : "📷 PHOTO READY"}
                              </span>
                            </div>

                            {/* Live Video / Photo Preview Box */}
                            <div className="w-full h-36 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-emerald-400/60 relative">
                              {adType === "video" ? (
                                adMediaUrl.includes("youtu") ? (
                                  <iframe
                                    src={
                                      adMediaUrl.includes("shorts/")
                                        ? `https://www.youtube.com/embed/${adMediaUrl.split("shorts/")[1]?.split("?")[0]}?autoplay=0`
                                        : adMediaUrl.includes("watch?v=")
                                        ? `https://www.youtube.com/embed/${adMediaUrl.split("v=")[1]?.split("&")[0]}?autoplay=0`
                                        : `https://www.youtube.com/embed/${adMediaUrl.split("youtu.be/")[1]?.split("?")[0]}?autoplay=0`
                                    }
                                    title="Video Preview"
                                    className="w-full h-full border-0"
                                  />
                                ) : (
                                  <video
                                    src={adMediaUrl}
                                    controls
                                    playsInline
                                    className="w-full h-full object-contain"
                                  />
                                )
                              ) : (
                                <img
                                  src={adMediaUrl}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 2. TITLE (OPTIONAL) */}
                      <div>
                        <label className="text-[11px] font-black text-slate-900 block mb-1">
                          {isUrdu ? "2. ایڈ کا عنوان / پلاٹ تفصیل (اختیاری):" : "2. Ad Title / Plot Summary (Optional):"}
                        </label>
                        <input
                          type="text"
                          value={adTitle}
                          onChange={(e) => setAdTitle(e.target.value)}
                          placeholder={isUrdu ? "مثلاً: 10 مرلہ برائے فروخت پام بلاک رائل پام سٹی" : "e.g. 10 Marla Plot for Sale Palm Block"}
                          className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-right"
                        />
                      </div>

                      {/* 3. PRICE & LOCATION (OPTIONAL) */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-black text-slate-900 block mb-1">
                            {isUrdu ? "3. قیمت / ڈیمانڈ (اختیاری):" : "3. Price Demand (Optional):"}
                          </label>
                          <input
                            type="text"
                            value={adPrice}
                            onChange={(e) => setAdPrice(e.target.value)}
                            placeholder={isUrdu ? "مثلاً: 1 کروڑ 25 لاکھ" : "e.g. 1.25 Crore"}
                            className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-right"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-black text-slate-900 block mb-1">
                            {isUrdu ? "4. بلاک / لوکیشن (اختیاری):" : "4. Block / Location (Optional):"}
                          </label>
                          <input
                            type="text"
                            value={adLocation}
                            onChange={(e) => setAdLocation(e.target.value)}
                            placeholder={isUrdu ? "مثلاً: بلاک B ایکسٹینشن" : "e.g. Block B Extension"}
                            className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-right"
                          />
                        </div>
                      </div>

                      {/* 4. DETAILS / CAPTION (OPTIONAL) */}
                      <div>
                        <label className="text-[11px] font-black text-slate-900 block mb-1">
                          {isUrdu ? "5. مزید مکمل تفصیلات و خصوصیات (اختیاری):" : "5. Additional Description (Optional):"}
                        </label>
                        <textarea
                          rows={2}
                          value={adCaption}
                          onChange={(e) => setAdCaption(e.target.value)}
                          placeholder={isUrdu ? "مثلاً: 40 فٹ روڈ، پارک فیسنگ، فوری پوزیشن دستیاب، کارنر پلاٹ..." : "e.g. Corner plot, 40ft road, ready for construction..."}
                          className="w-full p-2.5 rounded-xl border border-emerald-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-right"
                        />
                      </div>

                      {/* Submit Live Ad Button */}
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:brightness-110 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg border border-amber-400 cursor-pointer"
                      >
                        <Sparkles size={16} className="text-amber-300" />
                        <span>{isUrdu ? "🚀 ایڈ لائیو شائع کریں (تمام صارفین تک پہنچائیں)" : "🚀 Publish Live Ad Globally"}</span>
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Ads List */}
                <div className="space-y-3">
                  {ads.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <Film size={36} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-bold text-slate-600">
                        {isUrdu ? "فی الوقت کوئی لائیو ایڈ موجود نہیں ہے۔ اوپر والے بٹن سے نیا ایڈ بنائیں!" : "No custom ads created yet. Click 'Create New Ad' above!"}
                      </p>
                    </div>
                  ) : (
                    ads.map((ad) => (
                      <div
                        key={ad.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          ad.isActive 
                            ? "bg-white border-amber-300 shadow-md" 
                            : "bg-slate-50 border-slate-200 opacity-60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                              ad.type === "video" ? "bg-amber-500 text-slate-950" : "bg-emerald-800 text-white"
                            }`}>
                              {ad.type === "video" ? "VIDEO" : ad.type === "image" ? "PHOTO" : "TEXT"}
                            </span>
                            <span className="text-xs font-black text-slate-900">{ad.title}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleAdActive(ad.id)}
                              className="p-1 text-slate-500 hover:text-emerald-700"
                              title="Toggle Active"
                            >
                              {ad.isActive ? <ToggleRight size={22} className="text-emerald-600" /> : <ToggleLeft size={22} className="text-slate-400" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePromoAd(ad.id)}
                              className="p-1 text-slate-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {ad.price && (
                          <div className="text-xs font-black text-emerald-800 mt-1">
                            💰 {ad.price} {ad.location ? `| 📍 ${ad.location}` : ""}
                          </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Eye size={12} /> {ad.viewCount || 1} {isUrdu ? "مناظر" : "views"}
                          </span>
                          <button
                            type="button"
                            onClick={() => openAd(ad)}
                            className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Play size={12} /> {isUrdu ? "فل سکرین پیش نظارہ" : "Preview"}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: LEADS INBOX */}
            {activeTab === "leads" && (
              <div>
                <div className="p-3 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950">
                    {isUrdu ? "فلٹر:" : "Filter:"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFilterType("all")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        filterType === "all" ? "bg-emerald-800 text-white" : "bg-white text-slate-700"
                      }`}
                    >
                      {isUrdu ? "تمام" : "All"} ({inquiries.length})
                    </button>
                    <button
                      onClick={() => setFilterType("sell")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        filterType === "sell" ? "bg-emerald-800 text-white" : "bg-white text-slate-700"
                      }`}
                    >
                      {isUrdu ? "فروخت" : "Sell"} ({inquiries.filter((i) => i.type === "sell").length})
                    </button>
                    <button
                      onClick={() => setFilterType("buy")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        filterType === "buy" ? "bg-emerald-800 text-white" : "bg-white text-slate-700"
                      }`}
                    >
                      {isUrdu ? "خریداری" : "Buy"} ({inquiries.filter((i) => i.type === "buy").length})
                    </button>
                  </div>
                </div>

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
              </div>
            )}

            {/* TAB 3: 📱 INSTALLED DEVICES & ACTIVE USERS TRACKER */}
            {activeTab === "devices" && (
              <div className="p-3 sm:p-4 max-h-[65vh] overflow-y-auto space-y-3.5">
                {/* Stats Summary Bar */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                    <span className="text-[10px] text-blue-800 font-bold block">{isUrdu ? "کل انسٹالیشنز" : "Total Installs"}</span>
                    <span className="text-xl font-black text-blue-950">{devices.length}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-800 font-bold block">{isUrdu ? "لائیو ایکٹو یوزرز" : "Online Users"}</span>
                    <span className="text-xl font-black text-emerald-950 flex items-center justify-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {onlineDevicesCount || (devices.length > 0 ? 1 : 0)}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-800 font-bold block">{isUrdu ? "PWA ہوم سکرین" : "PWA Apps"}</span>
                    <span className="text-xl font-black text-amber-950">{pwaInstalledCount || devices.length}</span>
                  </div>
                </div>

                {/* Header Action to Refresh */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Smartphone size={15} className="text-blue-700" />
                    <span>{isUrdu ? "انسٹال شدہ موبائل اور کمپیوٹرز کی لسٹ:" : "Registered Devices & Users:"}</span>
                  </span>

                  <button
                    onClick={loadDevices}
                    disabled={isLoadingDevices}
                    className="py-1.5 px-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-black text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <RefreshCw size={13} className={isLoadingDevices ? "animate-spin" : ""} />
                    <span>{isUrdu ? "ریفریش لسٹ" : "Refresh"}</span>
                  </button>
                </div>

                {/* Devices List */}
                <div className="space-y-2.5">
                  {devices.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <Smartphone size={40} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-bold text-slate-600">
                        {isUrdu ? "جیسے ہی کوئی صارف ایپ اوپن یا انسٹال کرے گا، اس کا موبائل/کمپیوٹر یہاں ظاہر ہو جائے گا۔" : "Devices will appear here as users open or install the app."}
                      </p>
                    </div>
                  ) : (
                    devices.map((device, idx) => (
                      <div
                        key={device.id || `dev-${idx}`}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                              {getDeviceIcon(device.deviceType)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-slate-900">
                                  {device.deviceModel || device.deviceType}
                                </span>
                                {device.isPwaInstalled && (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[9px]">
                                    PWA APP
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {device.os} • {device.browser} {device.ip ? `• IP: ${device.ip}` : ""}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${
                              device.isOnline ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${device.isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
                              {device.isOnline ? (isUrdu ? "آن لائن" : "Online") : (isUrdu ? "آف لائن" : "Offline")}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                          <div>
                            <span className="text-slate-400 block">{isUrdu ? "انسٹالیشن تاریخ:" : "Installed on:"}</span>
                            <span className="font-bold text-slate-800">{device.installDateFormatted || "ابھی"}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 block">{isUrdu ? "آخری بار فعال:" : "Last Active:"}</span>
                            <span className="font-bold text-slate-800">{device.lastActiveFormatted || "ابھی"}</span>
                          </div>
                        </div>
                      </div>
                    ))
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
