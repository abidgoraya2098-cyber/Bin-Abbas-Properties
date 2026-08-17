import React from 'react';
import { 
  MapPin, 
  Phone, 
  Share2, 
  Download, 
  ShieldCheck, 
  Building, 
  Calculator, 
  PlusCircle, 
  ExternalLink,
  Navigation,
  Sparkles
} from 'lucide-react';
import { 
  BUSINESS_NAME, 
  ENGLISH_NAME, 
  SUBTITLE, 
  ADDRESS, 
  GOOGLE_MAPS_URL, 
  GOOGLE_MAPS_NAV_URL, 
  CONTACT_PHONE, 
  CONTACT_WHATSAPP,
  OFFICE_HOURS
} from '../data';
import { BIN_ABBAS_LOGO_BASE64, BIN_ABBAS_LOGO_URL } from '../assets/logoBase64';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  totalProperties: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenBackupModal,
  totalProperties
}: HeaderProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: BUSINESS_NAME,
          text: `${BUSINESS_NAME} - ${ADDRESS}\nرابطہ: ${CONTACT_PHONE}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or error');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('پورٹل کا لنک کاپی کر لیا گیا ہے!');
    }
  };

  return (
    <header className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white pt-6 pb-4 px-4 shadow-xl border-b border-emerald-800/60 overflow-hidden">
      {/* Background Subtle Luxury Accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Utility Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-emerald-800/40 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-emerald-200/90 font-medium">
            <span className="inline-flex items-center justify-center p-1 rounded-md bg-emerald-800/50 border border-emerald-600/30 text-amber-300">
              <ShieldCheck size={15} />
            </span>
            <span>تصدیق شدہ ریئل اسٹیٹ پورٹل</span>
            <span className="hidden md:inline-block text-emerald-400/50">|</span>
            <span className="hidden md:inline-block text-emerald-300/80 font-normal">{OFFICE_HOURS}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="backup-restore-header-btn"
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-200 hover:text-white transition-all text-xs font-semibold shadow-sm cursor-pointer"
              title="ڈیٹا بیک اپ، محفوظ کریں اور بحال کریں"
            >
              <Download size={13} className="text-amber-400" />
              <span>ڈیٹا بیک اپ و سیکیورٹی</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 text-emerald-200 hover:text-white transition-all text-xs cursor-pointer"
              title="شیئر کریں"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>

        {/* Main Branding Section with User Uploaded Official Logo */}
        <div className="flex flex-col items-center text-center">
          {/* Official Emblem & Logo Container */}
          <div className="relative group mb-3">
            <div className="relative w-72 sm:w-80 md:w-96 rounded-2xl p-1 bg-gradient-to-b from-amber-400/40 via-emerald-600/30 to-amber-500/40 shadow-2xl shadow-emerald-950/80 transition-transform group-hover:scale-[1.01]">
              <div className="rounded-xl overflow-hidden bg-emerald-950 border border-amber-400/30">
                <img
                  src={BIN_ABBAS_LOGO_BASE64 || BIN_ABBAS_LOGO_URL}
                  alt="بن عباس پراپرٹیز - رائل پام سٹی گوجرانوالہ"
                  className="w-full h-auto object-cover object-center max-h-[160px] sm:max-h-[180px] select-none"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              </div>
            </div>
            {/* Subtle glow badge below logo */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-black text-[10px] sm:text-[11px] shadow-md tracking-wider uppercase flex items-center gap-1 whitespace-nowrap">
              <Sparkles size={11} className="text-amber-100 animate-pulse" />
              <span>PREMIUM REAL ESTATE</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 font-nastaliq mt-2 leading-relaxed tracking-wide">
            {BUSINESS_NAME}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 font-bold tracking-widest mt-0.5">
            {ENGLISH_NAME} &bull; {SUBTITLE}
          </p>

          {/* Location & Address Card - Prioritized on Top followed by Royal Palm City */}
          <a
            id="header-location-card"
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-md mt-3 flex items-center justify-center gap-2.5 bg-slate-900/90 hover:bg-emerald-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-400/40 text-center shadow-lg transition-all cursor-pointer group hover:border-amber-400"
            title="گوگل میپس پر بن عباس پراپرٹیز کی لوکیشن دیکھیں"
          >
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <MapPin size={15} />
            </div>
            <div className="flex flex-col text-center">
              <span className="text-xs sm:text-sm text-amber-200 font-black leading-tight">
                بن عباس پراپرٹیز
              </span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-bold leading-tight mt-0.5">
                رائل پام سٹی، گوجرانوالہ (پام کمرشل 235)
              </span>
            </div>
            <div className="text-amber-400 text-xs hidden sm:flex items-center gap-1 mr-1">
              <ExternalLink size={12} />
            </div>
          </a>

          {/* Quick Contact & Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
            <a
              id="call-btn"
              href={`tel:${CONTACT_PHONE}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Phone size={14} />
              <span>کال کریں: {CONTACT_PHONE}</span>
            </a>

            <a
              id="whatsapp-btn"
              href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent('السلام علیکم! میں بن عباس پراپرٹیز پورٹل کے ذریعے رابطہ کر رہا ہوں۔')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm border border-emerald-500/50 shadow-md transition-all cursor-pointer"
            >
              <span className="text-amber-300 font-black">WhatsApp</span>
              <span>واٹس ایپ رابطہ</span>
            </a>

            <a
              id="directions-btn"
              href={GOOGLE_MAPS_NAV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 font-bold text-xs sm:text-sm border border-slate-600 shadow-md transition-all cursor-pointer"
            >
              <Navigation size={14} />
              <span>دفتر کا راستہ (Directions)</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mt-6 pt-3 border-t border-emerald-800/40 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              id="tab-properties"
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'properties'
                  ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                  : 'bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-700/40'
              }`}
            >
              <Building size={15} />
              <span>پراپرٹی ڈیلز و لسٹنگز</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'properties' ? 'bg-slate-900 text-amber-300' : 'bg-emerald-950 text-emerald-300'
              }`}>
                {totalProperties}
              </span>
            </button>

            <button
              id="tab-inquiries"
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                  : 'bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-700/40'
              }`}
            >
              <span>خرید و فروخت انکوائری</span>
            </button>

            <button
              id="tab-society"
              onClick={() => setActiveTab('society')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'society'
                  ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                  : 'bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-700/40'
              }`}
            >
              <MapPin size={15} />
              <span>رائل پام سٹی گائیڈ</span>
            </button>

            <button
              id="tab-calculator"
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                  : 'bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 border border-emerald-700/40'
              }`}
            >
              <Calculator size={15} />
              <span>پراپرٹی کیلکولیٹر</span>
            </button>
          </div>

          {/* Add New Property CTA Button */}
          <button
            id="add-new-property-header-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition-all cursor-pointer shrink-0"
          >
            <PlusCircle size={17} className="text-slate-950" />
            <span>نیا پلاٹ / پراپرٹی شامل کریں</span>
          </button>
        </div>
      </div>
    </header>
  );
}
