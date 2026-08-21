import { PromoAdItem, InstalledDeviceRecord } from "../types";

/**
 * 🌐 Global Cloud Synchronization & Device Analytics Engine
 * Ensures ads, deals, and device installation analytics sync in real-time across all mobile phones, iPhones, and computers worldwide.
 */

// Persistent Unique Device ID for this installation
export function getPersistentDeviceId(): string {
  try {
    let id = localStorage.getItem("bin_abbas_device_id");
    if (!id) {
      id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
  let deviceModel = "Desktop Computer";
  let browser = "Google Chrome";

  if (/iphone|ipod/.test(lowerUA)) {
    deviceType = "iPhone";
    os = "iOS";
    deviceModel = /iphone/.test(lowerUA) ? "Apple iPhone" : "Apple iPod";
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

// 📱 Register / Update Device Installation in Cloud
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

    // 1. Post to Server API
    await fetch("/api/devices/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {});

    // 2. Also cache locally
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

// 🌐 Fetch All Global Ads from Cloud
export async function fetchGlobalAdsFromCloud(): Promise<PromoAdItem[] | null> {
  try {
    const res = await fetch("/api/ads", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch ads from /api/ads:", err);
  }
  return null;
}

// 🚀 Publish / Sync Ad to Cloud (All users receive this instantly)
export async function publishAdToCloud(ad: PromoAdItem): Promise<boolean> {
  try {
    const res = await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ad)
    });
    return res.ok;
  } catch (err) {
    console.warn("Could not publish ad to /api/ads:", err);
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
  } catch (err) {
    console.warn("Could not delete ad from /api/ads:", err);
    return false;
  }
}

// 📊 Admin: Fetch Installed Devices List from Cloud
export async function fetchInstalledDevicesFromCloud(): Promise<InstalledDeviceRecord[]> {
  try {
    const res = await fetch("/api/devices", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem("bin_abbas_devices_cache", JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch devices from /api/devices:", err);
  }

  // Fallback to local cache
  try {
    return JSON.parse(localStorage.getItem("bin_abbas_devices_cache") || "[]");
  } catch {
    return [];
  }
}
