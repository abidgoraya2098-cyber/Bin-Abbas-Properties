import React from "react";
import { OWNER_NAME, BUSINESS_NAME, SUBTITLE } from "../data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="mt-4 pt-3.5 pb-1 text-center border-t border-emerald-200 select-none"
      id="app-footer"
    >
      <div className="text-xs font-black text-emerald-950 tracking-wide" id="footer-owner-info">
        {OWNER_NAME}
      </div>
      <div className="text-[10.5px] text-slate-600 font-semibold mt-1" id="footer-copyright">
        © {currentYear} {BUSINESS_NAME} - {SUBTITLE}
      </div>
      <div className="text-[9.5px] text-emerald-700 font-bold mt-0.5">
        رائل پام سٹی، گوجرانوالہ
      </div>
    </footer>
  );
}
