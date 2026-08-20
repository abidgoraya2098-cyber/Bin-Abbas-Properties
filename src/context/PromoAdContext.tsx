import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PromoAdItem } from "../types";
import { useNotifications } from "./NotificationContext";
import { useAdmin } from "./AdminContext";
import { getMediaBlob, deleteMediaBlob } from "../utils/mediaStorage";

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
  addPromoAd: (adData: Omit<PromoAdItem, "id" | "createdAt" | "viewCount">) => PromoAdItem;
  updatePromoAd: (id: string, adData: Partial<PromoAdItem>) => void;
  deletePromoAd: (id: string) => void;
  toggleAdActive: (id: string) => void;
  hasUnseenNewAd: boolean;
  markAdsAsSeen: () => void;
}

const PromoAdContext = createContext<PromoAdContextType | undefined>(undefined);

export const PromoAdProvider = ({ children }: { children: ReactNode }) => {
  const { broadcastPublicDeal } = useNotifications();
  const { isAdmin } = useAdmin();

  // 100% Clean: Pure Admin Ads Only (All legacy dummy/sample ads are automatically purged)
  const [ads, setAds] = useState<PromoAdItem[]>(() => {
    try {
      const saved = localStorage.getItem("bin_abbas_promo_ads");
      if (!saved) return [];
      const parsed: PromoAdItem[] = JSON.parse(saved);
      // Completely remove any legacy dummy sample ads
      const cleanAds = parsed.filter((a) => !a.id.startsWith("promo-ad-"));
      if (cleanAds.length !== parsed.length) {
        localStorage.setItem("bin_abbas_promo_ads", JSON.stringify(cleanAds));
      }
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
    setAds(items);
    try {
      localStorage.setItem("bin_abbas_promo_ads", JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save promo ads:", e);
    }
  };

  const activeAds = ads.filter((ad) => ad.isActive);
  const currentAd = activeAds[currentAdIndex] || activeAds[0] || null;

  // ⏱️ Auto-rotate through multiple ads (15 seconds per ad so users can comfortably read details)
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

  // Add new promo ad (Admin Only - Media, Caption, Price, Location are ALL OPTIONAL)
  const addPromoAd = (
    adData: Omit<PromoAdItem, "id" | "createdAt" | "viewCount">
  ): PromoAdItem => {
    const newAd: PromoAdItem = {
      ...adData,
      id: `ad-${Date.now()}`,
      createdAt: Date.now(),
      viewCount: 1
    };

    const updated = [newAd, ...ads];
    saveAds(updated);

    // Set badge and notification
    setHasUnseenNewAd(true);
    try {
      if ("setAppBadge" in navigator) {
        (navigator as any).setAppBadge(1).catch(() => {});
      }
    } catch (e) {
      console.warn("Badge error", e);
    }

    // Broadcast Public Notification
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

  const updatePromoAd = (id: string, adData: Partial<PromoAdItem>) => {
    const updated = ads.map((item) => (item.id === id ? { ...item, ...adData } : item));
    saveAds(updated);
  };

  const deletePromoAd = (id: string) => {
    const updated = ads.filter((item) => item.id !== id);
    saveAds(updated);
    deleteMediaBlob(id).catch(() => {});
    if (currentAdIndex >= updated.filter(a => a.isActive).length) {
      setCurrentAdIndex(0);
    }
  };

  const toggleAdActive = (id: string) => {
    const updated = ads.map((item) => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    saveAds(updated);
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
