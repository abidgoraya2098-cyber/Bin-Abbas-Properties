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
  Coins 
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useLanguage } from "../context/LanguageContext";
import { CustomerInquiryRecord, PropertyListing } from "../types";
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

  const { isUrdu } = useLanguage();
  const [filterType, setFilterType] = useState<"all" | "sell" | "buy">("all");

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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          id="admin-inbox-modal-root"
          dir={isUrdu ? "rtl" : "ltr"}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAdminInboxOpen(false)}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-[500px] bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-amber-400 z-10 text-slate-900 my-auto max-h-[90vh] flex flex-col ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {/* Top Accent */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsAdminInboxOpen(false)}
              className={`absolute top-3.5 p-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 ${
                isUrdu ? "left-3.5" : "right-3.5"
              }`}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300">
                <Inbox size={22} className="text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-emerald-950">
                  {isUrdu ? "کسٹمر ایڈز و انکوائریز ان باکس" : "Customer Plot Leads Inbox"}
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {isUrdu ? `ایڈمن کنٹرول پینل: ${OWNER_NAME}` : `Owner Lead Portal: ${OWNER_NAME}`}
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 my-2.5">
              {[
                { id: "all", label: isUrdu ? "تمام لیڈز" : "All Leads" },
                { id: "sell", label: isUrdu ? "فروخت کنندگان (Sell)" : "Sellers" },
                { id: "buy", label: isUrdu ? "خریدار ڈیمانڈز (Buy)" : "Buyers" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id as any)}
                  className={`py-1 px-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                    filterType === tab.id
                      ? "bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Inquiries List */}
            <div className="overflow-y-auto space-y-3 my-1 pr-1 flex-1 max-h-[58vh]">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inq) => {
                  const isSell = inq.type === "sell";
                  const isPublished = inq.status === "published";

                  return (
                    <div
                      key={inq.id}
                      className={`p-3.5 rounded-2xl border-2 transition-all space-y-2.5 ${
                        isPublished
                          ? "bg-emerald-50/50 border-emerald-300"
                          : inq.status === "new"
                          ? "bg-amber-50/80 border-amber-400 shadow-sm"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      {/* Top Info Bar */}
                      <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-200/80">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                              isSell
                                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                : "bg-purple-100 text-purple-900 border-purple-300"
                            }`}
                          >
                            {isSell ? (isUrdu ? "پلاٹ برائے فروخت" : "Sell Plot") : (isUrdu ? "پلاٹ خریداری ڈیمانڈ" : "Buy Plot")}
                          </span>

                          <span className="text-[10px] text-slate-500 font-bold">
                            {inq.dateFormatted}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {isPublished && (
                            <span className="text-[9.5px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                              {isUrdu ? "پبلک لائیو ✓" : "Published ✓"}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteInquiry(inq.id)}
                            title={isUrdu ? "لیڈ ڈیلیٹ کریں" : "Delete"}
                            className="p-1 rounded-lg text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">📍 بلاک و لوکیشن:</span>
                          <span className="font-black text-slate-900">{inq.block}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">📏 سائز:</span>
                          <span className="font-black text-emerald-900">{inq.size}</span>
                        </div>
                        {inq.plotNumber && (
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block">🔢 پلاٹ نمبر:</span>
                            <span className="font-black text-slate-900"># {inq.plotNumber}</span>
                          </div>
                        )}
                        {inq.priceOrBudget && (
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block">💰 قیمت / بجٹ:</span>
                            <span className="font-black text-amber-900">{inq.priceOrBudget}</span>
                          </div>
                        )}
                      </div>

                      {/* Client Info */}
                      <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <User size={13} className="text-emerald-700" />
                          <span>{inq.clientName || (isUrdu ? "نامعلوم کلائنٹ" : "Anonymous")}</span>
                        </div>
                        {inq.clientPhone && (
                          <span className="font-mono text-emerald-900 font-black">{inq.clientPhone}</span>
                        )}
                      </div>

                      {inq.notes && (
                        <p className="text-[10.5px] text-slate-600 font-medium italic bg-slate-100/70 p-1.5 rounded-lg">
                          📝 {inq.notes}
                        </p>
                      )}

                      {/* Action Buttons for Admin */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-200/80">
                        {/* WhatsApp Client */}
                        <button
                          type="button"
                          onClick={() => handleWhatsAppClient(inq)}
                          disabled={!inq.clientPhone}
                          className="py-1.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-[10.5px] flex items-center justify-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <MessageCircle size={12} className="fill-white" />
                          <span>{isUrdu ? "واٹس ایپ" : "WhatsApp"}</span>
                        </button>

                        {/* Call Client */}
                        <button
                          type="button"
                          onClick={() => handleCallClient(inq)}
                          disabled={!inq.clientPhone}
                          className="py-1.5 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[10.5px] flex items-center justify-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <Phone size={12} />
                          <span>{isUrdu ? "کال کریں" : "Call"}</span>
                        </button>

                        {/* Publish to Public Board */}
                        <button
                          type="button"
                          onClick={() => handlePublishToPublic(inq)}
                          disabled={isPublished}
                          className={`py-1.5 px-2 rounded-xl text-white font-black text-[10.5px] flex items-center justify-center gap-1 shadow-xs cursor-pointer ${
                            isPublished
                              ? "bg-slate-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-105"
                          }`}
                        >
                          <Globe size={12} />
                          <span>{isPublished ? (isUrdu ? "پبلک ہے" : "Live") : (isUrdu ? "ایڈ پبلک کریں" : "Publish Ad")}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-500 space-y-1">
                  <Inbox size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold">
                    {isUrdu ? "فی الحال کوئی کسٹمر ایڈز / انکوائریز موجود نہیں ہیں۔" : "No customer inquiries found."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
