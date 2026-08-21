import { PromoAdItem, InstalledDeviceRecord } from "../types";

/**
 * 🌐 Multi-Tier Global Cloud Synchronization & Device Analytics Engine
 * Automatically falls back to /data/ads.json, /api/ads, and localStorage
 * so that ads and device stats work identically across all servers, CDNs, iPhones, and Androids!
 */

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

// 📱 Register / Update Device Installation
export async function syncDeviceRegistration(): Promise<void> {
  try {
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

    // 1. Try posting to Server API
    fetch("/api/devices/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {});

    // 2. Cache in local storage list
    const currentList: InstalledDeviceRecord[] = JSON.parse(localStorage.getItem("bin_abbas_devices_cache") || "[]");
    const existingIdx = currentList.findIndex((d) => d.id === deviceId);
    if (existingIdx >= 0) {
      currentList[existingIdx] = payload;
    } else {
      currentList.unshift(payload);
    }
    localStorage.setItem("bin_abbas_devices_cache", JSON.stringify(currentList));
  } catch (err) {
    console.warn("Device sync error:", err);
  }
}

// 🌐 Fetch All Global Ads with Multi-Tier Fallback
export async function fetchGlobalAdsFromCloud(): Promise<PromoAdItem[] | null> {
  // Tier 1: /api/ads
  try {
    const res = await fetch("/api/ads", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {}

  // Tier 2: /data/ads.json
  try {
    const res = await fetch("/data/ads.json", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {}

  return null;
}

// 🚀 Publish Ad to Cloud
export async function publishAdToCloud(ad: PromoAdItem): Promise<boolean> {
  try {
    const res = await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ad)
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 🗑️ Delete Ad from Cloud
export async function deleteAdFromCloud(adId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/ads/${adId}`, {
      method: "DELETE"
    });
    return res.ok;
  } catch {
    return false;
  }
}

// 📊 Admin: Fetch Installed Devices List with Multi-Tier Fallback
export async function fetchInstalledDevicesFromCloud(): Promise<InstalledDeviceRecord[]> {
  let fetchedList: InstalledDeviceRecord[] = [];

  // Tier 1: /api/devices
  try {
    const res = await fetch("/api/devices", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        fetchedList = data;
      }
    }
  } catch {}

  // Tier 2: /data/devices.json fallback if list is empty
  if (fetchedList.length === 0) {
    try {
      const res = await fetch("/data/devices.json", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          fetchedList = data;
        }
      }
    } catch {}
  }

  // Tier 3: Local devices cache
  const localCache: InstalledDeviceRecord[] = JSON.parse(localStorage.getItem("bin_abbas_devices_cache") || "[]");
  
  // Merge unique devices by id
  const map = new Map<string, InstalledDeviceRecord>();
  [...fetchedList, ...localCache].forEach((d) => {
    if (d && d.id) {
      map.set(d.id, d);
    }
  });

  const merged = Array.from(map.values());
  localStorage.setItem("bin_abbas_devices_cache", JSON.stringify(merged));
  return merged;
}
