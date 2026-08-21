import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppNotification, CustomerInquiryRecord } from "../types";
import { useAdmin } from "./AdminContext";

interface NotificationContextType {
  notifications: AppNotification[];
  inquiries: CustomerInquiryRecord[];
  unreadCount: number;
  adminUnreadInquiriesCount: number;
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: (open: boolean) => void;
  isAdminInboxOpen: boolean;
  setIsAdminInboxOpen: (open: boolean) => void;
  addCustomerInquiry: (inquiry: Omit<CustomerInquiryRecord, "id" | "timestamp" | "dateFormatted" | "status">) => CustomerInquiryRecord;
  broadcastPublicDeal: (title: string, block: string, size: string, isDemand?: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
  updateInquiryStatus: (id: string, status: CustomerInquiryRecord["status"]) => void;
  deleteInquiry: (id: string) => void;
  requestPushPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-welcome",
    title: "خوش آمدید! بن عباس پراپرٹیز پورٹل",
    titleEn: "Welcome to Bin Abbas Properties",
    message: "رائل پام سٹی گوجرانوالہ میں تصدیق شدہ پلاٹس کی خرید و فروخت اور لائیو مارکیٹ ریٹس کے لیے بن عباس پراپرٹیز حاضر ہے۔",
    messageEn: "Welcome! Explore verified plots and live market rates for Royal Palm City Gujranwala.",
    timestamp: Date.now() - 3600000,
    timeFormatted: "آج",
    targetRole: "all",
    type: "system",
    isRead: false
  }
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAdmin();

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem("bin_abbas_notifications");
      if (!saved) return INITIAL_NOTIFICATIONS;
      const parsed: AppNotification[] = JSON.parse(saved);
      // Strictly remove any old dummy fake notifications like notif-hot-1
      const clean = parsed.filter(
        (n) => n && n.id !== "notif-hot-1" && !n.title.includes("10 مرلہ پرائم لوکیشن")
      );
      return clean.length > 0 ? clean : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [inquiries, setInquiries] = useState<CustomerInquiryRecord[]>(() => {
    try {
      const saved = localStorage.getItem("bin_abbas_customer_inquiries");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAdminInboxOpen, setIsAdminInboxOpen] = useState(false);

  // Save notifications to localStorage
  const saveNotifications = (items: AppNotification[]) => {
    const cleanItems = items.filter(
      (n) => n && n.id !== "notif-hot-1" && !n.title.includes("10 مرلہ پرائم لوکیشن")
    );
    setNotifications(cleanItems);
    try {
      localStorage.setItem("bin_abbas_notifications", JSON.stringify(cleanItems));
    } catch (e) {
      console.warn("Could not save notifications:", e);
    }
  };

  // Save inquiries to localStorage
  const saveInquiries = (items: CustomerInquiryRecord[]) => {
    setInquiries(items);
    try {
      localStorage.setItem("bin_abbas_customer_inquiries", JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save inquiries:", e);
    }
  };

  // Trigger Native Web / PWA Push Notification with Service Worker support
  const sendNativePush = (title: string, body: string, relatedId?: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "granted") {
      try {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(title, {
              body,
              icon: "/icon-192.png",
              badge: "/icon.svg",
              tag: `bin-abbas-${Date.now()}`,
              data: { url: "/", relatedId }
            });
          }).catch(() => {
            new Notification(title, { body, icon: "/icon-192.png" });
          });
        } else {
          new Notification(title, { body, icon: "/icon-192.png" });
        }
      } catch (e) {
        console.warn("Push error:", e);
      }
    }
  };

  const requestPushPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.warn("Notification permission error:", e);
      }
    }
  };

  // Add a new Customer Inquiry / Plot Ad submission
  const addCustomerInquiry = (
    inquiryData: Omit<CustomerInquiryRecord, "id" | "timestamp" | "dateFormatted" | "status">
  ): CustomerInquiryRecord => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("ur-PK", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const newRecord: CustomerInquiryRecord = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      timestamp: Date.now(),
      dateFormatted,
      status: "new"
    };

    const updatedInquiries = [newRecord, ...inquiries];
    saveInquiries(updatedInquiries);

    // Add In-App notification for Admin
    const isSell = newRecord.type === "sell";
    const timeFormatted = now.toLocaleTimeString("ur-PK", { hour: "2-digit", minute: "2-digit" });

    const newNotification: AppNotification = {
      id: `notif-admin-${Date.now()}`,
      title: isSell ? `🔔 نیا پلاٹ برائے فروخت: ${newRecord.size}` : `🔔 خریدار کی ڈیمانڈ: ${newRecord.size}`,
      titleEn: isSell ? `New Plot for Sale: ${newRecord.size}` : `New Buyer Demand: ${newRecord.size}`,
      message: `${newRecord.clientName ? newRecord.clientName + " - " : ""}${newRecord.block} (${newRecord.size})۔ موبائل: ${newRecord.clientPhone || "غیر درج"}`,
      messageEn: `${newRecord.block} (${newRecord.size}) - Phone: ${newRecord.clientPhone || "N/A"}`,
      timestamp: Date.now(),
      timeFormatted,
      targetRole: "admin",
      type: isSell ? "customer_ad" : "demand",
      isRead: false,
      relatedId: newRecord.id
    };

    const updatedNotifications = [newNotification, ...notifications].slice(0, 50);
    saveNotifications(updatedNotifications);
    sendNativePush(newNotification.title, newNotification.message, newRecord.id);

    return newRecord;
  };

  // Broadcast a hot deal / admin promo ad to all users
  const broadcastPublicDeal = (title: string, block: string, size: string, isDemand = false, adId?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString("ur-PK", { hour: "2-digit", minute: "2-digit" });

    const notifTitle = isDemand 
      ? `🎯 نئی خریدار ڈیمانڈ: ${size} (${block})` 
      : `🔥 نیا اشتہار: ${title}`;

    const notifTitleEn = isDemand 
      ? `🎯 New Buyer Demand: ${size} (${block})` 
      : `🔥 New Ad: ${title}`;

    const notifMsg = isDemand
      ? `${block} میں خریدار فوری دستیاب ہے۔ تفصیلات اور ریٹ کے لیے بن عباس پراپرٹیز سے رابطہ کریں۔`
      : `${block} میں ${size} کا پلاٹ برائے فروخت لسٹ ہو گیا ہے۔ فوری رابطہ کریں۔`;

    const notifMsgEn = isDemand
      ? `Instant buyer waiting in ${block}. Contact Bin Abbas Properties for details.`
      : `New plot available for sale in ${block} (${size}). Contact now.`;

    const publicNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: notifTitle,
      titleEn: notifTitleEn,
      message: notifMsg,
      messageEn: notifMsgEn,
      timestamp: Date.now(),
      timeFormatted,
      targetRole: "all",
      type: "promo_ad",
      isRead: false,
      relatedId: adId
    };

    const updated = [publicNotif, ...notifications.filter((n) => n.id !== "notif-hot-1")].slice(0, 50);
    saveNotifications(updated);
    sendNativePush(notifTitle, notifMsg, adId);
  };

  // Filter visible notifications: If Admin logged in -> see both "all" and "admin". If regular user -> see only "all"
  const visibleNotifications = notifications.filter((n) => {
    if (isAdmin) return true;
    return n.targetRole === "all";
  });

  const unreadCount = visibleNotifications.filter((n) => !n.isRead).length;
  const adminUnreadInquiriesCount = inquiries.filter((inq) => inq.status === "new").length;

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const clearNotifications = () => {
    const updated = notifications.filter((n) => !isAdmin && n.targetRole === "admin");
    saveNotifications(isAdmin ? [] : updated);
  };

  const updateInquiryStatus = (id: string, status: CustomerInquiryRecord["status"]) => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq));
    saveInquiries(updated);
  };

  const deleteInquiry = (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    saveInquiries(updated);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: visibleNotifications,
        inquiries,
        unreadCount,
        adminUnreadInquiriesCount,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
        isAdminInboxOpen,
        setIsAdminInboxOpen,
        addCustomerInquiry,
        broadcastPublicDeal,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotifications,
        updateInquiryStatus,
        deleteInquiry,
        requestPushPermission
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
