import React from 'react';
import { X, Printer, Building2, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { PropertyListing } from '../types';
import { BUSINESS_NAME, ENGLISH_NAME, ADDRESS, CONTACT_PHONE, formatPKR } from '../data';
import { BIN_ABBAS_LOGO_BASE64, BIN_ABBAS_LOGO_URL } from '../assets/logoBase64';

interface DealSlipPrintProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyListing | null;
}

export default function DealSlipPrint({ isOpen, onClose, property }: DealSlipPrintProps) {
  if (!isOpen || !property) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ur-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-fadeIn text-right print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Screen Toolbar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>پرنٹ کریں / PDF محفوظ کریں</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Official Printable Voucher Paper */}
        <div className="border-2 border-emerald-900/40 rounded-2xl p-6 relative bg-white overflow-hidden print:border-emerald-900 print:rounded-none">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Building2 size={240} className="text-emerald-950" />
          </div>

          {/* Letterhead */}
          <div className="text-center pb-4 border-b-2 border-emerald-900/30 mb-5">
            <div className="w-48 mx-auto mb-2 rounded-lg overflow-hidden border border-amber-500/40">
              <img
                src={BIN_ABBAS_LOGO_BASE64 || BIN_ABBAS_LOGO_URL}
                alt="بن عباس پراپرٹیز"
                className="w-full h-auto object-cover max-h-24"
              />
            </div>
            <h1 className="text-2xl font-black text-emerald-950 font-nastaliq">
              {BUSINESS_NAME}
            </h1>
            <p className="text-xs font-bold text-slate-700">{ENGLISH_NAME}</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">{ADDRESS}</p>
            <p className="text-xs font-bold text-emerald-800 mt-0.5">فون / واٹس ایپ: {CONTACT_PHONE}</p>
          </div>

          {/* Slip Title */}
          <div className="bg-emerald-900 text-white text-center py-1.5 rounded-lg mb-5 font-black text-sm">
            سرکاری پراپرٹی ڈیل سلپ / معلوماتی رسید
          </div>

          {/* Metadata Row */}
          <div className="flex justify-between items-center text-xs text-slate-600 mb-4 pb-2 border-b border-slate-200">
            <div><strong>تاریخ:</strong> {currentDate}</div>
            <div><strong>واؤچر نمبر:</strong> BA-{property.id.slice(-6).toUpperCase()}</div>
          </div>

          {/* Property Specifications Table */}
          <div className="space-y-3 mb-5 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 font-medium">سوسائٹی:</span>
                <span className="font-bold text-slate-900 mr-2">{property.society}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">بلاک / فیز:</span>
                <span className="font-bold text-slate-900 mr-2">{property.blockPhase || 'دستیاب نہیں'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">پلاٹ نمبر:</span>
                <span className="font-bold text-slate-900 mr-2 font-mono">{property.plotNumber || 'غیر متعین'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">رقبہ و سائز:</span>
                <span className="font-bold text-slate-900 mr-2 font-nastaliq">{property.sizeValue} {property.sizeUnit}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">پراپرٹی کی قسم:</span>
                <span className="font-bold text-slate-900 mr-2">
                  {property.type === 'commercial_plot' ? 'کمرشل پلاٹ' :
                   property.type === 'house_villa' ? 'مکان / ولا' :
                   property.type === 'shop_plaza' ? 'دکان / پلازہ' : 'رہائشی پلاٹ'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">حیثیت:</span>
                <span className="font-bold text-emerald-800 mr-2">
                  {property.purpose === 'sale' ? 'برائے فروخت' : 'مطلوب / خریدار'}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex justify-between items-center text-emerald-950 font-bold">
              <span>ڈیمانڈ / طے شدہ قیمت:</span>
              <span className="text-base font-black font-nastaliq text-emerald-900">
                {formatPKR(property.demandPrice)}
              </span>
            </div>

            {/* Client / Party Details */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">کلائنٹ / فریق کی تفصیل:</div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>نام: <strong>{property.clientName || 'محفوظ شدہ کلائنٹ'}</strong></div>
                <div>رابطہ: <strong dir="ltr">{property.clientPhone || 'دستیاب نہیں'}</strong></div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
                <div className="font-bold text-slate-800 mb-1">اضافی نوٹس و شرائط:</div>
                <p className="leading-relaxed">{property.description}</p>
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-300 text-center text-xs text-slate-700">
            <div>
              <div className="border-t border-dashed border-slate-400 pt-1.5 font-bold">دستخط خریدار</div>
            </div>
            <div>
              <div className="border-t border-dashed border-slate-400 pt-1.5 font-bold">دستخط فروخت کنندہ / مالک</div>
            </div>
            <div>
              <div className="border-t border-dashed border-slate-400 pt-1.5 font-bold">دستخط و مہر (بن عباس پراپرٹیز)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
