import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Building2, 
  MapPin, 
  Tag, 
  User, 
  Phone, 
  Sparkles, 
  Coins, 
  CheckSquare, 
  Square,
  AlertCircle
} from 'lucide-react';
import { PropertyListing, PropertyType, PropertyPurpose, SizeUnit, ClientRole } from '../types';
import { 
  POPULAR_SOCIETIES, 
  PROPERTY_TYPES, 
  PROPERTY_PURPOSES, 
  SIZE_UNITS, 
  COMMON_FEATURES, 
  formatPKR 
} from '../data';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: PropertyListing) => void;
  editProperty?: PropertyListing | null;
}

export default function PropertyFormModal({
  isOpen,
  onClose,
  onSave,
  editProperty
}: PropertyFormModalProps) {
  const [society, setSociety] = useState('رائل پام سٹی گوجرانوالہ');
  const [customSociety, setCustomSociety] = useState('');
  const [blockPhase, setBlockPhase] = useState('پام کمرشل (235)');
  const [plotNumber, setPlotNumber] = useState('');
  const [type, setType] = useState<PropertyType>('residential_plot');
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [sizeValue, setSizeValue] = useState<number>(5);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('marla');
  const [demandPrice, setDemandPrice] = useState<number>(5000000);
  const [priceType, setPriceType] = useState<'fixed' | 'negotiable' | 'per_marla'>('negotiable');
  
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientRole, setClientRole] = useState<ClientRole>('owner');
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['قبضہ دستیاب (Possession Available)']);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'available' | 'under_discussion' | 'sold'>('available');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editProperty) {
      setSociety(editProperty.society);
      setBlockPhase(editProperty.blockPhase || '');
      setPlotNumber(editProperty.plotNumber || '');
      setType(editProperty.type);
      setPurpose(editProperty.purpose);
      setSizeValue(editProperty.sizeValue || 5);
      setSizeUnit(editProperty.sizeUnit || 'marla');
      setDemandPrice(editProperty.demandPrice || 0);
      setPriceType(editProperty.priceType || 'negotiable');
      setClientName(editProperty.clientName || '');
      setClientPhone(editProperty.clientPhone || '');
      setClientRole(editProperty.clientRole || 'owner');
      setSelectedFeatures(editProperty.features || []);
      setDescription(editProperty.description || '');
      setStatus(editProperty.status as any || 'available');
    } else {
      // Reset defaults for a fresh entry
      setSociety('رائل پام سٹی گوجرانوالہ');
      setBlockPhase('پام کمرشل (235)');
      setPlotNumber('');
      setType('residential_plot');
      setPurpose('sale');
      setSizeValue(5);
      setSizeUnit('marla');
      setDemandPrice(5000000);
      setPriceType('negotiable');
      setClientName('');
      setClientPhone('');
      setClientRole('owner');
      setSelectedFeatures(['قبضہ دستیاب (Possession Available)']);
      setDescription('');
      setStatus('available');
    }
    setErrors({});
  }, [editProperty, isOpen]);

  if (!isOpen) return null;

  const toggleFeature = (label: string) => {
    if (selectedFeatures.includes(label)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== label));
    } else {
      setSelectedFeatures([...selectedFeatures, label]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    const finalSociety = society === 'custom' ? customSociety.trim() : society;
    if (!finalSociety) {
      newErrors.society = 'سوسائٹی یا لوکیشن کا انتخاب ضروری ہے۔';
    }
    if (!sizeValue || sizeValue <= 0) {
      newErrors.sizeValue = 'پلاٹ کا سائز درج کریں۔';
    }
    if (!demandPrice || demandPrice <= 0) {
      newErrors.demandPrice = 'ڈیمانڈ یا قیمت درج کریں۔';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const title = `${sizeValue} ${sizeUnit === 'marla' ? 'مرلہ' : sizeUnit === 'kanal' ? 'کنال' : 'اسکوائر فٹ'} ${
      type === 'commercial_plot' ? 'کمرشل پلاٹ' :
      type === 'house_villa' ? 'مکان/ولا' :
      type === 'shop_plaza' ? 'دکان/پلازہ' : 'رہائشی پلاٹ'
    } - ${finalSociety}`;

    const newProperty: PropertyListing = {
      id: editProperty ? editProperty.id : `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      society: finalSociety,
      blockPhase,
      plotNumber,
      type,
      purpose,
      sizeValue,
      sizeUnit,
      demandPrice,
      priceType,
      clientName: clientName.trim() || 'نامعلوم کلائنٹ',
      clientPhone: clientPhone.trim(),
      clientRole,
      features: selectedFeatures,
      description: description.trim(),
      status,
      createdAt: editProperty ? editProperty.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-nastaliq text-amber-200">
                {editProperty ? 'پراپرٹی ریکارڈ میں ترمیم کریں' : 'نیا پلاٹ / پراپرٹی ریکارڈ شامل کریں'}
              </h2>
              <p className="text-xs text-emerald-200">
                تمام معلومات خودکار طور پر مستقل محفوظ (Saved) رہیں گی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-right">
          {/* Purpose & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ڈیل کا زمرہ (Purpose) *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                {PROPERTY_PURPOSES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                پراپرٹی کی قسم (Property Type) *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                {PROPERTY_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Society / Location Selection */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <MapPin size={15} className="text-emerald-700" />
              <span>سوسائٹی و لوکیشن کی تفصیلات</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  سوسائٹی منتخب کریں *
                </label>
                <select
                  value={society}
                  onChange={(e) => setSociety(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {POPULAR_SOCIETIES.map(s => (
                    <option key={s.id} value={s.nameUrdu}>{s.nameUrdu}</option>
                  ))}
                  <option value="custom">دیگر نئی سوسائٹی خود لکھیں...</option>
                </select>
                {errors.society && <p className="text-xs text-rose-600 mt-1">{errors.society}</p>}
              </div>

              {society === 'custom' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    سوسائٹی کا نام درج کریں *
                  </label>
                  <input
                    type="text"
                    value={customSociety}
                    onChange={(e) => setCustomSociety(e.target.value)}
                    placeholder="مثلاً: ماڈل ٹاؤن، گوجرانوالہ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    بلاک / فیز / زون
                  </label>
                  <input
                    type="text"
                    value={blockPhase}
                    onChange={(e) => setBlockPhase(e.target.value)}
                    placeholder="مثلاً: پام کمرشل 235 / بلاک B"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  پلاٹ / پراپرٹی نمبر (اختیاری)
                </label>
                <input
                  type="text"
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  placeholder="مثلاً: 235 یا 14-B"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  سٹیٹس (Status)
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="available">دستیاب (Available)</option>
                  <option value="under_discussion">زیرِ بحث / ایڈوانس (Under Discussion)</option>
                  <option value="sold">فروخت شدہ (Sold Deal)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Size and Demand Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Size */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                پلاٹ / پراپرٹی کا رقبہ و سائز *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={sizeValue || ''}
                  onChange={(e) => setSizeValue(parseFloat(e.target.value) || 0)}
                  placeholder="مثلاً: 5 یا 10"
                  className="w-2/3 px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <select
                  value={sizeUnit}
                  onChange={(e) => setSizeUnit(e.target.value as any)}
                  className="w-1/3 px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {SIZE_UNITS.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
              {errors.sizeValue && <p className="text-xs text-rose-600 mt-1">{errors.sizeValue}</p>}
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ڈیمانڈ / قیمت (پاکستانی روپے میں) *
                </label>
                <span className="text-xs font-black text-emerald-800 font-nastaliq">
                  {formatPKR(demandPrice)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="10000"
                  min="0"
                  value={demandPrice || ''}
                  onChange={(e) => setDemandPrice(parseInt(e.target.value, 10) || 0)}
                  placeholder="مثلاً: 7500000 (75 لاکھ)"
                  className="w-2/3 px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <select
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value as any)}
                  className="w-1/3 px-2 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="negotiable">کمی بیشی ممکن</option>
                  <option value="fixed">فکس ریٹ</option>
                  <option value="per_marla">فی مرلہ</option>
                </select>
              </div>
              {errors.demandPrice && <p className="text-xs text-rose-600 mt-1">{errors.demandPrice}</p>}
            </div>
          </div>

          {/* Client & Contact Information */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <User size={15} className="text-slate-600" />
              <span>کلائنٹ یا پراپرٹی مالک کی تفصیلات</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  نام کلائنٹ / اونر
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثلاً: چوہدری احمد"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  موبائل / واٹس ایپ نمبر
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  فریق کی حیثیت
                </label>
                <select
                  value={clientRole}
                  onChange={(e) => setClientRole(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="owner">اصل مالک (Owner)</option>
                  <option value="buyer">خریدار (Buyer)</option>
                  <option value="investor">سرمایہ کار (Investor)</option>
                  <option value="dealer">ڈیلر / ایجنٹ (Dealer)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Features Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              پلاٹ / پراپرٹی کی نمایاں خصوصیات (Features)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_FEATURES.map((feat) => {
                const isChecked = selectedFeatures.includes(feat.label);
                return (
                  <button
                    type="button"
                    key={feat.id}
                    onClick={() => toggleFeature(feat.label)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold text-right transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare size={14} className="text-emerald-700 shrink-0" />
                    ) : (
                      <Square size={14} className="text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{feat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description & Additional Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              اضافی تفصیلات و ریمارکس (Description)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثلاً: بہترین لوکیشن، گرین بیلٹ اور پارک کے قریب، فیملی لونگ اور انویسٹمنٹ کے لیے آئیڈیل موقع..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Persistent Save Guarantee Alert */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-700 shrink-0" />
            <span>یہ ریکارڈ مستقل طور پر آپ کی لوکل ایپ اسٹوریج میں محفوظ رہے گا اور بغیر آپ کی اجازت کے ضائع نہیں ہوگا۔</span>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
            >
              منسوخ کریں
            </button>

            <button
              type="submit"
              id="save-property-submit-btn"
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Save size={16} />
              <span>{editProperty ? 'تبدیلیاں محفوظ کریں' : 'پراپرٹی محفوظ کریں'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
