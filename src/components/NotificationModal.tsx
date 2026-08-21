import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, CheckCheck, Trash2, Sparkles, Send, ShieldAlert, ArrowRight, ShieldCheck, Video, Eye } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { usePromoAds } from "../context/PromoAdContext";
import { useLanguage } from "../context/LanguageContext";
import { useAdmin } from "../context/AdminContext";

export default function NotificationModal() {
  const { 
    notifications, 
    unreadCount, 
    isNotificationModalOpen, 
    setIsNotificationModalOpen,
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearNotifications,
    setIsAdminInboxOpen
  } = useNotifications();

  const { featuredAd, openAd, activeAds, ads } = usePromoAds();
  const { isUrdu } = useLanguage();
  const { isAdmin } = useAdmin();

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markAsRead(n.id);

    // 1. If Admin Notification -> Open Admin Inbox
    if (n.targetRole === "admin" && isAdmin) {
      setIsNotificationModalOpen(false);
      setIsAdminInboxOpen(true);
      return;
    }

    // 2. If Linked to a specific ad ID -> Open that exact Ad
    if (n.relatedId) {
      const match = ads.find((a) => a.id === n.relatedId) || activeAds.find((a) => a.id === n.relatedId);
      if (match) {
        setIsNotificationModalOpen(false);
        openAd(match);
        return;
      }
    }

    // 3. If Promo Ad or Deal -> Open featured or first active ad
    if (featuredAd || activeAds.length > 0) {
      setIsNotificationModalOpen(false);
      openAd(featuredAd || activeAds[0]);
    }
  };

  return (
    <AnimatePresence>
      {isNotificationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          id="notification-modal-root"
          dir={isUrdu ? "rtl" : "ltr"}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNotificationModalOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-[420px] bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-amber-400 z-10 text-slate-900 my-auto max-h-[85vh] flex flex-col ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {/* Top Accent */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsNotificationModalOpen(false)}
              className={`absolute top-3.5 p-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 ${
                isUrdu ? "left-3.5" : "right-3.5"
              }`}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                  <Bell size={18} className="text-amber-700" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-emerald-950">
                    {isUrdu ? "نوٹیفکیشن سینٹر" : "Notification Center"}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    {unreadCount > 0 
                      ? isUrdu ? `${unreadCount} نئے غیر پڑھے گئے نوٹیفکیشنز` : `${unreadCount} unread notifications` 
                      : isUrdu ? "تمام نوٹیفکیشنز اپ ٹو ڈیٹ ہیں" : "All caught up"}
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Active Ad Shortcut Banner in Notification Center */}
            {(featuredAd || activeAds.length > 0) && (
              <div 
                onClick={() => {
                  setIsNotificationModalOpen(false);
                  openAd(featuredAd || activeAds[0]);
                }}
                className="my-2 p-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs flex items-center justify-between shadow-md border border-amber-500 cursor-pointer hover:brightness-105 transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1 rounded-lg bg-slate-950 text-amber-300 shrink-0">
                    <Video size={13} />
                  </span>
                  <span className="truncate">
                    {isUrdu 
                      ? `لائیو ایڈ: ${(featuredAd || activeAds[0]).title}` 
                      : `Live Ad: ${(featuredAd || activeAds[0]).title}`}
                  </span>
                </div>
                <span className="text-[10px] bg-slate-950 text-white px-2.5 py-0.5 rounded-full shrink-0 font-bold">
                  {isUrdu ? "دیکھیں" : "View"}
                </span>
              </div>
            )}

            {/* Actions Bar */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-slate-100 text-[11px]">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck size={14} />
                  <span>{isUrdu ? "سب پڑھے گئے مارک کریں" : "Mark all as read"}</span>
                </button>

                <button
                  type="button"
                  onClick={clearNotifications}
                  className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>{isUrdu ? "تمام صاف کریں" : "Clear all"}</span>
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="overflow-y-auto space-y-2.5 my-3 pr-1 flex-1 max-h-[45vh]">
              {notifications.length > 0 ? (
                notifications.map((n) => {
                  const isAdminNotif = n.targetRole === "admin";
                  const isPromoNotif = n.type === "promo_ad" || n.type === "new_deal" || !!n.relatedId;
                  const title = isUrdu ? n.title : (n.titleEn || n.title);
                  const msg = isUrdu ? n.message : (n.messageEn || n.message);

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                        !n.isRead
                          ? isAdminNotif
                            ? "bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-amber-400 shadow-md font-bold"
                            : "bg-gradient-to-r from-emerald-50 via-emerald-100/60 to-emerald-50 border-emerald-300 shadow-md font-bold"
                          : "bg-slate-50/80 border-slate-200 text-slate-600 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-900">
                          {isAdminNotif ? (
                            <ShieldAlert size={14} className="text-amber-700 shrink-0" />
                          ) : (
                            <Sparkles size={14} className="text-emerald-700 shrink-0" />
                          )}
                          <span className={!n.isRead ? "font-black" : "font-semibold"}>{title}</span>
                        </div>

                        {/* Right Top Actions: Unread Badge & Individual Delete Button */}
                        <div className="flex items-center gap-1 shrink-0">
                          {!n.isRead && (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black">
                              {isUrdu ? "نیا" : "NEW"}
                            </span>
                          )}

                          {/* Individual Delete Button for this specific notification */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="p-1 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title={isUrdu ? "یہ نوٹیفکیشن ڈیلیٹ کریں" : "Delete notification"}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className={`text-[11px] mt-1.5 leading-relaxed ${!n.isRead ? "text-slate-800 font-semibold" : "text-slate-600"}`}>
                        {msg}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 text-[10px] text-slate-500 font-bold">
                        <span>{n.timeFormatted}</span>

                        {isAdminNotif && isAdmin ? (
                          <span className="text-amber-800 font-black flex items-center gap-0.5">
                            <span>{isUrdu ? "کوائف دیکھیں" : "View Lead"}</span>
                            <ArrowRight size={11} />
                          </span>
                        ) : isPromoNotif ? (
                          <span className="text-emerald-800 font-black flex items-center gap-0.5 group-hover:text-amber-600 transition-colors">
                            <Eye size={12} />
                            <span>{isUrdu ? "ایڈ دیکھنے کے لیے کلک کریں" : "Click to view Ad"}</span>
                            <ArrowRight size={11} />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-slate-500 space-y-1">
                  <Bell size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold">{isUrdu ? "کوئی نیا نوٹیفکیشن موجود نہیں ہے" : "No notifications right now"}</p>
                </div>
              )}
            </div>

            {/* Admin Leads Shortcut if Admin */}
            {isAdmin && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationModalOpen(false);
                    setIsAdminInboxOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <ShieldCheck size={15} />
                  <span>{isUrdu ? "ایڈمن کنٹرول سنٹر و ایڈز مینیجر" : "Open Admin Control Center & Ads Manager"}</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
