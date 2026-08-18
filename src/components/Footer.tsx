import React from "react";
import { DEVELOPER_NAME, BUSINESS_NAME, SUBTITLE } from "../data";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="mt-4 pt-3.5 pb-1 text-center border-t border-emerald-200/90 select-none"
      id="app-footer"
    >
      <div 
        className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-950 bg-emerald-100/90 px-3 py-0.5 rounded-full border border-emerald-300 shadow-xs mb-1" 
        id="footer-developer-badge"
      >
        <ShieldCheck size={13} className="text-emerald-700" />
        <span>تیار کردہ و جملہ حقوق محفوظ: {DEVELOPER_NAME}</span>
      </div>
      <div className="text-[10.5px] text-slate-700 font-bold mt-0.5" id="footer-copyright">
        © {currentYear} {BUSINESS_NAME} - {SUBTITLE}
      </div>
      <div className="text-[9.5px] text-emerald-800 font-semibold mt-0.5">
        رائل پام سٹی، گوجرانوالہ
      </div>
    </footer>
  );
}
