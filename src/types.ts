export interface QuickLink {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  url: string;
  colorClass: string;
  textColorClass: string;
}

export interface SocialLinkItem {
  id: string;
  name: string;
  url: string;
  appUrl?: string;
  intentUrl?: string;
  iconName: string;
  colorClass: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PropertyListing {
  id: string;
  title: string;
  category: "residential" | "commercial" | "rent";
  tag: string;
  size: string;
  block: string;
  priceNote: string;
  features: string[];
  isHot?: boolean;
}

export interface SocietyAmenity {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SocietyBlockInfo {
  id: string;
  name: string;
  desc: string;
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
