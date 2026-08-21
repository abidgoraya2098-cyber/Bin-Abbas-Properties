export interface QuickLink {
  id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  iconName: string;
  url: string;
  urlEn?: string;
  colorClass: string;
  textColorClass: string;
}

export interface SocialLinkItem {
  id: string;
  name: string;
  nameEn?: string;
  url: string;
  appUrl?: string;
  intentUrl?: string;
  iconName: string;
  colorClass: string;
}

export interface FAQItem {
  id: string;
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
}

export interface PropertyListing {
  id: string;
  title: string;
  titleEn?: string;
  category: "residential" | "commercial" | "rent" | "demand";
  tag: string;
  tagEn?: string;
  size: string;
  sizeEn?: string;
  block: string;
  blockEn?: string;
  priceNote: string;
  priceNoteEn?: string;
  features: string[];
  featuresEn?: string[];
  isHot?: boolean;
}

export interface SocietyAmenity {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  icon: string;
}

export interface SocietyBlockInfo {
  id: string;
  name: string;
  nameEn?: string;
  desc: string;
  descEn?: string;
}

export interface SellPlotFormData {
  block: string;
  size: string;
  plotNumber?: string;
  category?: string;
  demandPrice?: string;
  finalPrice?: string;
  ownerName?: string;
  ownerPhone?: string;
  notes?: string;
}

export interface BuyPlotFormData {
  block?: string;
  size?: string;
  category?: string;
  budgetRange?: string;
  buyerName?: string;
  buyerPhone?: string;
  notes?: string;
}

export interface CustomerInquiryRecord {
  id: string;
  type: "sell" | "buy";
  timestamp: number;
  dateFormatted: string;
  block: string;
  size: string;
  plotNumber?: string;
  category?: string;
  priceOrBudget?: string;
  clientName?: string;
  clientPhone?: string;
  notes?: string;
  status: "new" | "contacted" | "published" | "archived";
}

export interface AppNotification {
  id: string;
  title: string;
  titleEn?: string;
  message: string;
  messageEn?: string;
  timestamp: number;
  timeFormatted: string;
  targetRole: "all" | "admin";
  type: "new_deal" | "customer_ad" | "system" | "demand" | "promo_ad";
  isRead: boolean;
  relatedId?: string;
}

export interface PromoAdItem {
  id: string;
  type?: "image" | "video" | "text_only";
  mediaUrl?: string; // Image Base64 / Web URL or Video MP4 / Base64 / YouTube
  thumbnailUrl?: string;
  title: string;
  titleEn?: string;
  caption?: string;
  captionEn?: string;
  price?: string;
  priceEn?: string;
  location?: string;
  locationEn?: string;
  whatsAppMessage?: string;
  createdAt: number;
  isActive: boolean;
  isHot?: boolean;
  viewCount?: number;
}

export interface InstalledDeviceRecord {
  id: string;
  deviceType: "Mobile" | "iPhone" | "Android" | "PC" | "Mac" | "Tablet" | "Unknown";
  deviceModel: string;
  os: string;
  browser: string;
  isPwaInstalled: boolean;
  installDate: number;
  installDateFormatted: string;
  lastActive: number;
  lastActiveFormatted: string;
  ip?: string;
  city?: string;
  country?: string;
  isOnline: boolean;
}
