import React from 'react';
import { MapPin, Navigation, ExternalLink, Shield, CheckCircle, Sparkles, Building, Phone } from 'lucide-react';
import { 
  POPULAR_SOCIETIES, 
  BUSINESS_NAME, 
  ADDRESS, 
  GOOGLE_MAPS_URL, 
  GOOGLE_MAPS_NAV_URL, 
  CONTACT_PHONE 
} from '../data';

export default function SocietyGuide() {
  return (
    <div className="space-y-6">
      {/* Featured Office Location Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-amber-400/40 relative overflow-hidden text-right">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-3">
            <Sparkles size={13} />
            <span>مرکزی ہیڈ آفس لوکیشن</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-nastaliq text-amber-200">
            {BUSINESS_NAME}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 font-bold mt-1 leading-relaxed">
            {ADDRESS}
          </p>

          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            رائل پام سٹی گوجرانوالہ میں پام کمرشل 235 (نزد رائل گولڈ جم) پر واقع ہمارا دفتر ہر قسم کے رہائشی و کمرشل پلاٹس، فائلز، اور مکانات کی شفاف اور محفوظ خرید و فروخت کے لیے ہمہ وقت دستیاب ہے۔
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <a
              id="guide-google-maps-btn"
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <ExternalLink size={16} />
              <span>بن عباس پراپرٹیز لوکیشن (Google Maps)</span>
            </a>

            <a
              id="guide-directions-btn"
              href={GOOGLE_MAPS_NAV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm border border-emerald-500/40 shadow-md transition-all cursor-pointer"
            >
              <Navigation size={16} className="text-amber-300" />
              <span>دفتر کا راستہ (Directions)</span>
            </a>

            <a
              href={`tel:${CONTACT_PHONE}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all"
            >
              <Phone size={14} />
              <span>رابطہ: {CONTACT_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Societies Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {POPULAR_SOCIETIES.map((soc) => (
          <div
            key={soc.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all text-right flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-nastaliq">
                    {soc.nameUrdu}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">{soc.nameEnglish}</p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Building size={18} />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mb-2.5">
                <MapPin size={14} className="text-emerald-700 shrink-0" />
                <span>{soc.location}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3.5">
                {soc.description}
              </p>

              {/* Blocks & Highlights */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">اہم بلاکس و زونز:</div>
                <div className="flex flex-wrap gap-1.5">
                  {soc.blocks.map((blk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                    >
                      {blk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle size={13} className="text-emerald-600" />
                <span>{soc.highlight}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
