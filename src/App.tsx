import React, { useState, useEffect } from 'react';
import { 
  Building, 
  PlusCircle, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  SlidersHorizontal,
  Home,
  Building2,
  Trash2,
  Share2,
  RefreshCw
} from 'lucide-react';
import { PropertyListing, BuySellInquiry } from './types';
import { 
  loadProperties, 
  saveProperties, 
  loadInquiries, 
  saveInquiries, 
  loadDeals, 
  saveDeals 
} from './lib/storage';
import { POPULAR_SOCIETIES, PROPERTY_TYPES, PROPERTY_PURPOSES } from './data';
import Header from './components/Header';
import PropertyCard from './components/PropertyCard';
import PropertyFormModal from './components/PropertyFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import BackupRestoreModal from './components/BackupRestoreModal';
import BuySellInquiries from './components/BuySellInquiries';
import PropertyCalculator from './components/PropertyCalculator';
import SocietyGuide from './components/SocietyGuide';
import DealSlipPrint from './components/DealSlipPrint';
import Footer from './components/Footer';

export default function App() {
  // Persistent State - strictly from localStorage, NO dummy data
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [inquiries, setInquiries] = useState<BuySellInquiry[]>([]);
  const [deals, setDeals] = useState<any[]>([]);

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<string>('properties');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSociety, setSelectedSociety] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  
  // Deletion Modal (Double Confirmation for User Safety)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<PropertyListing | BuySellInquiry | null>(null);
  const [deleteType, setDeleteType] = useState<'property' | 'inquiry'>('property');

  // Print Voucher Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [voucherProperty, setVoucherProperty] = useState<PropertyListing | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Data on Initial Render
  const reloadData = () => {
    const loadedProps = loadProperties();
    const loadedInqs = loadInquiries();
    const loadedDls = loadDeals();
    setProperties(loadedProps);
    setInquiries(loadedInqs);
    setDeals(loadedDls);
  };

  useEffect(() => {
    reloadData();

    // Listen for storage events across tabs or components
    const handlePropsUpdate = () => setProperties(loadProperties());
    const handleInqsUpdate = () => setInquiries(loadInquiries());
    window.addEventListener('properties-updated', handlePropsUpdate);
    window.addEventListener('inquiries-updated', handleInqsUpdate);

    return () => {
      window.removeEventListener('properties-updated', handlePropsUpdate);
      window.removeEventListener('inquiries-updated', handleInqsUpdate);
    };
  }, []);

  // Save / Update Property
  const handleSaveProperty = (property: PropertyListing) => {
    const exists = properties.some(p => p.id === property.id);
    let updated: PropertyListing[];
    if (exists) {
      updated = properties.map(p => p.id === property.id ? property : p);
      showToast('پراپرٹی ڈیٹا کامیابی سے اپ ڈیٹ ہو گیا!');
    } else {
      updated = [property, ...properties];
      showToast('نئی پراپرٹی کامیابی سے مستقل محفوظ ہو گئی!');
    }
    setProperties(updated);
    saveProperties(updated);
  };

  // Status Change for Property
  const handleStatusChange = (property: PropertyListing, newStatus: any) => {
    const updated = properties.map(p => p.id === property.id ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p);
    setProperties(updated);
    saveProperties(updated);
    showToast('پراپرٹی کی حیثیت تبدیل کر دی گئی ہے۔');
  };

  // Delete Request (Opens safety dialog)
  const handleDeleteRequest = (item: PropertyListing | BuySellInquiry, type: 'property' | 'inquiry' = 'property') => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  // Confirmed Delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (deleteType === 'property') {
      const updated = properties.filter(p => p.id !== itemToDelete.id);
      setProperties(updated);
      saveProperties(updated);
      showToast('پراپرٹی ریکارڈ محفوظ طریقے سے ڈیلیٹ کر دیا گیا۔');
    } else {
      const updated = inquiries.filter(i => i.id !== itemToDelete.id);
      setInquiries(updated);
      saveInquiries(updated);
      showToast('انکوائری ریکارڈ ڈیلیٹ کر دیا گیا۔');
    }
    setItemToDelete(null);
  };

  // Save Inquiry
  const handleSaveInquiry = (inquiry: BuySellInquiry) => {
    const exists = inquiries.some(i => i.id === inquiry.id);
    let updated: BuySellInquiry[];
    if (exists) {
      updated = inquiries.map(i => i.id === inquiry.id ? inquiry : i);
      showToast('انکوائری ڈیٹا اپ ڈیٹ ہو گیا!');
    } else {
      updated = [inquiry, ...inquiries];
      showToast('نئی انکوائری مستقل محفوظ ہو گئی!');
    }
    setInquiries(updated);
    saveInquiries(updated);
  };

  // Filter Properties
  const filteredProperties = properties.filter((prop) => {
    const matchesSearch = 
      (prop.title && prop.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prop.society && prop.society.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prop.blockPhase && prop.blockPhase.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prop.plotNumber && prop.plotNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prop.clientName && prop.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prop.clientPhone && prop.clientPhone.includes(searchTerm));

    const matchesSociety = selectedSociety === 'all' || prop.society.includes(selectedSociety);
    const matchesPurpose = selectedPurpose === 'all' || prop.purpose === selectedPurpose;
    const matchesType = selectedType === 'all' || prop.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || prop.status === selectedStatus;

    return matchesSearch && matchesSociety && matchesPurpose && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-naskh flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500 flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 size={18} className="text-amber-300 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header with Official Logo, Location, and Nav Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingProperty(null);
          setIsAddModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        totalProperties={properties.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* Tab 1: Properties & Deals */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute right-3.5 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="پلاٹ نمبر، سوسائٹی، بلاک یا کلائنٹ نام سے تلاش کریں..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all text-right"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute left-3 top-3 text-xs text-slate-400 hover:text-slate-600"
                    >
                      صاف کریں
                    </button>
                  )}
                </div>

                {/* Society Dropdown */}
                <div className="w-full md:w-56">
                  <select
                    value={selectedSociety}
                    onChange={(e) => setSelectedSociety(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 text-right cursor-pointer"
                  >
                    <option value="all">تمام سوسائٹیز (All)</option>
                    {POPULAR_SOCIETIES.map(s => (
                      <option key={s.id} value={s.nameUrdu}>{s.nameUrdu}</option>
                    ))}
                  </select>
                </div>

                {/* Purpose Dropdown */}
                <div className="w-full md:w-44">
                  <select
                    value={selectedPurpose}
                    onChange={(e) => setSelectedPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 text-right cursor-pointer"
                  >
                    <option value="all">تمام ڈیلز (All Deals)</option>
                    <option value="sale">برائے فروخت (For Sale)</option>
                    <option value="purchase">مطلوب (Wanted / Buy)</option>
                    <option value="rent">برائے کرایہ (Rent)</option>
                    <option value="sold">فروخت شدہ (Sold)</option>
                  </select>
                </div>
              </div>

              {/* Quick Filter Badges */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold pt-1 border-t border-slate-100">
                <span className="text-slate-500 whitespace-nowrap">فوری فلٹر:</span>
                <button
                  onClick={() => { setSelectedSociety('all'); setSelectedPurpose('all'); setSelectedType('all'); setSelectedStatus('all'); }}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedSociety === 'all' && selectedPurpose === 'all' && selectedType === 'all'
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  تمام ڈیلز
                </button>
                <button
                  onClick={() => setSelectedSociety('رائل پام سٹی')}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedSociety.includes('رائل پام') ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  رائل پام سٹی
                </button>
                <button
                  onClick={() => setSelectedPurpose('sale')}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedPurpose === 'sale' ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  برائے فروخت
                </button>
                <button
                  onClick={() => setSelectedType('commercial_plot')}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedType === 'commercial_plot' ? 'bg-purple-700 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  کمرشل پلاٹس
                </button>
                <button
                  onClick={() => setSelectedStatus('available')}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedStatus === 'available' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  صرف دستیاب
                </button>
              </div>
            </div>

            {/* Properties Grid or Clean Empty State */}
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                  <Building size={36} />
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-nastaliq">
                    {properties.length === 0 
                      ? 'کوئی عارضی یا غیر مصدقہ پلاٹ ڈیٹا موجود نہیں ہے' 
                      : 'تلاش کے مطابق کوئی پراپرٹی نہیں ملی'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                    {properties.length === 0 
                      ? 'تمام عارضی ڈمی پلاٹس ختم کر دیے گئے ہیں۔ اب آپ اپنا تصدیق شدہ پراپرٹی ڈیٹا درج کر سکتے ہیں جو مستقل اور محفوظ رہے گا۔'
                      : 'برائے مہربانی فلٹر یا سرچ کی ورڈ تبدیل کر کے دوبارہ کوشش کریں۔'}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    id="empty-state-add-property-btn"
                    onClick={() => {
                      setEditingProperty(null);
                      setIsAddModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
                  >
                    <PlusCircle size={18} />
                    <span>پہلا پلاٹ / پراپرٹی ریکارڈ شامل کریں</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onEdit={(p) => {
                      setEditingProperty(p);
                      setIsAddModalOpen(true);
                    }}
                    onDeleteRequest={(p) => handleDeleteRequest(p, 'property')}
                    onStatusChange={handleStatusChange}
                    onPrintVoucher={(p) => {
                      setVoucherProperty(p);
                      setIsPrintModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Buy & Sell Inquiries */}
        {activeTab === 'inquiries' && (
          <BuySellInquiries
            inquiries={inquiries}
            onSaveInquiry={handleSaveInquiry}
            onDeleteRequest={(i) => handleDeleteRequest(i, 'inquiry')}
            onStatusChange={(inq, status) => {
              const updated = inquiries.map(i => i.id === inq.id ? { ...i, status, updatedAt: new Date().toISOString() } : i);
              setInquiries(updated);
              saveInquiries(updated);
              showToast('انکوائری کی حیثیت تبدیل ہو گئی ہے۔');
            }}
          />
        )}

        {/* Tab 3: Society Guide & Office Location */}
        {activeTab === 'society' && <SocietyGuide />}

        {/* Tab 4: Real Estate Calculator */}
        {activeTab === 'calculator' && <PropertyCalculator />}
      </main>

      {/* Property Add/Edit Modal */}
      <PropertyFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProperty(null);
        }}
        onSave={handleSaveProperty}
        editProperty={editingProperty}
      />

      {/* Delete Confirmation Modal (Guarantees user-approved deletion) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        item={itemToDelete}
        itemType={deleteType}
      />

      {/* Backup & Restore Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        propertiesCount={properties.length}
        inquiriesCount={inquiries.length}
        dealsCount={deals.length}
        onDataReload={reloadData}
      />

      {/* Deal Slip Print Modal */}
      <DealSlipPrint
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setVoucherProperty(null);
        }}
        property={voucherProperty}
      />

      {/* Footer with Prioritized Location & Contacts */}
      <Footer />
    </div>
  );
}
