import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, CheckCheck, Trash2, Sparkles, Send, ShieldAlert, ArrowRight, ShieldCheck, Video } from "lucide-react";
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

  const { featuredAd, openAd, activeAds } = usePromoAds();
  const { isUrdu } = useLanguage();
  const { isAdmin } = useAdmin();

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
            {featuredAd && (
              <div 
                onClick={() => {
                  setIsNotificationModalOpen(false);
                  openAd(featuredAd);
                }}
                className="my-2 p-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs flex items-center justify-between shadow-md border border-amber-500 cursor-pointer hover:brightness-105 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-slate-950 text-amber-300">
                    <Video size={13} />
                  </span>
                  <span className="truncate max-w-[230px]">
                    {isUrdu ? `خصوصی ایڈ: ${featuredAd.title}` : `Featured Ad: ${featuredAd.title}`}
                  </span>
                </div>
                <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded-full shrink-0">
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
                  const isPromoNotif = n.type === "promo_ad" || n.title.includes("ویڈیو") || n.title.includes("تصویر");
                  const title = isUrdu ? n.title : (n.titleEn || n.title);
                  const msg = isUrdu ? n.message : (n.messageEn || n.message);

                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (isAdminNotif && isAdmin) {
                          setIsNotificationModalOpen(false);
                          setIsAdminInboxOpen(true);
                        } else if (isPromoNotif && featuredAd) {
                          setIsNotificationModalOpen(false);
                          openAd(featuredAd);
                        }
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                        !n.isRead
                          ? isAdminNotif
                            ? "bg-amber-50/80 border-amber-400 shadow-sm"
                            : "bg-emerald-50/80 border-emerald-300 shadow-sm"
                          : "bg-slate-50 border-slate-200 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {/* Unread Dot */}
                      {!n.isRead && (
                        <span className={`absolute top-3 ${isUrdu ? "left-3" : "right-3"} w-2 h-2 rounded-full ${isAdminNotif ? "bg-amber-500" : "bg-emerald-600"}`}></span>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                          {isAdminNotif ? (
                            <ShieldAlert size={14} className="text-amber-700 shrink-0" />
                          ) : (
                            <Sparkles size={14} className="text-emerald-700 shrink-0" />
                          )}
                          <span>{title}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-700 font-semibold mt-1 leading-relaxed">
                        {msg}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 text-[10px] text-slate-500 font-bold">
                        <span>{n.timeFormatted}</span>

                        {isAdminNotif && isAdmin ? (
                          <span className="text-amber-800 font-black flex items-center gap-0.5">
                            <span>{isUrdu ? "کوائف دیکھیں" : "View Lead"}</span>
                            <ArrowRight size={11} />
                          </span>
                        ) : isPromoNotif && featuredAd ? (
                          <span className="text-emerald-800 font-black flex items-center gap-0.5">
                            <span>{isUrdu ? "ایڈ کھولیں" : "Open Ad"}</span>
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
