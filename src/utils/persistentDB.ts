import { PromoAdItem, InstalledDeviceRecord } from "../types";
import { DEFAULT_PROMO_ADS, DEFAULT_INSTALLED_DEVICES } from "../data";

const DB_NAME = "BinAbbasMasterDB";
const DB_VERSION = 2;
const STORE_ADS = "master_ads";
const STORE_DEVICES = "master_devices";
const STORE_META = "master_meta";

/**
 * 🔒 Request Browser Storage Persistence
 * Prevents Chrome, Safari, Edge, and mobile browsers from clearing IndexedDB during basic cache clears!
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      console.log("[Storage] Persistent storage granted:", isPersisted);
      return isPersisted;
    } catch (e) {
      console.warn("[Storage] Storage persist request error:", e);
    }
  }
  return false;
}

function openMasterDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_ADS)) {
        db.createObjectStore(STORE_ADS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_DEVICES)) {
        db.createObjectStore(STORE_DEVICES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 📌 Save Ads to IndexedDB
export async function saveAdsToIndexedDB(ads: PromoAdItem[]): Promise<void> {
  try {
    const db = await openMasterDB();
    const tx = db.transaction([STORE_ADS, STORE_META], "readwrite");
    const store = tx.objectStore(STORE_ADS);
    
    // Clear & write all
    store.clear();
    ads.forEach((ad) => {
      if (ad && ad.id) {
        store.put(ad);
      }
    });

    const metaStore = tx.objectStore(STORE_META);
    metaStore.put({ key: "last_ads_sync", timestamp: Date.now(), count: ads.length });
  } catch (e) {
    console.warn("[PersistentDB] saveAds error:", e);
  }
}

// 📌 Load Ads from IndexedDB
export async function getAdsFromIndexedDB(): Promise<PromoAdItem[]> {
  try {
    const db = await openMasterDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_ADS, "readonly");
      const store = tx.objectStore(STORE_ADS);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        resolve(Array.isArray(results) ? results : []);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

// 📌 Save Devices to IndexedDB
export async function saveDevicesToIndexedDB(devices: InstalledDeviceRecord[]): Promise<void> {
  try {
    const db = await openMasterDB();
    const tx = db.transaction([STORE_DEVICES, STORE_META], "readwrite");
    const store = tx.objectStore(STORE_DEVICES);
    
    devices.forEach((dev) => {
      if (dev && dev.id) {
        store.put(dev);
      }
    });

    const metaStore = tx.objectStore(STORE_META);
    metaStore.put({ key: "last_devices_sync", timestamp: Date.now(), count: devices.length });
  } catch (e) {
    console.warn("[PersistentDB] saveDevices error:", e);
  }
}

// 📌 Load Devices from IndexedDB
export async function getDevicesFromIndexedDB(): Promise<InstalledDeviceRecord[]> {
  try {
    const db = await openMasterDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_DEVICES, "readonly");
      const store = tx.objectStore(STORE_DEVICES);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        resolve(Array.isArray(results) ? results : []);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * 📦 Export Complete Application Database Backup as JSON
 */
export async function exportFullDatabaseBackup(): Promise<string> {
  const ads = await getAdsFromIndexedDB();
  const devices = await getDevicesFromIndexedDB();
  const localAds: PromoAdItem[] = JSON.parse(localStorage.getItem("bin_abbas_promo_ads") || "[]");
  const localDevices: InstalledDeviceRecord[] = JSON.parse(localStorage.getItem("bin_abbas_devices_cache") || "[]");
  const inquiries = JSON.parse(localStorage.getItem("bin_abbas_inquiries") || "[]");

  const combinedAds = ads.length > 0 ? ads : localAds;
  const combinedDevices = devices.length > 0 ? devices : localDevices;

  const backupData = {
    appName: "Bin Abbas Properties",
    exportDate: new Date().toISOString(),
    version: "2.0",
    ads: combinedAds,
    devices: combinedDevices,
    inquiries
  };

  return JSON.stringify(backupData, null, 2);
}

/**
 * 📥 Restore Application Database from JSON Backup String
 */
export async function importFullDatabaseBackup(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString);
    if (!data) throw new Error("Empty backup payload");

    if (Array.isArray(data.ads) && data.ads.length > 0) {
      localStorage.setItem("bin_abbas_promo_ads", JSON.stringify(data.ads));
      await saveAdsToIndexedDB(data.ads);
    }

    if (Array.isArray(data.devices) && data.devices.length > 0) {
      localStorage.setItem("bin_abbas_devices_cache", JSON.stringify(data.devices));
      await saveDevicesToIndexedDB(data.devices);
    }

    if (Array.isArray(data.inquiries)) {
      localStorage.setItem("bin_abbas_inquiries", JSON.stringify(data.inquiries));
    }

    return {
      success: true,
      message: `بیک اپ کامیابی سے بحال ہو گیا! (${data.ads?.length || 0} ایڈز، ${data.devices?.length || 0} ڈیوائسز)`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `بیک اپ فائل غلط ہے: ${err?.message || "نامعلوم خرابی"}`
    };
  }
}