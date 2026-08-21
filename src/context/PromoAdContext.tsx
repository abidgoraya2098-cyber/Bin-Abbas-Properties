import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PromoAdItem } from "../types";
import { useNotifications } from "./NotificationContext";
import { useAdmin } from "./AdminContext";
import { deleteMediaBlob } from "../utils/mediaStorage";
import { fetchGlobalAdsFromCloud, publishAdToCloud, deleteAdFromCloud, isRealCustomAd } from "../utils/cloudSync";

interface PromoAdContextType {
  ads: PromoAdItem[];
  activeAds: PromoAdItem[];
  currentAdIndex: number;
  currentAd: PromoAdItem | null;
  isAdPopupOpen: boolean;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  openAd: (indexOrAd?: number | PromoAdItem) => void;
  closeAdPopup: () => void;
  nextAd: () => void;
  prevAd: () => void;
  goToAdIndex: (index: number) => void;
  addPromoAd: (adData: Omit<PromoAdItem, "id" | "createdAt" | "viewCount">) => Promise<PromoAdItem>;
  updatePromoAd: (id: string, adData: Partial<PromoAdItem>) => Promise<void>;
  deletePromoAd: (id: string) => Promise<void>;
  toggleAdActive: (id: string) => Promise<void>;
  refreshAdsFromCloud: () => Promise<PromoAdItem[]>;
  hasUnseenNewAd: boolean;
  markAdsAsSeen: () => void;
}

const PromoAdContext = createContext<PromoAdContextType | undefined>(undefined);

export const PromoAdProvider = ({ children }: { children: ReactNode }) => {
  const { broadcastPublicDeal } = useNotifications();
  const { isAdmin } = useAdmin();

  // Local state initialized from cache (strictly excluding old dummy samples)
  const [ads, setAds] = useState<PromoAdItem[]>(() => {
    try {
      const saved = localStorage.getItem("bin_abbas_promo_ads");
      if (!saved) return [];
      const parsed: PromoAdItem[] = JSON.parse(saved);
      const cleanAds = parsed.filter(isRealCustomAd);
      return cleanAds;
    } catch {
      return [];
    }
  });

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAdPopupOpen, setIsAdPopupOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [hasUnseenNewAd, setHasUnseenNewAd] = useState<boolean>(() => {
    try {
      const lastSeenTime = Number(localStorage.getItem("bin_abbas_last_seen_ad_time") || 0);
      const latestAdTime = ads.length > 0 ? Math.max(...ads.map((a) => a.createdAt)) : 0;
      return latestAdTime > lastSeenTime && ads.some(a => a.isActive);
    } catch {
      return false;
    }
  });

  const saveAds = (items: PromoAdItem[]) => {
    const cleanItems = items.filter(isRealCustomAd);
    setAds(cleanItems);
    try {
      localStorage.setItem("bin_abbas_promo_ads", JSON.stringify(cleanItems));
    } catch (e) {
      console.warn("Could not save promo ads:", e);
    }
  };

  const refreshAdsFromCloud = async (): Promise<PromoAdItem[]> => {
    try {
      const cloudAds = await fetchGlobalAdsFromCloud();
      if (cloudAds && Array.isArray(cloudAds)) {
        const cleanCloudAds = cloudAds.filter(isRealCustomAd);
        setAds(cleanCloudAds);
        try {
          localStorage.setItem("bin_abbas_promo_ads", JSON.stringify(cleanCloudAds));
          const lastSeenTime = Number(localStorage.getItem("bin_abbas_last_seen_ad_time") || 0);
          const latestAdTime = cleanCloudAds.length > 0 ? Math.max(...cleanCloudAds.map((a) => a.createdAt)) : 0;
          
          if (latestAdTime > lastSeenTime && cleanCloudAds.some((a) => a.isActive)) {
            setHasUnseenNewAd(true);
            const newest = cleanCloudAds.find((a) => a.isActive);
            if (newest) {
              // Trigger native notification
              if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                if ("serviceWorker" in navigator) {
                  navigator.serviceWorker.ready.then((reg) => {
                    reg.showNotification(`🔥 نیا ایڈ: ${newest.title}`, {
                      body: `${newest.price ? newest.price + " | " : ""}${newest.location || "رائل پام سٹی"} (بن عباس پراپرٹیز)`,
                      icon: "/icon-192.png",
                      badge: "/icon.svg",
                      tag: `bin-abbas-ad-${newest.id}`,
                      data: { url: "/", adId: newest.id }
                    });
                  }).catch(() => {});
                }
              }
            }
          }
        } catch {}
        return cleanCloudAds;
      }
    } catch (err) {
      console.warn("Error refreshing ads from cloud:", err);
    }
    return ads;
  };

  // 🌐 Global Real-Time Cloud Synchronization: Fetch latest ads for ALL users worldwide
  useEffect(() => {
    refreshAdsFromCloud();

    // Auto-poll every 15 seconds so any new ad by Admin appears on all users' screens
    const interval = setInterval(refreshAdsFromCloud, 15000);
    window.addEventListener("focus", refreshAdsFromCloud);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refreshAdsFromCloud);
    };
  }, []);

  const activeAds = ads.filter((ad) => ad.isActive);
  const currentAd = activeAds[currentAdIndex] || activeAds[0] || null;

  // ⏱️ Auto-rotate through multiple ads (15 seconds per ad)
  useEffect(() => {
    if (!isAdPopupOpen || activeAds.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [isAdPopupOpen, activeAds.length, isPaused, currentAdIndex]);

  const nextAd = () => {
    if (activeAds.length === 0) return;
    setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
  };

  const prevAd = () => {
    if (activeAds.length === 0) return;
    setCurrentAdIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  const goToAdIndex = (index: number) => {
    if (index >= 0 && index < activeAds.length) {
      setCurrentAdIndex(index);
    }
  };

  const openAd = (indexOrAd?: number | PromoAdItem) => {
    if (activeAds.length === 0) return;

    if (typeof indexOrAd === "number") {
      setCurrentAdIndex(indexOrAd);
    } else if (indexOrAd && typeof indexOrAd === "object") {
      const idx = activeAds.findIndex((a) => a.id === indexOrAd.id);
      setCurrentAdIndex(idx >= 0 ? idx : 0);
    } else {
      setCurrentAdIndex(0);
    }
    setIsAdPopupOpen(true);
    markAdsAsSeen();

    // Increment View Count
    if (currentAd) {
      const updated = ads.map((item) => 
        item.id === currentAd.id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item
      );
      saveAds(updated);
    }
  };

  const closeAdPopup = () => {
    setIsAdPopupOpen(false);
  };

  const markAdsAsSeen = () => {
    setHasUnseenNewAd(false);
    try {
      localStorage.setItem("bin_abbas_last_seen_ad_time", String(Date.now()));
      if ("clearAppBadge" in navigator) {
        (navigator as any).clearAppBadge().catch(() => {});
      }
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  // Add new promo ad (Admin Only - Broadcasts to cloud immediately)
  const addPromoAd = async (
    adData: Omit<PromoAdItem, "id" | "createdAt" | "viewCount">
  ): Promise<PromoAdItem> => {
    const newAd: PromoAdItem = {
      ...adData,
      id: `ad-${Date.now()}`,
      createdAt: Date.now(),
      viewCount: 1
    };

    const updated = [newAd, ...ads];
    saveAds(updated);

    // 🚀 Publish to Cloud Database (All users worldwide receive this ad)
    await publishAdToCloud(newAd);

    // Set badge and notification
    setHasUnseenNewAd(true);
    try {
      if ("setAppBadge" in navigator) {
        (navigator as any).setAppBadge(1).catch(() => {});
      }
    } catch (e) {
      console.warn("Badge error", e);
    }

    // Trigger Native System / Push Notification outside the app
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        const notifOptions = {
          body: `${newAd.price ? newAd.price + " | " : ""}${newAd.location || "رائل پام سٹی"} (بن عباس پراپرٹیز)`,
          icon: "/icon.svg",
          badge: "/icon.svg",
          vibrate: [200, 100, 200],
          tag: `bin-abbas-ad-${newAd.id}`,
          data: { url: "/", adId: newAd.id }
        };

        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(`🔥 نیا ایڈ: ${newAd.title}`, notifOptions);
          }).catch(() => {
            const fallbackNotif = new Notification(`🔥 نیا ایڈ: ${newAd.title}`, notifOptions);
            fallbackNotif.onclick = () => {
              window.focus();
              fallbackNotif.close();
            };
          });
        } else {
          const fallbackNotif = new Notification(`🔥 نیا ایڈ: ${newAd.title}`, notifOptions);
          fallbackNotif.onclick = () => {
            window.focus();
            fallbackNotif.close();
          };
        }
      }
    }

    // Broadcast In-App Notification
    const typeLabel = newAd.type === "video" 
      ? "ویڈیو ایڈ" 
      : newAd.type === "image" 
      ? "تصویر ایڈ" 
      : "خصوصی اعلان / ایڈ";

    broadcastPublicDeal(
      `🔥 نیا ${typeLabel}: ${newAd.title}`,
      newAd.location || "رائل پام سٹی",
      newAd.price || "خصوصی ریٹ",
      false
    );

    return newAd;
  };

  const updatePromoAd = async (id: string, adData: Partial<PromoAdItem>) => {
    const updated = ads.map((item) => (item.id === id ? { ...item, ...adData } : item));
    saveAds(updated);
    const target = updated.find(a => a.id === id);
    if (target) {
      await publishAdToCloud(target);
    }
  };

  const deletePromoAd = async (id: string) => {
    const updated = ads.filter((item) => item.id !== id);
    saveAds(updated);
    await deleteAdFromCloud(id);
    deleteMediaBlob(id).catch(() => {});
    if (currentAdIndex >= updated.filter(a => a.isActive).length) {
      setCurrentAdIndex(0);
    }
  };

  const toggleAdActive = async (id: string) => {
    const updated = ads.map((item) => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    saveAds(updated);
    const target = updated.find(a => a.id === id);
    if (target) {
      await publishAdToCloud(target);
    }
  };

  return (
    <PromoAdContext.Provider
      value={{
        ads,
        activeAds,
        currentAdIndex,
        currentAd,
        isAdPopupOpen,
        isPaused,
        setIsPaused,
        openAd,
        closeAdPopup,
        nextAd,
        prevAd,
        goToAdIndex,
        addPromoAd,
        updatePromoAd,
        deletePromoAd,
        toggleAdActive,
        refreshAdsFromCloud,
        hasUnseenNewAd,
        markAdsAsSeen
      }}
    >
      {children}
    </PromoAdContext.Provider>
  );
};

export const usePromoAds = () => {
  const context = useContext(PromoAdContext);
  if (!context) {
    throw new Error("usePromoAds must be used within a PromoAdProvider");
  }
  return context;
};
