import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  ShieldCheck, 
  HardDrive, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  FileJson,
  Sparkles
} from 'lucide-react';
import { exportDataBackup, importDataBackup } from '../lib/storage';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertiesCount: number;
  inquiriesCount: number;
  dealsCount: number;
  onDataReload: () => void;
}

export default function BackupRestoreModal({
  isOpen,
  onClose,
  propertiesCount,
  inquiriesCount,
  dealsCount,
  onDataReload
}: BackupRestoreModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = () => {
    exportDataBackup();
    setIsSuccess(true);
    setImportStatus('بیک اپ فائل ڈاؤن لوڈ ہو گئی ہے! اسے محفوظ جگہ پر رکھیں۔');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus('فائل کا معائنہ کیا جا رہا ہے...');
    try {
      const res = await importDataBackup(file, 'merge');
      setIsSuccess(true);
      setImportStatus(`${res.message} (${res.propertiesCount} پراپرٹیز بحال ہوئیں)`);
      onDataReload();
    } catch (err: any) {
      setIsSuccess(false);
      setImportStatus(err.message || 'بیک اپ بحال کرنے میں ناکامی۔');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 animate-fadeIn text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck size={22} className="text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-nastaliq leading-tight">
                ڈیٹا بیک اپ، حفاظت اور بحالی (Backup & Restore)
              </h3>
              <p className="text-xs text-emerald-700 font-semibold">
                صارف کے ڈیٹا کی 100 فیصد مستقل حفاظت
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Storage Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">پراپرٹیز</div>
            <div className="text-lg font-black text-emerald-800 mt-0.5">{propertiesCount}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">انکوائریز</div>
            <div className="text-lg font-black text-blue-800 mt-0.5">{inquiriesCount}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">ڈیل ریکارڈز</div>
            <div className="text-lg font-black text-purple-800 mt-0.5">{dealsCount}</div>
          </div>
        </div>

        {/* Notice */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs leading-relaxed space-y-1 mb-5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <Sparkles size={14} className="text-amber-600 shrink-0" />
            <span>مستقل ڈیٹا اسٹوریج کی گارنٹی:</span>
          </div>
          <p>
            آپ جو بھی پلاٹ یا انکوائری شامل کریں گے، وہ اس براؤزر میں خودکار طور پر مستقل محفوظ رہے گی۔ اگر آپ کسی دوسرے کمپیوٹر یا موبائل پر ڈیٹا منتقل کرنا چاہتے ہیں، تو بیک اپ ڈاؤن لوڈ کر کے وہاں امپورٹ کر سکتے ہیں۔
          </p>
        </div>

        {/* Status Toast */}
        {importStatus && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 mb-4 animate-fadeIn ${
            isSuccess ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            {isSuccess ? <CheckCircle2 size={16} className="text-emerald-700 shrink-0" /> : <AlertCircle size={16} className="text-rose-700 shrink-0" />}
            <span className="font-semibold">{importStatus}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Export Backup Button */}
          <button
            type="button"
            id="download-backup-btn"
            onClick={handleExport}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download size={18} className="text-amber-300" />
              <span>تمام ڈیٹا کا بیک اپ ڈاؤن لوڈ کریں (JSON Export)</span>
            </div>
            <FileJson size={16} className="text-emerald-200" />
          </button>

          {/* Import Backup Button */}
          <button
            type="button"
            id="upload-backup-btn"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <Upload size={18} className="text-blue-700" />
              <span>سابقہ بیک اپ فائل سے ڈیٹا بحال کریں (Restore)</span>
            </div>
            <Database size={16} className="text-slate-500" />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
          >
            بند کریں
          </button>
        </div>
      </div>
    </div>
  );
}
