import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  User, 
  Phone, 
  MapPin, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X, 
  Save, 
  Building,
  HelpCircle,
  Share2
} from 'lucide-react';
import { BuySellInquiry, PropertyType } from '../types';
import { POPULAR_SOCIETIES, PROPERTY_TYPES, formatPKR, BUSINESS_NAME, CONTACT_PHONE, ADDRESS } from '../data';

interface BuySellInquiriesProps {
  inquiries: BuySellInquiry[];
  onSaveInquiry: (inquiry: BuySellInquiry) => void;
  onDeleteRequest: (inquiry: BuySellInquiry) => void;
  onStatusChange: (inquiry: BuySellInquiry, status: 'active' | 'fulfilled' | 'closed') => void;
}

export default function BuySellInquiries({
  inquiries,
  onSaveInquiry,
  onDeleteRequest,
  onStatusChange
}: BuySellInquiriesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'buyer' | 'seller'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<BuySellInquiry | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [society, setSociety] = useState('رائل پام سٹی گوجرانوالہ');
  const [propertyType, setPropertyType] = useState<PropertyType>('residential_plot');
  const [preferredSize, setPreferredSize] = useState('5 مرلہ');
  const [budgetMax, setBudgetMax] = useState<number>(6000000);
  const [requirements, setRequirements] = useState('');

  const openAddModal = () => {
    setEditingInquiry(null);
    setClientName('');
    setClientPhone('');
    setRole('buyer');
    setSociety('رائل پام سٹی گوجرانوالہ');
    setPropertyType('residential_plot');
    setPreferredSize('5 مرلہ');
    setBudgetMax(6000000);
    setRequirements('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('کلائنٹ کا نام درج کریں۔');
      return;
    }

    const newInq: BuySellInquiry = {
      id: editingInquiry ? editingInquiry.id : `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      role,
      society,
      propertyType,
      preferredSize,
      budgetMax: budgetMax || 0,
      requirements: requirements.trim(),
      status: editingInquiry ? editingInquiry.status : 'active',
      createdAt: editingInquiry ? editingInquiry.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveInquiry(newInq);
    setIsModalOpen(false);
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.preferredSize.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.clientPhone && inq.clientPhone.includes(searchTerm));

    const matchesRole = roleFilter === 'all' || inq.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleWhatsAppInquiry = (inq: BuySellInquiry) => {
    const roleText = inq.role === 'buyer' ? 'خریدار کی مطلوبہ ڈیل' : 'فروخت کنندہ کا اندراج';
    const text = `*${BUSINESS_NAME} - کلائنٹ انکوائری*\n` +
      `👤 *کلائنٹ نام:* ${inq.clientName}\n` +
      `📞 *فون:* ${inq.clientPhone || 'دستیاب نہیں'}\n` +
      `🏷️ *حیثیت:* ${roleText}\n` +
      `📍 *سوسائٹی:* ${inq.society}\n` +
      `📐 *سائز:* ${inq.preferredSize}\n` +
      `💰 *بجٹ / ڈیمانڈ:* ${formatPKR(inq.budgetMax || 0)}\n` +
      (inq.requirements ? `📝 *ضروریات:* ${inq.requirements}\n` : '') +
      `\n🏢 *دفتر:* ${ADDRESS}\n` +
      `📞 *رابطہ:* ${CONTACT_PHONE}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-right w-full md:w-auto">
          <h2 className="text-lg font-black text-slate-900 font-nastaliq">
            خرید و فروخت انکوائریز و کلائنٹ ڈیمانڈز
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            خریدار اور فروخت کنندگان کی معلومات کا محفوظ ریکارڈ
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="نام، سوسائٹی یا فون سے تلاش..."
              className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                roleFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              تمام
            </button>
            <button
              onClick={() => setRoleFilter('buyer')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                roleFilter === 'buyer' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              خریدار (Buyer)
            </button>
            <button
              onClick={() => setRoleFilter('seller')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                roleFilter === 'seller' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              فروخت کنندہ (Seller)
            </button>
          </div>

          {/* Add Inquiry Button */}
          <button
            id="add-inquiry-btn"
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>نئی انکوائری درج کریں</span>
          </button>
        </div>
      </div>

      {/* Inquiries List or Empty State */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
            <Building size={28} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 font-nastaliq">
              کوئی عارضی ڈیٹا موجود نہیں ہے
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
              تمام عارضی ریکارڈز ختم کر دیے گئے ہیں۔ اب آپ کا اپنا تصدیق شدہ کلائنٹ ڈیٹا مستقل محفوظ رہے گا۔ نیا کلائنٹ یا ڈیل شامل کرنے کے لیے بٹن دبائیں۔
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>پہلی خرید و فروخت انکوائری شامل کریں</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase ${
                    inq.role === 'buyer' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {inq.role === 'buyer' ? 'خریدار مطلوب' : 'فروخت کا خواہش مند'}
                  </span>

                  <span className="text-xs font-bold text-slate-500">
                    {inq.status === 'active' ? '🟢 فعال (Active)' : '⚪ مکمل (Closed)'}
                  </span>
                </div>

                {/* Client Info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 font-nastaliq">
                      {inq.clientName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-1">
                      <MapPin size={13} className="text-emerald-700 shrink-0" />
                      <span>{inq.society}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-emerald-950 font-bold">{inq.preferredSize}</span>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <div className="text-[10px] text-slate-500 font-medium">بجٹ / تخمینہ</div>
                    <div className="text-xs font-black text-emerald-800 font-nastaliq">
                      {formatPKR(inq.budgetMax || 0)}
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                {inq.requirements && (
                  <p className="text-xs text-slate-600 mt-2.5 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
                    {inq.requirements}
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {inq.clientPhone ? (
                  <a
                    href={`tel:${inq.clientPhone}`}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold text-xs"
                  >
                    <Phone size={12} />
                    <span dir="ltr">{inq.clientPhone}</span>
                  </a>
                ) : (
                  <span className="text-slate-400 text-xs">نمبر موجود نہیں</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleWhatsAppInquiry(inq)}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                    title="واٹس ایپ پر شیئر کریں"
                  >
                    <Share2 size={14} />
                  </button>

                  <button
                    onClick={() => onDeleteRequest(inq)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="ڈیلیٹ کریں"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 animate-fadeIn text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 font-nastaliq">
                نئی خرید یا فروخت انکوائری شامل کریں
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    کلائنٹ کا کردار *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="buyer">خریدار (Buyer)</option>
                    <option value="seller">فروخت کنندہ (Seller)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    پراپرٹی کی قسم
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {PROPERTY_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  کلائنٹ کا نام *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثلاً: میاں طارق صاحب"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  موبائل / واٹس ایپ نمبر
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    سوسائٹی / لوکیشن
                  </label>
                  <select
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {POPULAR_SOCIETIES.map(s => (
                      <option key={s.id} value={s.nameUrdu}>{s.nameUrdu}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    مطلوبہ سائز
                  </label>
                  <input
                    type="text"
                    value={preferredSize}
                    onChange={(e) => setPreferredSize(e.target.value)}
                    placeholder="مثلاً: 5 مرلہ، 10 مرلہ یا 1 کنال"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    بجٹ کی حد (پاکستانی روپے)
                  </label>
                  <span className="text-xs font-black text-emerald-800 font-nastaliq">
                    {formatPKR(budgetMax)}
                  </span>
                </div>
                <input
                  type="number"
                  step="100000"
                  value={budgetMax || ''}
                  onChange={(e) => setBudgetMax(parseInt(e.target.value, 10) || 0)}
                  placeholder="مثلاً: 5000000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  کلائنٹ کی خصوصی ڈیمانڈز و ہدایات
                </label>
                <textarea
                  rows={2}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="مثلاً: پارک فیسنگ، فوری تعمیر کے لیے پوزیشن شدہ پلاٹ درکار ہے..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  <Save size={14} />
                  <span>انکوائری محفوظ کریں</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
