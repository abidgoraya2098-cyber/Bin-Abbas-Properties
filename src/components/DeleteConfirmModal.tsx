import React from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react';
import { PropertyListing, BuySellInquiry } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: PropertyListing | BuySellInquiry | null;
  itemType?: 'property' | 'inquiry' | 'deal';
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  item,
  itemType = 'property'
}: DeleteConfirmModalProps) {
  if (!isOpen || !item) return null;

  const getTitle = () => {
    if (itemType === 'property') {
      const prop = item as PropertyListing;
      return prop.title || `${prop.sizeValue} ${prop.sizeUnit} - ${prop.society}`;
    }
    const inq = item as BuySellInquiry;
    return `${inq.clientName} (${inq.preferredSize} - ${inq.society})`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 animate-scaleUp text-right">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2.5 text-rose-700">
            <div className="p-2.5 rounded-2xl bg-rose-100 border border-rose-200">
              <ShieldAlert size={22} className="text-rose-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">ڈیٹا ڈیلیٹ کرنے کی تصدیق</h3>
              <p className="text-xs text-rose-600 font-semibold">ڈیٹا کے تحفظ کی سیکیورٹی</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-slate-700 leading-relaxed">
            کیا آپ واقعی مندرجہ ذیل ریکارڈ کو ایپ سے ڈیلیٹ کرنا چاہتے ہیں؟
          </p>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950">
            <div className="font-black text-sm">{getTitle()}</div>
            {'plotNumber' in item && item.plotNumber && (
              <div className="text-xs text-rose-800 mt-1">پلاٹ نمبر: {item.plotNumber}</div>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[12px] text-amber-900 flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>اہم نوٹ:</strong> ایک بار ڈیلیٹ کرنے کے بعد یہ ڈیٹا ایپ سے ختم ہو جائے گا۔ اگر آپ نے بیک اپ ڈاؤن لوڈ نہیں کیا تو یہ بحال نہیں ہو سکے گا۔
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
          >
            نہیں، واپس جائیں
          </button>

          <button
            type="button"
            id="confirm-delete-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Trash2 size={16} />
            <span>ہاں، ڈیلیٹ کریں</span>
          </button>
        </div>
      </div>
    </div>
  );
}
