import { PropertyListing, BuySellInquiry, DealVoucher } from '../types';
import { STORAGE_KEYS } from '../data';

// Load Properties safely
export function loadProperties(): PropertyListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading properties from localStorage:', err);
    return [];
  }
}

// Save Properties safely
export function saveProperties(properties: PropertyListing[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    window.dispatchEvent(new CustomEvent('properties-updated', { detail: properties }));
    return true;
  } catch (err) {
    console.error('Error saving properties to localStorage:', err);
    return false;
  }
}

// Load Inquiries safely
export function loadInquiries(): BuySellInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading inquiries from localStorage:', err);
    return [];
  }
}

// Save Inquiries safely
export function saveInquiries(inquiries: BuySellInquiry[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    window.dispatchEvent(new CustomEvent('inquiries-updated', { detail: inquiries }));
    return true;
  } catch (err) {
    console.error('Error saving inquiries to localStorage:', err);
    return false;
  }
}

// Load Deals / Vouchers safely
export function loadDeals(): DealVoucher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEALS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading deals from localStorage:', err);
    return [];
  }
}

// Save Deals / Vouchers safely
export function saveDeals(deals: DealVoucher[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
    window.dispatchEvent(new CustomEvent('deals-updated', { detail: deals }));
    return true;
  } catch (err) {
    console.error('Error saving deals to localStorage:', err);
    return false;
  }
}

// Export Complete Data Backup as JSON file
export function exportDataBackup(): void {
  try {
    const data = {
      appName: "Bin Abbas Properties",
      exportedAt: new Date().toISOString(),
      version: "2.0",
      properties: loadProperties(),
      inquiries: loadInquiries(),
      deals: loadDeals()
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const dateStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `bin_abbas_properties_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error creating backup export:', err);
    alert('بیک اپ فائل بنانے میں خرابی پیش آئی۔');
  }
}

// Import & Restore Data Backup from JSON file
export function importDataBackup(
  jsonFile: File,
  mode: 'replace' | 'merge' = 'merge'
): Promise<{ success: boolean; message: string; propertiesCount: number; inquiriesCount: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        let newProps: PropertyListing[] = Array.isArray(parsed.properties) ? parsed.properties : [];
        let newInqs: BuySellInquiry[] = Array.isArray(parsed.inquiries) ? parsed.inquiries : [];
        let newDeals: DealVoucher[] = Array.isArray(parsed.deals) ? parsed.deals : [];

        if (mode === 'replace') {
          saveProperties(newProps);
          saveInquiries(newInqs);
          saveDeals(newDeals);
        } else {
          // Merge avoiding ID duplicates
          const currentProps = loadProperties();
          const propMap = new Map(currentProps.map(p => [p.id, p]));
          newProps.forEach(p => propMap.set(p.id, p));
          saveProperties(Array.from(propMap.values()));

          const currentInqs = loadInquiries();
          const inqMap = new Map(currentInqs.map(i => [i.id, i]));
          newInqs.forEach(i => inqMap.set(i.id, i));
          saveInquiries(Array.from(inqMap.values()));

          const currentDeals = loadDeals();
          const dealMap = new Map(currentDeals.map(d => [d.id, d]));
          newDeals.forEach(d => dealMap.set(d.id, d));
          saveDeals(Array.from(dealMap.values()));
        }

        resolve({
          success: true,
          message: 'ڈیٹا کامیابی کے ساتھ بحال (Restore) کر دیا گیا ہے۔',
          propertiesCount: newProps.length,
          inquiriesCount: newInqs.length
        });
      } catch (err) {
        console.error('Error importing backup:', err);
        reject(new Error('بیک اپ فائل غیر موزوں یا خراب ہے۔ برائے مہربانی درست JSON فائل منتخب کریں۔'));
      }
    };
    reader.onerror = () => reject(new Error('فائل پڑھنے میں ناکامی۔'));
    reader.readAsText(jsonFile);
  });
}
