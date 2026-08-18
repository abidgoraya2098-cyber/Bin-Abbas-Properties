import React from "react";
import { MapPin, Navigation, ShieldCheck, Zap, Building, ShoppingBag, Trees, Fuel, Landmark, ExternalLink } from "lucide-react";
import { SOCIETY_AMENITIES, GOOGLE_MAPS_URL, GOOGLE_MAPS_NAV_URL } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../i18n";

export default function SocietyGuide() {
  const { language, isUrdu } = useLanguage();
  const t = getTranslation(language);

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck size={18} className="text-emerald-800" />;
      case "Zap":
        return <Zap size={18} className="text-emerald-800" />;
      case "Fuel":
        return <Fuel size={18} className="text-emerald-800" />;
      case "Landmark":
        return <Landmark size={18} className="text-emerald-800" />;
      case "Building":
        return <Building size={18} className="text-emerald-800" />;
      case "ShoppingBag":
        return <ShoppingBag size={18} className="text-emerald-800" />;
      case "Trees":
        return <Trees size={18} className="text-emerald-800" />;
      default:
        return <Building size={18} className="text-emerald-800" />;
    }
  };

  return (
    <div 
      className={`w-full my-3 bg-white/95 rounded-2xl p-3.5 sm:p-4 border-2 border-emerald-200 shadow-md backdrop-blur-md ${isUrdu ? "text-right" : "text-left"}`} 
      id="society-guide-section"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <Navigation size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-emerald-950">
              {t.societyTitle}
            </h3>
            <p className="text-[10px] text-slate-600">
              {t.societySubtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm">
          {t.societyBadge}
        </span>
      </div>

      {/* Society Amenities Grid */}
      <div className="grid grid-cols-2 gap-2 mt-3.5" id="society-amenities-grid">
        {SOCIETY_AMENITIES.map((amenity) => {
          const currentTitle = isUrdu ? amenity.title : (amenity.titleEn || amenity.title);
          const currentDesc = isUrdu ? amenity.description : (amenity.descriptionEn || amenity.description);

          return (
            <div
              key={amenity.id}
              className={`p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-400 transition-all flex flex-col justify-between shadow-sm ${isUrdu ? "text-right" : "text-left"}`}
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center mb-1.5 shadow-inner">
                  {getAmenityIcon(amenity.icon)}
                </div>
                <h4 className="text-[11px] font-black text-slate-900 leading-tight">
                  {currentTitle}
                </h4>
                <p className="text-[9.5px] text-slate-600 mt-1 leading-relaxed">
                  {currentDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Google Maps / Office Location Action Card */}
      <div className="mt-3.5 p-3.5 rounded-2xl bg-emerald-50/90 border-2 border-emerald-200 flex flex-col gap-2.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
            <MapPin size={18} />
          </div>
          <div className={isUrdu ? "text-right" : "text-left"}>
            <h4 className="text-xs font-black text-emerald-950">
              {isUrdu ? "بن عباس پراپرٹیز" : "BIN ABBAS PROPERTIES"}
            </h4>
            <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed font-semibold">
              {isUrdu ? "رائل پام سٹی، گوجرانوالہ (پام کمرشل 235)" : "Royal Palm City, Gujranwala (Palm Commercial 235)"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 hover:brightness-105 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer border border-emerald-500 active:scale-95 text-center"
            id="google-maps-location-btn"
          >
            <ExternalLink size={14} className="text-white" />
            <span>{t.mapsLocationBtn}</span>
          </a>

          <a
            href={GOOGLE_MAPS_NAV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer border border-emerald-600 active:scale-95 text-center"
            id="google-maps-directions-btn"
          >
            <Navigation size={14} className="text-amber-300" />
            <span>{t.mapsDirectionsBtn}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
