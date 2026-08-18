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
  category: "residential" | "commercial" | "rent";
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
