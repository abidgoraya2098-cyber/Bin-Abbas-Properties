import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { 
  BUSINESS_NAME, 
  ENGLISH_NAME, 
  ADDRESS, 
  GOOGLE_MAPS_URL, 
  GOOGLE_MAPS_NAV_URL, 
  CONTACT_PHONE, 
  CONTACT_WHATSAPP, 
  CONTACT_EMAIL, 
  OFFICE_HOURS 
} from '../data';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-emerald-950 text-right no-print">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-black text-amber-300 font-nastaliq">{BUSINESS_NAME}</h3>
            <p className="text-xs text-emerald-400 font-bold mt-0.5">{ENGLISH_NAME}</p>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              گوجرانوالہ کی معروف اور معتبر ریئل اسٹیٹ ایجنسی۔ رائل پام سٹی، ڈی ایچ اے، ماسٹر سٹی اور تمام پرائم سوسائٹیز میں محفوظ اور شفاف انویسٹمنٹ کی ضمانت۔
            </p>
          </div>

          {/* Location & Directions */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5 justify-end">
              <span>دفتر کا پتہ و لوکیشن</span>
              <MapPin size={16} className="text-emerald-500" />
            </h4>
            
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              {ADDRESS}
            </p>

            <div className="flex flex-col gap-2 mt-3 text-xs">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors"
              >
                <ExternalLink size={13} />
                <span>گوگل میپس پر دیکھیں (Google Maps Search)</span>
              </a>

              <a
                href={GOOGLE_MAPS_NAV_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ExternalLink size={13} />
                <span>راستہ اور نیویگیشن (Direct Navigation)</span>
              </a>
            </div>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5 justify-end">
              <span>رابطہ و دفتری اوقات</span>
              <Clock size={16} className="text-emerald-500" />
            </h4>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 justify-end">
                <span dir="ltr">{CONTACT_PHONE}</span>
                <Phone size={13} className="text-emerald-500" />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span>{OFFICE_HOURS}</span>
                <Clock size={13} className="text-emerald-500" />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span>{CONTACT_EMAIL}</span>
                <Mail size={13} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {BUSINESS_NAME} ({ENGLISH_NAME}). تمام حقوق محفوظ ہیں۔
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>محفوظ آف لائن ڈیٹا اسٹوریج سسٹم</span>
            <ShieldCheck size={14} className="text-emerald-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
