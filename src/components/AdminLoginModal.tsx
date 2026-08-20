import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Lock, X, LogOut, CheckCircle, AlertCircle, Video } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { useLanguage } from "../context/LanguageContext";
import { useNotifications } from "../context/NotificationContext";
import { OWNER_NAME } from "../data";

export default function AdminLoginModal() {
  const { isAdmin, login, logout, isLoginModalOpen, setIsLoginModalOpen } = useAdmin();
  const { setIsAdminInboxOpen } = useNotifications();
  const { isUrdu } = useLanguage();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(pin);
    if (success) {
      setPin("");
      setError(false);
      setIsLoginModalOpen(false);
      setIsAdminInboxOpen(true);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoginModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          id="admin-login-modal"
          dir={isUrdu ? "rtl" : "ltr"}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoginModalOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-[380px] bg-white rounded-3xl p-5 shadow-2xl border-2 border-amber-400 z-10 text-slate-900 ${
              isUrdu ? "text-right" : "text-left"
            }`}
          >
            {/* Top Accent */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600"></div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className={`absolute top-3.5 p-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 ${
                isUrdu ? "left-3.5" : "right-3.5"
              }`}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
                <ShieldCheck size={22} className="text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-emerald-950">
                  {isUrdu ? "مالک و ایڈمن پورٹل" : "Owner & Admin Portal"}
                </h3>
                <p className="text-[11px] text-slate-600 font-bold">
                  {isUrdu ? `${OWNER_NAME} (بن عباس پراپرٹیز)` : `${OWNER_NAME} (Owner Login)`}
                </p>
              </div>
            </div>

            {isAdmin ? (
              /* If already logged in as Admin */
              <div className="space-y-4 pt-1">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-2 text-emerald-950">
                  <CheckCircle size={18} className="text-emerald-700 shrink-0" />
                  <p className="text-xs font-black">
                    {isUrdu
                      ? "آپ بطور ایڈمن / اونر کامیابی سے لاگ ان ہیں۔ آپ پراپرٹی ڈیلز کو ایڈٹ، ڈیلیٹ اور نئی ڈیلز شامل کر سکتے ہیں۔"
                      : "You are logged in as Admin/Owner. You have full permissions to add, edit and delete listings."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                >
                  <LogOut size={16} />
                  <span>{isUrdu ? "ایڈمن موڈ سے لاگ آؤٹ کریں" : "Logout Admin Mode"}</span>
                </button>
              </div>
            ) : (
              /* PIN Login Form */
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 pt-1">
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  {isUrdu
                    ? "ایپ میں نئی پراپرٹی ڈیلز شامل کرنے، تبدیل کرنے یا ڈیلیٹ کرنے کے لیے اپنا خفیہ ایڈمن پن کوڈ درج کریں:"
                    : "Enter your private Owner PIN to unlock management mode and add/edit deals:"}
                </p>

                <div>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={11}
                      autoFocus
                      placeholder={isUrdu ? "خفیہ پن کوڈ درج کریں..." : "Enter PIN code..."}
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        setError(false);
                      }}
                      className={`w-full bg-emerald-50/60 border-2 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 tracking-widest focus:outline-none focus:bg-white text-center ${
                        error ? "border-red-500 bg-red-50" : "border-emerald-300 focus:border-emerald-600"
                      }`}
                    />
                    <Lock
                      size={16}
                      className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                        isUrdu ? "left-3" : "right-3"
                      }`}
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-1 mt-1.5 text-red-600 text-[11px] font-bold">
                      <AlertCircle size={13} />
                      <span>{isUrdu ? "غلط پن کوڈ! دوبارہ کوشش کریں۔" : "Invalid PIN! Please try again."}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white font-black text-xs shadow-md border border-amber-300 flex items-center justify-center gap-2 hover:brightness-105 cursor-pointer active:scale-98 transition-all"
                >
                  <ShieldCheck size={16} className="text-amber-300" />
                  <span>{isUrdu ? "ایڈمن تصدیق و لاگ ان" : "Verify & Login as Owner"}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
