import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PromoAdItem } from "../types";
import { useNotifications } from "./NotificationContext";
import { useAdmin } from "./AdminContext";

interface PromoAdContextType {
  ads: PromoAdItem[];
  activeAds: PromoAdItem[];
  featuredAd: PromoAdItem | null;
  selectedAd: PromoAdItem | null;
  isAdPopupOpen: boolean;
  openAd: (ad: PromoAdItem) => void;
  closeAdPopup: () => void;
  addPromoAd: (adData: Omit<PromoAdItem, "id" | "createdAt" | "viewCount">) => PromoAdItem;
  updatePromoAd: (id: string, adData: Partial<PromoAdItem>) => void;
  deletePromoAd: (id: string) => void;
  toggleAdActive: (id: string) => void;
  hasUnseenNewAd: boolean;
  markAdsAsSeen: () => void;
}

const PromoAdContext = createContext<PromoAdContextType | undefined>(undefined);

// Initial Sample High-End Real Estate Ads
const INITIAL_PROMO_ADS: PromoAdItem[] = [
  {
    id: "promo-ad-palm-commercial",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80",
    title: "خصوصی آفر: پرائم کمرشل دکان (پام کمرشل 235)",
    titleEn: "Exclusive Offer: Prime Commercial Shop (Palm Commercial 235)",
    caption: "رائل پام سٹی کی مرکزی ترین مین مارکیٹ میں پام کمرشل 235 پر شاندار کمرشل دکان برائے فروخت دستیاب ہے۔ تمام جدید سہولیات، فوری قبضہ اور بہترین رینٹل انکم کی گارنٹی۔ برائے فوری رابطہ بن عباس پراپرٹیز۔",
    captionEn: "Prime commercial shop available for instant sale at Palm Commercial 235, Royal Palm City Gujranwala. High rental yield and instant possession.",
    price: "ڈیمانڈ: 1 کروڑ 65 لاکھ",
    priceEn: "Demand: 1.65 Crore PKR",
    location: "پام کمرشل 235، مین مارکیٹ، رائل پام سٹی، گوجرانوالہ",
    locationEn: "Palm Commercial 235, Main Market, Royal Palm City, Gujranwala",
    whatsAppMessage: "السلام علیکم فریاد حسن گورائیہ صاحب! میں نے ایپ پر پام کمرشل 235 کی دکان کا ایڈ دیکھا ہے، مجھے یہ خریدنی ہے، براہ کرم معلومات دیں۔",
    createdAt: Date.now() - 3600000 * 2,
    isActive: true,
    isHot: true,
    viewCount: 142
  },
  {
    id: "promo-ad-luxury-villa",
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-suburban-house-exterior-tour-41484-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    title: "ویڈیو ٹور: 10 مرلہ برانڈ نیو لگژری ڈیزائنر ولا (بلاک B)",
    titleEn: "Video Tour: 10 Marla Luxury Designer Villa (Block B)",
    caption: "5 کشادہ بیڈ رومز بمعہ اٹیچ باتھ، 2 اٹالین کچن، ڈرائنگ و ڈائننگ، امپورٹڈ سینیٹری و ٹائل فٹنگز، سرونٹ کوارٹر اور سولر پینلز انسٹالڈ۔ رائل پام سٹی کے بہترین بلاک میں فوری شفٹنگ کے لیے تیار۔",
    captionEn: "Brand new 10 Marla modern house in Block B, Royal Palm City. 5 Master Bedrooms, 2 Luxury Kitchens, Designer Interior, Solar System Installed.",
    price: "ڈیمانڈ: 3 کروڑ 75 لاکھ",
    priceEn: "Demand: 3.75 Crore PKR",
    location: "بلاک B، رائل پام سٹی، گوجرانوالہ",
    locationEn: "Block B, Royal Palm City, Gujranwala",
    whatsAppMessage: "السلام علیکم فریاد حسن گورائیہ صاحب! میں نے ایپ پر بلاک B کے 10 مرلہ گھر کا ویڈیو ایڈ دیکھا ہے۔ برائے مہربانی وزٹ کا وقت اور فائنل ریٹ بتائیں۔",
    createdAt: Date.now() - 3600000 * 5,
    isActive: true,
    isHot: true,
    viewCount: 289
  }
];

export const PromoAdProvider = ({ children }: { children: ReactNode }) => {
  const { broadcastPublicDeal } = useNotifications();
  const { isAdmin } = useAdmin();

  const [ads, setAds] = useState<PromoAdItem[]>(() => {
    try {
      const saved = localStorage.getItem("bin_abbas_promo_ads");
      return saved ? JSON.parse(saved) : INITIAL_PROMO_ADS;
    } catch {
      return INITIAL_PROMO_ADS;
    }
  });

  const [selectedAd, setSelectedAd] = useState<PromoAdItem | null>(null);
  const [isAdPopupOpen, setIsAdPopupOpen] = useState(false);

  const [hasUnseenNewAd, setHasUnseenNewAd] = useState<boolean>(() => {
    try {
      const lastSeenTime = Number(localStorage.getItem("bin_abbas_last_seen_ad_time") || 0);
      const latestAdTime = ads.length > 0 ? Math.max(...ads.map((a) => a.createdAt)) : 0;
      return latestAdTime > lastSeenTime;
    } catch {
      return false;
    }
  });

  // Save ads to localStorage
  const saveAds = (items: PromoAdItem[]) => {
    setAds(items);
    try {
      localStorage.setItem("bin_abbas_promo_ads", JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save promo ads:", e);
    }
  };

  const activeAds = ads.filter((ad) => ad.isActive);
  const featuredAd = activeAds.find((ad) => ad.isHot) || activeAds[0] || null;

  // Open Ad in Popup Modal
  const openAd = (ad: PromoAdItem) => {
    setSelectedAd(ad);
    setIsAdPopupOpen(true);
    markAdsAsSeen();

    // Increment View Count
    const updated = ads.map((item) => 
      item.id === ad.id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item
    );
    saveAds(updated);
  };

  const closeAdPopup = () => {
    setIsAdPopupOpen(false);
    setSelectedAd(null);
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

  // Add new promo ad (Admin Only)
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
    const typeLabel = newAd.type === "video" ? "ویڈیو ایڈ" : "خصوصی تصویر ایڈ";
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
        featuredAd,
        selectedAd,
        isAdPopupOpen,
        openAd,
        closeAdPopup,
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
