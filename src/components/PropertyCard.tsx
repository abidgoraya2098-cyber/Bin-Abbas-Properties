import React from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Share2, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  CheckCheck, 
  Printer, 
  Layers, 
  Sparkles,
  Home,
  Store,
  Hotel,
  Trees
} from 'lucide-react';
import { PropertyListing } from '../types';
import { formatPKR, generateWhatsAppMessage, PROPERTY_STATUSES, PROPERTY_PURPOSES } from '../data';

interface PropertyCardProps {
  property: PropertyListing;
  onEdit: (property: PropertyListing) => void;
  onDeleteRequest: (property: PropertyListing) => void;
  onStatusChange: (property: PropertyListing, newStatus: any) => void;
  onPrintVoucher: (property: PropertyListing) => void;
}

export default function PropertyCard({
  property,
  onEdit,
  onDeleteRequest,
  onStatusChange,
  onPrintVoucher
}: PropertyCardProps) {
  const [copied, setCopied] = React.useState(false);

  const getStatusBadge = (status: string) => {
    const item = PROPERTY_STATUSES.find(s => s.value === status) || PROPERTY_STATUSES[0];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${item.badgeClass}`}>
        {status === 'available' && <CheckCircle2 size={12} />}
        {status === 'under_discussion' && <Clock size={12} />}
        {status === 'sold' && <CheckCheck size={12} />}
        <span>{item.label}</span>
      </span>
    );
  };

  const getPurposeBadge = (purpose: string) => {
    const item = PROPERTY_PURPOSES.find(p => p.value === purpose) || PROPERTY_PURPOSES[0];
    return (
      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${
        purpose === 'sale' ? 'bg-emerald-600 text-white' :
        purpose === 'purchase' ? 'bg-blue-600 text-white' :
        purpose === 'rent' ? 'bg-purple-600 text-white' :
        'bg-slate-700 text-slate-200'
      }`}>
        {item.label}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'commercial_plot': return <Building className="text-amber-600" size={16} />;
      case 'shop_plaza': return <Store className="text-purple-600" size={16} />;
      case 'house_villa': return <Hotel className="text-indigo-600" size={16} />;
      case 'agricultural_farm': return <Trees className="text-emerald-600" size={16} />;
      default: return <Home className="text-emerald-700" size={16} />;
    }
  };

  const handleWhatsAppShare = () => {
    const msg = generateWhatsAppMessage(property);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const msg = generateWhatsAppMessage(property);
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeUnitText = property.sizeUnit === 'marla' ? 'مرلہ' : property.sizeUnit === 'kanal' ? 'کنال' : property.sizeUnit === 'sqft' ? 'اسکوائر فٹ' : 'گز';

  return (
    <div className={`rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden bg-white flex flex-col ${
      property.status === 'sold' ? 'border-slate-200 bg-slate-50/70 opacity-90' :
      property.status === 'under_discussion' ? 'border-amber-200 bg-amber-50/20' :
      'border-emerald-100 hover:border-emerald-300'
    }`}>
      {/* Top Card Header */}
      <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2 bg-gradient-to-r from-slate-50 via-white to-emerald-50/30">
        <div className="flex items-center gap-2 flex-wrap">
          {getPurposeBadge(property.purpose)}
          {getStatusBadge(property.status)}
          <div className="flex items-center gap-1 text-slate-600 text-xs font-semibold">
            {getTypeIcon(property.type)}
            <span>{property.sizeValue} {sizeUnitText}</span>
          </div>
        </div>

        <div className="text-left shrink-0">
          <div className="text-xs text-slate-500 font-medium">ڈیمانڈ / قیمت</div>
          <div className="text-base font-black text-emerald-800 font-nastaliq leading-tight">
            {formatPKR(property.demandPrice)}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Location */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900 font-nastaliq leading-snug">
                {property.title || `${property.sizeValue} ${sizeUnitText} - ${property.society}`}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-1">
                <MapPin size={14} className="text-emerald-700 shrink-0" />
                <span>{property.society}</span>
                {property.blockPhase && (
                  <>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-slate-800 font-bold">{property.blockPhase}</span>
                  </>
                )}
                {property.plotNumber && (
                  <>
                    <span className="text-slate-300">&bull;</span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[11px]">پلاٹ #{property.plotNumber}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Features Badges */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {property.features.map((feat, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold"
                >
                  <Sparkles size={10} className="text-amber-600" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {property.description && (
            <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed bg-slate-50/80 p-2 rounded-lg border border-slate-100">
              {property.description}
            </p>
          )}

          {/* Client Details Section */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">کلائنٹ / مالک:</span>
              <span className="font-bold text-slate-900">{property.clientName || 'محفوظ شدہ کلائنٹ'}</span>
            </div>
            {property.clientPhone && (
              <a
                href={`tel:${property.clientPhone}`}
                className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
              >
                <Phone size={12} />
                <span dir="ltr">{property.clientPhone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1 flex-wrap">
          {/* Status Quick Dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={property.status}
              onChange={(e) => onStatusChange(property, e.target.value)}
              className="text-xs font-bold px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
              title="پراپرٹی کی حیثیت تبدیل کریں"
            >
              <option value="available">دستیاب (Available)</option>
              <option value="under_discussion">زیرِ بحث (Discussion)</option>
              <option value="sold">فروخت شدہ (Sold)</option>
            </select>

            <button
              onClick={() => onPrintVoucher(property)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="ڈیل واؤچر / پرنٹ سلپ بنائیں"
            >
              <Printer size={15} />
            </button>
          </div>

          {/* Share, Edit & Delete */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="واٹس ایپ پر ڈیل شیئر کریں"
            >
              <Share2 size={13} />
              <span>واٹس ایپ</span>
            </button>

            <button
              onClick={() => onEdit(property)}
              className="p-1.5 rounded-lg text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
              title="پراپرٹی ڈیٹا میں ترمیم کریں"
            >
              <Edit3 size={15} />
            </button>

            <button
              id={`delete-prop-${property.id}`}
              onClick={() => onDeleteRequest(property)}
              className="p-1.5 rounded-lg text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              title="محفوظ شدہ ریکارڈ ڈیلیٹ کریں (محفوظ طریقہ)"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
