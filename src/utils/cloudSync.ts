import { PromoAdItem, InstalledDeviceRecord } from "../types";
import { DEFAULT_PROMO_ADS, DEFAULT_INSTALLED_DEVICES } from "../data";
import { 
  saveAdsToIndexedDB, 
  getAdsFromIndexedDB, 
  saveDevicesToIndexedDB, 
  getDevicesFromIndexedDB, 
  requestPersistentStorage 
} from "./persistentDB";

/**
 * 🌐 High-Speed Global Cloud Synchronization Engine (Upstash Redis REST)
 * Syncs Ads, Devices, and Notifications across ALL mobile phones (Android / iPhone),
 * computers, and PWAs worldwide in real-time.
 */

export interface CloudDbConfig {
  url: string;
  token: string;
  isConfigured: boolean;
}

export function getCloudDbConfig(): CloudDbConfig {
  let url = "";
  let token = "";

  try {
    url = localStorage.getItem("bin_abbas_cloud_db_url") || "";
    token = localStorage.getItem("bin_abbas_cloud_db_token") || "";
  } catch {}

  if (!url) {
    try {
      url = ((import.meta as any).env?.VITE_UPSTASH_REDIS_REST_URL as string) || "";
    } catch {}
  }

  if (!token) {
    try {
      token = ((import.meta as any).env?.VITE_UPSTASH_REDIS_REST_TOKEN as string) || "";
    } catch {}
  }

  return {
    url: url.trim(),
    token: token.trim(),
    isConfigured: Boolean(url.trim() && token.trim())
  };
}

export function setCloudDbConfig(url: string, token: string): void {
  try {
    localStorage.setItem("bin_abbas_cloud_db_url", url.trim());
    localStorage.setItem("bin_abbas_cloud_db_token", token.trim());
  } catch (e) {
    console.warn("Could not save cloud db config:", e);
  }
}

export async function testCloudDbConnection(testUrl?: string, testToken?: string): Promise<{ success: boolean; message: string }> {
  const config = getCloudDbConfig();
  const url = (testUrl !== undefined ? testUrl : config.url).trim();
  const token = (testToken !== undefined ? testToken : config.token).trim();

  if (!url || !token) {
    return { success: false, message: "URL اور Token درج کریں" };
  }

  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeout = setTimeout(() => controller?.abort(), 6000);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(["PING"]),
      signal: controller?.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data?.result === "PONG") {
        return { success: true, message: "✅ کلاؤڈ ڈیٹا بیس سے کامیابی کے ساتھ کنکشن قائم ہو گیا ہے!" };
      }
      return { success: true, message: `✅ رسپانس موصول ہوا: ${JSON.stringify(data?.result)}` };
    } else {
      return { success: false, message: `سرور کا رسپانس کوڈ: ${res.status} ${res.statusText}` };
    }
  } catch (e: any) {
    return { success: false, message: `کنکشن میں رکاوٹ: ${e?.message || "نامعلوم خرابی"}` };
  }
}

async function executeRedisCommand(command: any[]): Promise<any> {
  const config = getCloudDbConfig();
  if (!config.isConfigured) return null;

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeout = setTimeout(() => controller?.abort(), 6000);

  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command),
      signal: controller?.signal
    });

    if (res.ok) {
      const data = await res.json();
      return data?.result;
    }
  } catch (e) {
    console.warn("[CloudSync] Redis command error:", e);
  } finally {
    clearTimeout(timeout);
  }
  return null;
}

// Persistent Unique Device ID for this installation
export function getPersistentDeviceId(): string {
  try {
    let id = localStorage.getItem("bin_abbas_device_id");
    if (!id) {
      id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem("bin_abbas_device_id", id);
    }
    return id;
  } catch {
    return `dev_fallback_${Date.now()}`;
  }
}

// Extract human-friendly device & OS info
export function detectDeviceInfo(): {
  deviceType: InstalledDeviceRecord["deviceType"];
  deviceModel: string;
  os: string;
  browser: string;
  isPwaInstalled: boolean;
} {
  const ua = (typeof navigator !== "undefined" ? navigator.userAgent : "") || "";
  const lowerUA = ua.toLowerCase();

  const isStandalone = 
    (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) ||
    (typeof navigator !== "undefined" && (navigator as any).standalone === true);

  let deviceType: InstalledDeviceRecord["deviceType"] = "PC";
  let os = "Windows";
  let deviceModel = "Windows PC";
  let browser = "Chrome";

  if (/iphone|ipod/.test(lowerUA)) {
    deviceType = "iPhone";
    os = "iOS";
    deviceModel = "Apple iPhone";
  } else if (/ipad/.test(lowerUA) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    deviceType = "Tablet";
    os = "iPadOS";
    deviceModel = "Apple iPad";
  } else if (/android/.test(lowerUA)) {
    deviceType = "Android";
    os = "Android";
    const match = ua.match(/Android\s+([\d.]+);\s*([^;)]+)/);
    deviceModel = match && match[2] ? match[2].trim() : "Android Smartphone";
  } else if (/macintosh|mac os x/.test(lowerUA)) {
    deviceType = "Mac";
    os = "macOS";
    deviceModel = "Apple Mac";
  } else if (/linux/.test(lowerUA)) {
    deviceType = "PC";
    os = "Linux";
    deviceModel = "Linux PC";
  }

  if (/edg\//.test(lowerUA)) browser = "Microsoft Edge";
  else if (/opr\/|opera/.test(lowerUA)) browser = "Opera";
  else if (/chrome|crios/.test(lowerUA)) browser = "Google Chrome";
  else if (/firefox|fxios/.test(lowerUA)) browser = "Mozilla Firefox";
  else if (/safari/.test(lowerUA)) browser = "Apple Safari";

  return {
    deviceType,
    deviceModel,
    os,
    browser,
    isPwaInstalled: !!isStandalone
  };
}

// 📱 Register / Update Device Installation in Global Cloud
export async function syncDeviceRegistration(): Promise<void> {
  try {
    requestPersistentStorage().catch(() => {});
    const deviceId = getPersistentDeviceId();
    const info = detectDeviceInfo();
    const now = Date.now();

    let installDate = Number(localStorage.getItem("bin_abbas_install_date") || 0);
    if (!installDate) {
      installDate = now;
      localStorage.setItem("bin_abbas_install_date", String(installDate));
    }

    const payload: InstalledDeviceRecord = {
      id: deviceId,
      deviceType: info.deviceType,
      deviceModel: info.deviceModel,
      os: info.os,
      browser: info.browser,
      isPwaInstalled: info.isPwaInstalled,
      installDate,
      installDateFormatted: new Date(installDate).toLocaleDateString("ur-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      lastActive: now,
      lastActiveFormatted: new Date(now).toLocaleDateString("ur-PK", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      isOnline: true
    };

    // 1. Save to local storage & IndexedDB
    const currentList: InstalledDeviceRecord[] = JSON.parse(localStorage.getItem("bin_abbas_devices_cache") || "[]");
    const map = new Map<string, InstalledDeviceRecord>();
    currentList.forEach((d) => map.set(d.id, d));
    map.set(deviceId, payload);

    const merged = Array.from(map.values()).slice(0, 150);
    localStorage.setItem("bin_abbas_devices_cache", JSON.stringify(merged));
    await saveDevicesToIndexedDB(merged);

    // 2. Sync to Global Cloud (Redis) if configured
    const rawDevices = await executeRedisCommand(["GET", "bin_abbas:devices"]);
    let cloudDevices: InstalledDeviceRecord[] = [];
    if (rawDevices) {
      try {
        const parsed = typeof rawDevices === "string" ? JSON.parse(rawDevices) : rawDevices;
        if (Array.isArray(parsed)) cloudDevices = parsed;
      } catch {}
    }

    const cloudMap = new Map<string, InstalledDeviceRecord>();
    cloudDevices.forEach((d) => {
      if (d && d.id) cloudMap.set(d.id, d);
    });
    cloudMap.set(deviceId, payload);

    const finalCloudDevices = Array.from(cloudMap.values()).slice(0, 200);
    await executeRedisCommand(["SET", "bin_abbas:devices", JSON.stringify(finalCloudDevices)]);
  } catch (err) {
    console.warn("Device registration error:", err);
  }
}

// 🛡️ Strict filter to eliminate dummy/sample ads
export function isRealCustomAd(a: PromoAdItem | null | undefined): boolean {
  if (!a || !a.id) return false;
  if (a.id.startsWith("ad-initial-") || a.id.startsWith("promo-ad-") || a.id.includes("royal-palm-1")) return false;
  if (typeof a.mediaUrl === "string" && a.mediaUrl.includes("photo-1600596542815-ffad4c1539a9")) return false;
  if (!a.title || a.title.trim() === "" || a.title === "dummy") return false;
  return true;
}

// 🌐 Fetch All Global Ads in Real-Time (Cloud Authority + Local Cache)
export async function fetchGlobalAdsFromCloud(): Promise<PromoAdItem[]> {
  requestPersistentStorage().catch(() => {});

  let deletedIds: string[] = [];
  try {
    const rawDeleted = localStorage.getItem("bin_abbas_deleted_ads");
    if (rawDeleted) {
      deletedIds = JSON.parse(rawDeleted);
    }
  } catch {}

  // 1. Fetch cloud deleted ads list if cloud DB configured
  const rawCloudDeleted = await executeRedisCommand(["GET", "bin_abbas:deleted_ads"]);
  if (rawCloudDeleted) {
    try {
      const parsed = typeof rawCloudDeleted === "string" ? JSON.parse(rawCloudDeleted) : rawCloudDeleted;
      if (Array.isArray(parsed)) {
        deletedIds = Array.from(new Set([...deletedIds, ...parsed]));
        try {
          localStorage.setItem("bin_abbas_deleted_ads", JSON.stringify(deletedIds));
        } catch {}
      }
    } catch {}
  }

  // 2. Fetch from Cloud Redis
  const rawAds = await executeRedisCommand(["GET", "bin_abbas:ads"]);
  if (rawAds !== null && rawAds !== undefined) {
    try {
      const parsed = typeof rawAds === "string" ? JSON.parse(rawAds) : rawAds;
      if (Array.isArray(parsed)) {
        const cleanCloudAds = parsed
          .filter(isRealCustomAd)
          .filter((a) => !deletedIds.includes(a.id))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        try {
          localStorage.setItem("bin_abbas_promo_ads", JSON.stringify(cleanCloudAds));
          saveAdsToIndexedDB(cleanCloudAds).catch(() => {});
        } catch {}

        return cleanCloudAds;
      }
    } catch (e) {
      console.warn("Error parsing ads from redis:", e);
    }
  }

  // 3. Fallback to Local Persistent Stores (IndexedDB & LocalStorage)
  const map = new Map<string, PromoAdItem>();

  try {
    const idbAds = await getAdsFromIndexedDB();
    if (Array.isArray(idbAds)) {
      idbAds.forEach((ad) => {
        if (isRealCustomAd(ad) && !deletedIds.includes(ad.id)) {
          map.set(ad.id, ad);
        }
      });
    }
  } catch {}

  try {
    const rawLocal = localStorage.getItem("bin_abbas_promo_ads");
    if (rawLocal) {
      const localAds: PromoAdItem[] = JSON.parse(rawLocal);
      if (Array.isArray(localAds)) {
        localAds.forEach((ad) => {
          if (isRealCustomAd(ad) && !deletedIds.includes(ad.id)) {
            map.set(ad.id, ad);
          }
        });
      }
    }
  } catch {}

  const combined = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return combined;
}

// 🚀 Publish / Update Ad (Saves to Cloud + IndexedDB + localStorage)
export async function publishAdToCloud(ad: PromoAdItem): Promise<boolean> {
  try {
    requestPersistentStorage().catch(() => {});
    const map = new Map<string, PromoAdItem>();

    // 1. Fetch existing ads from cloud if available
    const rawAds = await executeRedisCommand(["GET", "bin_abbas:ads"]);
    if (rawAds) {
      try {
        const parsed = typeof rawAds === "string" ? JSON.parse(rawAds) : rawAds;
        if (Array.isArray(parsed)) {
          parsed.filter(isRealCustomAd).forEach((a) => map.set(a.id, a));
        }
      } catch {}
    }

    // 2. Also merge from local stores
    const idbAds = await getAdsFromIndexedDB();
    idbAds.forEach((a) => map.set(a.id, a));

    try {
      const local = JSON.parse(localStorage.getItem("bin_abbas_promo_ads") || "[]");
      if (Array.isArray(local)) {
        local.forEach((a: PromoAdItem) => map.set(a.id, a));
      }
    } catch {}

    // 3. Set new / updated ad
    map.set(ad.id, ad);

    const merged = Array.from(map.values())
      .filter(isRealCustomAd)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // 4. Save to localStorage + IndexedDB
    localStorage.setItem("bin_abbas_promo_ads", JSON.stringify(merged));
    await saveAdsToIndexedDB(merged);

    // 5. Save to Cloud Redis & Broadcast
    await executeRedisCommand(["SET", "bin_abbas:ads", JSON.stringify(merged)]);
    await executeRedisCommand([
      "SET",
      "bin_abbas:broadcast_ad",
      JSON.stringify({ adId: ad.id, title: ad.title, timestamp: Date.now() })
    ]);

    return true;
  } catch (err) {
    console.warn("Could not publish ad:", err);
    return false;
  }
}

// 🗑️ Delete Ad Permanently (Removes from Cloud & Local Stores)
export async function deleteAdFromCloud(adId: string): Promise<boolean> {
  try {
    // 1. Add to local deleted blacklist
    let deletedList: string[] = [];
    try {
      const raw = localStorage.getItem("bin_abbas_deleted_ads");
      if (raw) deletedList = JSON.parse(raw);
    } catch {}

    if (!deletedList.includes(adId)) {
      deletedList.push(adId);
      localStorage.setItem("bin_abbas_deleted_ads", JSON.stringify(deletedList));
    }

    // 2. Remove from localStorage & IndexedDB
    try {
      const rawLocal = localStorage.getItem("bin_abbas_promo_ads");
      if (rawLocal) {
        const list: PromoAdItem[] = JSON.parse(rawLocal);
        const filtered = list.filter((a) => a.id !== adId);
        localStorage.setItem("bin_abbas_promo_ads", JSON.stringify(filtered));
        await saveAdsToIndexedDB(filtered);
      }
    } catch {}

    // 3. Remove from Cloud Redis & update cloud deleted list
    const rawAds = await executeRedisCommand(["GET", "bin_abbas:ads"]);
    if (rawAds) {
      try {
        const parsed = typeof rawAds === "string" ? JSON.parse(rawAds) : rawAds;
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((a: PromoAdItem) => a.id !== adId);
          await executeRedisCommand(["SET", "bin_abbas:ads", JSON.stringify(filtered)]);
        }
      } catch {}
    }

    const rawDeleted = await executeRedisCommand(["GET", "bin_abbas:deleted_ads"]);
    let cloudDeletedList: string[] = [];
    if (rawDeleted) {
      try {
        const parsed = typeof rawDeleted === "string" ? JSON.parse(rawDeleted) : rawDeleted;
        if (Array.isArray(parsed)) cloudDeletedList = parsed;
      } catch {}
    }
    if (!cloudDeletedList.includes(adId)) {
      cloudDeletedList.push(adId);
      await executeRedisCommand(["SET", "bin_abbas:deleted_ads", JSON.stringify(cloudDeletedList)]);
    }

    return true;
  } catch (e) {
    console.warn("Delete ad error:", e);
    return false;
  }
}

// 🧹 Clear All Ads Permanently (Wipe out all old & current ads from Cloud & Local Stores)
export async function clearAllAdsFromCloud(): Promise<boolean> {
  try {
    localStorage.removeItem("bin_abbas_promo_ads");
    localStorage.removeItem("bin_abbas_cached_ads");
    localStorage.removeItem("bin_abbas_deleted_ads");
    await saveAdsToIndexedDB([]);
    await executeRedisCommand(["SET", "bin_abbas:ads", "[]"]);
    await executeRedisCommand(["DEL", "bin_abbas:broadcast_ad"]);
    return true;
  } catch (e) {
    console.warn("Clear all ads error:", e);
    return false;
  }
}

// 📊 Admin: Fetch Installed Devices List with Real-Time Global Stats
export async function fetchInstalledDevicesFromCloud(): Promise<InstalledDeviceRecord[]> {
  requestPersistentStorage().catch(() => {});
  const map = new Map<string, InstalledDeviceRecord>();

  // 1. Fetch from Cloud Redis
  const rawDevices = await executeRedisCommand(["GET", "bin_abbas:devices"]);
  if (rawDevices) {
    try {
      const parsed = typeof rawDevices === "string" ? JSON.parse(rawDevices) : rawDevices;
      if (Array.isArray(parsed)) {
        parsed.forEach((d) => {
          if (d && d.id) map.set(d.id, d);
        });
      }
    } catch (e) {
      console.warn("Error parsing devices from redis:", e);
    }
  }

  // 2. IndexedDB & Local Storage Cache
  try {
    const idbDevices = await getDevicesFromIndexedDB();
    if (Array.isArray(idbDevices)) {
      idbDevices.forEach((d) => {
        if (d && d.id && !map.has(d.id)) map.set(d.id, d);
      });
    }
  } catch {}

  try {
    const rawLocal = localStorage.getItem("bin_abbas_devices_cache");
    if (rawLocal) {
      const localDevs = JSON.parse(rawLocal);
      if (Array.isArray(localDevs)) {
        localDevs.forEach((d) => {
          if (d && d.id && !map.has(d.id)) map.set(d.id, d);
        });
      }
    }
  } catch {}

  const currentDeviceId = getPersistentDeviceId();
  const now = Date.now();

  const merged = Array.from(map.values()).map((d) => {
    const isOnline = (now - (d.lastActive || 0) < 15 * 60 * 1000) || d.id === currentDeviceId;
    return {
      ...d,
      isOnline
    };
  }).sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));

  try {
    localStorage.setItem("bin_abbas_devices_cache", JSON.stringify(merged));
    saveDevicesToIndexedDB(merged).catch(() => {});
  } catch {}

  return merged;
}


